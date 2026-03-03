'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Play, ArrowRight, MessageCircle, X } from 'lucide-react';
import Link from 'next/link';

interface Match {
  id: number;
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
  scoreHome: number;
  scoreAway: number;
  matchMinute: number;
  status: 'PENDING' | 'LIVE' | 'FINISHED';
  importance?: string | null;
  matchDate: Date | string;
}

interface LiveMatchCardProps {
  match: Match;
  initialHomeLikesCount?: number;
  initialAwayLikesCount?: number;
  initialUserLikedFacultyId?: number | null;
}

// ✅ SHORT & PUNCHY CHEERING MESSAGES
const thinkWithMeMessages = {
  home: [
    "🏠 Our House, Our Rules!",
    "⚡ Home Advantage! Let's Go!",
    "🔥 Defend the Fort!",
    "💪 This is Our Ground!",
    "👑 Dominate at Home!",
    "🎯 Make Them Fear This Place!",
    "🏟️ Crowd is Our 12th Player!",
    "⚽ Play Like Champions!",
    "🌟 Show Your Power!",
    "🚀 Let's Make History!",
  ],
  away: [
    "🚌 Road Warriors Let's Go!",
    "💫 Underdog Energy!",
    "🛣️ We Don't Back Down!",
    "⚔️ Come For The Win!",
    "🔥 Silence Their Crowd!",
    "🎖️ Show Them Who We Are!",
    "💪 Believe & Fight!",
    "🏅 Away But Unbreakable!",
    "🌍 We Came to Take It!",
    "👊 Victory or Nothing!",
  ],
};

