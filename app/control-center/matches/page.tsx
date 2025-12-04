import { db } from '@/server';
import { matches } from '@/server/schema';
import Link from 'next/link';
import { Plus, Calendar, Trophy } from 'lucide-react';
import { eq } from 'drizzle-orm';

export default async function MatchesPage() {
  const allMatches = await db.query.matches.findMany({
    with: {
      homeFaculty: true,
      awayFaculty: true,
    },
    orderBy: (matches, { desc }) => [desc(matches.matchDate)],
  });

  const pendingCount = allMatches.filter(m => m.status === 'PENDING').length;
  const liveCount = allMatches.filter(m => m.status === 'LIVE').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Manage Matches</h1>
          <p className="text-gray-400 font-semibold flex items-center gap-2">
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-bold">{pendingCount} Pending</span>
            <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold animate-pulse">{liveCount} Live</span>
          </p>
        </div>
        <Link
          href="/control-center/matches/new"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-bold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
        >
          <Plus size={20} />
          Add Match
        </Link>
      </div>

      {/* Matches Table */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-700">
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase">Home</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-300 uppercase">Score</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase">Away</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allMatches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 font-semibold">
                    No matches scheduled.  Create one to get started!
                  </td>
                </tr>
              ) : (
                allMatches.map((match) => (
                  <tr
                    key={match.id}
                    className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-300 font-semibold">
                      {new Date(match.matchDate).toLocaleDateString()}<br/>
                      <span className="text-xs text-gray-500">{new Date(match.matchDate).toLocaleTimeString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow"
                          style={{ backgroundColor: match.homeFaculty. colorPrimary }}
                        >
                          {match.homeFaculty.abbreviation}
                        </div>
                        <span className="text-white font-bold">{match.homeFaculty.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-3xl font-black text-white">{match.scoreHome}</span>
                      <span className="text-gray-500 mx-2">−</span>
                      <span className="text-3xl font-black text-white">{match. scoreAway}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow"
                          style={{ backgroundColor: match.awayFaculty. colorPrimary }}
                        >
                          {match.awayFaculty.abbreviation}
                        </div>
                        <span className="text-white font-bold">{match.awayFaculty.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                          match.status === 'PENDING'
                            ? 'bg-gray-500/20 text-gray-400'
                            : match.status === 'LIVE'
                            ? 'bg-red-500/20 text-red-400 animate-pulse'
                            : 'bg-green-500/20 text-green-400'
                        }`}
                      >
                        {match.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/control-center/matches/${match.id}`}
                          className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm font-bold transition"
                        >
                          View
                        </Link>
                        <Link
                          href={`/control-center/scores/${match.id}`}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-bold transition"
                        >
                          Update
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}