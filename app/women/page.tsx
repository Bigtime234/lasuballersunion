'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Flame,
  TrendingUp,
  Activity,
  Clock,
  ArrowRight,
  Zap,
  AlertCircle,
  Play,
  Calendar,
  BarChart3,
  Award,
  Sparkles,
  Heart,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';



interface Match {
  id: number;
  status: 'PENDING' | 'LIVE' | 'FINISHED';
  scoreHome: number;
  scoreAway: number;
  matchDate: Date | string;
  finishedAt: Date | string | null;
  matchMinute: number;
  archived: boolean;
  importance: string | null;
  venue?: string;
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

interface HomeData {
  liveMatches: Match[];
  upcomingMatches: Match[];
  recentMatches: Match[];
  standings: Faculty[];
  stats: {
    totalGoals: number;
    highestScoringMatch: Match | null;
    longestStreak: Faculty | null;
    totalMatches: number;
    avgGoals: string;
  };
  season?: {
    id: number;
    name: string;
    startDate: string;
    status: string;
  } | null;
  message?: string;
}

function FloatingWhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
// ============================================
// FLOATING WHATSAPP BUTTON
// ============================================
useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // ✅ ADD THIS - Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Refresh page data
    }, 10000);

    return () => clearInterval(interval);
  }, []);
  
  return (
    <Link
      href="https://whatsapp.com/channel/LASU-BU"
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed right-6 bottom-8 z-40 transition-all duration-700 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="relative group">
        <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse opacity-75 group-hover:opacity-100 transition-opacity"></div>
        
        <div className="relative w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50 transition-all transform hover:scale-110 group-hover:shadow-green-500/80">
          <FaWhatsapp className="w-8 h-8 text-white animate-bounce group-hover:animate-none transition-all" />
        </div>

        <div className="absolute -left-32 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-green-600 text-white text-sm font-bold py-2 px-4 rounded-lg whitespace-nowrap shadow-lg">
            Join WhatsApp Channel
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-0 h-0 border-l-8 border-t-4 border-b-4 border-l-green-600 border-t-transparent border-b-transparent"></div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ============================================
// IMPORTANCE BADGE
// ============================================
function ImportanceBadge({ importance }: { importance: string | null | undefined }) {
  if (!importance) return null;

  const badgeConfig: Record<string, { bg: string; text: string; icon: string; border: string }> = {
    Friendly: { bg: 'bg-gray-500/10', text: 'text-gray-400', icon: '⚽', border: 'border-gray-500/30' },
    League: { bg: 'bg-blue-500/10', text: 'text-blue-400', icon: '🏆', border: 'border-blue-500/30' },
    Cup: { bg: 'bg-purple-500/10', text: 'text-purple-400', icon: '🏆', border: 'border-purple-500/30' },
    Finals: { bg: 'bg-amber-500/10', text: 'text-amber-400', icon: '👑', border: 'border-amber-500/30' },
  };

  const config = badgeConfig[importance] || badgeConfig.Friendly;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text} border ${config.border} backdrop-blur-sm`}>
      {config.icon} {importance}
    </span>
  );
}

// ============================================
// COUNTDOWN TIMER
// ============================================
function CountdownTimer({ targetDate }: { targetDate: Date | string }) {
  const [timeLeft, setTimeLeft] = useState<string>('Loading...');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const distance = target - now;

      if (distance < 0) {
        setTimeLeft('LIVE');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 60000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) return <span className="text-pink-300 text-xs font-bold">...</span>;
  return <span className="text-pink-300 text-xs font-bold">{timeLeft}</span>;
}

// ============================================
// PREMIUM MATCH CARD
// ============================================
function PremiumMatchCard({ match, variant = 'default' }: { match: Match; variant?: 'live' | 'upcoming' | 'recent' | 'default' }) {
  const [isLiked, setIsLiked] = useState(false);

  const getVariantStyles = () => {
    switch (variant) {
      case 'live':
        return 'bg-gradient-to-br from-pink-950/60 via-pink-900/40 to-purple-950/30 border-2 border-pink-500/40 shadow-2xl shadow-pink-500/20 hover:shadow-pink-500/40 hover:border-pink-500/60';
      case 'upcoming':
        return 'bg-gradient-to-br from-purple-950/40 via-slate-900/50 to-slate-950/40 border border-purple-500/30 hover:border-purple-500/50';
      case 'recent':
        return 'bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700 hover:border-pink-500/50';
      default:
        return 'bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50';
    }
  };

  const homeWon = match.scoreHome > match.scoreAway;
  const awayWon = match.scoreAway > match.scoreHome;
  const isDraw = match.scoreHome === match.scoreAway;

  return (
    <div className={`rounded-2xl p-6 transition-all duration-300 group hover:scale-105 cursor-pointer ${getVariantStyles()}`}>
      {variant === 'live' && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-pink-500 text-white rounded-full font-black text-sm animate-pulse shadow-lg shadow-pink-500/50">
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
              LIVE {match.matchMinute || 0}'
            </div>
            <ImportanceBadge importance={match.importance} />
          </div>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="transition-transform hover:scale-125"
          >
            <Heart size={20} className={isLiked ? 'fill-pink-500 text-pink-500' : 'text-gray-500'} />
          </button>
        </div>
      )}

      {variant === 'upcoming' && (
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-purple-500/20 flex-wrap gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <Calendar size={16} className="text-purple-400" />
            <span className="text-sm font-bold text-gray-400">
              {new Date(match.matchDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <CountdownTimer targetDate={match.matchDate} />
            <ImportanceBadge importance={match.importance} />
          </div>
        </div>
      )}

      {variant === 'recent' && (
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-500 uppercase">
              {new Date(match.finishedAt || match.matchDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <ImportanceBadge importance={match.importance} />
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm border ${
            isDraw 
              ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
              : homeWon 
              ? 'bg-green-500/20 text-green-400 border-green-500/30'
              : 'bg-red-500/20 text-red-400 border-red-500/30'
          }`}>
            {isDraw ? '🤝 Draw' : '✓ FT'}
          </span>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3 md:flex-nowrap">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div
              className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-white text-lg md:text-2xl font-black shadow-lg transition-transform group-hover:scale-110 flex-shrink-0"
              style={{ backgroundColor: match.homeFaculty.colorPrimary }}
            >
              {match.homeFaculty.abbreviation}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wide">Home</p>
              <p className="text-sm md:text-lg font-black text-white truncate">
                {match.homeFaculty.name}
              </p>
            </div>
          </div>
          <div className="text-right order-3 md:order-2">
            <p className="text-3xl md:text-5xl font-black tabular-nums text-white">
              {match.scoreHome}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
          <span className="text-xs font-bold text-gray-500 uppercase">vs</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3 md:flex-nowrap">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div
              className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-white text-lg md:text-2xl font-black shadow-lg transition-transform group-hover:scale-110 flex-shrink-0"
              style={{ backgroundColor: match.awayFaculty.colorPrimary }}
            >
              {match.awayFaculty.abbreviation}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wide">Away</p>
              <p className="text-sm md:text-lg font-black text-white truncate">
                {match.awayFaculty.name}
              </p>
            </div>
          </div>
          <div className="text-right order-3 md:order-2">
            <p className="text-3xl md:text-5xl font-black tabular-nums text-white">
              {match.scoreAway}
            </p>
          </div>
        </div>
      </div>

      {variant === 'live' && (
        <Link
          href={`/women/livescores?match=${match.id}`}
          className="mt-6 block w-full text-center px-4 py-3 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white rounded-lg font-bold text-sm transition-all transform hover:scale-105 flex items-center justify-center gap-2 group"
        >
          <Play size={16} />
          Watch Live
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      )}

      {variant === 'upcoming' && (
        <Link
          href={`/women/fixtures?match=${match.id}`}
          className="mt-4 block w-full text-center px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-lg font-bold text-sm transition-all border border-purple-500/30"
        >
          View Details →
        </Link>
      )}
    </div>
  );
}

