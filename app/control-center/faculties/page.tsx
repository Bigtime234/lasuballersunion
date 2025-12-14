'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Users as UsersIcon, AlertCircle } from 'lucide-react';

interface FacultyStats {
  id: number;
  name: string;
  abbreviation: string;
  colorPrimary: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  currentStreak: number;
}

export default function FacultiesPage() {
  const [selectedCategory, setSelectedCategory] = useState<'men' | 'women'>('men');
  const [faculties, setFaculties] = useState<FacultyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFacultiesByCategory();
  }, [selectedCategory]);

  const fetchFacultiesByCategory = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch from home-data API which already calculates stats per category
      const apiEndpoint = selectedCategory === 'men' 
        ? '/api2/home-data'  // Men's data
        : '/api2/women-data'; // Women's data

      const response = await fetch(apiEndpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setFaculties(data.standings || []);
    } catch (err:  any) {
      console.error('Error fetching faculties:', err);
      setError(err.message || 'Failed to load faculties');
      setFaculties([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Manage Faculties</h1>
          <p className="text-gray-400 font-semibold flex items-center gap-2">
            <UsersIcon size={18} />
            {selectedCategory === 'men' ? "Men's" : "Women's"} Standings
          </p>
        </div>
        <Link
          href="/control-center/faculties/new"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-bold hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg"
        >
          <Plus size={20} />
          Add Faculty
        </Link>
      </div>

      {/* Category Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedCategory('men')}
          className={`px-6 py-3 rounded-lg font-black text-lg transition-all ${
            selectedCategory === 'men'
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
              : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
          }`}
        >
          👨 Men's
        </button>
        <button
          onClick={() => setSelectedCategory('women')}
          className={`px-6 py-3 rounded-lg font-black text-lg transition-all ${
            selectedCategory === 'women'
              ? 'bg-gradient-to-r from-pink-600 to-pink-700 text-white shadow-lg shadow-pink-500/30'
              : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
          }`}
        >
          👩 Women's
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-950/30 border border-red-500/30 rounded-lg">
          <AlertCircle size={20} className="text-red-400" />
          <p className="text-red-400 font-semibold">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 font-semibold">Loading faculties...</p>
          </div>
        </div>
      )}

      {/* Faculties Grid */}
      {! loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faculties.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700">
              <p className="text-gray-400 font-semibold mb-4">No {selectedCategory}'s matches yet</p>
            </div>
          ) : (
            faculties.map((fac, index) => (
              <div
                key={fac.id}
                className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 hover: border-slate-600 transition-all hover:shadow-xl"
              >
                {/* Rank Badge */}
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-black shadow-lg">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' :  index === 2 ? '🥉' : index + 1}
                </div>

                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:shadow-2xl transition-all"
                    style={{ backgroundColor: fac.colorPrimary }}
                  >
                    {fac.abbreviation}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-white group-hover:text-blue-300 transition">
                      {fac.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {fac.won}W - {fac.drawn}D - {fac.lost}L
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-black text-white">{fac.points}</p>
                    <p className="text-xs text-gray-400 font-bold">Points</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-white">{fac.goalsFor}</p>
                    <p className="text-xs text-gray-400 font-bold">Goals</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-white">{fac.played}</p>
                    <p className="text-xs text-gray-400 font-bold">Played</p>
                  </div>
                </div>

                {/* Streak */}
                {fac.currentStreak > 0 && (
                  <div className="mb-4 px-3 py-2 bg-green-500/20 border border-green-500/50 rounded-lg text-center">
                    <p className="text-sm font-bold text-green-400">
                      🔥 {fac.currentStreak}W Streak
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/control-center/faculties/${fac. id}`}
                    className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-bold transition"
                  >
                    View
                  </Link>
                  <Link
                    href={`/control-center/faculties/${fac.id}/edit`}
                    className="flex-1 px-3 py-2 bg-blue-600 hover: bg-blue-700 text-white rounded-lg text-sm font-bold transition"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}