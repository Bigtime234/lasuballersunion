'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, ArrowLeft, Clock, MapPin, AlertCircle } from 'lucide-react';

interface Match {
  id: number;
  matchDate: Date | string;
  venue: string;
  importance: string | null;
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

export default function WomensFixturesPage() {
  const [fixtures, setFixtures] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const response = await fetch('/api2/women-data');
        const data = await response.json();
        setFixtures(data.upcomingMatches || []);
      } catch (error) {
        console.error('Error fetching fixtures:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFixtures();
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
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                UPCOMING FIXTURES
              </span>
            </h1>
            <p className="text-gray-400 font-semibold">Women's matches scheduled ahead</p>
          </div>
        </div>

        {/* Fixtures List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 font-semibold">Loading fixtures...</p>
          </div>
        ) : fixtures.length > 0 ? (
          <div className="space-y-4">
            {fixtures.map((match) => (
              <div
                key={match.id}
                className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 hover:border-purple-500/50 transition-all"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  {/* Date & Time */}
                  <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-purple-400" />
                    <div>
                      <p className="text-white font-bold">
                        {new Date(match.matchDate).toLocaleDateString('en-US', { 
                          weekday: 'short',
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-gray-400 font-semibold">
                        {new Date(match.matchDate).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    <ImportanceBadge importance={match.importance} />
                  </div>

                  {/* Teams */}
                  <div className="flex items-center gap-4 flex-1 justify-center">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-sm font-black shadow-lg"
                        style={{ backgroundColor: match.homeFaculty.colorPrimary }}
                      >
                        {match.homeFaculty.abbreviation}
                      </div>
                      <span className="text-white font-bold hidden sm:inline">{match.homeFaculty.name}</span>
                    </div>

                    <span className="text-2xl font-black text-gray-600">VS</span>

                    <div className="flex items-center gap-3">
                      <span className="text-white font-bold hidden sm:inline">{match.awayFaculty.name}</span>
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-sm font-black shadow-lg"
                        style={{ backgroundColor: match.awayFaculty.colorPrimary }}
                      >
                        {match.awayFaculty.abbreviation}
                      </div>
                    </div>
                  </div>

                  {/* Venue */}
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <MapPin size={16} />
                    <span className="font-semibold">{match.venue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-700">
            <AlertCircle size={48} className="text-gray-500 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-white mb-2">No Upcoming Fixtures</h3>
            <p className="text-gray-400 font-semibold mb-6">Check back later for scheduled women's matches</p>
            <Link
              href="/women/results"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition"
            >
              <Clock size={18} />
              View Past Results
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}