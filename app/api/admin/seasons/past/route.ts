import { NextResponse } from 'next/server';
import { auth } from '@/server/auth';
import { getPastSeasons } from "@/lib/actions/seasons"

export async function GET() {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const result = await getPastSeasons();

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      seasons: result.seasons,
    });
  } catch (error) {
    console.error('Error in past seasons API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch past seasons' },
      { status: 500 }
    );
  }
}