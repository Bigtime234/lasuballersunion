import { NextResponse } from 'next/server';
import { auth } from '@/server/auth';
import { getSeasonStandings } from '@/lib/actions/seasons';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const seasonId = parseInt(params.id);
    
    if (isNaN(seasonId)) {
      return NextResponse.json(
        { error: 'Invalid season ID' },
        { status: 400 }
      );
    }

    // Get category from query params (default to 'men')
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as 'men' | 'women' || 'men';

    if (category !== 'men' && category !== 'women') {
      return NextResponse.json(
        { error: 'Invalid category. Must be "men" or "women"' },
        { status: 400 }
      );
    }

    const result = await getSeasonStandings(seasonId, category);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      standings: result.standings,
      category,
    });
  } catch (error) {
    console.error('Error in season standings API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch season standings' },
      { status: 500 }
    );
  }
}