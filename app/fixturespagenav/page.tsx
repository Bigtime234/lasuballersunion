'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, AlertCircle, ArrowRight } from 'lucide-react';

interface Match {
  id: number;
  status: 'PENDING' | 'LIVE' | 'FINISHED';
  scoreHome: number;
  scoreAway: number;
  matchDate: Date | string;
  finishedAt:    Date | string | null;
  matchMinute: number;
  archived: boolean;
  importance: string | null;
  venue? :  string;
  homeFaculty:   {
    id: number;
    name: string;
    abbreviation: string;
    colorPrimary: string;
  };
  awayFaculty:  {
    id: number;
    name: string;
    abbreviation: string;
    colorPrimary: string;
  };
}

interface FixturesData {
  upcomingMatches: Match[];
}

// ============================================
// IMPORTANCE BADGE
// ============================================
function ImportanceBadge({ importance }: { importance?  :   string }) {
  if (!importance) return null;

  const badgeConfig:    Record<string, { bg: string; text: string; icon: string }> = {
    Friendly: { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: '⚽' },
    League: { bg: 'bg-blue-500/20', text:    'text-blue-400', icon: '🏆' },
    Cup:  { bg: 'bg-purple-500/20', text:  'text-purple-400', icon: '🏆' },
    Finals: { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: '👑' },
  };

  const config = badgeConfig[importance as keyof typeof badgeConfig] || badgeConfig.Friendly;

  return (
    <span className={`px-2 md:px-3 py-1 rounded text-xs font-bold ${config.bg} ${config.text}`}>
      {config.icon} {importance}
    </span>
  );
}

