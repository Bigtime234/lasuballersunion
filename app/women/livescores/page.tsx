'use client';
import React, { useState, useEffect } from 'react';
import { db } from '@/server';
import { matches } from '@/server/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { Zap, Clock, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';

// You'll need to fetch matches on the client side or use server components
// This is a simplified version - adapt based on your existing livescores structure

export default function WomensLiveScoresPage() {
  const [liveMatches, setLiveMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveMatches = async () => {
      try {
        // You'll need to create an API endpoint or fetch directly
        // For now, this is a placeholder structure
        const response = await fetch('/api2/women-data');
        const data = await response.json();
        setLiveMatches(data.liveMatches || []);
      } catch (error) {
        console.error('Error fetching live matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveMatches();
    const interval = setInterval(fetchLiveMatches, 10000); // Refresh every 10s

    return () => clearInterval(interval);
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
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
                <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  LIVE SCORES
                </span>
              </h1>
              <p className="text-gray-400 font-semibold">Women's matches happening now</p>
            </div>
            
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-bold flex items-center gap-2 transition"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>

        {/* Live Matches */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 font-semibold">Loading live matches...</p>
          </div>
        ) : liveMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveMatches.map((match) => (
              <div
                key={match.id}
                className="bg-gradient-to-br from-pink-950/60 via-pink-900/40 to-purple-950/30 border-2 border-pink-500/40 rounded-2xl p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-pink-500 text-white rounded-full font-black text-sm animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                    LIVE {match.matchMinute || 0}'
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Home Team */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-black"
                        style={{ backgroundColor: match.homeFaculty.colorPrimary }}
                      >
                        {match.homeFaculty.abbreviation}
                      </div>
                      <p className="text-lg font-black text-white">{match.homeFaculty.name}</p>
                    </div>
                    <p className="text-5xl font-black text-white">{match.scoreHome}</p>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
                    <span className="text-xs font-bold text-gray-400">VS</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
                  </div>

                  {/* Away Team */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-black"
                        style={{ backgroundColor: match.awayFaculty.colorPrimary }}
                      >
                        {match.awayFaculty.abbreviation}
                      </div>
                      <p className="text-lg font-black text-white">{match.awayFaculty.name}</p>
                    </div>
                    <p className="text-5xl font-black text-white">{match.scoreAway}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-700">
            <AlertCircle size={48} className="text-gray-500 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-white mb-2">No Live Matches</h3>
            <p className="text-gray-400 font-semibold mb-6">Check back later for live women's matches</p>
            <Link
              href="/women/fixtures"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition"
            >
              <Clock size={18} />
              View Upcoming Fixtures
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}