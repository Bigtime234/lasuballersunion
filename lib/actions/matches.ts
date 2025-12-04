'use server';

import { db } from '@/server';
import { matches, faculties } from '@/server/schema';
import { eq, and } from 'drizzle-orm';
import { createMatchSchema, updateScoreSchema, updateMatchSchema } from '@/Types/matches';
import { auth } from '@/server/auth';
import { logAdminActivity } from './activity-log';
import { revalidatePath } from 'next/cache';

export async function createMatch(data: unknown) {
  try {
    const session = await auth();
    if (! session || session.user.role !== 'admin') {
      return { error: 'Unauthorized - Admin access required' };
    }

    const validatedData = createMatchSchema. parse(data);

    // Verify faculties exist and are different
    const [homeExists, awayExists] = await Promise.all([
      db.query.faculties.findFirst({ where: eq(faculties.id, validatedData.homeFacultyId) }),
      db. query.faculties.findFirst({ where: eq(faculties.id, validatedData.awayFacultyId) })
    ]);

    if (!  homeExists || ! awayExists) {
      return { error: 'One or both faculties do not exist' };
    }

    const [newMatch] = await db
      .insert(matches)
      .values({
        homeFacultyId: validatedData.homeFacultyId,
        awayFacultyId: validatedData.awayFacultyId,
        seasonId: validatedData.seasonId,
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
      newMatch. id,
      `Created match: ${homeExists.abbreviation} vs ${awayExists.  abbreviation} on ${validatedData.matchDate}`
    );

    revalidatePath('/control-center');
    revalidatePath('/control-center/matches');
    revalidatePath('/live');

    return { success: true, match: newMatch };
  } catch (error: any) {
    console.error('Create match error:', error);
    return { error: error.message || 'Failed to create match' };
  }
}

export async function updateMatchScore(matchId: number, data: unknown) {
  try {
    const session = await auth();
    if (! session || session.user.  role !== 'admin') {
      return { error: 'Unauthorized - Admin access required' };
    }

    const validatedData = updateScoreSchema.parse(data);

    // Get current match
    const currentMatch = await db.  query.matches.findFirst({
      where: eq(matches.id, matchId),
      with: {
        homeFaculty: true,
        awayFaculty: true,
      }
    });

    if (! currentMatch) {
      return { error: 'Match not found' };
    }

    // Build update data
    const updateData: any = {
      scoreHome: validatedData.scoreHome,
      scoreAway: validatedData.scoreAway,
      matchMinute: validatedData.matchMinute,
      status: validatedData.  status,
      updatedAt: new Date(),
    };

    // Handle status transitions
    if (validatedData.  status === 'LIVE' && currentMatch.status === 'PENDING') {
      updateData.startedAt = new Date();
    }

    if (validatedData.  status === 'FINISHED' && currentMatch.status !== 'FINISHED') {
      updateData.finishedAt = new Date();
    }

    const [updatedMatch] = await db
      .update(matches)
      .set(updateData)
      .where(eq(matches.id, matchId))
      .returning();

    // Update faculty stats if match is finished AND NOT friendly
    if (validatedData.status === 'FINISHED' && currentMatch.status !== 'FINISHED' && currentMatch.importance !== 'Friendly') {
      await updateFacultyStats(
        currentMatch.homeFacultyId,
        currentMatch.  awayFacultyId,
        validatedData.scoreHome,
        validatedData.  scoreAway
      );
    }

    await logAdminActivity(
      session.user.id,
      'UPDATE_SCORE',
      'MATCH',
      matchId,
      `${currentMatch.homeFaculty.abbreviation} ${validatedData.scoreHome}-${validatedData.scoreAway} ${currentMatch.awayFaculty.abbreviation} | Status: ${validatedData.status} | Min: ${validatedData.matchMinute}' ${currentMatch.importance === 'Friendly' ? '| FRIENDLY (No stats counted)' : ''}`
    );

    revalidatePath('/control-center');
    revalidatePath('/control-center/scores');
    revalidatePath('/live');
    revalidatePath('/standings');
    revalidatePath('/fixtures');

    return { success: true, match: updatedMatch };
  } catch (error: any) {
    console.error('Update score error:', error);
    return { error: error.message || 'Failed to update score' };
  }
}

export async function updateMatch(matchId: number, data: unknown) {
  try {
    const session = await auth();
    if (!session || session.user. role !== 'admin') {
      return { error: 'Unauthorized' };
    }

    const validatedData = updateMatchSchema.parse(data);

    const [updatedMatch] = await db
      .update(matches)
      .set({
        ...validatedData,
        matchDate: validatedData.matchDate ?   new Date(validatedData.matchDate) : undefined,
        updatedAt: new Date(),
      })
      .  where(eq(matches.id, matchId))
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

async function updateFacultyStats(
  homeFacultyId: number,
  awayFacultyId: number,
  homeScore: number,
  awayScore: number
) {
  try {
    // Get current faculty stats
    const [homeFac, awayFac] = await Promise.all([
      db.  query.faculties.findFirst({ where: eq(faculties.id, homeFacultyId) }),
      db. query.faculties.findFirst({ where: eq(faculties.id, awayFacultyId) })
    ]);

    if (!homeFac || !awayFac) return;

    // Calculate new stats
    const homeWon = homeScore > awayScore;
    const awayWon = awayScore > homeScore;
    const isDraw = homeScore === awayScore;

    // Update home faculty
    await db. update(faculties). set({
      played: homeFac.played + 1,
      won: homeFac.won + (homeWon ? 1 : 0),
      drawn: homeFac.drawn + (isDraw ? 1 : 0),
      lost: homeFac.lost + (awayWon ? 1 : 0),
      goalsFor: homeFac.goalsFor + homeScore,
      goalsAgainst: homeFac.goalsAgainst + awayScore,
      goalDifference: homeFac.goalDifference + (homeScore - awayScore),
      points: homeFac.points + (homeWon ? 3 : isDraw ? 1 : 0),
      currentStreak: homeWon ? homeFac.currentStreak + 1 : 0,
      updatedAt: new Date(),
    }).where(eq(faculties.  id, homeFacultyId));

    // Update away faculty
    await db.update(faculties).  set({
      played: awayFac.played + 1,
      won: awayFac.won + (awayWon ? 1 : 0),
      drawn: awayFac.drawn + (isDraw ? 1 : 0),
      lost: awayFac.lost + (homeWon ? 1 : 0),
      goalsFor: awayFac. goalsFor + awayScore,
      goalsAgainst: awayFac.goalsAgainst + homeScore,
      goalDifference: awayFac.goalDifference + (awayScore - homeScore),
      points: awayFac. points + (awayWon ?  3 : isDraw ? 1 : 0),
      currentStreak: awayWon ? awayFac.currentStreak + 1 : 0,
      updatedAt: new Date(),
    }).where(eq(faculties.id, awayFacultyId));

  } catch (error) {
    console.error('Error updating faculty stats:', error);
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
    if (!  session || session.user.role !== 'admin') {
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