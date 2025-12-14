'use server';

import { db } from '@/server';
import { seasons, seasonStandings, faculties, matches } from '@/server/schema';
import { eq, and, desc } from 'drizzle-orm';
import { auth } from '@/server/auth';
import { logAdminActivity } from './activity-log';
import { revalidatePath } from 'next/cache';

// ============================================
// GET ACTIVE SEASON
// ============================================

export async function getActiveSeason() {
  try {
    const activeSeason = await db. query. seasons. findFirst({
      where: eq(seasons.status, 'ACTIVE'),
      orderBy: desc(seasons.startDate),
    });

    return activeSeason || null;
  } catch (error) {
    console.error('Error fetching active season:', error);
    return null;
  }
}

// ============================================
// CHECK IF BOTH CATEGORIES ARE COMPLETED
// ============================================

export async function checkSeasonCompletion(seasonId:  number) {
  try {
    // Check if there are any ACTIVE matches for this season in BOTH categories
    const menMatches = await db.query.matches. findMany({
      where: and(
        eq(matches.seasonId, seasonId),
        eq(matches.category, 'men'),
        eq(matches.status, 'PENDING') // Only PENDING means not all finished
      ),
    });

    const womenMatches = await db.query.matches.findMany({
      where: and(
        eq(matches.seasonId, seasonId),
        eq(matches. category, 'women'),
        eq(matches.status, 'PENDING') // Only PENDING means not all finished
      ),
    });

    // Get the season
    const season = await db.query.seasons.findFirst({
      where: eq(seasons.id, seasonId),
    });

    if (!season) {
      return { error: 'Season not found' };
    }

    // Get all finished matches for each category
    const menFinished = await db.query.matches.findMany({
      where: and(
        eq(matches.seasonId, seasonId),
        eq(matches.category, 'men'),
        eq(matches.status, 'FINISHED')
      ),
    });

    const womenFinished = await db.query.matches.findMany({
      where: and(
        eq(matches.seasonId, seasonId),
        eq(matches.category, 'women'),
        eq(matches.status, 'FINISHED')
      ),
    });

    // Check standings snapshots - if both exist, both categories are ended
    const menStandings = await db.query.seasonStandings.findMany({
      where: and(
        eq(seasonStandings.seasonId, seasonId),
        eq(seasonStandings.category, 'men')
      ),
    });

    const womenStandings = await db.query.seasonStandings.findMany({
      where: and(
        eq(seasonStandings.seasonId, seasonId),
        eq(seasonStandings.category, 'women')
      ),
    });

    // Both categories are completed if both have standings snapshots
    const menCompleted = menStandings. length > 0;
    const womenCompleted = womenStandings.length > 0;
    const bothCompleted = menCompleted && womenCompleted;

    return {
      success: true,
      menCompleted,
      womenCompleted,
      bothCompleted,
      season,
    };
  } catch (error:  any) {
    console.error('Error checking season completion:', error);
    return { error: error. message || 'Failed to check season completion' };
  }
}

// ============================================
// END SEASON & SNAPSHOT STANDINGS (INDEPENDENT)
// ============================================