export default function LiveMatchCard({
  match,
  initialHomeLikesCount = 0,
  initialAwayLikesCount = 0,
  initialUserLikedFacultyId = null,
}: LiveMatchCardProps) {
  // ✅ STATE MANAGEMENT
  const [userLikedFacultyId, setUserLikedFacultyId] = useState<number | null>(
    initialUserLikedFacultyId
  );
  const [homeLikesCount, setHomeLikesCount] = useState(initialHomeLikesCount);
  const [awayLikesCount, setAwayLikesCount] = useState(initialAwayLikesCount);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showThinkWithMe, setShowThinkWithMe] = useState(false);
  const [thinkWithMeMessage, setThinkWithMeMessage] = useState<string>('');
  const [lastClickedTeam, setLastClickedTeam] = useState<number | null>(null);

  // ✅ FIXED: Actually sync state when props change (previously only logged)
  useEffect(() => {
    setHomeLikesCount(initialHomeLikesCount);
    setAwayLikesCount(initialAwayLikesCount);
    setUserLikedFacultyId(initialUserLikedFacultyId);
  }, [initialHomeLikesCount, initialAwayLikesCount, initialUserLikedFacultyId]);

  // ✅ GET RANDOM CHEERING MESSAGE
  const getThinkWithMeMessage = (facultyId: number): string => {
    let messageType: keyof typeof thinkWithMeMessages = 'away';

    if (facultyId === match.homeFaculty.id) {
      messageType = 'home';
    }

    const messages = thinkWithMeMessages[messageType];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // ✅ HANDLE LIKE TOGGLE
  const handleLikeToggle = async (facultyId: number) => {
    if (isLoading) {
      console.warn('⚠️ Already processing a like request');
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowThinkWithMe(false);
    setLastClickedTeam(facultyId);

    try {
      console.log('🔄 Sending like request:', {
        matchId: match.id,
        likedFacultyId: facultyId,
      });

      const response = await fetch(`/api/matches/${match.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ likedFacultyId: facultyId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        const errorMessage = errorData.error || `Server error: ${response.status}`;
        setError(errorMessage);
        console.error('❌ Like error response:', errorData);
        return;
      }

      const data = await response.json();
      console.log('✅ Like response received:', data);

      if (typeof data.homeLikesCount !== 'number' || typeof data.awayLikesCount !== 'number') {
        console.error('❌ Invalid response data:', data);
        setError('Invalid response from server');
        return;
      }

      setHomeLikesCount(data.homeLikesCount);
      setAwayLikesCount(data.awayLikesCount);

      if (data.isLiked === true) {
        setUserLikedFacultyId(facultyId);
        const message = getThinkWithMeMessage(facultyId);
        setThinkWithMeMessage(message);
        setShowThinkWithMe(true);
        console.log('❤️ User liked faculty:', facultyId);

        setTimeout(() => {
          setShowThinkWithMe(false);
        }, 4000);
      } else if (data.isLiked === false) {
        setUserLikedFacultyId(null);
        setShowThinkWithMe(false);
        console.log('🖤 User unliked faculty:', facultyId);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('❌ Exception caught:', err);
    } finally {
      setIsLoading(false);
      setLastClickedTeam(null);
    }
  };

  const isHomeLiked = userLikedFacultyId === match.homeFaculty.id;
  const isAwayLiked = userLikedFacultyId === match.awayFaculty.id;

  return (
    <div className="rounded-2xl p-6 transition-all duration-300 group hover:scale-105 bg-gradient-to-br from-red-950/60 via-red-900/40 to-orange-950/30 border-2 border-red-500/40 shadow-2xl shadow-red-500/20 hover:shadow-red-500/40 hover:border-red-500/60">
      {/* ============= HEADER WITH LIVE BADGE ============= */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full font-black text-sm animate-pulse shadow-lg shadow-red-500/50">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            LIVE {match.matchMinute || 0}'
          </div>

          {match.importance && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
              {match.importance}
            </span>
          )}
        </div>
      </div>

      {/* ============= SCORE SECTION ============= */}
      <div className="space-y-4">
        {/* Home Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-lg transition-transform group-hover:scale-110"
              style={{ backgroundColor: match.homeFaculty.colorPrimary }}
            >
              {match.homeFaculty.abbreviation}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">Home</p>
              <p className="text-lg font-black text-white">{match.homeFaculty.name}</p>
            </div>
          </div>
          <p className="text-5xl font-black tabular-nums text-white">{match.scoreHome}</p>
        </div>

        {/* VS Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
          <span className="text-xs font-bold text-gray-500 uppercase">vs</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-lg transition-transform group-hover:scale-110"
              style={{ backgroundColor: match.awayFaculty.colorPrimary }}
            >
              {match.awayFaculty.abbreviation}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">Away</p>
              <p className="text-lg font-black text-white">{match.awayFaculty.name}</p>
            </div>
          </div>
          <p className="text-5xl font-black tabular-nums text-white">{match.scoreAway}</p>
        </div>
      </div>

      {/* ============= CHEER MESSAGE ============= */}
      {showThinkWithMe && (
        <div className="mt-6 mb-4 p-3 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border-l-4 border-yellow-400 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300 shadow-lg">
          <div className="flex items-center gap-3">
            <MessageCircle size={18} className="text-yellow-300 flex-shrink-0 animate-bounce" />
            <p className="text-base font-bold text-yellow-100">{thinkWithMeMessage}</p>
            <button
              onClick={() => setShowThinkWithMe(false)}
              className="text-yellow-300 hover:text-yellow-200 flex-shrink-0 ml-auto transition-colors"
              aria-label="Close message"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ============= ERROR MESSAGE ============= */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-300 text-sm font-semibold flex items-center gap-2">
          <span>⚠️</span>
          <span className="flex-1">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-300 transition-colors"
            aria-label="Close error"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ============= LIKE BUTTONS ============= */}
      <div className="mt-6 grid grid-cols-2 gap-3 mb-4">
        {/* HOME TEAM LIKE BUTTON */}
        <button
          onClick={() => handleLikeToggle(match.homeFaculty.id)}
          disabled={isLoading}
          className={`py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all transform duration-200 ${
            isHomeLiked
              ? 'bg-red-600 text-white shadow-lg shadow-red-500/50 scale-105'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          } ${isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
          aria-label={`Like ${match.homeFaculty.name}`}
        >
          <Heart
            size={18}
            className={isHomeLiked ? 'fill-white animate-pulse' : ''}
            fill={isHomeLiked ? 'white' : 'none'}
          />
          <span className="text-sm font-bold">{homeLikesCount}</span>
        </button>

        {/* AWAY TEAM LIKE BUTTON */}
        <button
          onClick={() => handleLikeToggle(match.awayFaculty.id)}
          disabled={isLoading}
          className={`py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all transform duration-200 ${
            isAwayLiked
              ? 'bg-red-600 text-white shadow-lg shadow-red-500/50 scale-105'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          } ${isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
          aria-label={`Like ${match.awayFaculty.name}`}
        >
          <Heart
            size={18}
            className={isAwayLiked ? 'fill-white animate-pulse' : ''}
            fill={isAwayLiked ? 'white' : 'none'}
          />
          <span className="text-sm font-bold">{awayLikesCount}</span>
        </button>
      </div>

      {/* ============= WATCH LIVE BUTTON ============= */}
      <Link
        href={`/livescorespagenav?match=${match.id}`}
        className="block w-full text-center px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-lg font-bold text-sm transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
      >
        <Play size={16} />
        Watch Live
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}