'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Trophy,
  Flame,
  TrendingUp,
  Target,
  Activity,
  Users,
  Clock,
  ArrowRight,
  Star,
  Zap,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Play,
  Calendar,
  BarChart3,
  Award,
  Sparkles,
  Heart,
  Share2,
  MapPin,
  Eye,
} from 'lucide-react';

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
}

// ============================================
// IMPORTANCE BADGE COMPONENT
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
// COUNTDOWN TIMER COMPONENT
// ============================================
function CountdownTimer({ targetDate }: { targetDate: Date | string }) {
  const [timeLeft, setTimeLeft] = useState<string>('Loading...');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const calculateTime = () => {
      const now = new Date(). getTime();
      const target = new Date(targetDate).getTime();
      const distance = target - now;

      if (distance < 0) {
        setTimeLeft('LIVE');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${seconds}s`);
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) return <span className="text-blue-300 text-xs font-bold">... </span>;
  return <span className="text-blue-300 text-xs font-bold">{timeLeft}</span>;
}

// ============================================
// MATCH CARD COMPONENT
// ============================================
function PremiumMatchCard({ match, variant = 'default' }: { match: Match; variant?: 'live' | 'upcoming' | 'recent' | 'default' }) {
  const [isLiked, setIsLiked] = useState(false);

  const getVariantStyles = () => {
    switch (variant) {
      case 'live':
        return 'bg-gradient-to-br from-red-950/60 via-red-900/40 to-orange-950/30 border-2 border-red-500/40 shadow-2xl shadow-red-500/20 hover:shadow-red-500/40 hover:border-red-500/60';
      case 'upcoming':
        return 'bg-gradient-to-br from-orange-950/40 via-slate-900/50 to-slate-950/40 border border-orange-500/30 hover:border-orange-500/50';
      case 'recent':
        return 'bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700 hover:border-green-500/50';
      default:
        return 'bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50';
    }
  };

  const homeWon = match.scoreHome > match. scoreAway;
  const awayWon = match.scoreAway > match.scoreHome;
  const isDraw = match.scoreHome === match.scoreAway;

  return (
    <div className={`rounded-2xl p-6 transition-all duration-300 group hover:scale-105 cursor-pointer ${getVariantStyles()}`}>
      {/* Header */}
      {variant === 'live' && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full font-black text-sm animate-pulse shadow-lg shadow-red-500/50">
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
              LIVE {match.matchMinute || 0}'
            </div>
            <ImportanceBadge importance={match. importance} />
          </div>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="transition-transform hover:scale-125"
          >
            <Heart size={20} className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'} />
          </button>
        </div>
      )}

      {variant === 'upcoming' && (
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-orange-500/20">
          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-orange-400" />
            <span className="text-sm font-bold text-gray-400">
              {new Date(match.matchDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <span className="text-sm font-bold text-orange-400">
              <CountdownTimer targetDate={match.matchDate} />
            </span>
            <ImportanceBadge importance={match. importance} />
          </div>
        </div>
      )}

      {variant === 'recent' && (
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase">
              {new Date(match.finishedAt || match.matchDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <ImportanceBadge importance={match. importance} />
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

      {/* Teams Display */}
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
              <p className="text-lg font-black text-white">
                {match.homeFaculty.name}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-5xl font-black tabular-nums text-white">
              {match.scoreHome}
            </p>
          </div>
        </div>

        {/* Score Divider */}
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
              {match. awayFaculty.abbreviation}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">Away</p>
              <p className="text-lg font-black text-white">
                {match. awayFaculty.name}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-5xl font-black tabular-nums text-white">
              {match.scoreAway}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      {variant === 'live' && (
        <Link
          href={`/livescores? match=${match.id}`}
          className="mt-6 block w-full text-center px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-lg font-bold text-sm transition-all transform hover:scale-105 flex items-center justify-center gap-2 group"
        >
          <Play size={16} />
          Watch Live Commentary
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      )}

      {variant === 'upcoming' && (
        <Link
          href={`/fixtures?match=${match.id}`}
          className="mt-4 block w-full text-center px-4 py-2 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 rounded-lg font-bold text-sm transition-all border border-orange-500/30"
        >
          View Details →
        </Link>
      )}

      {variant === 'recent' && match.venue && (
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
          <MapPin size={14} />
          <span>{match.venue}</span>
        </div>
      )}
    </div>
  );
}

// ============================================
// STATISTICS CARD
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
      {/* Animated background */}
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
// MAIN HOME PAGE
// ============================================
export default function HomePage() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api2/home-data', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json(). catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch data`);
        }

        const homeData = await response.json();
        
        console.log('Data received:', homeData);

        if (! homeData || typeof homeData !== 'object') {
          throw new Error('Invalid data format received from API');
        }

        setData(homeData);
      } catch (err) {
        console. error('Error fetching home data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setData({
          liveMatches: [],
          upcomingMatches: [],
          recentMatches: [],
          standings: [],
          stats: {
            totalGoals: 0,
            highestScoringMatch: null,
            longestStreak: null,
            totalMatches: 0,
            avgGoals: '0',
          },
        });
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
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-black text-white mb-2">Loading LASU Sports Hub</h2>
          <p className="text-gray-400 font-semibold">Preparing the championship experience...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-400 font-semibold mb-6">{error || 'Failed to load data'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-bold transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* HERO SECTION */}
        <div className="container mx-auto px-4 pt-20 pb-24">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full backdrop-blur-md">
              <Sparkles size={16} className="text-blue-400" />
              <span className="text-sm font-bold text-blue-400">Championship Live Now</span>
            </div>

            {/* Main Title */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                LASU
              </span>
            </h1>

            {/* Subtitle */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white">
              SPORTS HUB
            </h2>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-300 font-semibold max-w-2xl mx-auto leading-relaxed">
              Experience live college sports like never before. Real-time scores, thrilling matchups, and championship glory.  Join thousands of fans. 
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-8">
              <Link
                href="/livescorespagenav"
                className="group px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl text-lg font-black shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 transition-all transform hover:scale-110 hover:-translate-y-1 flex items-center gap-3"
              >
                <Flame size={24} className="group-hover:animate-bounce" />
                Live Scores
              </Link>
              <Link
                href="/standingsagenav"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl text-lg font-black shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all transform hover:scale-110 hover:-translate-y-1 flex items-center gap-3"
              >
                <Trophy size={24} className="group-hover:animate-bounce" />
                Standings
              </Link>
              <Link
                href="/fixturespagenav"
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl text-lg font-black shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all transform hover:scale-110 hover:-translate-y-1 flex items-center gap-3"
              >
                <Calendar size={24} className="group-hover:animate-bounce" />
                Fixtures
              </Link>
            </div>
          </div>
        </div>

        {/* LIVE MATCHES SECTION */}
        {data.liveMatches.length > 0 && (
          <div className="container mx-auto px-4 py-20 border-t border-slate-800">
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full backdrop-blur-md">
                  <Zap size={18} className="text-red-400 animate-pulse" />
                  <span className="text-sm font-bold text-red-400">HAPPENING NOW</span>
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white">
                <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  LIVE MATCHES
                </span>
              </h2>
              <p className="text-gray-400 font-semibold mt-3">Follow the action in real-time</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data. liveMatches.map((match) => (
                <PremiumMatchCard key={match.id} match={match} variant="live" />
              ))}
            </div>
          </div>
        )}

        {/* STATISTICS SECTION */}
        <div className="container mx-auto px-4 py-20 border-t border-slate-800">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white flex items-center gap-3">
              <BarChart3 size={40} className="text-blue-500" />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                SEASON HIGHLIGHTS
              </span>
            </h2>
            <p className="text-gray-400 font-semibold mt-3">Outstanding performances this season</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <PremiumStatCard
              label="Total Goals"
              value={data.stats.totalGoals}
              icon={Flame}
              gradient="bg-gradient-to-br from-red-950/40 to-orange-950/30 border-red-500/30"
              subtext="🎯 Goals scored this season"
            />
            <PremiumStatCard
              label="Matches Played"
              value={data. stats.totalMatches}
              icon={Activity}
              gradient="bg-gradient-to-br from-purple-950/40 to-purple-900/30 border-purple-500/30"
              subtext="⚽ Total competitions"
            />
            <PremiumStatCard
              label="Avg Goals/Match"
              value={data. stats.avgGoals}
              icon={TrendingUp}
              gradient="bg-gradient-to-br from-green-950/40 to-emerald-950/30 border-green-500/30"
              subtext="📊 Per game average"
            />
            {data.stats.longestStreak && (
              <PremiumStatCard
                label="Longest Streak"
                value={data.stats.longestStreak. currentStreak}
                icon={Award}
                gradient="bg-gradient-to-br from-amber-950/40 to-yellow-950/30 border-amber-500/30"
                subtext={`🔥 ${data.stats.longestStreak.name}`}
              />
            )}
          </div>
        </div>

        {/* UPCOMING MATCHES SECTION */}
        {data.upcomingMatches. length > 0 && (
          <div className="container mx-auto px-4 py-20 border-t border-slate-800">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full backdrop-blur-md">
                  <Clock size={18} className="text-orange-400" />
                  <span className="text-sm font-bold text-orange-400">COMING SOON</span>
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white">
                <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  UPCOMING FIXTURES
                </span>
              </h2>
              <p className="text-gray-400 font-semibold mt-3">Mark your calendars for these exciting matchups</p>
            </div>

            <div className="space-y-4">
              {data.upcomingMatches. map((match) => (
                <PremiumMatchCard key={match. id} match={match} variant="upcoming" />
              ))}
            </div>

            {data.upcomingMatches.length > 0 && (
              <div className="text-center mt-8">
                <Link
                  href="/fixturespagenav"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white rounded-lg font-bold transition-all transform hover:scale-105"
                >
                  View All Fixtures
                  <ArrowRight size={20} />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* RECENT RESULTS SECTION */}
        {data.recentMatches.length > 0 && (
          <div className="container mx-auto px-4 py-20 border-t border-slate-800">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full backdrop-blur-md">
                  <TrendingUp size={18} className="text-green-400" />
                  <span className="text-sm font-bold text-green-400">MATCH RESULTS</span>
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white">
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  RECENT RESULTS
                </span>
              </h2>
              <p className="text-gray-400 font-semibold mt-3">All matches including friendlies and competitive games</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data. recentMatches.map((match) => (
                <PremiumMatchCard key={match.id} match={match} variant="recent" />
              ))}
            </div>

            {data. recentMatches.length > 0 && (
              <div className="text-center mt-12">
                <Link
                  href="/results"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-bold transition-all transform hover:scale-105"
                >
                  View All Results
                  <ArrowRight size={20} />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* STANDINGS SECTION */}
        {data.standings.length > 0 && (
          <div className="container mx-auto px-4 py-20 border-t border-slate-800">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full backdrop-blur-md">
                  <Trophy size={18} className="text-yellow-400" />
                  <span className="text-sm font-bold text-yellow-400">RANKINGS</span>
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white">
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                  CHAMPIONSHIP STANDINGS
                </span>
              </h2>
              <p className="text-gray-400 font-semibold mt-3">Competitive matches only • Updated live</p>
            </div>

            <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl backdrop-blur-md">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-700">
                      <th className="px-6 py-4 text-left text-sm font-black text-gray-300 uppercase tracking-wider">Position</th>
                      <th className="px-6 py-4 text-left text-sm font-black text-gray-300 uppercase tracking-wider">Faculty</th>
                      <th className="px-6 py-4 text-center text-sm font-black text-gray-300 uppercase tracking-wider">P</th>
                      <th className="px-6 py-4 text-center text-sm font-black text-gray-300 uppercase tracking-wider">W</th>
                      <th className="px-6 py-4 text-center text-sm font-black text-gray-300 uppercase tracking-wider">D</th>
                      <th className="px-6 py-4 text-center text-sm font-black text-gray-300 uppercase tracking-wider">L</th>
                      <th className="px-6 py-4 text-center text-sm font-black text-gray-300 uppercase tracking-wider">GF</th>
                      <th className="px-6 py-4 text-center text-sm font-black text-gray-300 uppercase tracking-wider">GA</th>
                      <th className="px-6 py-4 text-center text-sm font-black text-gray-300 uppercase tracking-wider">GD</th>
                      <th className="px-6 py-4 text-center text-sm font-black text-gray-300 uppercase tracking-wider">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.standings. map((faculty, index) => (
                      <tr
                        key={faculty.id}
                        className={`border-b border-slate-700 transition-colors hover:bg-slate-800/50 ${
                          index < 3 ? 'bg-gradient-to-r from-yellow-950/20 to-transparent' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          <span className="text-2xl font-black">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-lg transition-transform hover:scale-110"
                              style={{ backgroundColor: faculty.colorPrimary }}
                            >
                              {faculty.abbreviation}
                            </div>
                            <div>
                              <p className="text-white font-bold">{faculty.name}</p>
                              <p className="text-xs text-gray-500">
                                {faculty.currentStreak > 0 ? `🔥 ${faculty.currentStreak}W` : 'N/A'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-white font-bold">{faculty.played}</td>
                        <td className="px-6 py-4 text-center text-green-400 font-bold text-lg">{faculty.won}</td>
                        <td className="px-6 py-4 text-center text-yellow-400 font-bold text-lg">{faculty.drawn}</td>
                        <td className="px-6 py-4 text-center text-red-400 font-bold text-lg">{faculty.lost}</td>
                        <td className="px-6 py-4 text-center text-blue-400 font-bold">{faculty.goalsFor}</td>
                        <td className="px-6 py-4 text-center text-red-400 font-bold">{faculty.goalsAgainst}</td>
                        <td className={`px-6 py-4 text-center font-bold ${
                          faculty.goalDifference > 0
                            ? 'text-green-400'
                            : faculty.goalDifference < 0
                            ? 'text-red-400'
                            : 'text-gray-400'
                        }`}>
                          {faculty.goalDifference > 0 ? '+' : ''}
                          {faculty.goalDifference}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-3xl font-black bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                            {faculty. points}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-center mt-10">
              <Link
                href="/standingsnav"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white rounded-lg font-bold transition-all transform hover:scale-105"
              >
                View Full Standings
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        )}

        {/* CTA SECTION */}
        <div className="container mx-auto px-4 py-20 border-t border-slate-800">
          <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border border-blue-500/30 rounded-3xl p-12 text-center backdrop-blur-md">
            <h3 className="text-4xl md:text-5xl font-black text-white mb-4">
              Never Miss an Update
            </h3>
            <p className="text-lg text-gray-300 font-semibold mb-8 max-w-2xl mx-auto">
              Get instant notifications for live matches, final scores, and championship updates.  Join thousands of LASU sports fans. 
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="https://whatsapp.com/channel/LASU-BU"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-black transition-all transform hover:scale-110 shadow-lg shadow-green-500/30"
              >
                <span>💚</span>
                Join WhatsApp Channel
              </Link>
              <Link
                href="/standingsnav"
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-black transition-all transform hover:scale-110 border border-slate-700"
              >
                <Trophy size={20} />
                See Standings
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Spacing */}
        <div className="h-12"></div>
      </div>
    </div>
  );
}