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
    orderBy:  (matches, { desc }) => [desc(matches.matchDate)],
  });

  const pendingCount = allMatches.filter(m => m.status === 'PENDING').length;
  const liveCount = allMatches.filter(m => m.status === 'LIVE').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 sm:mb-3 leading-tight">
                Manage Matches
              </h1>
              <p className="text-gray-400 font-semibold flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <span className="px-2 sm:px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-bold whitespace-nowrap">
                  {pendingCount} Pending
                </span>
                <span className="px-2 sm:px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold animate-pulse whitespace-nowrap">
                  {liveCount} Live
                </span>
              </p>
            </div>
            <Link
              href="/control-center/matches/new"
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-bold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg whitespace-nowrap text-sm sm:text-base w-full sm:w-auto"
            >
              <Plus size={18} className="sm:w-5 sm:h-5" />
              <span>Add Match</span>
            </Link>
          </div>
        </div>

        {/* Matches Container */}
        <div className="rounded-xl sm:rounded-2xl border border-slate-700 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
          {/* Mobile Card View */}
          <div className="md:hidden">
            {allMatches.length === 0 ? (
              <div className="text-center py-8 sm:py-12 px-4">
                <Trophy className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-600 mb-3 sm:mb-4" />
                <p className="text-gray-400 font-semibold text-sm sm:text-base">
                  No matches scheduled
                </p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  Create one to get started!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-700">
                {allMatches. map((match) => (
                  <div
                    key={match.id}
                    className="p-4 sm:p-5 hover:bg-slate-800/50 transition-colors"
                  >
                    {/* Date */}
                    <div className="flex items-center gap-2 mb-3 sm:mb-4 text-xs sm:text-sm">
                      <Calendar size={16} className="text-blue-400 flex-shrink-0" />
                      <span className="text-gray-300 font-semibold">
                        {new Date(match.matchDate).toLocaleDateString()}
                      </span>
                      <span className="text-gray-500">
                        {new Date(match.matchDate).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {/* Score Card */}
                    <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between gap-2 sm:gap-3">
                        {/* Home Team */}
                        <div className="flex-1 flex flex-col items-center gap-2">
                          <div
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow flex-shrink-0"
                            style={{ backgroundColor: match.homeFaculty.colorPrimary }}
                          >
                            {match.homeFaculty. abbreviation}
                          </div>
                          <p className="text-white font-bold text-xs sm:text-sm text-center line-clamp-2">
                            {match.homeFaculty.name}
                          </p>
                          <p className="text-2xl sm:text-4xl font-black text-white">
                            {match.scoreHome}
                          </p>
                        </div>

                        {/* Divider */}
                        <div className="text-gray-500 font-bold text-lg">−</div>

                        {/* Away Team */}
                        <div className="flex-1 flex flex-col items-center gap-2">
                          <div
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow flex-shrink-0"
                            style={{ backgroundColor: match.awayFaculty.colorPrimary }}
                          >
                            {match.awayFaculty.abbreviation}
                          </div>
                          <p className="text-white font-bold text-xs sm:text-sm text-center line-clamp-2">
                            {match.awayFaculty. name}
                          </p>
                          <p className="text-2xl sm:text-4xl font-black text-white">
                            {match.scoreAway}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch">
                      <span
                        className={`px-3 py-2 rounded-lg text-xs font-bold text-center flex-shrink-0 ${
                          match.status === 'PENDING'
                            ? 'bg-gray-500/20 text-gray-400'
                            : match.status === 'LIVE'
                            ? 'bg-red-500/20 text-red-400 animate-pulse'
                            : 'bg-green-500/20 text-green-400'
                        }`}
                      >
                        {match.status}
                      </span>
                      <div className="flex gap-2 flex-1">
                        <Link
                          href={`/control-center/matches/${match.id}`}
                          className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs sm:text-sm font-bold transition text-center"
                        >
                          View
                        </Link>
                        <Link
                          href={`/control-center/scores/${match.id}`}
                          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-bold transition text-center"
                        >
                          Update
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tablet & Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-700">
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold text-gray-300 uppercase">
                    Date
                  </th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold text-gray-300 uppercase">
                    Home
                  </th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-center text-xs lg:text-sm font-bold text-gray-300 uppercase">
                    Score
                  </th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold text-gray-300 uppercase">
                    Away
                  </th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold text-gray-300 uppercase">
                    Status
                  </th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-right text-xs lg:text-sm font-bold text-gray-300 uppercase">
                    Actions
                  </th>
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
                      key={match. id}
                      className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-4 lg: px-6 py-3 lg:py-4 text-xs lg:text-sm text-gray-300 font-semibold whitespace-nowrap">
                        <div>
                          {new Date(match.matchDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(match.matchDate).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg: py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center text-white text-xs lg:text-sm font-bold shadow flex-shrink-0"
                            style={{
                              backgroundColor: match.homeFaculty.colorPrimary,
                            }}
                          >
                            {match.homeFaculty.abbreviation}
                          </div>
                          <span className="text-white font-bold text-sm lg:text-base truncate">
                            {match. homeFaculty.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg: py-4 text-center">
                        <span className="text-xl lg:text-3xl font-black text-white">
                          {match.scoreHome}
                        </span>
                        <span className="text-gray-500 mx-1 lg:mx-2">−</span>
                        <span className="text-xl lg:text-3xl font-black text-white">
                          {match. scoreAway}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center text-white text-xs lg:text-sm font-bold shadow flex-shrink-0"
                            style={{
                              backgroundColor: match.awayFaculty.colorPrimary,
                            }}
                          >
                            {match.awayFaculty.abbreviation}
                          </div>
                          <span className="text-white font-bold text-sm lg:text-base truncate">
                            {match.awayFaculty.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-bold inline-block whitespace-nowrap ${
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
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <div className="flex gap-2 justify-end">
                          <Link
                            href={`/control-center/matches/${match.id}`}
                            className="px-3 py-1 lg:px-4 lg:py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs lg:text-sm font-bold transition whitespace-nowrap"
                          >
                            View
                          </Link>
                          <Link
                            href={`/control-center/scores/${match.id}`}
                            className="px-3 py-1 lg:px-4 lg:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs lg:text-sm font-bold transition whitespace-nowrap"
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
    </div>
  );
}