export async function endSeason(seasonId: number, category: 'men' | 'women') {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return { error: 'Unauthorized - Admin access required' };
    }

    // Get the season
    const season = await db.query.seasons.findFirst({
      where: eq(seasons. id, seasonId),
    });

    if (!season) {
      return { error: 'Season not found' };
    }

    // ✅ FIX: Allow ending if season is ACTIVE
    if (season.status !== 'ACTIVE') {
      return { error: 'Can only end an active season' };
    }

    // Get all faculties
    const allFaculties = await db.query. faculties.findMany();

    // Get all competitive matches for this season and category
    const seasonMatches = await db.query. matches.findMany({
      where: and(
        eq(matches.seasonId, seasonId),
        eq(matches.category, category),
        eq(matches.status, 'FINISHED')
      ),
    });

    const competitiveMatches = seasonMatches.filter(m => m.importance !== 'Friendly');

    // Calculate final standings from matches
    const standingsMap = new Map();

    allFaculties.forEach(faculty => {
      standingsMap.set(faculty.id, {
        facultyId: faculty.id,
        played: 0,
        won: 0,
        drawn:  0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      });
    });

    // Calculate stats from competitive matches
    competitiveMatches.forEach(match => {
      const homeTeam = standingsMap.get(match.homeFacultyId);
      const awayTeam = standingsMap.get(match. awayFacultyId);

      if (homeTeam && awayTeam) {
        homeTeam.played++;
        awayTeam.played++;

        homeTeam.goalsFor += match.scoreHome;
        homeTeam.goalsAgainst += match.scoreAway;
        awayTeam.goalsFor += match.scoreAway;
        awayTeam.goalsAgainst += match.scoreHome;

        if (match.scoreHome > match.scoreAway) {
          homeTeam.won++;
          homeTeam.points += 3;
          awayTeam.lost++;
        } else if (match.scoreHome < match.scoreAway) {
          awayTeam.won++;
          awayTeam. points += 3;
          homeTeam.lost++;
        } else {
          homeTeam. drawn++;
          awayTeam.drawn++;
          homeTeam.points += 1;
          awayTeam. points += 1;
        }

        homeTeam.goalDifference = homeTeam.goalsFor - homeTeam.goalsAgainst;
        awayTeam.goalDifference = awayTeam.goalsFor - awayTeam.goalsAgainst;
      }
    });

    // Sort standings
    const finalStandings = Array.from(standingsMap.values())
      .filter(team => team.played > 0)
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a. goalDifference) return b.goalDifference - a.goalDifference;
        return b.goalsFor - a.goalsFor;
      });

    // ✅ DELETE EXISTING STANDINGS FOR THIS SEASON/CATEGORY FIRST
    await db.delete(seasonStandings).where(
      and(
        eq(seasonStandings.seasonId, seasonId),
        eq(seasonStandings.category, category)
      )
    );

    // Save snapshot to season_standings table
    for (let i = 0; i < finalStandings.length; i++) {
      const standing = finalStandings[i];
      await db.insert(seasonStandings).values({
        seasonId,
        facultyId: standing.facultyId,
        category,
        finalPosition: i + 1,
        played: standing.played,
        won: standing.won,
        drawn: standing.drawn,
        lost: standing.lost,
        goalsFor: standing.goalsFor,
        goalsAgainst: standing.goalsAgainst,
        goalDifference:  standing.goalDifference,
        points: standing.points,
      });
    }

    // ✅ Update faculty career stats for THIS category champion
    if (finalStandings.length >= 1) {
      const championFaculty = await db.query.faculties.findFirst({
        where: eq(faculties.id, finalStandings[0].facultyId)
      });

      if (championFaculty) {
        await db.update(faculties)
          .set({
            championshipsWon: championFaculty.championshipsWon + 1,
            updatedAt: new Date(),
          })
          .where(eq(faculties.id, finalStandings[0].facultyId));
      }
    }

    if (finalStandings.length >= 2) {
      const runnerUpFaculty = await db.query.faculties.findFirst({
        where: eq(faculties.id, finalStandings[1].facultyId)
      });

      if (runnerUpFaculty) {
        await db.update(faculties)
          .set({
            runnerUpCount: runnerUpFaculty. runnerUpCount + 1,
            updatedAt: new Date(),
          })
          .where(eq(faculties.id, finalStandings[1].facultyId));
      }
    }

    if (finalStandings.length >= 3) {
      const thirdPlaceFaculty = await db. query.faculties.findFirst({
        where: eq(faculties.id, finalStandings[2].facultyId)
      });

      if (thirdPlaceFaculty) {
        await db.update(faculties)
          .set({
            thirdPlaceCount: thirdPlaceFaculty.thirdPlaceCount + 1,
            updatedAt: new Date(),
          })
          .where(eq(faculties.id, finalStandings[2].facultyId));
      }
    }

    // ✅ CHECK IF OTHER CATEGORY IS ALSO COMPLETED
    // Get the other category's standings snapshot
    const otherCategory = category === 'men' ? 'women' : 'men';
    const otherCategoryStandings = await db. query.seasonStandings.findMany({
      where: and(
        eq(seasonStandings.seasonId, seasonId),
        eq(seasonStandings. category, otherCategory)
      ),
    });

    // ✅ ONLY MARK SEASON AS COMPLETED IF BOTH CATEGORIES ARE DONE
    if (otherCategoryStandings.length > 0) {
      // Other category is already completed, so NOW mark season as COMPLETED
      await db.update(seasons)
        .set({
          status: 'COMPLETED' as const,
          endDate:  new Date(),
          updatedAt: new Date(),
        })
        .where(eq(seasons.id, seasonId));

      console.log(
        `✅ SEASON FULLY COMPLETED: Both men's and women's seasons are now done for season ${seasonId}`
      );
    } else {
      // Other category not yet completed, so keep season ACTIVE
      console.log(
        `⏳ SEASON PARTIALLY COMPLETED: ${category} season done, waiting for ${otherCategory} to end`
      );
    }

    // ✅ Log activity
    await logAdminActivity(
      session. user.id,
      'END_SEASON',
      'SEASON',
      seasonId,
      `Ended season:  ${season.name} (${category} category) - Champion: Faculty #${finalStandings[0]?.facultyId || 'N/A'}`
    );

    // ✅ Revalidate all relevant paths
    revalidatePath('/control-center');
    revalidatePath('/control-center/seasons');
    revalidatePath('/standings');
    revalidatePath('/women/standings');
    revalidatePath('/');
    revalidatePath('/women');

    return {
      success: true,
      champion: finalStandings[0]?.facultyId,
      standings: finalStandings,
      categoryEnded: category,
      // ✅ Return whether BOTH categories are now completed
      bothCategoriesCompleted: otherCategoryStandings.length > 0,
    };
  } catch (error:  any) {
    console.error('End season error:', error);
    return { error: error.message || 'Failed to end season' };
  }
}

