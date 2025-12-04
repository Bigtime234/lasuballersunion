'use server';

import { db } from '@/server';
import { faculties } from '@/server/schema';
import { eq } from 'drizzle-orm';
import { createFacultySchema, updateFacultySchema } from '@/Types/faculties';
import { auth } from '@/server/auth';
import { logAdminActivity } from './activity-log';
import { revalidatePath } from 'next/cache';

export async function createFaculty(data: unknown) {
  try {
    const session = await auth();
    if (!session || session.user. role !== 'admin') {
      return { error: 'Unauthorized - Admin access required' };
    }

    const validatedData = createFacultySchema.parse(data);

    // Check if faculty name already exists
    const existing = await db.query.faculties.findFirst({
      where: eq(faculties.name, validatedData.name)
    });

    if (existing) {
      return { error: 'Faculty with this name already exists' };
    }

    const [newFaculty] = await db
      .insert(faculties)
      .values({
        name: validatedData.name,
        abbreviation: validatedData. abbreviation. toUpperCase(),
        colorPrimary: validatedData.colorPrimary,
        colorSecondary: validatedData.colorSecondary,
        logo: validatedData.logo || null,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        currentStreak: 0,
      })
      .returning();

    await logAdminActivity(
      session.user.id,
      'CREATE_FACULTY',
      'FACULTY',
      newFaculty.id,
      `Created faculty: ${validatedData.name}`
    );

    revalidatePath('/control-center');
    revalidatePath('/control-center/faculties');
    revalidatePath('/faculties');
    revalidatePath('/standings');

    return { success: true, faculty: newFaculty };
  } catch (error: any) {
    console.error('Create faculty error:', error);
    return { error: error.message || 'Failed to create faculty' };
  }
}

export async function updateFaculty(facultyId: number, data: unknown) {
  try {
    const session = await auth();
    if (!session || session.user. role !== 'admin') {
      return { error: 'Unauthorized' };
    }

    const validatedData = updateFacultySchema.parse(data);

    const [updatedFaculty] = await db
      .update(faculties)
      .set({
        name: validatedData.name,
        abbreviation: validatedData.abbreviation.toUpperCase(),
        colorPrimary: validatedData.colorPrimary,
        colorSecondary: validatedData.colorSecondary,
        logo: validatedData.logo || null,
        updatedAt: new Date(),
      })
      .where(eq(faculties.id, facultyId))
      .returning();

    await logAdminActivity(
      session.user.id,
      'UPDATE_FACULTY',
      'FACULTY',
      facultyId,
      `Updated faculty: ${validatedData.name}`
    );

    revalidatePath('/control-center');
    revalidatePath('/control-center/faculties');
    revalidatePath('/faculties');

    return { success: true, faculty: updatedFaculty };
  } catch (error: any) {
    console.error('Update faculty error:', error);
    return { error: error.message || 'Failed to update faculty' };
  }
}

export async function getFaculty(facultyId: number) {
  try {
    const faculty = await db.query.faculties.findFirst({
      where: eq(faculties.id, facultyId)
    });
    return faculty || null;
  } catch (error) {
    console. error('Error fetching faculty:', error);
    return null;
  }
}

export async function getAllFaculties() {
  try {
    const allFaculties = await db.query.faculties.findMany({
      orderBy: (faculties, { desc }) => [desc(faculties.points)]
    });
    return allFaculties;
  } catch (error) {
    console.error('Error fetching faculties:', error);
    return [];
  }
}

export async function deleteFaculty(facultyId: number) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return { error: 'Unauthorized' };
    }

    await db.delete(faculties).where(eq(faculties.id, facultyId));

    await logAdminActivity(
      session.user.id,
      'DELETE_FACULTY',
      'FACULTY',
      facultyId,
      'Deleted faculty'
    );

    revalidatePath('/control-center');
    revalidatePath('/control-center/faculties');
    revalidatePath('/faculties');

    return { success: true };
  } catch (error: any) {
    console.error('Delete faculty error:', error);
    return { error: error.message || 'Failed to delete faculty' };
  }
}