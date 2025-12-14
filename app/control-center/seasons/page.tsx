'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Plus,
  History,
  Sparkles,
} from 'lucide-react';
import { getActiveSeason, endSeason, startNewSeason } from "@/lib/actions/seasons";

interface Season {
  id: number;
  name: string;
  startDate: Date | string;
  endDate?:  Date | string | null;
  status: 'ACTIVE' | 'COMPLETED';
}

export default function SeasonManagementPage() {
  const [activeSeason, setActiveSeason] = useState<Season | null>(null);
  const [loading, setLoading] = useState(true);
  const [endingMen, setEndingMen] = useState(false);
  const [endingWomen, setEndingWomen] = useState(false);
  const [startingNew, setStartingNew] = useState(false);
  const [showNewSeasonForm, setShowNewSeasonForm] = useState(false);
  const [newSeasonName, setNewSeasonName] = useState('');
  const [newSeasonDate, setNewSeasonDate] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [bothCategoriesEnded, setBothCategoriesEnded] = useState(false);

  const fetchActiveSeason = async () => {
    try {
      setLoading(true);
      const season = await getActiveSeason();
      setActiveSeason(season);
    } catch (error) {
      console.error('Error fetching active season:', error);
      setMessage({ type: 'error', text: 'Failed to load season data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveSeason();

    // ✅ Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      fetchActiveSeason();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleEndSeason = async (category: 'men' | 'women') => {
    if (! activeSeason) return;

    const confirmed = confirm(
      `Are you sure you want to end the ${category}'s season?  This will:\n\n` +
      `✓ Calculate final standings\n` +
      `✓ Save season snapshot\n` +
      `✓ Update faculty championships\n\n` +
      `This action cannot be undone.`
    );

    if (!confirmed) return;

    if (category === 'men') setEndingMen(true);
    else setEndingWomen(true);

    try {
      const result = await endSeason(activeSeason.id, category);

      if (result.error) {
        setMessage({ type: 'error', text: result.error });
        if (category === 'men') setEndingMen(false);
        else setEndingWomen(false);
      } else {
        // ✅ SUCCESS
        if (result.bothCategoriesCompleted) {
          // ✅ BOTH CATEGORIES ENDED - SEASON IS NOW COMPLETED
          setMessage({
            type: 'success',
            text: `🎉 ${category === 'men' ? "Men's" : "Women's"} season ended!  BOTH categories complete - Season fully finished!  ✨`,
          });
          setBothCategoriesEnded(true);
        } else {
          // ⏳ ONLY ONE CATEGORY ENDED - SEASON STILL ACTIVE
          setMessage({
            type: 'success',
            text: `✅ ${category === 'men' ? "Men's" : "Women's"} season ended successfully!   Waiting for ${category === 'men' ? "women's" : "men's"} season to end...`,
          });
        }

        // ✅ RELOAD AFTER 2 SECONDS
        setTimeout(() => {
          console.log('🔄 Reloading page to update standings and data...');
          window.location. reload();
        }, 2000);
      }
    } catch (error:  any) {
      setMessage({ type: 'error', text: error.message || 'Failed to end season' });
      if (category === 'men') setEndingMen(false);
      else setEndingWomen(false);
    }
  };

  const handleStartNewSeason = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newSeasonName. trim() || !newSeasonDate) {
      setMessage({ type:  'error', text: 'Please provide season name and start date' });
      return;
    }

    const confirmed = confirm(
      `Start new season: "${newSeasonName}"?\n\n` +
      `This will create a fresh season for both men's and women's competitions. `
    );

    if (!confirmed) return;

    setStartingNew(true);

    try {
      const result = await startNewSeason({
        name: newSeasonName,
        startDate: newSeasonDate,
      });

      if (result.error) {
        setMessage({ type: 'error', text: result.error });
        setStartingNew(false);
      } else {
        setMessage({
          type: 'success',
          text: `🎉 Season "${newSeasonName}" started successfully!   Ready for competition!`,
        });

        setShowNewSeasonForm(false);
        setNewSeasonName('');
        setNewSeasonDate('');
        setBothCategoriesEnded(false);

        // ✅ RELOAD AFTER 2 SECONDS
        setTimeout(() => {
          console.log('🔄 Reloading page to activate new season...');
          window.location.reload();
        }, 2000);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to start new season' });
      setStartingNew(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-black text-white mb-2">Loading Season Data</h2>
          <p className="text-gray-400 font-semibold">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
          <Trophy className="text-yellow-400" size={40} />
          Season Management
        </h1>
        <p className="text-gray-400 font-semibold">Manage active season and create new seasons</p>
      </div>

      {/* Message Alert */}
      {message && (
        <div
          className={`rounded-lg p-4 border flex items-start gap-3 ${
            message.type === 'success'
              ? 'bg-green-950/40 border-green-500/50 text-green-300'
              : 'bg-red-950/40 border-red-500/50 text-red-300'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle size={24} className="flex-shrink-0" />
          ) : (
            <AlertCircle size={24} className="flex-shrink-0" />
          )}
          <div>
            <p className="font-bold text-sm">{message.text}</p>
            {message.type === 'success' && (
              <p className="text-xs text-gray-400 mt-2">Updating all pages... 🔄</p>
            )}
          </div>
          <button
            onClick={() => setMessage(null)}
            className="ml-auto text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>
      )}

      {/* Current Season Card */}
      {activeSeason ?  (
        <div className="bg-gradient-to-br from-blue-950/40 to-slate-900/40 rounded-xl p-8 border border-blue-500/30">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="text-blue-400" size={24} />
                <h2 className="text-2xl font-black text-white">Current Active Season</h2>
              </div>
              <h3 className="text-4xl font-black text-blue-400 mb-2">{activeSeason.name}</h3>
              <p className="text-gray-400 font-semibold flex items-center gap-2">
                <Calendar size={16} />
                Started: {new Date(activeSeason.startDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-full">
              <span className="text-green-400 font-black text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                ACTIVE
              </span>
            </div>
          </div>

          {/* End Season Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <h4 className="text-lg font-black text-white mb-2 flex items-center gap-2">
                👨 Men's Competition
              </h4>
              <p className="text-sm text-gray-400 mb-4">
                End the men's season and save final standings snapshot
              </p>
              <button
                onClick={() => handleEndSeason('men')}
                disabled={endingMen}
                className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2"
              >
                {endingMen ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Ending Season... 
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    End Men's Season
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <h4 className="text-lg font-black text-white mb-2 flex items-center gap-2">
                👩 Women's Competition
              </h4>
              <p className="text-sm text-gray-400 mb-4">
                End the women's season and save final standings snapshot
              </p>
              <button
                onClick={() => handleEndSeason('women')}
                disabled={endingWomen}
                className="w-full px-4 py-3 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2"
              >
                {endingWomen ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Ending Season...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    End Women's Season
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-950/30 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-300 text-sm font-semibold flex items-start gap-2">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>
                <strong>Important:</strong> You must end BOTH men's and women's seasons before starting a new season.
                <br />
                When BOTH are ended: 
                <br />
                ✓ Standings will reset to 0 across all pages
                <br />
                ✓ Matches will be empty
                <br />
                ✓ "Create Season" button will be enabled
              </span>
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-xl p-8 border border-slate-700 text-center">
          <XCircle className="text-gray-500 mx-auto mb-4" size={64} />
          <h3 className="text-2xl font-black text-white mb-2">No Active Season</h3>
          <p className="text-gray-400 font-semibold mb-6">
            There is currently no active season. Start a new season to begin tracking matches. 
          </p>
        </div>
      )}

      {/* Start New Season Section */}
      <div className="bg-gradient-to-br from-green-950/40 to-slate-900/40 rounded-xl p-8 border border-green-500/30">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2 mb-2">
              <Plus className="text-green-400" size={28} />
              Start New Season
            </h2>
            <p className="text-gray-400 font-semibold">
              Create a fresh season for both men's and women's competitions
            </p>
          </div>
        </div>

        {! showNewSeasonForm ? (
          <button
            onClick={() => setShowNewSeasonForm(true)}
            disabled={!! activeSeason}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-bold transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            Create New Season
          </button>
        ) : (
          <form onSubmit={handleStartNewSeason} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Season Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={newSeasonName}
                onChange={(e) => setNewSeasonName(e.target.value)}
                placeholder="e.g., 2024-2025 Championship"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Start Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={newSeasonDate}
                onChange={(e) => setNewSeasonDate(e.target. value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500 transition"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={startingNew}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2"
              >
                {startingNew ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating... 
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Start Season
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowNewSeasonForm(false);
                  setNewSeasonName('');
                  setNewSeasonDate('');
                }}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {activeSeason && (
          <div className="mt-4 p-4 bg-red-950/30 border border-red-500/30 rounded-lg">
            <p className="text-red-300 text-sm font-semibold flex items-start gap-2">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>
                You must end the current active season (BOTH men's and women's) before creating a new one.
              </span>
            </p>
          </div>
        )}
      </div>

      {/* View Past Seasons Link */}
      <Link
        href="/control-center/seasons/past"
        className="block bg-gradient-to-r from-purple-950/40 to-slate-900/40 rounded-xl p-6 border border-purple-500/30 hover:border-purple-500/50 transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History className="text-purple-400" size={32} />
            <div>
              <h3 className="text-xl font-black text-white mb-1">View Past Seasons</h3>
              <p className="text-gray-400 font-semibold text-sm">
                Browse historical season data and final standings
              </p>
            </div>
          </div>
          <ArrowRight className="text-purple-400 group-hover:translate-x-2 transition-transform" size={24} />
        </div>
      </Link>
    </div>
  );
}