'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Trophy,
  Flame,
  TrendingUp,
  Activity,
  Users,
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
  MapPin,
  MessageCircle,
  Zap as ZapIcon,
  Target,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

interface Match {
  id: number;
  status: 'PENDING' | 'LIVE' | 'FINISHED';
  scoreHome: number;
  scoreAway: number;
  matchDate: Date | string;
  finishedAt:  Date | string | null;
  matchMinute: number;
  archived: boolean;
  importance: string | null;
  venue?:  string;
  homeFaculty:  {
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
// ANIMATION HOOK - OPTION 2 SLOWER TIMING
// ============================================
function useStaggerAnimation() {
  const [animateHero, setAnimateHero] = useState(false);
  const [animateLive, setAnimateLive] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);
  const [animateUpcoming, setAnimateUpcoming] = useState(false);
  const [animateRecent, setAnimateRecent] = useState(false);
  const [animateStandings, setAnimateStandings] = useState(false);

  useEffect(() => {
    setAnimateHero(true);
    
    const timer1 = setTimeout(() => setAnimateLive(true), 1500);
    const timer2 = setTimeout(() => setAnimateStats(true), 2000);
    const timer3 = setTimeout(() => setAnimateUpcoming(true), 2500);
    const timer4 = setTimeout(() => setAnimateRecent(true), 3000);
    const timer5 = setTimeout(() => setAnimateStandings(true), 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);

  return { animateHero, animateLive, animateStats, animateUpcoming, animateRecent, animateStandings };
}

// ============================================
// HERO IMAGE CAROUSEL
// ============================================
function HeroCarousel() {
  const [currentImage, setCurrentImage] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  const images = [
    '/fav. jpg',
    '/hero-new2.jpg',
    '/hero-new. jpg',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeOut(true);
      
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
        setFadeOut(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentImage && !fadeOut ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url('${img}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50"></div>
    </div>
  );
}

// ============================================
// FLOATING WHATSAPP BUTTON
// ============================================
function FloatingWhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Link
      href="/"
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
  if (! importance) return null;

  const badgeConfig:  Record<string, { bg: string; text: string; icon: string; border: string }> = {
    Friendly: { bg: 'bg-gray-500/10', text: 'text-gray-400', icon: '⚽', border: 'border-gray-500/30' },
    League: { bg: 'bg-blue-500/10', text:  'text-blue-400', icon: '🏆', border: 'border-blue-500/30' },
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

  if (!mounted) return <span className="text-blue-300 text-xs font-bold">... </span>;
  return <span className="text-blue-300 text-xs font-bold">{timeLeft}</span>;
}

// ============================================
// LIVE MATCH CARD
// ============================================
function LiveMatchCard({ match }: { match: Match }) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="rounded-2xl p-6 transition-all duration-300 group hover:scale-105 cursor-pointer bg-gradient-to-br from-red-950/60 via-red-900/40 to-orange-950/30 border-2 border-red-500/40 shadow-2xl shadow-red-500/20 hover:shadow-red-500/40 hover:border-red-500/60">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full font-black text-sm animate-pulse shadow-lg shadow-red-500/50">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            LIVE {match.matchMinute || 0}'
          </div>
          <ImportanceBadge importance={match. importance} />
        </div>
        <button onClick={() => setIsLiked(!isLiked)} className="transition-transform hover:scale-125">
          <Heart size={20} className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'} />
        </button>
      </div>

      <div className="space-y-4">
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
              <p className="text-lg font-black text-white">{match.homeFaculty. name}</p>
            </div>
          </div>
          <p className="text-5xl font-black tabular-nums text-white">{match.scoreHome}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
          <span className="text-xs font-bold text-gray-500 uppercase">vs</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
        </div>

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
              <p className="text-lg font-black text-white">{match.awayFaculty.name}</p>
            </div>
          </div>
          <p className="text-5xl font-black tabular-nums text-white">{match.scoreAway}</p>
        </div>
      </div>

      <Link
        href={`/livescores? match=${match.id}`}
        className="mt-6 block w-full text-center px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-lg font-bold text-sm transition-all transform hover:scale-105 flex items-center justify-center gap-2 group"
      >
        <Play size={16} />
        Watch Live
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}

// ============================================
// STAT CARD
// ============================================
function StatCard({
  label,
  value,
  icon: Icon,
  gradient,
  subtext,
}:  {
  label: string;
  value: string | number;
  icon: React.ComponentType<any>;
  gradient: string;
  subtext:  string;
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
    { label:  'D', fullName: 'Drawn', icon: '🤝', color: 'from-yellow-500 to-yellow-600' },
    { label:  'L', fullName: 'Lost', icon: '❌', color: 'from-red-500 to-red-600' },
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
            <div className="text-white/70 text-xs font-bold mt-1 opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 backdrop-blur z-10">
              {item. fullName}
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
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-700">
              <th className="px-4 py-3 text-left text-xs font-black text-gray-300 uppercase min-w-16">Pos</th>
              <th className="px-4 py-3 text-left text-xs font-black text-gray-300 uppercase min-w-48">Faculty</th>
              <th className="px-3 py-3 text-center text-xs font-black text-gray-300 uppercase min-w-12">P</th>
              <th className="px-3 py-3 text-center text-xs font-black text-gray-300 uppercase min-w-12">W</th>
              <th className="px-3 py-3 text-center text-xs font-black text-gray-300 uppercase min-w-12">D</th>
              <th className="px-3 py-3 text-center text-xs font-black text-gray-300 uppercase min-w-12">L</th>
              <th className="px-3 py-3 text-center text-xs font-black text-gray-300 uppercase min-w-12">GF</th>
              <th className="px-3 py-3 text-center text-xs font-black text-gray-300 uppercase min-w-12">GA</th>
              <th className="px-3 py-3 text-center text-xs font-black text-gray-300 uppercase min-w-12">GD</th>
              <th className="px-4 py-3 text-center text-xs font-black text-gray-300 uppercase min-w-16">Pts</th>
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
                    {index === 0 ? '🥇' : index === 1 ? '🥈' :  index === 2 ? '🥉' : `#${index + 1}`}
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
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm truncate">{faculty.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-center text-white font-bold text-sm">{faculty.played}</td>
                <td className="px-3 py-3 text-center text-green-400 font-bold text-sm">{faculty.won}</td>
                <td className="px-3 py-3 text-center text-yellow-400 font-bold text-sm">{faculty. drawn}</td>
                <td className="px-3 py-3 text-center text-red-400 font-bold text-sm">{faculty.lost}</td>
                <td className="px-3 py-3 text-center text-blue-400 font-bold text-sm">{faculty.goalsFor}</td>
                <td className="px-3 py-3 text-center text-red-400 font-bold text-sm">{faculty.goalsAgainst}</td>
                <td
                  className={`px-3 py-3 text-center font-bold text-sm ${
                    faculty.goalDifference > 0
                      ? 'text-green-400'
                      : faculty.goalDifference < 0
                      ? 'text-red-400'
                      :  'text-gray-400'
                  }`}
                >
                  {faculty.goalDifference > 0 ?  '+' : ''}
                  {faculty.goalDifference}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                    {faculty. points}
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
// MAIN HOME PAGE
// ============================================
export default function LASUBallersHomePage() {
  // ============================================
  // ALL HOOKS DECLARED FIRST
  // ============================================
  const router = useRouter();
  const { data: session, status } = useSession();
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { animateHero, animateLive, animateStats, animateUpcoming, animateRecent, animateStandings } = useStaggerAnimation();

  // ============================================
  // FETCH DATA EFFECT
  // ============================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api2/home-data', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const homeData = await response.json();
        setData(homeData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message :  'Failed to load data');
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

  // ============================================
  // SESSION PROTECTION EFFECT
  // ============================================
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // ============================================
  // RENDER CONDITIONS (AFTER ALL HOOKS)
  // ============================================
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-black text-white mb-2">Loading LASU Ballers Union</h2>
          <p className="text-gray-400 font-semibold">Preparing the championship experience...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-black text-white mb-2">Loading LASU Ballers Union</h2>
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

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <>
      <FloatingWhatsAppButton />

      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* ============= HERO SECTION ============= */}
          <div
            className={`relative h-screen flex items-center justify-center overflow-hidden transition-all duration-1000 ${
              animateHero ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'
            }`}
          >
            {/* Hero Carousel Background */}
            <HeroCarousel />

            {/* Hero Content */}
            <div className="relative z-20 container mx-auto px-4 text-center space-y-6 max-w-4xl">
              {/* Badge - POP UP ANIMATION */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-500/30 border border-blue-500/50 rounded-full backdrop-blur-md animate-pulse transition-all duration-700 ${
                animateHero ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}>
                <Sparkles size={16} className="text-blue-400" />
                <span className="text-sm font-bold text-blue-300">⚽ Championship Live Now</span>
              </div>

              {/* Main Title */}
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-tight drop-shadow-2xl">
                <span className="bg-gradient-to-r from-red-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  LASU BALLERS
                </span>
              </h1>

              {/* Subtitle */}
              <h2 className="text-3xl md:text-4xl lg: text-5xl font-black text-white drop-shadow-2xl">
                UNION
              </h2>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-100 font-semibold max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
                Experience football like never before.  Real-time scores, thrilling matchups, championship glory.  Join thousands of passionate students! 
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap justify-center gap-4 pt-8">
                <Link
                  href="/livescorespagenav"
                  className="group px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl text-lg font-black shadow-2xl shadow-red-500/50 hover:shadow-red-500/70 transition-all transform hover:scale-110 hover:-translate-y-1 flex items-center gap-3"
                >
                  <Flame size={24} className="group-hover:animate-bounce" />
                  🔴 Live Scores
                </Link>
                <Link
                  href="/"
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl text-lg font-black shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 transition-all transform hover:scale-110 hover:-translate-y-1 flex items-center gap-3"
                >
                  <Trophy size={24} className="group-hover:animate-bounce" />
                  🏆 Mens page
                </Link>
                <Link
                  href="/fixturespagenav"
                  className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl text-lg font-black shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all transform hover:scale-110 hover:-translate-y-1 flex items-center gap-3"
                >
                  <Calendar size={24} className="group-hover:animate-bounce" />
                  📅 Fixtures
                </Link>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
              <div className="w-6 h-10 border-2 border-white rounded-full flex items-center justify-center">
                <div className="w-1 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* ============= LIVE MATCHES - SLIDE FROM RIGHT ============= */}
          {data.liveMatches.length > 0 && (
            <div
              className={`transition-all duration-1000 container mx-auto px-4 py-20 border-t border-slate-800 ${
                animateLive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
              }`}
            >
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full backdrop-blur-md">
                    <Zap size={18} className="text-red-400 animate-pulse" />
                    <span className="text-sm font-bold text-red-400">🔴 LIVE NOW</span>
                  </div>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white">
                  <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                    LIVE MATCHES
                  </span>
                </h2>
                <p className="text-gray-400 font-semibold mt-3">⚡ Follow the action in real-time</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data. liveMatches.map((match) => (
                  <LiveMatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          )}

          {/* ============= STATS - POP UP ANIMATION ============= */}
          <div
            className={`transition-all duration-1000 container mx-auto px-4 py-20 border-t border-slate-800 ${
              animateStats ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
          >
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white flex items-center gap-3">
                <BarChart3 size={40} className="text-blue-500" />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  SEASON HIGHLIGHTS
                </span>
              </h2>
              <p className="text-gray-400 font-semibold mt-3">🌟 Outstanding performances this season</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total Goals"
                value={data.stats.totalGoals}
                icon={Flame}
                gradient="bg-gradient-to-br from-red-950/40 to-orange-950/30 border-red-500/30"
                subtext="🎯 Goals scored this season"
              />
              <StatCard
                label="Matches"
                value={data.stats. totalMatches}
                icon={Activity}
                gradient="bg-gradient-to-br from-purple-950/40 to-purple-900/30 border-purple-500/30"
                subtext="⚽ Total competitions"
              />
              <StatCard
                label="Avg Goals/Match"
                value={data. stats.avgGoals}
                icon={TrendingUp}
                gradient="bg-gradient-to-br from-green-950/40 to-emerald-950/30 border-green-500/30"
                subtext="📊 Per game"
              />
              {data.stats.longestStreak && (
                <StatCard
                  label="Hot Streak"
                  value={data.stats.longestStreak. currentStreak}
                  icon={Award}
                  gradient="bg-gradient-to-br from-amber-950/40 to-yellow-950/30 border-amber-500/30"
                  subtext={`🔥 ${data.stats.longestStreak.name}`}
                />
              )}
            </div>
          </div>

          {/* ============= UPCOMING - SLIDE FROM LEFT ============= */}
          {data.upcomingMatches.length > 0 && (
            <div
              className={`transition-all duration-1000 container mx-auto px-4 py-20 border-t border-slate-800 ${
                animateUpcoming ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'
              }`}
            >
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full backdrop-blur-md">
                    <Clock size={18} className="text-orange-400" />
                    <span className="text-sm font-bold text-orange-400">⏱️ COMING SOON</span>
                  </div>
                </div>
                <h2 className="text-4xl md: text-5xl font-black text-white">
                  <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                    UPCOMING FIXTURES
                  </span>
                </h2>
                <p className="text-gray-400 font-semibold mt-3">📆 Mark your calendars!</p>
              </div>

              <div className="space-y-3">
                {data.upcomingMatches.map((match) => (
                  <div key={match.id} className="bg-gradient-to-r from-orange-950/30 to-slate-900/30 rounded-lg p-4 border border-orange-500/30 hover:border-orange-500/50 transition-all">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Calendar size={16} className="text-orange-400" />
                        <span className="text-sm font-bold text-gray-400">
                          {new Date(match.matchDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <CountdownTimer targetDate={match.matchDate} />
                        <ImportanceBadge importance={match.importance} />
                      </div>
                      <div className="flex items-center gap-2 flex-wrap justify-center">
                        <div
                          className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: match.homeFaculty.colorPrimary }}
                        >
                          {match. homeFaculty.abbreviation}
                        </div>
                        <span className="text-white font-bold text-sm">{match.homeFaculty.name}</span>
                        <span className="text-gray-500">vs</span>
                        <span className="text-white font-bold text-sm">{match.awayFaculty.name}</span>
                        <div
                          className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: match.awayFaculty.colorPrimary }}
                        >
                          {match.awayFaculty.abbreviation}
                        </div>
                      </div>
                      <Link href={`/fixtures? match=${match.id}`} className="px-3 py-1 bg-orange-600/20 text-orange-400 rounded text-xs font-bold transition">
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============= RECENT RESULTS - SLIDE FROM RIGHT ============= */}
          {data.recentMatches.length > 0 && (
            <div
              className={`transition-all duration-1000 container mx-auto px-4 py-20 border-t border-slate-800 ${
                animateRecent ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
              }`}
            >
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full backdrop-blur-md">
                    <TrendingUp size={18} className="text-green-400" />
                    <span className="text-sm font-bold text-green-400">✅ MATCH RESULTS</span>
                  </div>
                </div>
                <h2 className="text-4xl md: text-5xl font-black text-white">
                  <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    RECENT RESULTS
                  </span>
                </h2>
                <p className="text-gray-400 font-semibold mt-3">🎮 All matches & competitions</p>
              </div>

              <div className="space-y-4">
                {data.recentMatches.map((match) => {
                  const homeWon = match.scoreHome > match.scoreAway;
                  const awayWon = match.scoreAway > match.scoreHome;
                  const isDraw = match.scoreHome === match.scoreAway;

                  return (
                    <div key={match.id} className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-lg p-4 md:p-6 border border-slate-700 hover:border-green-500/50 transition-all">
                      {/* Top Row:  Date & Badge */}
                      <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-700 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-500 whitespace-nowrap">
                            {new Date(match.finishedAt || match.matchDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          <ImportanceBadge importance={match. importance} />
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                            isDraw ? 'bg-yellow-500/20 text-yellow-400' : homeWon ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {isDraw ? '🤝 Draw' : '✓ FT'}
                        </span>
                      </div>

                      {/* Score Row - Optimized for Mobile */}
                      <div className="flex items-center justify-between gap-2">
                        {/* Home Team */}
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div
                            className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-white text-xs md:text-sm font-bold flex-shrink-0"
                            style={{ backgroundColor: match.homeFaculty.colorPrimary }}
                          >
                            {match.homeFaculty. abbreviation}
                          </div>
                          <span className={`text-xs md:text-sm font-bold truncate ${homeWon ? 'text-white' : 'text-gray-400'}`}>
                            {match.homeFaculty.name}
                          </span>
                        </div>

                        {/* Score */}
                        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                          <span className="text-xl md:text-2xl font-black text-white">{match.scoreHome}</span>
                          <span className="text-gray-500 text-sm md:text-base">−</span>
                          <span className="text-xl md:text-2xl font-black text-white">{match. scoreAway}</span>
                        </div>

                        {/* Away Team */}
                        <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                          <span className={`text-xs md:text-sm font-bold truncate text-right ${awayWon ? 'text-white' : 'text-gray-400'}`}>
                            {match.awayFaculty.name}
                          </span>
                          <div
                            className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-white text-xs md:text-sm font-bold flex-shrink-0"
                            style={{ backgroundColor: match. awayFaculty.colorPrimary }}
                          >
                            {match.awayFaculty.abbreviation}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============= STANDINGS - SLIDE FROM LEFT + LEGEND ============= */}
          {data.standings.length > 0 && (
            <div
              className={`transition-all duration-1000 container mx-auto px-4 py-20 border-t border-slate-800 ${
                animateStandings ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'
              }`}
            >
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full backdrop-blur-md">
                    <Trophy size={18} className="text-yellow-400" />
                    <span className="text-sm font-bold text-yellow-400">🏆 RANKINGS</span>
                  </div>
                </div>
                <h2 className="text-4xl md: text-5xl font-black text-white">
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                    CHAMPIONSHIP STANDINGS
                  </span>
                </h2>
                <p className="text-gray-400 font-semibold mt-3">Competitive matches only • Updated live 🔄</p>
              </div>

              {/* LEGEND BEFORE TABLE */}
              <StandingsLegend />

              <ResponsiveStandingsTable standings={data.standings} />

              <div className="text-center mt-10">
                <Link
                  href="/women/standings"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white rounded-lg font-bold transition-all transform hover:scale-105"
                >
                  View women's Standings
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          )}

          {/* ============= CTA ============= */}
          <div className="container mx-auto px-4 py-20 border-t border-slate-800">
            <div className="bg-gradient-to-r from-red-600/20 via-blue-600/20 to-purple-600/20 border border-red-500/30 rounded-3xl p-12 text-center backdrop-blur-md">
              <h3 className="text-4xl md:text-5xl font-black text-white mb-4">
                Never Miss a Match ⚽
              </h3>
              <p className="text-lg text-gray-300 font-semibold mb-8 max-w-2xl mx-auto">
                Get instant notifications for live matches, final scores, and championship updates! 
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-black transition-all transform hover:scale-110 shadow-lg shadow-green-500/30"
                >
                  <span>💚</span>
                  Join WhatsApp
                </Link>
                <Link
                  href="/women/standings"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-black transition-all transform hover:scale-110 border border-slate-700"
                >
                  <Trophy size={20} />
                  See women standings 
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Spacing */}
          <div className="h-20"></div>
        </div>

        {/* Scrollbar Styling */}
        <style jsx>{`
          .scrollbar-hide: :-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width:  none;
          }
        `}</style>
      </div>
    </>
  );
}