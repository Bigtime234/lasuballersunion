import { getMatch } from '@/lib/actions/matches';
import { ScoreUpdateForm } from '@/app/control-center/components/score-update-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function ScoreUpdatePage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId: matchIdStr } = await params;
  const matchId = parseInt(matchIdStr, 10);

  if (isNaN(matchId)) {
    return <div className="text-red-400 font-bold text-lg">❌ Invalid match ID</div>;
  }

  const match = await getMatch(matchId);

  if (!match) {
    return <div className="text-red-400 font-bold text-lg">❌ Match not found</div>;
  }

  return (
    <div className="space-y-6">
      <Link href="/control-center/scores" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold">
        <ArrowLeft size={20} />
        Back to Scores
      </Link>

      <div>
        <h1 className="text-3xl font-black text-white mb-1">
          {match.homeFaculty.name} vs {match.awayFaculty.name}
        </h1>
        <p className="text-gray-400 font-semibold">{new Date(match.matchDate).toLocaleString()}</p>
      </div>

      <ScoreUpdateForm matchId={matchId} initialData={{ ...match, matchMinute: match.matchMinute ?? 0 }} />
    </div>
  );
}