'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Calendar,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Medal,
  Award,
  Sparkles,
  AlertCircle,
} from 'lucide-react';



interface Faculty {
  id: number;
  name: string;
  abbreviation: string;
  colorPrimary: string;
}

interface Season {
  id: number;
  name: string;
  startDate: Date | string;
  endDate: Date | string | null;
  status: string;
  champion: Faculty | null;
  runnerUp: Faculty | null;
  thirdPlace: Faculty | null;
}

interface Standing {
  id: number;
  finalPosition: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  faculty: Faculty;
}

export default function PastSeasonsPage() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSeason, setExpandedSeason] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'men' | 'women'>('men');
  const [standings, setStandings] = useState<Record<string, Standing[]>>({});
  const [loadingStandings, setLoadingStandings] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchPastSeasons();
  }, []);

  const fetchPastSeasons = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/seasons/past');
      
      if (!response.ok) {
        throw new Error('Failed to fetch past seasons');
      }

      const data = await response.json();
      setSeasons(data.seasons || []);
    } catch (err: any) {
      console.error('Error fetching past seasons:', err);
      setError(err.message || 'Failed to load past seasons');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPastSeasons();

    // ✅ Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      fetchPastSeasons();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchSeasonStandings = async (seasonId: number, category: 'men' | 'women') => {
    const cacheKey = `${seasonId}-${category}`;
    
    if (standings[cacheKey]) {
      return; // Already loaded
    }

    try {
      setLoadingStandings({ ...loadingStandings, [seasonId]: true });
      
      const response = await fetch(`/api/admin/seasons/${seasonId}/standings?category=${category}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch standings');
      }

      const data = await response.json();
      setStandings({ ...standings, [cacheKey]: data.standings || [] });
    } catch (err) {
      console.error('Error fetching standings:', err);
    } finally {
      setLoadingStandings({ ...loadingStandings, [seasonId]: false });
    }
  };

  const toggleSeason = async (seasonId: number) => {
    if (expandedSeason === seasonId) {
      setExpandedSeason(null);
    } else {
      setExpandedSeason(seasonId);
      await fetchSeasonStandings(seasonId, selectedCategory);
    }
  };

  const handleCategoryChange = async (category: 'men' | 'women') => {
    setSelectedCategory(category);
    if (expandedSeason) {
      await fetchSeasonStandings(expandedSeason, category);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-black text-white mb-2">Loading Past Seasons</h2>
          <p className="text-gray-400 font-semibold">Please wait...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-2">Error Loading Data</h2>
          <p className="text-gray-400 font-semibold mb-6">{error}</p>
          <button
            onClick={fetchPastSeasons}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-bold transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/control-center/seasons"
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-bold mb-4 transition"
        >
          <ArrowLeft size={20} />
          Back to Season Management
        </Link>
        <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
          <Trophy className="text-yellow-400" size={40} />
          Past Seasons History
        </h1>
        <p className="text-gray-400 font-semibold">View final standings and champions from previous seasons</p>
      </div>

      {/* Category Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => handleCategoryChange('men')}
          className={`px-6 py-3 rounded-lg font-black text-lg transition-all ${
            selectedCategory === 'men'
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
              : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
          }`}
        >
          👨 Men's Seasons
        </button>
        <button
          onClick={() => handleCategoryChange('women')}
          className={`px-6 py-3 rounded-lg font-black text-lg transition-all ${
            selectedCategory === 'women'
              ? 'bg-gradient-to-r from-pink-600 to-pink-700 text-white shadow-lg shadow-pink-500/30'
              : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
          }`}
        >
          👩 Women's Seasons
        </button>
      </div>

      {/* Seasons List */}
      {seasons.length === 0 ? (
        <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-xl p-12 border border-slate-700 text-center">
          <Trophy className="text-gray-500 mx-auto mb-4" size={64} />
          <h3 className="text-2xl font-black text-white mb-2">No Past Seasons</h3>
          <p className="text-gray-400 font-semibold">
            There are no completed seasons yet. Seasons will appear here once they are ended.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {seasons.map((season) => {
            const isExpanded = expandedSeason === season.id;
            const cacheKey = `${season.id}-${selectedCategory}`;
            const currentStandings = standings[cacheKey] || [];
            const isLoadingStandings = loadingStandings[season.id];

            return (
              <div
                key={season.id}
                className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl border border-slate-700 overflow-hidden transition-all"
              >
                {/* Season Header */}
                <button
                  onClick={() => toggleSeason(season.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-slate-800/40 transition"
                >
                  <div className="flex items-start gap-4 flex-1 text-left">
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <Trophy className="text-purple-400" size={32} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-white mb-2">{season.name}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(season.startDate).toLocaleDateString()} - {season.endDate ? new Date(season.endDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      
                      {/* Champions Display */}
                      {season.champion && (
                        <div className="flex flex-wrap gap-3 mt-4">
                          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
                            <Medal className="text-yellow-400" size={16} />
                            <span className="text-yellow-400 font-bold text-xs">
                              Champion: {season.champion.name}
                            </span>
                          </div>
                          {season.runnerUp && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-gray-500/20 border border-gray-500/30 rounded-full">
                              <Medal className="text-gray-400" size={16} />
                              <span className="text-gray-400 font-bold text-xs">
                                Runner-up: {season.runnerUp.name}
                              </span>
                            </div>
                          )}
                          {season.thirdPlace && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full">
                              <Medal className="text-orange-400" size={16} />
                              <span className="text-orange-400 font-bold text-xs">
                                3rd: {season.thirdPlace.name}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    {isExpanded ? (
                      <ChevronUp className="text-gray-400" size={24} />
                    ) : (
                      <ChevronDown className="text-gray-400" size={24} />
                    )}
                  </div>
                </button>

                {/* Expanded Standings */}
                {isExpanded && (
                  <div className="border-t border-slate-700 p-6">
                    <h4 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                      {selectedCategory === 'men' ? '👨' : '👩'} Final {selectedCategory === 'men' ? "Men's" : "Women's"} Standings
                    </h4>

                    {isLoadingStandings ? (
                      <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400 font-semibold">Loading standings...</p>
                      </div>
                    ) : currentStandings.length === 0 ? (
                      <div className="text-center py-12">
                        <AlertCircle className="text-gray-500 mx-auto mb-4" size={48} />
                        <p className="text-gray-400 font-semibold">No standings data available for this season</p>
                      </div>
                    ) : (
                      <div className="bg-slate-900/50 rounded-lg border border-slate-700 overflow-hidden">
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-slate-800 border-b border-slate-700">
                                <th className="px-4 py-3 text-left text-xs font-black text-gray-300 uppercase">Pos</th>
                                <th className="px-4 py-3 text-left text-xs font-black text-gray-300 uppercase">Faculty</th>
                                <th className="px-2 py-3 text-center text-xs font-black text-gray-300 uppercase">P</th>
                                <th className="px-2 py-3 text-center text-xs font-black text-gray-300 uppercase">W</th>
                                <th className="px-2 py-3 text-center text-xs font-black text-gray-300 uppercase">D</th>
                                <th className="px-2 py-3 text-center text-xs font-black text-gray-300 uppercase">L</th>
                                <th className="px-2 py-3 text-center text-xs font-black text-gray-300 uppercase">GF</th>
                                <th className="px-2 py-3 text-center text-xs font-black text-gray-300 uppercase">GA</th>
                                <th className="px-2 py-3 text-center text-xs font-black text-gray-300 uppercase">GD</th>
                                <th className="px-4 py-3 text-center text-xs font-black text-gray-300 uppercase">Pts</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentStandings.map((standing) => (
                                <tr
                                  key={standing.id}
                                  className={`border-b border-slate-700 ${
                                    standing.finalPosition <= 3 ? 'bg-yellow-950/20' : ''
                                  }`}
                                >
                                  <td className="px-4 py-3">
                                    <span className="text-lg font-black">
                                      {standing.finalPosition === 1 ? '🥇' : standing.finalPosition === 2 ? '🥈' : standing.finalPosition === 3 ? '🥉' : `#${standing.finalPosition}`}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-black"
                                        style={{ backgroundColor: standing.faculty.colorPrimary }}
                                      >
                                        {standing.faculty.abbreviation}
                                      </div>
                                      <span className="text-white font-bold text-sm">{standing.faculty.name}</span>
                                    </div>
                                  </td>
                                  <td className="px-2 py-3 text-center text-white font-bold">{standing.played}</td>
                                  <td className="px-2 py-3 text-center text-green-400 font-bold">{standing.won}</td>
                                  <td className="px-2 py-3 text-center text-yellow-400 font-bold">{standing.drawn}</td>
                                  <td className="px-2 py-3 text-center text-red-400 font-bold">{standing.lost}</td>
                                  <td className="px-2 py-3 text-center text-blue-400 font-bold">{standing.goalsFor}</td>
                                  <td className="px-2 py-3 text-center text-red-400 font-bold">{standing.goalsAgainst}</td>
                                  <td className={`px-2 py-3 text-center font-bold ${
                                    standing.goalDifference > 0 ? 'text-green-400' : standing.goalDifference < 0 ? 'text-red-400' : 'text-gray-400'
                                  }`}>
                                    {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <span className="text-2xl font-black text-yellow-400">{standing.points}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-3 p-4">
                          {currentStandings.map((standing) => (
                            <div
                              key={standing.id}
                              className={`rounded-lg p-4 border ${
                                standing.finalPosition <= 3 ? 'bg-yellow-950/20 border-yellow-600/30' : 'bg-slate-800/40 border-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3 flex-1">
                                  <span className="text-2xl font-black">
                                    {standing.finalPosition === 1 ? '🥇' : standing.finalPosition === 2 ? '🥈' : standing.finalPosition === 3 ? '🥉' : `#${standing.finalPosition}`}
                                  </span>
                                  <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-black"
                                    style={{ backgroundColor: standing.faculty.colorPrimary }}
                                  >
                                    {standing.faculty.abbreviation}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-white font-bold text-sm truncate">{standing.faculty.name}</p>
                                    <p className="text-xs text-gray-500">{standing.played} matches</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-2xl font-black text-yellow-400">{standing.points}</p>
                                  <p className="text-xs text-gray-500">pts</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                                <div>
                                  <p className="text-gray-500">W</p>
                                  <p className="text-green-400 font-bold text-lg">{standing.won}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">D</p>
                                  <p className="text-yellow-400 font-bold text-lg">{standing.drawn}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">L</p>
                                  <p className="text-red-400 font-bold text-lg">{standing.lost}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">GF</p>
                                  <p className="text-blue-400 font-bold">{standing.goalsFor}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">GD</p>
                                  <p className={`font-bold ${
                                    standing.goalDifference > 0 ? 'text-green-400' : standing.goalDifference < 0 ? 'text-red-400' : 'text-gray-400'
                                  }`}>
                                    {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}