// ============================================
// PREMIUM STAT CARD
// ============================================
function PremiumStatCard({ 
  label, 
  value, 
  icon: Icon, 
  gradient, 
  subtext 
}: { 
  label: string; 
  value: string | number; 
  icon: React.ComponentType<any>; 
  gradient: string; 
  subtext: string; 
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 border backdrop-blur-md transition-all hover:scale-105 group cursor-pointer ${gradient}`}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:blur-2xl transition-all"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">{label}</p>
            <p className="text-5xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {value}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md group-hover:scale-110 transition-transform">
            <Icon size={24} className="text-white" />
          </div>
        </div>
        <p className="text-xs font-semibold text-gray-400">{subtext}</p>
      </div>
    </div>
  );
}

// ============================================
// STANDINGS LEGEND
// ============================================
function StandingsLegend() {
  const legendItems = [
    { label: 'P', fullName: 'Played', icon: '📊', color: 'from-blue-500 to-blue-600' },
    { label: 'W', fullName: 'Won', icon: '✅', color: 'from-green-500 to-green-600' },
    { label: 'D', fullName: 'Drawn', icon: '🤝', color: 'from-yellow-500 to-yellow-600' },
    { label: 'L', fullName: 'Lost', icon: '❌', color: 'from-red-500 to-red-600' },
    { label: 'GF', fullName: 'Goals For', icon: '⚽', color: 'from-cyan-500 to-cyan-600' },
    { label: 'GA', fullName: 'Goals Against', icon: '🥅', color: 'from-orange-500 to-orange-600' },
    { label: 'GD', fullName: 'Goal Difference', icon: '📈', color: 'from-purple-500 to-purple-600' },
    { label: 'Pts', fullName: 'Points', icon: '👑', color: 'from-amber-500 to-amber-600' },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <Trophy size={24} className="text-yellow-400" />
        <h3 className="text-lg font-black text-white">Legend</h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {legendItems.map((item, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${item.color} rounded-lg p-3 text-center border border-white/20 shadow-lg hover:shadow-xl transition-all hover:scale-105 group cursor-help relative`}
          >
            <div className="text-2xl mb-1 group-hover:scale-125 transition-transform">{item.icon}</div>
            <div className="text-white font-black text-lg">{item.label}</div>
            <div className="text-white/70 text-xs font-bold mt-1 opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 backdrop-blur">
              {item.fullName}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// RESPONSIVE STANDINGS TABLE
// ============================================
function ResponsiveStandingsTable({ standings }: { standings: Faculty[] }) {
  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
      {/* Desktop & Tablet */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-700">
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
            {standings.map((faculty, index) => (
              <tr
                key={faculty.id}
                className={`border-b border-slate-700 transition-colors hover:bg-slate-800/50 ${
                  index < 3 ? 'bg-gradient-to-r from-yellow-950/30 to-transparent' : ''
                }`}
              >
                <td className="px-4 py-3">
                  <span className="text-lg font-black">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                      style={{ backgroundColor: faculty.colorPrimary }}
                    >
                      {faculty.abbreviation}
                    </div>
                    <div className="hidden md:block">
                      <p className="text-white font-bold text-sm">{faculty.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-2 py-3 text-center text-white font-bold text-sm">{faculty.played}</td>
                <td className="px-2 py-3 text-center text-green-400 font-bold text-sm">{faculty.won}</td>
                <td className="px-2 py-3 text-center text-yellow-400 font-bold text-sm">{faculty.drawn}</td>
                <td className="px-2 py-3 text-center text-red-400 font-bold text-sm">{faculty.lost}</td>
                <td className="px-2 py-3 text-center text-blue-400 font-bold text-sm">{faculty.goalsFor}</td>
                <td className="px-2 py-3 text-center text-red-400 font-bold text-sm">{faculty.goalsAgainst}</td>
                <td
                  className={`px-2 py-3 text-center font-bold text-sm ${
                    faculty.goalDifference > 0
                      ? 'text-green-400'
                      : faculty.goalDifference < 0
                      ? 'text-red-400'
                      : 'text-gray-400'
                  }`}
                >
                  {faculty.goalDifference > 0 ? '+' : ''}
                  {faculty.goalDifference}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                    {faculty.points}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile - Horizontal Scrollable */}
      <div className="sm:hidden overflow-x-auto scrollbar-hide">
        <table className="w-max min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-700 sticky left-0">
              <th className="px-3 py-3 text-left text-xs font-black text-gray-300 uppercase min-w-max">Pos</th>
              <th className="px-3 py-3 text-left text-xs font-black text-gray-300 uppercase min-w-20">Team</th>
              <th className="px-2 py-3 text-center text-xs font-black text-gray-300 uppercase min-w-9">P</th>
              <th className="px-2 py-3 text-center text-xs font-black text-gray-300 uppercase min-w-9">W</th>
              <th className="px-2 py-3 text-center text-xs font-black text-gray-300 uppercase min-w-9">D</th>
              <th className="px-2 py-3 text-center text-xs font-black text-gray-300 uppercase min-w-9">L</th>
              <th className="px-2 py-3 text-center text-xs font-black text-gray-300 uppercase min-w-9">GF</th>
              <th className="px-2 py-3 text-center text-xs font-black text-gray-300 uppercase min-w-9">GA</th>
              <th className="px-2 py-3 text-center text-xs font-black text-gray-300 uppercase min-w-9">GD</th>
              <th className="px-3 py-3 text-center text-xs font-black text-gray-300 uppercase min-w-10">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((faculty, index) => (
              <tr
                key={faculty.id}
                className={`border-b border-slate-700 transition-colors hover:bg-slate-800/50 ${
                  index < 3 ? 'bg-gradient-to-r from-yellow-950/40 to-transparent' : ''
                }`}
              >
                <td className="px-3 py-3 text-center">
                  <span className="text-base font-black">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                      style={{ backgroundColor: faculty.colorPrimary }}
                    >
                      {faculty.abbreviation}
                    </div>
                  </div>
                </td>
                <td className="px-2 py-3 text-center text-white font-bold text-xs">{faculty.played}</td>
                <td className="px-2 py-3 text-center text-green-400 font-bold text-xs">{faculty.won}</td>
                <td className="px-2 py-3 text-center text-yellow-400 font-bold text-xs">{faculty.drawn}</td>
                <td className="px-2 py-3 text-center text-red-400 font-bold text-xs">{faculty.lost}</td>
                <td className="px-2 py-3 text-center text-blue-400 font-bold text-xs">{faculty.goalsFor}</td>
                <td className="px-2 py-3 text-center text-red-400 font-bold text-xs">{faculty.goalsAgainst}</td>
                <td
                  className={`px-2 py-3 text-center font-bold text-xs ${
                    faculty.goalDifference > 0
                      ? 'text-green-400'
                      : faculty.goalDifference < 0
                      ? 'text-red-400'
                      : 'text-gray-400'
                  }`}
                >
                  {faculty.goalDifference > 0 ? '+' : ''}
                  {faculty.goalDifference}
                </td>
                <td className="px-3 py-3 text-center">
                  <span className="text-lg font-black bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                    {faculty.points}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden px-4 py-2 bg-slate-800/50 text-center">
        <p className="text-xs text-gray-500">← Swipe to see all columns →</p>
      </div>
    </div>
  );
}

// ============================================
// MAIN WOMEN'S HOME PAGE
// ============================================
export default function WomensHomePage() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api2/women-data', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch women data');
        }

        const homeData = await response.json();
        setData(homeData);
      } catch (err) {
        console.error('Error fetching women data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-black text-white mb-2">Loading Women's Sports Hub</h2>
          <p className="text-gray-400 font-semibold">Preparing the championship experience...</p>
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
          <p className="text-gray-400 font-semibold mb-6">{error || 'Failed to load data'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white rounded-lg font-bold transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // NO ACTIVE SEASON STATE
  if (!data.season) {
    return (
      <>
        <FloatingWhatsAppButton />
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
          <div className="text-center max-w-2xl">
            <Trophy size={64} className="text-yellow-400 mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">No Active Season</h2>
            <p className="text-lg text-gray-400 font-semibold mb-8">
              {data.message || "The women's championship season hasn't started yet. Check back soon for updates!"}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/standings"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-bold transition-all"
              >
                View Men's Section
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <FloatingWhatsAppButton />

      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* HERO SECTION */}
          <div className="container mx-auto px-4 pt-20 pb-24">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              {/* Season Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/20 border border-pink-500/30 rounded-full backdrop-blur-md">
                <Trophy size={16} className="text-pink-400" />
                <span className="text-sm font-bold text-pink-400">
                  {data.season.name}
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
                <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  LASU WOMEN'S
                </span>
              </h1>

              <h2 className="text-3xl md:text-4xl font-black text-white">
                SPORTS HUB
              </h2>

              <p className="text-base md:text-lg text-gray-300 font-semibold max-w-2xl mx-auto leading-relaxed">
                Experience women's college sports excellence. Real-time scores, thrilling matchups, and championship glory.
              </p>

              <div className="flex flex-wrap justify-center gap-3 md:gap-4 pt-8">
                <Link
                  href="/women/livescores"
                  className="group px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white rounded-xl font-black text-sm md:text-lg shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all transform hover:scale-110 flex items-center gap-2"
                >
                  <Flame size={20} className="group-hover:animate-bounce" />
                  Live Scores
                </Link>
                <Link
                  href="/women/standings"
                  className="group px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-black text-sm md:text-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all transform hover:scale-110 flex items-center gap-2"
                >
                  <Trophy size={20} className="group-hover:animate-bounce" />
                  Standings
                </Link>
                <Link
                  href="/women/fixtures"
                  className="group px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-black text-sm md:text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all transform hover:scale-110 flex items-center gap-2"
                >
                  <Calendar size={20} className="group-hover:animate-bounce" />
                  Fixtures
                </Link>
              </div>
            </div>
          </div>

          {/* LIVE MATCHES */}
          {data.liveMatches.length > 0 && (
            <div className="container mx-auto px-4 py-16 md:py-20 border-t border-slate-800">
              <div className="mb-12 md:mb-16">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-pink-500/20 border border-pink-500/30 rounded-full backdrop-blur-md">
                    <Zap size={18} className="text-pink-400 animate-pulse" />
                    <span className="text-sm font-bold text-pink-400">HAPPENING NOW</span>
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white">
                  <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    LIVE MATCHES
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {data.liveMatches.map((match) => (
                  <PremiumMatchCard key={match.id} match={match} variant="live" />
                ))}
              </div>
            </div>
          )}

          {/* STATISTICS */}
          <div className="container mx-auto px-4 py-16 md:py-20 border-t border-slate-800">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 flex-wrap">
                <BarChart3 size={32} className="text-pink-500" />
                <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  SEASON HIGHLIGHTS
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <PremiumStatCard
                label="Total Goals"
                value={data.stats.totalGoals}
                icon={Flame}
                gradient="bg-gradient-to-br from-pink-950/40 to-purple-950/30 border-pink-500/30"
                subtext="🎯 Goals scored"
              />
              <PremiumStatCard
                label="Matches"
                value={data.stats.totalMatches}
                icon={Activity}
                gradient="bg-gradient-to-br from-purple-950/40 to-purple-900/30 border-purple-500/30"
                subtext="⚽ Total competitions"
              />
              <PremiumStatCard
                label="Avg Goals/Match"
                value={data.stats.avgGoals}
                icon={TrendingUp}
                gradient="bg-gradient-to-br from-blue-950/40 to-cyan-950/30 border-blue-500/30"
                subtext="📊 Average"
              />
              {data.stats.longestStreak && (
                <PremiumStatCard
                  label="Hot Streak"
                  value={data.stats.longestStreak.currentStreak}
                  icon={Award}
                  gradient="bg-gradient-to-br from-amber-950/40 to-yellow-950/30 border-amber-500/30"
                  subtext={`🔥 ${data.stats.longestStreak.name}`}
                />
              )}
            </div>
          </div>

          {/* UPCOMING MATCHES */}
          {data.upcomingMatches.length > 0 && (
            <div className="container mx-auto px-4 py-16 md:py-20 border-t border-slate-800">
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full backdrop-blur-md">
                    <Clock size={18} className="text-purple-400" />
                    <span className="text-sm font-bold text-purple-400">COMING SOON</span>
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    UPCOMING FIXTURES
                  </span>
                </h2>
              </div>

              <div className="space-y-4">
                {data.upcomingMatches.map((match) => (
                  <PremiumMatchCard key={match.id} match={match} variant="upcoming" />
                ))}
              </div>

              <div className="text-center mt-10">
                <Link
                  href="/women/fixtures"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold transition-all transform hover:scale-105"
                >
                  View All Fixtures
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          )}

          {/* RECENT RESULTS */}
          {data.recentMatches.length > 0 && (
            <div className="container mx-auto px-4 py-16 md:py-20 border-t border-slate-800">
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full backdrop-blur-md">
                    <TrendingUp size={18} className="text-green-400" />
                    <span className="text-sm font-bold text-green-400">MATCH RESULTS</span>
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white">
                  <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    RECENT RESULTS
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.recentMatches.map((match) => (
                  <PremiumMatchCard key={match.id} match={match} variant="recent" />
                ))}
              </div>

              <div className="text-center mt-10">
                <Link
                  href="/women/results"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-bold transition-all transform hover:scale-105"
                >
                  View All Results
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          )}

          {/* STANDINGS WITH LEGEND */}
          {data.standings.length > 0 && (
            <div className="container mx-auto px-4 py-16 md:py-20 border-t border-slate-800">
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full backdrop-blur-md">
                    <Trophy size={18} className="text-yellow-400" />
                    <span className="text-sm font-bold text-yellow-400">RANKINGS</span>
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white">
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                    CHAMPIONSHIP STANDINGS
                  </span>
                </h2>
                <p className="text-gray-400 font-semibold mt-3">Competitive matches only • Updated live 🔄</p>
              </div>

              {/* LEGEND */}
              <StandingsLegend />

              {/* TABLE */}
              <ResponsiveStandingsTable standings={data.standings} />

              <div className="text-center mt-10">
                <Link
                  href="/women/standings"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white rounded-lg font-bold transition-all transform hover:scale-105"
                >
                  View Full Standings
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          )}

          {/* CTA SECTION */}
          <div className="container mx-auto px-4 py-16 md:py-20 border-t border-slate-800">
            <div className="bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-purple-600/20 border border-pink-500/30 rounded-3xl p-8 md:p-12 text-center backdrop-blur-md">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
                Never Miss an Update 💯
              </h3>
              <p className="text-base md:text-lg text-gray-300 font-semibold mb-8 max-w-2xl mx-auto">
                Get instant notifications for live women's matches, final scores, and championship updates!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="https://whatsapp.com/channel/LASU-BU"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-black text-sm md:text-base transition-all transform hover:scale-110 shadow-lg shadow-green-500/30"
                >
                  <span>💚</span>
                  Join WhatsApp
                </Link>
                <Link
                  href="/women/standings"
                  className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-black text-sm md:text-base transition-all transform hover:scale-110 border border-slate-700"
                >
                  <Trophy size={20} />
                  See Standings
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Spacing */}
          <div className="h-12 md:h-20"></div>
        </div>

        {/* Scrollbar Styling */}
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </>
  );
}