import { NextResponse } from 'next/server';
import { db } from '@/server';

export const runtime = 'nodejs';
export const revalidate = 30;

export async function GET() {
  try {
    // Fetch all matches with relations
    const allMatches = await db.query.matches.findMany({
      with: {
        homeFaculty: true,
        awayFaculty: true,
      },
    });

    if (!allMatches || allMatches.length === 0) {
      console.warn('No matches found in database');
    }

    // Filter LIVE matches
    const liveMatches = allMatches.filter((m) => m.status === 'LIVE');

    // Filter UPCOMING matches (next 5)
    const upcomingMatches = allMatches
      .filter((m) => m.status === 'PENDING')
      . sort(
        (a, b) =>
          new Date(a.matchDate).getTime() - new Date(b.matchDate). getTime()
      )
      .slice(0, 5);

    // Filter RECENT matches (last 8)
    const recentMatches = allMatches
      .filter((m) => m.status === 'FINISHED' && ! m.archived)
      .sort(
        (a, b) =>
          new Date(b. finishedAt || 0). getTime() -
          new Date(a.finishedAt || 0).getTime()
      )
      . slice(0, 8);

    // Fetch standings (faculties sorted by points)
    const standings = await db.query.faculties.findMany({
      orderBy: (faculties, { desc }) => [
        desc(faculties.points),
        desc(faculties. goalDifference),
        desc(faculties.goalsFor),
      ],
    });

    if (!standings || standings.length === 0) {
      console.warn('No faculties found in database');
    }

    // Calculate statistics
    const totalGoals = standings.reduce((acc, f) => acc + f.goalsFor, 0);

    // Find highest scoring match
    const finishedMatches = allMatches.filter((m) => m. status === 'FINISHED');
    const highestScoringMatch =
      finishedMatches. length > 0
        ? finishedMatches.reduce((max, m) => {
            const currentTotal = m.scoreHome + m. scoreAway;
            const maxTotal = max.scoreHome + max.scoreAway;
            return currentTotal > maxTotal ? m : max;
          })
        : null;

    // Find longest streak
    const longestStreak =
      standings.length > 0
        ? standings. reduce((max, f) =>
            f.currentStreak > max.currentStreak ? f : max
          )
        : null;

    const totalMatches = finishedMatches.length;
    const avgGoals =
      totalMatches > 0 ?  (totalGoals / totalMatches). toFixed(1) : '0';

    // Return successful response
    const responseData = {
      liveMatches,
      upcomingMatches,
      recentMatches,
      standings,
      stats: {
        totalGoals,
        highestScoringMatch,
        longestStreak,
        totalMatches,
        avgGoals,
      },
    };

    return NextResponse. json(responseData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('❌ Error fetching home data:', error);

    // Return error response with empty data
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch data',
        liveMatches: [],
        upcomingMatches: [],
        recentMatches: [],
        standings: [],
        stats: {
          totalGoals: 0,
          highestScoringMatch: null,
          longestStreak: null,
          totalMatches: 0,
          avgGoals: '0',
        },
      },
      { status: 500 }
    );
  }
}