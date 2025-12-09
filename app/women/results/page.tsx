'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowLeft, Calendar, AlertCircle } from 'lucide-react';

interface Match {
  id: number;
  scoreHome: number;
  scoreAway: number;
  finishedAt: Date | string | null;
  matchDate: Date | string;
  importance: string | null;
  venue: string;
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

function ImportanceBadge({ importance }: { importance: string | null }) {
  if (!importance) return null;

  const badgeConfig: Record<string, { bg: string; text: string; icon: string }> = {
    Friendly: { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: '⚽' },
    League: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: '🏆' },
    Cup: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: '🏆' },
    Finals: { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: '👑' },
  };

  const config = badgeConfig[importance] || badgeConfig.Friendly;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
      {config.icon} {importance}
    </span>
  );
}

export default function WomensResultsPage() {
  const [results, setResults] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('/api2/women-data');
        const data = await response.json();
        setResults(data.recentMatches || []);
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/women"
            className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 font-bold mb-4 transition"
          >
            <ArrowLeft size={20} />
            Back to Women's Home
          </Link>
          
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                MATCH RESULTS
              </span>
            </h1>
            <p className="text-gray-400 font-semibold">Recent women's match outcomes • Competitive matches only</p>
          </div>
        </div>

        {/* Results List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 font-semibold">Loading results...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((match) => {
              const homeWon = match.scoreHome > match.scoreAway;
              const awayWon = match.scoreAway > match.scoreHome;
              const isDraw = match.scoreHome === match.scoreAway;

              return (
                <div
                  key={match.id}
                  className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl p-6 border border-slate-700 hover:border-pink-500/50 transition-all"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-sm font-bold text-gray-400">
                        {new Date(match.finishedAt || match.matchDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <ImportanceBadge importance={match.importance} />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isDraw 
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {isDraw ? '🤝 Draw' : '✓ FT'}
                    </span>
                  </div>

                  {/* Teams & Scores */}
                  <div className="space-y-4">
                    {/* Home Team */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-black shadow-lg"
                          style={{ backgroundColor: match.homeFaculty.colorPrimary }}
                        >
                          {match.homeFaculty.abbreviation}
                        </div>
                        <p className={`text-lg font-bold ${homeWon ? 'text-white' : 'text-gray-400'}`}>
                          {match.homeFaculty.name}
                        </p>
                      </div>
                      <p className={`text-4xl font-black ${homeWon ? 'text-green-400' : 'text-gray-400'}`}>
                        {match.scoreHome}
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                      <span className="text-xs font-bold text-gray-500">VS</span>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                    </div>

                    {/* Away Team */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-black shadow-lg"
                          style={{ backgroundColor: match.awayFaculty.colorPrimary }}
                        >
                          {match.awayFaculty.abbreviation}
                        </div>
                        <p className={`text-lg font-bold ${awayWon ? 'text-white' : 'text-gray-400'}`}>
                          {match.awayFaculty.name}
                        </p>
                      </div>
                      <p className={`text-4xl font-black ${awayWon ? 'text-green-400' : 'text-gray-400'}`}>
                        {match.scoreAway}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  {match.venue && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <p className="text-xs text-gray-500 font-semibold">📍 {match.venue}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-700">
            <AlertCircle size={48} className="text-gray-500 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-white mb-2">No Results Available</h3>
            <p className="text-gray-400 font-semibold mb-6">Results will appear after matches are completed</p>
            <Link
              href="/women/fixtures"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition"
            >
              <Calendar size={18} />
              View Upcoming Fixtures
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}