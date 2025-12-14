'use server';

import { db } from '@/server';
import { matches, faculties } from '@/server/schema';
import { eq } from 'drizzle-orm';
import { createMatchSchema, updateScoreSchema, updateMatchSchema } from '@/Types/matches';
import { auth } from '@/server/auth';
import { logAdminActivity } from './activity-log';
import { revalidatePath } from 'next/cache';
import { getActiveSeason } from './seasons';

export async function createMatch(data: unknown) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return { error: 'Unauthorized - Admin access required' };
    }

    const validatedData = createMatchSchema.parse(data);

    // AUTO-GET ACTIVE SEASON
    const activeSeason = await getActiveSeason();
    
    if (!activeSeason) {
      return { error: 'No active season found. Please create a season first at /control-center/seasons' };
    }

    // Verify faculties exist and are different
    if (validatedData.homeFacultyId === validatedData.awayFacultyId) {
      return { error: 'Home and away faculties must be different' };
    }

    const [homeExists, awayExists] = await Promise.all([
      db.query.faculties.findFirst({ where: eq(faculties.id, validatedData.homeFacultyId) }),
      db.query.faculties.findFirst({ where: eq(faculties.id, validatedData.awayFacultyId) })
    ]);

    if (!homeExists || !awayExists) {
      return { error: 'One or both faculties do not exist' };
    }

    const [newMatch] = await db
      .insert(matches)
      .values({
        homeFacultyId: validatedData.homeFacultyId,
        awayFacultyId: validatedData.awayFacultyId,
        seasonId: activeSeason.id, // ← AUTO-USE ACTIVE SEASON
        category: validatedData.category,
        matchDate: new Date(validatedData.matchDate),
        venue: validatedData.venue,
        importance: validatedData.importance || null,
        notes: validatedData.notes || null,
        status: 'PENDING',
        scoreHome: 0,
        scoreAway: 0,
        matchMinute: 0,
      })
      .returning();

    await logAdminActivity(
      session.user.id,
      'CREATE_MATCH',
      'MATCH',
      newMatch.id,
      `Created match: ${homeExists.abbreviation} vs ${awayExists.abbreviation} on ${validatedData.matchDate} (Season: ${activeSeason.name})`
    );

    revalidatePath('/control-center');
    revalidatePath('/control-center/matches');
    revalidatePath('/live');
    revalidatePath('/');
    revalidatePath('/women');

    return { success: true, match: newMatch };
  } catch (error: any) {
    console.error('Create match error:', error);
    return { error: error.message || 'Failed to create match' };
  }
}

export async function updateMatchScore(matchId: number, data: unknown) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return { error: 'Unauthorized - Admin access required' };
    }

    const validatedData = updateScoreSchema.parse(data);

    // Get current match
    const currentMatch = await db.query.matches.findFirst({
      where: eq(matches.id, matchId),
      with: {
        homeFaculty: true,
        awayFaculty: true,
      }
    });

    if (!currentMatch) {
      return { error: 'Match not found' };
    }

    // Build update data
    const updateData: any = {
      scoreHome: validatedData.scoreHome,
      scoreAway: validatedData.scoreAway,
      matchMinute: validatedData.matchMinute,
      status: validatedData.status,
      updatedAt: new Date(),
    };

    // Handle status transitions
    if (validatedData.status === 'LIVE' && currentMatch.status === 'PENDING') {
      updateData.startedAt = new Date();
    }

    if (validatedData.status === 'FINISHED' && currentMatch.status !== 'FINISHED') {
      updateData.finishedAt = new Date();
    }

    const [updatedMatch] = await db
      .update(matches)
      .set(updateData)
      .where(eq(matches.id, matchId))
      .returning();

    // NOTE: Faculty stats are NO LONGER updated here
    // Standings are calculated on-the-fly from matches in API routes
    // When season ends, standings are snapshotted to season_standings table

    await logAdminActivity(
      session.user.id,
      'UPDATE_SCORE',
      'MATCH',
      matchId,
      `${currentMatch.homeFaculty.abbreviation} ${validatedData.scoreHome}-${validatedData.scoreAway} ${currentMatch.awayFaculty.abbreviation} | Status: ${validatedData.status} | Min: ${validatedData.matchMinute}${currentMatch.importance === 'Friendly' ? ' | FRIENDLY (No stats counted)' : ''}`
    );

    revalidatePath('/control-center');
    revalidatePath('/control-center/scores');
    revalidatePath('/live');
    revalidatePath('/standings');
    revalidatePath('/fixtures');
    revalidatePath('/');
    revalidatePath('/women');

    return { success: true, match: updatedMatch };
  } catch (error: any) {
    console.error('Update score error:', error);
    return { error: error.message || 'Failed to update score' };
  }
}

export async function updateMatch(matchId: number, data: unknown) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return { error: 'Unauthorized' };
    }

    const validatedData = updateMatchSchema.parse(data);

    const [updatedMatch] = await db
      .update(matches)
      .set({
        ...validatedData,
        matchDate: validatedData.matchDate ? new Date(validatedData.matchDate) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(matches.id, matchId))
      .returning();

    await logAdminActivity(
      session.user.id,
      'UPDATE_MATCH',
      'MATCH',
      matchId,
      'Updated match details'
    );

    revalidatePath('/control-center');
    revalidatePath('/control-center/matches');

    return { success: true, match: updatedMatch };
  } catch (error: any) {
    console.error('Update match error:', error);
    return { error: error.message || 'Failed to update match' };
  }
}

export async function getMatch(matchId: number) {
  try {
    const match = await db.query.matches.findFirst({
      where: eq(matches.id, matchId),
      with: {
        homeFaculty: true,
        awayFaculty: true,
        season: true,
      }
    });

    return match || null;
  } catch (error) {
    console.error('Error fetching match:', error);
    return null;
  }
}

export async function deleteMatch(matchId: number) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return { error: 'Unauthorized' };
    }

    await db.delete(matches).where(eq(matches.id, matchId));

    await logAdminActivity(
      session.user.id,
      'DELETE_MATCH',
      'MATCH',
      matchId,
      'Deleted match'
    );

    revalidatePath('/control-center');
    revalidatePath('/control-center/matches');

    return { success: true };
  } catch (error: any) {
    console.error('Delete match error:', error);
    return { error: error.message || 'Failed to delete match' };
  }
}