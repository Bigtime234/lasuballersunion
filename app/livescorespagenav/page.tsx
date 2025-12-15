'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, Calendar, TrendingUp, AlertCircle } from 'lucide-react';

interface Match {
  id: number;
  status: 'PENDING' | 'LIVE' | 'FINISHED';
  scoreHome: number;
  scoreAway: number;
  matchDate: Date | string;
  finishedAt:  Date | string | null;
  matchMinute: number;
  archived: boolean;
  importance: string | null;
  venue?:  string;
  homeFaculty: {
    id: number;
    name: string;
    abbreviation: string;
    colorPrimary: string;
  };
  awayFaculty: {
    id: number;
    name: string;
    abbreviation: string;
    colorPrimary: string;
  };
}

interface LiveScoresData {
  liveMatches: Match[];
  recentMatches: Match[];
}

// ============================================
// IMPORTANCE BADGE
// ============================================
function ImportanceBadge({ importance }: { importance?:  string }) {
  if (!importance) return null;

  const badgeConfig:  Record<string, { bg: string; text: string; icon: string }> = {
    Friendly: { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: '⚽' },
    League: { bg: 'bg-blue-500/20', text:  'text-blue-400', icon: '🏆' },
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

// ============================================
// LIVE MATCH CARD
// ============================================
function LiveMatchCard({ match }: { match: Match }) {
  return (
    <div className="bg-gradient-to-br from-red-950 to-red-900 border-2 border-red-500/50 rounded-xl p-6 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300 transform hover:scale-105">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full text-xs font-black animate-pulse flex items-center gap-1 shadow-lg shadow-red-500/50">
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
            LIVE {match.matchMinute || 0}'
          </span>
          <ImportanceBadge importance={match. importance} />
        </div>
      </div>

      <div className="space-y-4">
        {/* Home Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: match. homeFaculty.colorPrimary }}
            >
              {match.homeFaculty.abbreviation}
            </div>
            <span className="text-white font-bold truncate">{match.homeFaculty.name}</span>
          </div>
          <span className="text-4xl font-black text-white ml-2">{match.scoreHome}</span>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
          <span className="text-xs font-bold text-gray-500 uppercase">vs</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: match.awayFaculty.colorPrimary }}
            >
              {match.awayFaculty.abbreviation}
            </div>
            <span className="text-white font-bold truncate">{match.awayFaculty.name}</span>
          </div>
          <span className="text-4xl font-black text-white ml-2">{match.scoreAway}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN LIVE SCORES PAGE
// ============================================
export default function LiveScoresPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [category, setCategory] = useState<'men' | 'women'>('men');
  const [data, setData] = useState<LiveScoresData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // SESSION PROTECTION
  // ============================================
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // ============================================
  // FETCH LIVE SCORES DATA
  // ============================================
  useEffect(() => {
    const fetchLiveScores = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch from appropriate endpoint based on category
        const endpoint = category === 'men' ? '/api2/home-data' : '/api2/women-data';
        const response = await fetch(endpoint);

        if (!response. ok) {
          throw new Error(`Failed to fetch ${category} live scores`);
        }

        const homeData = await response.json();
        setData({
          liveMatches: homeData.liveMatches || [],
          recentMatches:  homeData.recentMatches || [],
        });
      } catch (err) {
        console.error('Error fetching live scores:', err);
        setError(err instanceof Error ? err.message :  'Failed to load live scores');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchLiveScores();
    }
  }, [category, status]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-black text-white mb-2">Loading Live Scores</h2>
          <p className="text-gray-400 font-semibold">Fetching match updates...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (status === 'unauthenticated') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-black text-white mb-2">Loading {category. toUpperCase()} Live Scores</h2>
          <p className="text-gray-400 font-semibold">Fetching match updates...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-400 font-semibold mb-6">{error || 'Failed to load live scores'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-bold transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <Zap size={32} className="text-red-400 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Live Scores
            </h1>
          </div>
          <p className="text-gray-400 font-semibold">Follow all live matches and recent results</p>
        </div>

        {/* Category Toggle */}
        <div className="mb-12 flex justify-center">
          <div className="inline-flex gap-2 p-1 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg border border-red-500/30 backdrop-blur-md">
            <button
              onClick={() => setCategory('men')}
              className={`flex items-center gap-2 px-6 md:px-8 py-3 rounded-lg font-black text-sm md:text-base transition-all duration-300 ${
                category === 'men'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>👨</span>
              MEN'S
            </button>
            <button
              onClick={() => setCategory('women')}
              className={`flex items-center gap-2 px-6 md: px-8 py-3 rounded-lg font-black text-sm md:text-base transition-all duration-300 ${
                category === 'women'
                  ? 'bg-gradient-to-r from-pink-600 to-pink-700 text-white shadow-lg shadow-pink-500/50'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>👩</span>
              WOMEN'S
            </button>
          </div>
        </div>

        {/* Live Matches Section */}
        {data.liveMatches.length > 0 && (
          <div className="space-y-6 mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 flex-wrap">
              <Zap size={32} className="text-red-500 animate-pulse" />
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Live Now
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data. liveMatches.map((match) => (
                <LiveMatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        )}

        {/* No Live Matches Message */}
        {data.liveMatches.length === 0 && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-12 border border-slate-700 text-center mb-12">
            <Zap size={48} className="text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 text-lg font-semibold">No live matches at the moment</p>
            <p className="text-gray-500 text-sm mt-1">Check back soon for upcoming {category} matches</p>
          </div>
        )}

        {/* Recent Results Section */}
        {data. recentMatches.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 flex-wrap">
              <TrendingUp size={32} className="text-green-500" />
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Recent Results
              </span>
            </h2>

            <div className="space-y-3">
              {data.recentMatches.map((match) => {
                const homeWon = match.scoreHome > match.scoreAway;
                const awayWon = match. scoreAway > match.scoreHome;
                const isDraw = match.scoreHome === match.scoreAway;
                const isFriendly = match.importance === 'Friendly';

                return (
                  <div
                    key={match.id}
                    className={`rounded-lg p-4 md:p-6 border transition-all backdrop-blur-sm ${
                      isFriendly
                        ?  'bg-gradient-to-r from-slate-800/40 to-slate-900/40 border-slate-700 opacity-75'
                        : 'bg-gradient-to-r from-slate-800/60 to-slate-900/60 border-slate-700 hover:border-green-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 flex-wrap md:flex-nowrap">
                      {/* Date & Badge */}
                      <div className="flex items-center gap-2 min-w-max">
                        <span className="text-xs font-bold text-gray-400 whitespace-nowrap">
                          {new Date(match. finishedAt || match.matchDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric'
                          })}
                        </span>
                        <ImportanceBadge importance={match. importance} />
                      </div>

                      {/* Match Score */}
                      <div className="flex items-center gap-2 flex-wrap justify-center flex-1 md:flex-initial order-3 md:order-2">
                        <div
                          className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: match.homeFaculty.colorPrimary }}
                        >
                          {match.homeFaculty. abbreviation}
                        </div>
                        <span className={`text-xs md:text-sm font-bold truncate ${homeWon && ! isFriendly ? 'text-white' : 'text-gray-400'}`}>
                          {match.homeFaculty.name}
                        </span>
                        <span className="text-lg md:text-2xl font-black text-white mx-1">{match.scoreHome}</span>
                        <span className="text-gray-500">−</span>
                        <span className="text-lg md:text-2xl font-black text-white mx-1">{match.scoreAway}</span>
                        <span className={`text-xs md:text-sm font-bold truncate ${awayWon && ! isFriendly ? 'text-white' : 'text-gray-400'}`}>
                          {match.awayFaculty.name}
                        </span>
                        <div
                          className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: match.awayFaculty.colorPrimary }}
                        >
                          {match.awayFaculty.abbreviation}
                        </div>
                      </div>

                      {/* Result Badge */}
                      <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap order-2 md:order-3 ${
                        isFriendly
                          ? 'bg-gray-500/20 text-gray-400'
                          : isDraw
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : homeWon
                          ?  'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {isFriendly ? 'Friendly' : isDraw ?  '🤝 Draw' : homeWon ?  '✓ FT' : '✓ FT'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* No Results Message */}
        {data. recentMatches.length === 0 && data.liveMatches.length === 0 && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-12 border border-slate-700 text-center">
            <TrendingUp size={48} className="text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 text-lg font-semibold">No results yet</p>
            <p className="text-gray-500 text-sm mt-1">
              {category === 'men' ? "Men's" : "Women's"} matches will appear here once they finish
            </p>
          </div>
        )}
      </div>

      {/* Scrollbar Styling */}
      <style jsx global>{`
        .scrollbar-hide: :-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style:  none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}