import { getMatch } from '@/lib/actions/matches';
import { db } from '@/server';
import { MatchForm } from '@/app/control-center/components/match-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function EditMatchPage({
  params,
}: {
  params: { id: string };
}) {
  const matchId = Number(params.id);
  const matchData = await getMatch(matchId);
  const allFaculties = await db.query.faculties.findMany({
    orderBy: (faculties, { asc }) => [asc(faculties.name)],
  });
  const allSeasons = await db.query.seasons.findMany({
    orderBy: (seasons, { desc }) => [desc(seasons.startDate)],
  });

  if (!matchData) {
    return (
      <div className="text-red-400 font-bold text-lg">
        ❌ Match not found
      </div>
    );
  }

  // Format the match data for the form
  const formattedMatchData = {
    id: matchData.id,
    homeFacultyId: matchData.homeFacultyId,
    awayFacultyId: matchData.awayFacultyId,
    seasonId: matchData.seasonId || undefined,
    category: matchData.category,
    matchDate: new Date(matchData.matchDate).toISOString().slice(0, 16), // Convert to datetime-local format
    venue: matchData.venue,
    importance: matchData.importance || '',
    notes: matchData.notes || '',
  };

  return (
    <div className="space-y-6">
      <Link
        href={`/control-center/matches/${matchId}`}
        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold"
      >
        <ArrowLeft size={20} />
        Back
      </Link>

      <h1 className="text-3xl font-black text-white">Edit Match</h1>

      <MatchForm
        faculties={allFaculties}
        seasons={allSeasons}
        initialData={formattedMatchData}
        isEditing={true}
      />
    </div>
  );
}