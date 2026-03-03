import { db } from '@/server';
import { matchLikes, matches, users } from '@/server/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/server/auth';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ matchId: string }> } // ✅ params is now a Promise in Next.js 15
) {
  try {
    // ✅ FIXED: await params before accessing matchId
    const { matchId: matchIdStr } = await params;

    // ✅ Get authenticated user
    const session = await auth();

    if (!session?.user?.email) {
      console.error('❌ No session or email found');
      return NextResponse.json({ error: 'Unauthorized - Please log in' }, { status: 401 });
    }

    // ✅ Parse request body
    const body = await request.json();
    const { likedFacultyId } = body;

    if (!likedFacultyId) {
      console.error('❌ No likedFacultyId provided');
      return NextResponse.json(
        { error: 'Must specify which team to like' },
        { status: 400 }
      );
    }

    const matchId = parseInt(matchIdStr, 10);

    if (isNaN(matchId)) {
      console.error('❌ Invalid matchId:', matchIdStr);
      return NextResponse.json({ error: 'Invalid match ID' }, { status: 400 });
    }

    // ✅ Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });

    if (!user) {
      console.error('❌ User not found with email:', session.user.email);
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    console.log('✅ User found:', user.id, 'Faculty:', user.facultyId);

    // ✅ Get match details
    const match = await db.query.matches.findFirst({
      where: eq(matches.id, matchId),
    });

    if (!match) {
      console.error('❌ Match not found:', matchId);
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    console.log('✅ Match found:', match.id, 'Home:', match.homeFacultyId, 'Away:', match.awayFacultyId);

    // ✅ Validate the liked faculty is in this match (home or away)
    const isValidTeam =
      match.homeFacultyId === likedFacultyId ||
      match.awayFacultyId === likedFacultyId;

    if (!isValidTeam) {
      console.error('❌ Team not in match:', likedFacultyId);
      return NextResponse.json(
        { error: 'This team is not in this match' },
        { status: 403 }
      );
    }

    console.log('✅ Valid team:', likedFacultyId);

    // ✅ CHECK IF USER ALREADY LIKED THIS FACULTY IN THIS MATCH
    const existingLike = await db.query.matchLikes.findFirst({
      where: and(
        eq(matchLikes.matchId, matchId),
        eq(matchLikes.userId, user.id),
        eq(matchLikes.likedFacultyId, likedFacultyId)
      ),
    });

    if (existingLike) {
      // ✅ UNLIKE: User clicked again - remove the like
      console.log('🔄 Removing existing like:', existingLike.id);
      await db.delete(matchLikes).where(eq(matchLikes.id, existingLike.id));
    } else {
      // ✅ CHECK IF USER LIKED THE OTHER TEAM IN THIS MATCH
      const otherTeamFacultyId =
        match.homeFacultyId === likedFacultyId
          ? match.awayFacultyId
          : match.homeFacultyId;

      const existingLikeOtherTeam = await db.query.matchLikes.findFirst({
        where: and(
          eq(matchLikes.matchId, matchId),
          eq(matchLikes.userId, user.id),
          eq(matchLikes.likedFacultyId, otherTeamFacultyId)
        ),
      });

      // ✅ AUTO-UNLIKE THE OTHER TEAM FIRST
      if (existingLikeOtherTeam) {
        console.log('🔄 Removing like for other team:', existingLikeOtherTeam.id);
        await db.delete(matchLikes).where(eq(matchLikes.id, existingLikeOtherTeam.id));
      }

      // ✅ LIKE THE NEW TEAM
      console.log('➕ Adding new like for team:', likedFacultyId);
      await db.insert(matchLikes).values({
        matchId,
        userId: user.id,
        likedFacultyId,
      });
    }

    // ✅ GET UPDATED LIKE COUNTS
    const allLikes = await db.query.matchLikes.findMany({
      where: eq(matchLikes.matchId, matchId),
    });

    const homeLikesCount = allLikes.filter(
      l => l.likedFacultyId === match.homeFacultyId
    ).length;

    const awayLikesCount = allLikes.filter(
      l => l.likedFacultyId === match.awayFacultyId
    ).length;

    console.log('📊 Like counts - Home:', homeLikesCount, 'Away:', awayLikesCount);

    // ✅ CHECK IF USER CURRENTLY LIKES THIS TEAM
    const userCurrentLike = await db.query.matchLikes.findFirst({
      where: and(
        eq(matchLikes.matchId, matchId),
        eq(matchLikes.userId, user.id),
        eq(matchLikes.likedFacultyId, likedFacultyId)
      ),
    });

    const isLiked = !!userCurrentLike;
    console.log('✅ Final isLiked status:', isLiked);

    return NextResponse.json({
      success: true,
      isLiked,
      homeLikesCount,
      awayLikesCount,
      message: isLiked ? 'Liked successfully!' : 'Like removed',
    });

  } catch (error) {
    console.error('❌ Like error:', error);
    return NextResponse.json(
      { error: 'Failed to process like', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}