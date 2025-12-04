import { db } from '@/server';
import { matches } from '@/server/schema';
import Link from 'next/link';
import { eq, or } from 'drizzle-orm';
import { Flame, Clock } from 'lucide-react';

export default async function ScoresPage() {
  // Get LIVE and PENDING matches
  const activeMatches = await db. query.matches.findMany({
    with: {
      homeFaculty: true,
      awayFaculty: true,
    },
    orderBy: (matches, { desc }) => [desc(matches.matchDate)],
  });

  const liveMatches = activeMatches. filter(m => m.status === 'LIVE');
  const pendingMatches = activeMatches.filter(m => m.status === 'PENDING');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-white mb-2">Update Scores</h1>
        <p className="text-gray-400 font-semibold">
          {liveMatches.length > 0
            ? `⚡ ${liveMatches.length} match${liveMatches.length > 1 ? 'es' : ''} live right now! `
            : '✅ No live matches currently'}
        </p>
      </div>

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Flame size={24} className="text-red-500 animate-pulse" />
            <h2 className="text-2xl font-black text-white">Live Now</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveMatches.map((match) => (
              <div
                key={match.id}
                className="bg-gradient-to-br from-red-950 to-red-900 border-2 border-red-500/50 rounded-2xl p-6 shadow-2xl shadow-red-500/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-black animate-pulse flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full" />
                    LIVE {match.matchMinute || 0}'
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: match.homeFaculty.colorPrimary }}
                    >
                      {match.homeFaculty.abbreviation}
                    </div>
                    <span className="text-white font-bold flex-1">{match.homeFaculty. name}</span>
                    <span className="text-3xl font-black text-white">{match.scoreHome}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: match.awayFaculty.colorPrimary }}
                    >
                      {match.awayFaculty.abbreviation}
                    </div>
                    <span className="text-white font-bold flex-1">{match.awayFaculty.name}</span>
                    <span className="text-3xl font-black text-white">{match.scoreAway}</span>
                  </div>
                </div>

                <Link
                  href={`/control-center/scores/${match.id}`}
                  className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg font-bold hover:from-red-600 hover:to-pink-700 transition-all shadow-lg"
                >
                  Update Score →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Matches */}
      {pendingMatches.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock size={24} className="text-orange-500" />
            <h2 className="text-2xl font-black text-white">Upcoming</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingMatches.map((match) => (
              <div
                key={match.id}
                className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-gray-400 uppercase">
                    {new Date(match.matchDate).toLocaleDateString()}
                  </span>
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-bold">
                    Pending
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: match. homeFaculty.colorPrimary }}
                    >
                      {match.homeFaculty.abbreviation}
                    </div>
                    <span className="text-white font-bold">{match.homeFaculty. name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: match.awayFaculty.colorPrimary }}
                    >
                      {match.awayFaculty.abbreviation}
                    </div>
                    <span className="text-white font-bold">{match.awayFaculty.name}</span>
                  </div>
                </div>

                <Link
                  href={`/control-center/scores/${match.id}`}
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all"
                >
                  Start Match
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Matches */}
      {liveMatches.length === 0 && pendingMatches.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700">
          <p className="text-2xl font-black text-gray-400 mb-2">✅ All Caught Up!</p>
          <p className="text-gray-500 font-semibold">
            No active or pending matches. Create one to get started. 
          </p>
          <Link
            href="/control-center/matches/new"
            className="inline-block mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all"
          >
            Create Match
          </Link>
        </div>
      )}
    </div>
  );
}