// ============================================
// START NEW SEASON
// ============================================

export async function startNewSeason(data: {
  name: string;
  startDate: string;
}) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return { error: 'Unauthorized - Admin access required' };
    }

    // ✅ FIX: Check if there's already an ACTIVE season
    const existingActive = await db.query.seasons. findFirst({
      where: eq(seasons.status, 'ACTIVE'),
    });

    if (existingActive) {
      return {
        error: `There is already an active season:  "${existingActive.name}".  Please end both men's and women's competitions before starting a new season.`,
      };
    }

    const [newSeason] = await db
      .insert(seasons)
      .values({
        name: data.name,
        startDate: new Date(data.startDate),
        status: 'ACTIVE',
      })
      .returning();

    await logAdminActivity(
      session. user.id,
      'CREATE_SEASON',
      'SEASON',
      newSeason. id,
      `Started new season: ${data.name}`
    );

    revalidatePath('/control-center');
    revalidatePath('/control-center/seasons');
    revalidatePath('/standings');
    revalidatePath('/women/standings');
    revalidatePath('/');
    revalidatePath('/women');

    return { success: true, season: newSeason };
  } catch (error: any) {
    console.error('Start new season error:', error);
    return { error: error.message || 'Failed to start new season' };
  }
}

// ============================================
// GET PAST SEASONS
// ============================================

export async function getPastSeasons() {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return { error: 'Unauthorized - Admin access required' };
    }

    const pastSeasons = await db.query. seasons.findMany({
      where: eq(seasons.status, 'COMPLETED'),
      orderBy: desc(seasons.endDate),
      with: {
        champion: true,
        runnerUp: true,
        thirdPlace: true,
      },
    });

    return { success: true, seasons: pastSeasons };
  } catch (error: any) {
    console.error('Get past seasons error:', error);
    return { error: error.message || 'Failed to fetch past seasons' };
  }
}

// ============================================
// GET SEASON STANDINGS SNAPSHOT
// ============================================

export async function getSeasonStandings(seasonId: number, category: 'men' | 'women') {
  try {
    const session = await auth();
    if (!session || session. user.role !== 'admin') {
      return { error: 'Unauthorized - Admin access required' };
    }

    const standings = await db.query.seasonStandings.findMany({
      where: and(
        eq(seasonStandings.seasonId, seasonId),
        eq(seasonStandings.category, category)
      ),
      orderBy: [seasonStandings.finalPosition],
      with: {
        faculty: true,
        season: true,
      },
    });

    return { success: true, standings };
  } catch (error:  any) {
    console.error('Get season standings error:', error);
    return { error: error. message || 'Failed to fetch season standings' };
  }
}

// ============================================
// GET ALL SEASONS (INCLUDING ACTIVE)
// ============================================

export async function getAllSeasons() {
  try {
    const allSeasons = await db.query. seasons.findMany({
      orderBy: desc(seasons.startDate),
      with: {
        champion: true,
        runnerUp: true,
        thirdPlace: true,
      },
    });

    return { success: true, seasons: allSeasons };
  } catch (error: any) {
    console.error('Get all seasons error:', error);
    return { error: error.message || 'Failed to fetch seasons' };
  }
}