// ============================================
// MAIN FIXTURES PAGE
// ============================================
export default function FixturesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [category, setCategory] = useState<'men' | 'women'>('men');
  const [data, setData] = useState<FixturesData | null>(null);
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
  // FETCH FIXTURES DATA
  // ============================================
  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch from appropriate endpoint based on category
        const endpoint = category === 'men' ?   '/api2/home-data' : '/api2/women-data';
        const response = await fetch(endpoint);

        if (!response.  ok) {
          throw new Error(`Failed to fetch ${category} fixtures`);
        }

        const homeData = await response.json();
        setData({
          upcomingMatches:  homeData.upcomingMatches || [],
        });
      } catch (err) {
        console.error('Error fetching fixtures:', err);
        setError(err instanceof Error ? err.message :    'Failed to load fixtures');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchFixtures();
    }
  }, [category, status]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-black text-white mb-2">Loading Fixtures</h2>
          <p className="text-gray-400 font-semibold">Fetching match schedules...</p>
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
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-black text-white mb-2">Loading {category.  toUpperCase()} Fixtures</h2>
          <p className="text-gray-400 font-semibold">Fetching match schedules... </p>
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
          <p className="text-gray-400 font-semibold mb-6">{error || 'Failed to load fixtures'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-lg font-bold transition-all"
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
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <Calendar size={32} className="text-orange-400" />
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              Fixtures
            </h1>
          </div>
          <p className="text-gray-400 font-semibold">Upcoming matches and scheduled fixtures</p>
        </div>

        {/* Category Toggle */}
        <div className="mb-12 flex justify-center">
          <div className="inline-flex gap-2 p-1 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg border border-orange-500/30 backdrop-blur-md">
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
              className={`flex items-center gap-2 px-6 md:  px-8 py-3 rounded-lg font-black text-sm md:text-base transition-all duration-300 ${
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

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-gradient-to-br from-orange-950 to-orange-900 rounded-xl p-6 border border-orange-500/30 hover:border-orange-500/50 transition-all">
            <p className="text-gray-400 text-sm font-bold uppercase mb-2">Total Fixtures</p>
            <p className="text-4xl font-black text-orange-400">{data.upcomingMatches.   length}</p>
            <p className="text-xs text-gray-500 mt-2">Upcoming matches</p>
          </div>

          <div className="bg-gradient-to-br from-blue-950 to-blue-900 rounded-xl p-6 border border-blue-500/30 hover:border-blue-500/50 transition-all">
            <p className="text-gray-400 text-sm font-bold uppercase mb-2">Next Match</p>
            <p className="text-white font-bold text-lg">
              {data.upcomingMatches.length > 0
                ? new Date(data.  upcomingMatches[0]. matchDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                : 'N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {data.upcomingMatches. length > 0
                ? new Date(data.upcomingMatches[0].  matchDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                  })
                : 'No matches'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-950 to-purple-900 rounded-xl p-6 border border-purple-500/30 hover:border-purple-500/50 transition-all">
            <p className="text-gray-400 text-sm font-bold uppercase mb-2">Venues</p>
            <p className="text-purple-400 font-black text-2xl">
              {new Set(data.upcomingMatches.map(m => m.venue || 'Unknown')).size}
            </p>
            <p className="text-xs text-gray-500 mt-2">Different locations</p>
          </div>
        </div>

        {/* Upcoming Matches */}
        {data.upcomingMatches. length > 0 && (
          <div className="space-y-6 mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
              <Calendar size={32} className="text-orange-500" />
              <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                Scheduled Matches
              </span>
            </h2>

            <div className="space-y-3">
              {data.upcomingMatches.map((match) => (
                <div
                  key={match.id}
                  className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-lg p-4 md:p-6 border border-slate-700 hover:border-orange-500/50 transition-all"
                >
                  {/* Top Row:  Date, Time & Importance */}
                  <div className="flex items-center justify-between gap-2 md:gap-4 mb-4 pb-4 border-b border-slate-700 flex-wrap">
                    <div className="flex items-center gap-2 md:gap-4">
                      {/* Date */}
                      <div className="flex items-center gap-2 min-w-fit">
                        <Calendar size={16} className="text-orange-400 flex-shrink-0" />
                        <span className="text-xs md:text-sm font-bold text-gray-300 whitespace-nowrap">
                          {new Date(match.matchDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-2 min-w-fit">
                        <Clock size={16} className="text-orange-400 flex-shrink-0" />
                        <span className="text-xs md:text-sm font-bold text-gray-300 whitespace-nowrap">
                          {new Date(match.matchDate).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    <ImportanceBadge importance={match. importance} />
                  </div>

                  {/* Match Details Row */}
                  <div className="flex items-center justify-between gap-2 md:gap-4 flex-wrap md:flex-nowrap">
                    {/* Home Team */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div
                        className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-white text-xs md:text-sm font-bold flex-shrink-0"
                        style={{ backgroundColor: match.homeFaculty.colorPrimary }}
                      >
                        {match. homeFaculty.abbreviation}
                      </div>
                      <span className="text-xs md:text-sm font-bold text-white truncate">{match.  homeFaculty.name}</span>
                    </div>

                    {/* VS */}
                    <span className="text-gray-500 font-bold text-xs md:text-sm flex-shrink-0">vs</span>

                    {/* Away Team */}
                    <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                      <span className="text-xs md:text-sm font-bold text-white truncate text-right">{match.awayFaculty.name}</span>
                      <div
                        className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-white text-xs md:text-sm font-bold flex-shrink-0"
                        style={{ backgroundColor: match. awayFaculty.colorPrimary }}
                      >
                        {match.awayFaculty.abbreviation}
                      </div>
                    </div>

                    {/* View Button */}
                    <Link
                      href={`/fixtures/${match.id}`}
                      className="px-3 md:px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs md:text-sm font-bold transition-all transform hover:scale-105 flex-shrink-0 whitespace-nowrap"
                    >
                      View →
                    </Link>
                  </div>

                  {/* Venue (if available) */}
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
        {data.upcomingMatches.length === 0 && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-12 border border-slate-700 text-center">
            <Calendar size={48} className="text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 text-lg font-semibold">No upcoming fixtures</p>
            <p className="text-gray-500 text-sm mt-1">
              {category === 'men' ? "Men's" : "Women's"} fixtures will appear here once scheduled
            </p>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-gray-200 rounded-lg font-bold transition-all transform hover:scale-105 border border-slate-600"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Scrollbar Styling */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}