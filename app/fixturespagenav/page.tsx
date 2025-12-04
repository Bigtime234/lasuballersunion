import { db } from '@/server';
import { matches } from '@/server/schema';
import { eq, and, desc } from 'drizzle-orm';
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';

function ImportanceBadge({ importance }: { importance?: string }) {
  if (!importance) return null;

  const badgeConfig = {
    Friendly: { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: '⚽' },
    League: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: '🏆' },
    Cup: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: '🏆' },
    Finals: { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: '👑' },
  };

  const config = badgeConfig[importance as keyof typeof badgeConfig] || badgeConfig.Friendly;

  return (
    <span className={`px-2 py-1 rounded text-xs font-bold ${config. bg} ${config.text}`}>
      {config.icon} {importance}
    </span>
  );
}

export default async function FixturesPage() {
  // Get all matches
  const allMatches = await db.query.matches.findMany({
    with: {
      homeFaculty: true,
      awayFaculty: true,
    },
  });

  // Get pending matches (upcoming) sorted by match date
  const upcomingMatches = allMatches
    .filter(m => m.status === 'PENDING')
    .sort((a, b) => new Date(a.matchDate). getTime() - new Date(b.matchDate).getTime());

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-black text-white mb-2">Fixtures 📅</h1>
        <p className="text-gray-400 font-semibold">Upcoming matches and scheduled fixtures</p>
      </div>

      {/* Upcoming Matches */}
      {upcomingMatches.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Calendar size={28} className="text-orange-500" />
            Scheduled Matches
          </h2>
          <div className="space-y-3">
            {upcomingMatches.map((match) => (
              <div
                key={match.id}
                className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg p-4 border border-slate-700 hover:border-orange-500/50 transition-all"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  {/* Date & Time */}
                  <div className="flex items-center gap-3 min-w-fit">
                    <div className="flex items-center gap-2">
                      <Calendar size={18} className="text-orange-400" />
                      <span className="text-xs font-bold text-gray-300 whitespace-nowrap">
                        {new Date(match.matchDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-orange-400" />
                      <span className="text-xs font-bold text-gray-300 whitespace-nowrap">
                        {new Date(match.matchDate).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Match Details */}
                  <div className="flex items-center gap-3 flex-1 min-w-max">
                    {/* Home Faculty */}
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: match.homeFaculty.colorPrimary }}
                      >
                        {match.homeFaculty.abbreviation}
                      </div>
                      <span className="text-white font-bold text-sm">{match.homeFaculty.name}</span>
                    </div>

                    {/* vs */}
                    <span className="text-gray-500 font-bold">vs</span>

                    {/* Away Faculty */}
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-sm">{match.awayFaculty. name}</span>
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: match.awayFaculty.colorPrimary }}
                      >
                        {match.awayFaculty.abbreviation}
                      </div>
                    </div>
                  </div>

                  {/* Importance Badge */}
                  <ImportanceBadge importance={match.importance} />

                  {/* View Button */}
                  <Link
                    href={`/fixtures/${match.id}`}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-bold transition-all whitespace-nowrap"
                  >
                    View Details →
                  </Link>
                </div>

                {/* Venue */}
                {match.venue && (
                  <div className="mt-3 pt-3 border-t border-slate-700 text-xs text-gray-400">
                    <span>📍 {match.venue}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Upcoming Matches Message */}
      {upcomingMatches.length === 0 && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 text-center">
          <Calendar size={48} className="text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400 text-lg font-semibold">No upcoming fixtures</p>
          <p className="text-gray-500 text-sm mt-1">Check back soon for scheduled matches</p>
        </div>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-orange-950 to-orange-900 rounded-xl p-6 border border-orange-500/30">
          <p className="text-gray-400 text-sm font-bold uppercase mb-2">Total Fixtures</p>
          <p className="text-3xl font-black text-orange-400">{upcomingMatches. length}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-950 to-blue-900 rounded-xl p-6 border border-blue-500/30">
          <p className="text-gray-400 text-sm font-bold uppercase mb-2">Next Match</p>
          <p className="text-white font-bold">
            {upcomingMatches.length > 0
              ? new Date(upcomingMatches[0].matchDate). toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              : 'N/A'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-950 to-purple-900 rounded-xl p-6 border border-purple-500/30">
          <p className="text-gray-400 text-sm font-bold uppercase mb-2">Venues</p>
          <p className="text-purple-400 font-black text-2xl">
            {new Set(upcomingMatches.map(m => m.venue)).size}
          </p>
        </div>
      </div>
    </div>
  );
}