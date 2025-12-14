import { db } from '@/server';
import { matches, faculties, seasons } from '@/server/schema';
import { eq, and, desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get active season
    const activeSeason = await db.query.seasons.findFirst({
      where: eq(seasons.status, 'ACTIVE'),
      orderBy: desc(seasons.startDate),
    });

    if (!activeSeason) {
      return NextResponse.json({
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
        season: null,
        message: 'No active season found',
      });
    }

    // Get all MEN'S matches for ACTIVE SEASON ONLY
    const allMatches = await db.query. matches.findMany({
      where: and(
        eq(matches.category, 'men'),
        eq(matches.seasonId, activeSeason.id)
      ),
      with: {
        homeFaculty: true,
        awayFaculty: true,
      },
      orderBy:  desc(matches.matchDate), // ✅ SORT BY DATE FOR STREAK CALC
    });

    // Get live matches
    const liveMatches = allMatches.filter(m => m.status === 'LIVE');

    // Get upcoming matches (next 5)
    const upcomingMatches = allMatches
      .filter(m => m. status === 'PENDING')
      .sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime())
      .slice(0, 5);

    // Get recent finished matches (last 6) - ONLY COMPETITIVE MATCHES
    const recentMatches = allMatches
      . filter(m => m.status === 'FINISHED' && ! m.archived && m.importance !== 'Friendly')
      .sort((a, b) => new Date(b.finishedAt || 0).getTime() - new Date(a.finishedAt || 0).getTime())
      .slice(0, 6);

    // Get all faculties
    const allFaculties = await db.query.faculties.findMany();

    // Calculate standings from MEN'S COMPETITIVE MATCHES IN ACTIVE SEASON ONLY
    const competitiveMatches = allMatches. filter(
      m => m.status === 'FINISHED' && m.importance !== 'Friendly'
    );

    // ✅ HELPER FUNCTION TO CALCULATE STREAK
    function calculateStreak(facultyId: number, matches: typeof competitiveMatches) {
      let streak = 0;
      let streakType:  'W' | 'D' | null = null;

      // Go through matches from most recent backwards
      for (const match of matches) {
        const isHome = match.homeFacultyId === facultyId;
        const isAway = match.awayFacultyId === facultyId;

        if (! isHome && !isAway) continue;

        const won = isHome 
          ? match.scoreHome > match.scoreAway 
          : match.scoreAway > match.scoreHome;
        
        const drawn = match.scoreHome === match.scoreAway;

        if (won) {
          if (streakType === 'W' || streakType === null) {
            streakType = 'W';
            streak++;
          } else {
            break; // Streak ended
          }
        } else if (drawn) {
          if (streakType === 'D' || streakType === null) {
            streakType = 'D';
            streak++;
          } else {
            break; // Streak ended
          }
        } else {
          break; // Loss ends streak
        }
      }

      return streak;
    }

    // Build standings
    const standingsMap = new Map();

    allFaculties.forEach(faculty => {
      standingsMap.set(faculty.id, {
        id: faculty. id,
        name: faculty. name,
        abbreviation: faculty.abbreviation,
        colorPrimary: faculty.colorPrimary,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points:  0,
        currentStreak: 0,
      });
    });

    // Calculate from competitive men's matches in active season
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

        if (match. scoreHome > match.scoreAway) {
          homeTeam. won++;
          homeTeam. points += 3;
          awayTeam.lost++;
        } else if (match.scoreHome < match.scoreAway) {
          awayTeam.won++;
          awayTeam. points += 3;
          homeTeam.lost++;
        } else {
          homeTeam. drawn++;
          awayTeam.drawn++;
          homeTeam.points += 1;
          awayTeam.points += 1;
        }

        homeTeam.goalDifference = homeTeam.goalsFor - homeTeam.goalsAgainst;
        awayTeam.goalDifference = awayTeam.goalsFor - awayTeam.goalsAgainst;
      }
    });

    // ✅ NOW CALCULATE STREAKS AFTER ALL STATS
    standingsMap.forEach((team) => {
      team.currentStreak = calculateStreak(team.id, competitiveMatches);
    });

    const standings = Array.from(standingsMap.values())
      .filter(team => team.played > 0)
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a. points;
        if (b. goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        return b. goalsFor - a.goalsFor;
      });

    // Calculate stats
    const totalGoals = competitiveMatches.reduce(
      (acc, m) => acc + m.scoreHome + m.scoreAway,
      0
    );

    const highestScoringMatch = competitiveMatches.reduce((max, match) => {
      const total = match.scoreHome + match. scoreAway;
      const maxTotal = max ? max.scoreHome + max.scoreAway : 0;
      return total > maxTotal ? match : max;
    }, competitiveMatches[0] || null);

    // ✅ FIND TEAM WITH LONGEST STREAK (not just the leader)
    const longestStreak = standings.length > 0 
      ? standings. reduce((max, team) => 
          team.currentStreak > (max?. currentStreak || 0) ? team : max
        ) 
      : null;

    const stats = {
      totalGoals,
      highestScoringMatch,
      longestStreak,
      totalMatches: competitiveMatches.length,
      avgGoals: competitiveMatches.length > 0 
        ? (totalGoals / competitiveMatches.length).toFixed(1) 
        : '0',
    };

    return NextResponse.json({
      liveMatches,
      upcomingMatches,
      recentMatches,
      standings,
      stats,
      season: {
        id: activeSeason.id,
        name: activeSeason.name,
        startDate: activeSeason.startDate,
        status: activeSeason.status,
      },
    });

  } catch (error) {
    console.error('Error fetching home data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch home data' },
      { status: 500 }
    );
  }
}