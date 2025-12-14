import { db } from '@/server';
import { faculties, matches } from '@/server/schema';
import { desc, eq, and, or } from 'drizzle-orm';
import { Trophy } from 'lucide-react';

export const revalidate = 30; // Revalidate every 30 seconds

export default async function StandingsPage() {
  // Get all faculties sorted by points (only from competitive matches)
  const allFaculties = await db.query.faculties.findMany({
    orderBy: (faculties, { desc }) => [desc(faculties.points)],
  });

  // Get all competitive matches (exclude friendly)
  const competitiveMatches = await db. query.matches.findMany({
    where: and(
      eq(matches.status, 'FINISHED'),
      or(
        eq(matches.importance, 'League'),
        eq(matches.importance, 'Cup'),
        eq(matches.importance, 'Finals'),
      )
    ),
    with: {
      homeFaculty: true,
      awayFaculty: true,
    },
  });

  const totalCompetitiveMatches = competitiveMatches.length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-black text-white mb-2">Standings 🏆</h1>
        <p className="text-gray-400 font-semibold">Current league standings and faculty rankings (Competitive Matches Only)</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-950 to-blue-900 rounded-xl p-6 border border-blue-500/30">
          <p className="text-gray-400 text-sm font-bold uppercase mb-2">Competitive Matches</p>
          <p className="text-3xl font-black text-blue-400">{totalCompetitiveMatches}</p>
          <p className="text-xs text-gray-500 mt-2">(League, Cup, Finals only)</p>
        </div>

        <div className="bg-gradient-to-br from-amber-950 to-amber-900 rounded-xl p-6 border border-amber-500/30">
          <p className="text-gray-400 text-sm font-bold uppercase mb-2">Top Faculty</p>
          <p className="text-white font-black text-xl">
            {allFaculties. length > 0 ? allFaculties[0].abbreviation : 'N/A'}
          </p>
          <p className="text-xs text-gray-500 mt-2">{allFaculties.length > 0 ? allFaculties[0].points : 0} points</p>
        </div>

        <div className="bg-gradient-to-br from-purple-950 to-purple-900 rounded-xl p-6 border border-purple-500/30">
          <p className="text-gray-400 text-sm font-bold uppercase mb-2">Total Faculties</p>
          <p className="text-3xl font-black text-purple-400">{allFaculties. length}</p>
        </div>
      </div>

      {/* Standings Table */}
      {allFaculties.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Trophy size={28} className="text-yellow-500" />
            League Table
          </h2>
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-700">
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">Faculty</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-400 uppercase">P</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-400 uppercase">W</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-400 uppercase">D</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-400 uppercase">L</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-400 uppercase">GF</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-400 uppercase">GA</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-400 uppercase">GD</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-400 uppercase">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {allFaculties.map((fac, index) => (
                    <tr key={fac.id} className="border-b border-slate-700 hover:bg-slate-800/50 transition">
                      <td className="px-6 py-3">
                        <span className="text-lg font-black">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: fac.colorPrimary }}
                          >
                            {fac.abbreviation}
                          </div>
                          <span className="text-white font-bold">{fac.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-center text-white font-bold">{fac.played}</td>
                      <td className="px-6 py-3 text-center text-green-400 font-bold">{fac. won}</td>
                      <td className="px-6 py-3 text-center text-yellow-400 font-bold">{fac.drawn}</td>
                      <td className="px-6 py-3 text-center text-red-400 font-bold">{fac.lost}</td>
                      <td className="px-6 py-3 text-center text-blue-400 font-bold">{fac.goalsFor}</td>
                      <td className="px-6 py-3 text-center text-red-400 font-bold">{fac.goalsAgainst}</td>
                      <td className="px-6 py-3 text-center text-purple-400 font-bold">{fac.goalDifference}</td>
                      <td className="px-6 py-3 text-center text-white font-black text-lg">{fac.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg p-4 border border-slate-700">
            <p className="text-sm font-bold text-gray-300 mb-2">📊 Legend:</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs text-gray-400">
              <div>P = Played</div>
              <div>W = Won</div>
              <div>D = Drawn</div>
              <div>L = Lost</div>
              <div>GF = Goals For</div>
              <div>GA = Goals Against</div>
              <div>GD = Goal Difference</div>
              <div>Pts = Points</div>
            </div>
          </div>
        </div>
      )}

      {/* No Faculties Message */}
      {allFaculties.length === 0 && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 text-center">
          <Trophy size={48} className="text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400 text-lg font-semibold">No standings available yet</p>
          <p className="text-gray-500 text-sm mt-1">Competitive matches will appear here once played</p>
        </div>
      )}
    </div>
  );
}