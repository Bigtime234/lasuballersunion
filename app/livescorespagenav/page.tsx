import { db } from '@/server';
import { matches, faculties } from '@/server/schema';
import { eq, and, desc } from 'drizzle-orm';
import Link from 'next/link';
import { Zap, Calendar, TrendingUp } from 'lucide-react';

function ImportanceBadge({ importance }: { importance?: string }) {
  if (!importance) return null;

  const isFriendly = importance === 'Friendly';
  const badgeConfig = {
    Friendly: { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: '⚽' },
    League: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: '🏆' },
    Cup: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: '🏆' },
    Finals: { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: '👑' },
  };

  const config = badgeConfig[importance as keyof typeof badgeConfig] || badgeConfig.Friendly;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
      {config.icon} {importance}
    </span>
  );
}

export default async function LiveScoresPage() {
  // Get all matches with faculty relations
  const allMatches = await db.query. matches.findMany({
    with: {
      homeFaculty: true,
      awayFaculty: true,
    },
  });

  // Get live matches
  const liveMatches = allMatches.filter(m => m.status === 'LIVE');

  // Get recent finished matches (last 5)
  const recentMatches = allMatches
    . filter(m => m.status === 'FINISHED' && ! m.archived)
    .sort((a, b) => new Date(b.finishedAt || 0). getTime() - new Date(a.finishedAt || 0).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-black text-white mb-2">Live Scores ⚽</h1>
        <p className="text-gray-400 font-semibold">Follow all live matches and recent results</p>
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
                    <ImportanceBadge importance={match. importance} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: match.homeFaculty.colorPrimary }}
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
                    <span className="text-2xl font-black text-white">{match.scoreAway}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Live Matches Message */}
      {liveMatches.length === 0 && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 text-center">
          <Zap size={48} className="text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400 text-lg font-semibold">No live matches at the moment</p>
          <p className="text-gray-500 text-sm mt-1">Check back soon for upcoming matches</p>
        </div>
      )}

      {/* Recent Results */}
      {recentMatches.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <TrendingUp size={28} className="text-green-500" />
            Recent Results
          </h2>
          <div className="space-y-3">
            {recentMatches.map((match) => {
              const homeWon = match.scoreHome > match.scoreAway;
              const awayWon = match. scoreAway > match.scoreHome;
              const isDraw = match.scoreHome === match. scoreAway;
              const isFriendly = match.importance === 'Friendly';

              return (
                <div
                  key={match.id}
                  className={`bg-gradient-to-r rounded-lg p-4 border transition-all ${
                    isFriendly
                      ? 'from-slate-800 to-slate-900 border-slate-700 opacity-75'
                      : 'from-slate-800 to-slate-900 border-slate-700 hover:border-green-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400 whitespace-nowrap">
                        {new Date(match.finishedAt || match.matchDate).toLocaleDateString()}
                      </span>
                      <ImportanceBadge importance={match. importance} />
                    </div>

                    <div className="flex items-center gap-3 flex-1 min-w-max">
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: match.homeFaculty.colorPrimary }}
                      >
                        {match.homeFaculty.abbreviation}
                      </div>
                      <span className={`text-sm font-bold ${homeWon && ! isFriendly ? 'text-white' : 'text-gray-400'}`}>
                        {match.homeFaculty.name}
                      </span>
                      <span className="text-2xl font-black text-white">{match.scoreHome}</span>
                      <span className="text-gray-500">−</span>
                      <span className="text-2xl font-black text-white">{match.scoreAway}</span>
                      <span className={`text-sm font-bold ${awayWon && !isFriendly ?  'text-white' : 'text-gray-400'}`}>
                        {match.awayFaculty.name}
                      </span>
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: match.awayFaculty.colorPrimary }}
                      >
                        {match.awayFaculty.abbreviation}
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                      isFriendly
                        ? 'bg-gray-500/20 text-gray-400'
                        : isDraw
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : homeWon
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {isFriendly ? 'Friendly' : isDraw ? 'Draw' : homeWon ? `${match.homeFaculty.name} Win` : `${match.awayFaculty.name} Win`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No Recent Matches Message */}
      {recentMatches.length === 0 && liveMatches.length === 0 && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 text-center">
          <TrendingUp size={48} className="text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400 text-lg font-semibold">No results yet</p>
          <p className="text-gray-500 text-sm mt-1">Matches will appear here once they finish</p>
        </div>
      )}
    </div>
  );
}