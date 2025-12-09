import { db } from '@/server';
import { matches, faculties } from '@/server/schema';
import { eq, and, desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get all WOMEN'S matches
    const allMatches = await db.query.matches.findMany({
      where: eq(matches.category, 'women'), // ← FILTER FOR WOMEN ONLY
      with: {
        homeFaculty: true,
        awayFaculty: true,
      },
    });

    // Get live matches
    const liveMatches = allMatches.filter(m => m.status === 'LIVE');

    // Get upcoming matches (next 5)
    const upcomingMatches = allMatches
      .filter(m => m.status === 'PENDING')
      .sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime())
      .slice(0, 5);

    // Get recent finished matches (last 6) - ONLY COMPETITIVE MATCHES
    const recentMatches = allMatches
      .filter(m => m.status === 'FINISHED' && !m.archived && m.importance !== 'Friendly')
      .sort((a, b) => new Date(b.finishedAt || 0).getTime() - new Date(a.finishedAt || 0).getTime())
      .slice(0, 6);

    // Get all faculties
    const allFaculties = await db.query.faculties.findMany();

    // Calculate standings from WOMEN'S COMPETITIVE MATCHES ONLY
    const competitiveMatches = allMatches.filter(
      m => m.status === 'FINISHED' && m.importance !== 'Friendly'
    );

    // Build standings
    const standingsMap = new Map();

    allFaculties.forEach(faculty => {
      standingsMap.set(faculty.id, {
        id: faculty.id,
        name: faculty.name,
        abbreviation: faculty.abbreviation,
        colorPrimary: faculty.colorPrimary,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        currentStreak: 0,
      });
    });

    // Calculate from competitive women's matches
    competitiveMatches.forEach(match => {
      const homeTeam = standingsMap.get(match.homeFacultyId);
      const awayTeam = standingsMap.get(match.awayFacultyId);

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
          awayTeam.points += 3;
          homeTeam.lost++;
        } else {
          homeTeam.drawn++;
          awayTeam.drawn++;
          homeTeam.points += 1;
          awayTeam.points += 1;
        }

        homeTeam.goalDifference = homeTeam.goalsFor - homeTeam.goalsAgainst;
        awayTeam.goalDifference = awayTeam.goalsFor - awayTeam.goalsAgainst;
      }
    });

    const standings = Array.from(standingsMap.values())
      .filter(team => team.played > 0)
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        return b.goalsFor - a.goalsFor;
      });

    // Calculate stats
    const totalGoals = competitiveMatches.reduce(
      (acc, m) => acc + m.scoreHome + m.scoreAway,
      0
    );

    const highestScoringMatch = competitiveMatches.reduce((max, match) => {
      const total = match.scoreHome + match.scoreAway;
      const maxTotal = max ? max.scoreHome + max.scoreAway : 0;
      return total > maxTotal ? match : max;
    }, competitiveMatches[0] || null);

    const longestStreak = standings.length > 0 ? standings[0] : null;

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
    });

  } catch (error) {
    console.error('Error fetching women data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch women data' },
      { status: 500 }
    );
  }
}