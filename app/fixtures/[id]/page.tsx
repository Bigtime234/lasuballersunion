import { db } from '@/server';
import { matches } from '@/server/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, MapPin, Trophy, Users } from 'lucide-react';

function ImportanceBadge({ importance }: { importance?: string }) {
  if (!importance) return null;

  const badgeConfig = {
    Friendly: { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: '⚽', border: 'border-gray-500/30' },
    League: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: '🏆', border: 'border-blue-500/30' },
    Cup: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: '🏆', border: 'border-purple-500/30' },
    Finals: { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: '👑', border: 'border-amber-500/30' },
  };

  const config = badgeConfig[importance as keyof typeof badgeConfig] || badgeConfig.Friendly;

  return (
    <span className={`px-4 py-2 rounded-lg text-sm font-bold ${config.bg} ${config.text} border ${config.border}`}>
      {config.icon} {importance}
    </span>
  );
}

export default async function FixtureDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> // Changed to Promise
}) {
  // Await params - THIS IS THE FIX
  const { id } = await params;
  const matchId = parseInt(id);
  
  if (isNaN(matchId)) {
    notFound();
  }

  const match = await db.query.matches.findFirst({
    where: eq(matches.id, matchId),
    with: {
      homeFaculty: true,
      awayFaculty: true,
    },
  });

  if (!match) {
    notFound();
  }

  const matchDate = new Date(match.matchDate);
  const isUpcoming = match.status === 'PENDING';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-8">
      <div className="container mx-auto px-4 space-y-8">
        {/* Back Button */}
        <Link
          href="/fixtures"
          className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-bold transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Fixtures
        </Link>

        {/* Match Header */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl">
          {/* Status Banner */}
          <div className={`px-6 py-3 ${
            isUpcoming 
              ? 'bg-gradient-to-r from-orange-600/20 to-orange-500/20 border-b border-orange-500/30' 
              : 'bg-gradient-to-r from-green-600/20 to-green-500/20 border-b border-green-500/30'
          }`}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-black ${
                  isUpcoming 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-green-500 text-white'
                }`}>
                  {match.status === 'PENDING' ? '⏱️ UPCOMING' : match.status === 'LIVE' ? '🔴 LIVE' : '✅ FINISHED'}
                </span>
                <ImportanceBadge importance={match.importance} />
              </div>
              
              {/* Date & Time */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-2 rounded-lg">
                  <Calendar size={18} className="text-orange-400" />
                  <span className="text-sm font-bold text-white">
                    {matchDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-2 rounded-lg">
                  <Clock size={18} className="text-orange-400" />
                  <span className="text-sm font-bold text-white">
                    {matchDate.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Match Details */}
          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* Home Team */}
              <div className="text-center space-y-4">
                <div
                  className="w-32 h-32 mx-auto rounded-2xl flex items-center justify-center text-white text-4xl font-black shadow-2xl transform hover:scale-110 transition-transform"
                  style={{ backgroundColor: match.homeFaculty.colorPrimary }}
                >
                  {match.homeFaculty.abbreviation}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Home</p>
                  <h2 className="text-2xl md:text-3xl font-black text-white">{match.homeFaculty.name}</h2>
                </div>
              </div>

              {/* VS / Score */}
              <div className="text-center">
                {match.status === 'PENDING' ? (
                  <div className="space-y-3">
                    <div className="text-6xl font-black text-gray-600">VS</div>
                    <p className="text-gray-500 font-bold text-sm">Match hasn't started</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-7xl font-black text-white tabular-nums flex items-center justify-center gap-4">
                      <span className={match.scoreHome > match.scoreAway ? 'text-green-400' : 'text-white'}>
                        {match.scoreHome}
                      </span>
                      <span className="text-gray-600">:</span>
                      <span className={match.scoreAway > match.scoreHome ? 'text-green-400' : 'text-white'}>
                        {match.scoreAway}
                      </span>
                    </div>
                    {match.status === 'LIVE' && (
                      <p className="text-red-400 font-black text-sm animate-pulse">
                        🔴 {match.matchMinute}'
                      </p>
                    )}
                    {match.status === 'FINISHED' && (
                      <p className="text-green-400 font-bold text-sm">
                        ✅ Full Time
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Away Team */}
              <div className="text-center space-y-4">
                <div
                  className="w-32 h-32 mx-auto rounded-2xl flex items-center justify-center text-white text-4xl font-black shadow-2xl transform hover:scale-110 transition-transform"
                  style={{ backgroundColor: match.awayFaculty.colorPrimary }}
                >
                  {match.awayFaculty.abbreviation}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Away</p>
                  <h2 className="text-2xl md:text-3xl font-black text-white">{match.awayFaculty.name}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Match Information */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Venue */}
          {match.venue && (
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <MapPin size={24} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-bold uppercase">Venue</p>
                  <p className="text-white text-xl font-black">{match.venue}</p>
                </div>
              </div>
            </div>
          )}

          {/* Match Type */}
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Trophy size={24} className="text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm font-bold uppercase">Competition</p>
                <p className="text-white text-xl font-black">{match.importance || 'Friendly'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl p-8 border border-slate-700/50">
          <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
            <Users size={28} className="text-orange-400" />
            Match Information
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 text-sm font-bold uppercase mb-2">Match Status</p>
              <p className="text-white font-bold text-lg">
                {match.status === 'PENDING' && '⏱️ Scheduled'}
                {match.status === 'LIVE' && '🔴 In Progress'}
                {match.status === 'FINISHED' && '✅ Completed'}
              </p>
            </div>

            {match.status === 'FINISHED' && match.finishedAt && (
              <div>
                <p className="text-gray-400 text-sm font-bold uppercase mb-2">Finished At</p>
                <p className="text-white font-bold text-lg">
                  {new Date(match.finishedAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            )}

            <div>
              <p className="text-gray-400 text-sm font-bold uppercase mb-2">Match ID</p>
              <p className="text-white font-mono font-bold text-lg">#{match.id}</p>
            </div>

            {match.status === 'LIVE' && (
              <div>
                <p className="text-gray-400 text-sm font-bold uppercase mb-2">Current Minute</p>
                <p className="text-red-400 font-black text-lg animate-pulse">
                  {match.matchMinute}'
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/fixtures"
            className="px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-xl font-black transition-all transform hover:scale-105 shadow-lg"
          >
            View All Fixtures
          </Link>
          <Link
            href="/standings"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-black transition-all transform hover:scale-105 shadow-lg"
          >
            View Standings
          </Link>
        </div>
      </div>
    </div>
  );
}