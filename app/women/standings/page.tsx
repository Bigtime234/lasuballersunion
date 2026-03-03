'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, ArrowLeft, Flame, AlertCircle } from 'lucide-react';

interface Faculty {
  id: number;
  name: string;
  abbreviation: string;
  colorPrimary: string;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  currentStreak: number;
}

export default function WomensStandingsPage() {
  const [standings, setStandings] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api2/women-data');
        if (!response.ok) throw new Error('Failed to fetch standings');
        const data = await response.json();
        setStandings(data.standings || []);
      } catch (err) {
        console.error('Error fetching standings:', err);
        setError(err instanceof Error ? err.message : 'Failed to load standings');
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
    // ✅ No setInterval — was broken before (no delay = infinite reloads)
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-8">
          <Link href="/women" className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 font-bold mb-4 transition">
            <ArrowLeft size={20} />
            Back to Women's Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
              WOMEN'S STANDINGS
            </span>
          </h1>
          <p className="text-gray-400 font-semibold">Championship table • Competitive matches only • Active season</p>
        </div>

        {/* Legend */}
        {!loading && standings.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Trophy size={24} className="text-yellow-400" />
              <h3 className="text-lg font-black text-white">Legend</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {[
                { label: 'P', fullName: 'Played', icon: '📊', color: 'from-blue-500 to-blue-600' },
                { label: 'W', fullName: 'Won', icon: '✅', color: 'from-green-500 to-green-600' },
                { label: 'D', fullName: 'Drawn', icon: '🤝', color: 'from-yellow-500 to-yellow-600' },
                { label: 'L', fullName: 'Lost', icon: '❌', color: 'from-red-500 to-red-600' },
                { label: 'GF', fullName: 'Goals For', icon: '⚽', color: 'from-cyan-500 to-cyan-600' },
                { label: 'GA', fullName: 'Goals Against', icon: '🥅', color: 'from-orange-500 to-orange-600' },
                { label: 'GD', fullName: 'Goal Difference', icon: '📈', color: 'from-purple-500 to-purple-600' },
                { label: 'Pts', fullName: 'Points', icon: '👑', color: 'from-amber-500 to-amber-600' },
              ].map((item, index) => (
                <div key={index} className={`bg-gradient-to-br ${item.color} rounded-lg p-3 text-center border border-white/20 shadow-lg hover:shadow-xl transition-all hover:scale-105 group cursor-help relative`}>
                  <div className="text-2xl mb-1 group-hover:scale-125 transition-transform">{item.icon}</div>
                  <div className="text-white font-black text-lg">{item.label}</div>
                  <div className="text-white/70 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 backdrop-blur">
                    {item.fullName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 font-semibold">Loading standings...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-700">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-white mb-2">Failed to Load</h3>
            <p className="text-gray-400 font-semibold mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-bold transition">
              Try Again
            </button>
          </div>
        ) : standings.length > 0 ? (
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
            {/* ✅ FULL TABLE — horizontal scroll on mobile, all columns always visible */}
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-max min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-700">
                    <th className="px-3 py-3 text-left text-xs font-black text-gray-300 uppercase min-w-14">Pos</th>
                    <th className="px-3 py-3 text-left text-xs font-black text-gray-300 uppercase min-w-40">Faculty</th>
                    <th className="px-3 py-3 text-center text-xs font-black text-gray-300 uppercase min-w-10">P</th>
                    <th className="px-3 py-3 text-center text-xs font-black text-gray-300 uppercase min-w-10">W</th>
                    <th className="px-3 py-3 text-center text-xs font-black text-gray-300 uppercase min-w-10">D</th>
                    <th className="px-3 py-3 text-center text-xs font-black text-gray-300 uppercase min-w-10">L</th>
                    <th className="px-3 py-3 text-center text-xs font-black text-gray-300 uppercase min-w-10">GF</th>
                    <th className="px-3 py-3 text-center text-xs font-black text-gray-300 uppercase min-w-10">GA</th>
                    <th className="px-3 py-3 text-center text-xs font-black text-gray-300 uppercase min-w-10">GD</th>
                    <th className="px-3 py-3 text-center text-xs font-black text-gray-300 uppercase min-w-14">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((faculty, index) => (
                    <tr
                      key={faculty.id}
                      className={`border-b border-slate-700 transition-colors hover:bg-slate-800/50 ${
                        index < 3 ? 'bg-gradient-to-r from-yellow-950/30 to-transparent' : ''
                      }`}
                    >
                      <td className="px-3 py-3">
                        <span className="text-lg font-black">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                            style={{ backgroundColor: faculty.colorPrimary }}
                          >
                            {faculty.abbreviation}
                          </div>
                          <div>
                            <p className="text-white font-bold text-sm whitespace-nowrap">{faculty.name}</p>
                            {faculty.currentStreak > 0 && (
                              <p className="text-xs text-pink-400 flex items-center gap-1">
                                <Flame size={11} />
                                {faculty.currentStreak}W Streak
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center text-white font-bold text-sm">{faculty.played}</td>
                      <td className="px-3 py-3 text-center text-green-400 font-bold text-sm">{faculty.won}</td>
                      <td className="px-3 py-3 text-center text-yellow-400 font-bold text-sm">{faculty.drawn}</td>
                      <td className="px-3 py-3 text-center text-red-400 font-bold text-sm">{faculty.lost}</td>
                      <td className="px-3 py-3 text-center text-blue-400 font-bold text-sm">{faculty.goalsFor}</td>
                      <td className="px-3 py-3 text-center text-red-400 font-bold text-sm">{faculty.goalsAgainst}</td>
                      <td className={`px-3 py-3 text-center font-bold text-sm ${
                        faculty.goalDifference > 0 ? 'text-green-400' : faculty.goalDifference < 0 ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {faculty.goalDifference > 0 ? '+' : ''}{faculty.goalDifference}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                          {faculty.points}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="sm:hidden px-4 py-2 bg-slate-800/50 text-center border-t border-slate-700">
              <p className="text-xs text-gray-500">← Swipe to see all columns →</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-700">
            <AlertCircle size={48} className="text-gray-500 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-white mb-2">No Standings Available</h3>
            <p className="text-gray-400 font-semibold">Standings will appear after competitive matches are played</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}