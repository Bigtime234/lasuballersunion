'use server';

import { db } from '@/server';
import { adminActivityLog } from '@/server/schema';

export async function logAdminActivity(
  userId: string,
  action: string,
  entityType: string,
  entityId: number,
  details?: string
) {
  try {
    await db.insert(adminActivityLog). values({
      userId,
      action,
      entityType,
      entityId,
      details: details || null,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

export async function getRecentActivity(limit: number = 20) {
  try {
    const activity = await db. query.adminActivityLog.findMany({
      limit,
      orderBy: (adminActivityLog, { desc }) => [desc(adminActivityLog.createdAt)],
      with: {
        user: true,
      }
    });
    return activity;
  } catch (error) {
    console.error('Error fetching activity:', error);
    return [];
  }
}