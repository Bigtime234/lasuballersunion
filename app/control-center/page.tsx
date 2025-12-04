import { db } from '@/server';
import { matches, faculties } from '@/server/schema';
import { eq, and, desc } from 'drizzle-orm';
import Link from 'next/link';
import { BarChart3, Calendar, Trophy, Users, Zap, TrendingUp } from 'lucide-react';
import { auth } from '@/server/auth';

function ImportanceBadge({ importance }: { importance?: string | null }) {
  if (! importance) return null;

  const badgeConfig = {
    Friendly: { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: '⚽' },
    League: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: '🏆' },
    Cup: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: '🏆' },
    Finals: { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: '👑' },
  };

  const config = badgeConfig[importance as keyof typeof badgeConfig] || badgeConfig.Friendly;

  return (
    <span className={`px-2 py-1 rounded text-xs font-bold ${config.bg} ${config.text}`}>
      {config.icon} {importance}
    </span>
  );
}

export default async function ControlCenterDashboard() {
  const session = await auth();

  // Get all matches
  const allMatches = await db. query.matches.findMany({
    with: {
      homeFaculty: true,
      awayFaculty: true,
    },
  });

  // Get live matches
  const liveMatches = allMatches.filter(m => m.status === 'LIVE');

  // Get recent finished matches (last 5) - ONLY COMPETITIVE MATCHES
  const recentMatches = allMatches
    .filter(m => m. status === 'FINISHED' && ! m.archived && m.importance !== 'Friendly')
    .sort((a, b) => new Date(b.finishedAt || 0). getTime() - new Date(a.finishedAt || 0).getTime())
    .slice(0, 5);

  // Get pending matches (next 5)
  const upcomingMatches = allMatches
    .filter(m => m.status === 'PENDING')
    .sort((a, b) => new Date(a.matchDate). getTime() - new Date(b.matchDate).getTime())
    .slice(0, 5);

  // Get all faculties
  const allFaculties = await db.query.faculties.findMany({
    orderBy: (faculties, { desc }) => [desc(faculties.points)],
  });

  // Calculate stats
  const competitiveMatches = allMatches.filter(m => m.status === 'FINISHED' && m.importance !== 'Friendly');
  const friendlyMatches = allMatches. filter(m => m.status === 'FINISHED' && m. importance === 'Friendly');

  const stats = {
    totalMatches: allMatches.length,
    liveMatches: liveMatches.length,
    competitiveMatches: competitiveMatches.length,
    friendlyMatches: friendlyMatches.length,
    finishedMatches: allMatches.filter(m => m.status === 'FINISHED'). length,
    pendingMatches: allMatches.filter(m => m.status === 'PENDING'). length,
    totalFaculties: allFaculties.length,
    totalGoals: allFaculties.reduce((acc, f) => acc + f. goalsFor, 0),
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-4xl font-black text-white mb-2">Welcome Back, {session?. user?.name}!  👋</h1>
        <p className="text-gray-400 font-semibold">Manage your sports tournaments and matches from here</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-950 to-blue-900 rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-sm font-bold uppercase">Total Matches</p>
            <BarChart3 size={20} className="text-blue-400" />
          </div>
          <p className="text-3xl font-black text-blue-400">{stats.totalMatches}</p>
          <p className="text-xs text-gray-500 mt-2">{stats.finishedMatches} finished</p>
        </div>

        <div className="bg-gradient-to-br from-red-950 to-red-900 rounded-xl p-6 border border-red-500/30">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-sm font-bold uppercase">Live Now</p>
            <Zap size={20} className="text-red-400 animate-pulse" />
          </div>
          <p className="text-3xl font-black text-red-400">{stats.liveMatches}</p>
          <p className="text-xs text-gray-500 mt-2">Active matches</p>
        </div>

        <div className="bg-gradient-to-br from-purple-950 to-purple-900 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-sm font-bold uppercase">Competitive</p>
            <Trophy size={20} className="text-purple-400" />
          </div>
          <p className="text-3xl font-black text-purple-400">{stats.competitiveMatches}</p>
          <p className="text-xs text-gray-500 mt-2">League/Cup/Finals</p>
        </div>

        <div className="bg-gradient-to-br from-orange-950 to-orange-900 rounded-xl p-6 border border-orange-500/30">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-sm font-bold uppercase">Upcoming</p>
            <Calendar size={20} className="text-orange-400" />
          </div>
          <p className="text-3xl font-black text-orange-400">{stats. pendingMatches}</p>
          <p className="text-xs text-gray-500 mt-2">Scheduled</p>
        </div>

        <div className="bg-gradient-to-br from-green-950 to-green-900 rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-sm font-bold uppercase">Faculties</p>
            <Users size={20} className="text-green-400" />
          </div>
          <p className="text-3xl font-black text-green-400">{stats. totalFaculties}</p>
          <p className="text-xs text-gray-500 mt-2">Registered</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/control-center/matches/new"
          className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl p-6 border border-blue-500/30 transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <Calendar size={24} className="text-blue-200" />
            <h3 className="text-lg font-black text-white">Schedule Match</h3>
          </div>
          <p className="text-blue-200 text-sm font-semibold">Create a new match</p>
        </Link>

        <Link
          href="/control-center/scores"
          className="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl p-6 border border-green-500/30 transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <Trophy size={24} className="text-green-200" />
            <h3 className="text-lg font-black text-white">Update Scores</h3>
          </div>
          <p className="text-green-200 text-sm font-semibold">Edit live matches</p>
        </Link>

        <Link
          href="/control-center/faculties/new"
          className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-xl p-6 border border-purple-500/30 transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <Users size={24} className="text-purple-200" />
            <h3 className="text-lg font-black text-white">Add Faculty</h3>
          </div>
          <p className="text-purple-200 text-sm font-semibold">Register new faculty</p>
        </Link>
      </div>

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Zap size={28} className="text-red-500 animate-pulse" />
            Live Now
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveMatches.map((match) => (
              <div
                key={match.id}
                className="bg-gradient-to-br from-red-950 to-red-900 border-2 border-red-500/50 rounded-xl p-6 shadow-lg shadow-red-500/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-black animate-pulse flex items-center gap-1">
                      <div className="w-2 h-2 bg-white rounded-full" />
                      LIVE {match.matchMinute || 0}'
                    </span>
                    <ImportanceBadge importance={match.importance} />
                  </div>
                  <Link
                    href={`/control-center/scores/${match.id}`}
                    className="text-xs font-bold text-red-300 hover:text-red-200 transition"
                  >
                    Update →
                  </Link>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: match.homeFaculty. colorPrimary }}
                      >
                        {match.homeFaculty.abbreviation}
                      </div>
                      <span className="text-white font-bold">{match.homeFaculty.name}</span>
                    </div>
                    <span className="text-2xl font-black text-white">{match.scoreHome}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: match.awayFaculty.colorPrimary }}
                      >
                        {match.awayFaculty.abbreviation}
                      </div>
                      <span className="text-white font-bold">{match.awayFaculty.name}</span>
                    </div>
                    <span className="text-2xl font-black text-white">{match. scoreAway}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Matches */}
      {upcomingMatches.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Calendar size={28} className="text-orange-500" />
            Upcoming Matches
          </h2>
          <div className="space-y-3">
            {upcomingMatches.map((match) => (
              <div
                key={match.id}
                className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg p-4 border border-slate-700 hover:border-orange-500/50 transition-all"
              >
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 whitespace-nowrap">
                      {new Date(match.matchDate).toLocaleDateString()} {new Date(match.matchDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <ImportanceBadge importance={match. importance} />
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: match.homeFaculty.colorPrimary }}
                    >
                      {match.homeFaculty.abbreviation}
                    </div>
                    <span className="text-white font-bold text-sm">{match.homeFaculty.name}</span>
                    <span className="text-gray-500">vs</span>
                    <span className="text-white font-bold text-sm">{match.awayFaculty.name}</span>
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: match.awayFaculty.colorPrimary }}
                    >
                      {match.awayFaculty.abbreviation}
                    </div>
                  </div>
                  <Link
                    href={`/control-center/matches/${match.id}`}
                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm font-bold transition"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Results - ONLY COMPETITIVE MATCHES */}
      {recentMatches.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <TrendingUp size={28} className="text-green-500" />
            Recent Results (Competitive Matches Only)
          </h2>
          <div className="space-y-3">
            {recentMatches.map((match) => {
              const homeWon = match.scoreHome > match.scoreAway;
              const awayWon = match.scoreAway > match. scoreHome;
              const isDraw = match.scoreHome === match. scoreAway;

              return (
                <div
                  key={match.id}
                  className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg p-4 border border-slate-700"
                >
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400 whitespace-nowrap">
                        {new Date(match.finishedAt || match.matchDate).toLocaleDateString()}
                      </span>
                      <ImportanceBadge importance={match.importance} />
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: match.homeFaculty.colorPrimary }}
                      >
                        {match.homeFaculty.abbreviation}
                      </div>
                      <span className={`text-sm font-bold ${homeWon ? 'text-white' : 'text-gray-400'}`}>
                        {match.homeFaculty.name}
                      </span>
                      <span className="text-2xl font-black text-white">{match.scoreHome}</span>
                      <span className="text-gray-500">−</span>
                      <span className="text-2xl font-black text-white">{match. scoreAway}</span>
                      <span className={`text-sm font-bold ${awayWon ? 'text-white' : 'text-gray-400'}`}>
                        {match.awayFaculty.name}
                      </span>
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: match. awayFaculty.colorPrimary }}
                      >
                        {match.awayFaculty.abbreviation}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                        isDraw ? 'bg-yellow-500/20 text-yellow-400' : homeWon ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {isDraw ? 'Draw' : homeWon ? `${match.homeFaculty.name} Win` : `${match.awayFaculty.name} Win`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Faculties - Standings */}
      {allFaculties.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Trophy size={28} className="text-yellow-500" />
            Standings (Competitive Matches Only)
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
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-400 uppercase">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {allFaculties.slice(0, 8).map((fac, index) => (
                    <tr key={fac. id} className="border-b border-slate-700 hover:bg-slate-800/50 transition">
                      <td className="px-6 py-3">
                        <span className="text-lg font-black">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: fac. colorPrimary }}
                          >
                            {fac. abbreviation}
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
                      <td className="px-6 py-3 text-center text-white font-black text-lg">{fac.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}