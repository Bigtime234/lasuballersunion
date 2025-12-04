import { getMatch } from '@/lib/actions/matches';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Trophy } from 'lucide-react';

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const matchId = Number(id);
  const match = await getMatch(matchId);

  if (!match) {
    return (
      <div className="text-red-400 font-bold text-lg">
        ❌ Match not found
      </div>
    );
  }

  const homeWon = match.scoreHome > match.scoreAway;
  const awayWon = match.scoreAway > match.scoreHome;
  const isDraw = match.scoreHome === match.scoreAway;

  return (
    <div className="space-y-6">
      <Link
        href="/control-center/matches"
        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold"
      >
        <ArrowLeft size={20} />
        Back to Matches
      </Link>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
        {/* Teams & Score */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-lg"
                style={{ backgroundColor: match.homeFaculty.colorPrimary }}
              >
                {match.homeFaculty.abbreviation}
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">
                  {match.homeFaculty.name}
                </h2>
                <p className="text-gray-400 text-sm">{homeWon ? '🏆 Winner' : isDraw ? '🤝 Draw' : '❌ Loss'}</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-6xl font-black text-white">
                {match.scoreHome}
              </p>
              <p className="text-gray-500 font-bold my-2">−</p>
              <p className="text-6xl font-black text-white">
                {match.scoreAway}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-2xl font-black text-white text-right">
                  {match.awayFaculty.name}
                </h2>
                <p className="text-gray-400 text-sm text-right">{awayWon ? '🏆 Winner' : isDraw ? '🤝 Draw' : '❌ Loss'}</p>
              </div>
              <div
                className="w-20 h-20 rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-lg"
                style={{ backgroundColor: match.awayFaculty.colorPrimary }}
              >
                {match.awayFaculty.abbreviation}
              </div>
            </div>
          </div>
        </div>

        {/* Match Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pt-8 border-t border-slate-700">
          <div>
            <p className="text-gray-400 text-sm font-bold uppercase mb-1">Status</p>
            <span
              className={`px-4 py-2 rounded-lg font-bold inline-block ${
                match.status === 'PENDING'
                  ? 'bg-gray-500/20 text-gray-400'
                  : match.status === 'LIVE'
                  ? 'bg-red-500/20 text-red-400 animate-pulse'
                  : 'bg-green-500/20 text-green-400'
              }`}
            >
              {match.status}
            </span>
          </div>

          <div>
            <p className="text-gray-400 text-sm font-bold uppercase mb-1 flex items-center gap-1">
              <Calendar size={14} /> Match Date
            </p>
            <p className="text-white font-bold">
              {new Date(match.matchDate).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm font-bold uppercase mb-1 flex items-center gap-1">
              <MapPin size={14} /> Venue
            </p>
            <p className="text-white font-bold">{match.venue}</p>
          </div>
        </div>

        {/* Additional Info */}
        {(match.importance || match.notes) && (
          <div className="mb-8 space-y-4">
            {match.importance && (
              <div>
                <p className="text-gray-400 text-sm font-bold uppercase mb-2">
                  <Trophy size={14} className="inline mr-1" />
                  Importance
                </p>
                <p className="text-white font-semibold px-3 py-2 bg-slate-800 rounded-lg">
                  {match.importance}
                </p>
              </div>
            )}
            {match.notes && (
              <div>
                <p className="text-gray-400 text-sm font-bold uppercase mb-2">Notes</p>
                <p className="text-white px-3 py-2 bg-slate-800 rounded-lg">
                  {match.notes}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-700">
          <Link
            href={`/control-center/matches/${match.id}/edit`}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all"
          >
            Edit Match
          </Link>
          <Link
            href={`/control-center/scores/${match.id}`}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-all"
          >
            Update Score
          </Link>
        </div>
      </div>
    </div>
  );
}