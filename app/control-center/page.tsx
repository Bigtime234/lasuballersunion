'use client';
import React, { useState, useEffect } from 'react';
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
  Calendar,
  BarChart3,
  Award,
  Settings,
  ChevronDown,
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
  venue?:  string;
  homeFaculty:  {
    id: number;
    name: string;
    abbreviation: string;
    colorPrimary: string;
  };
  awayFaculty:  {
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

interface DashboardData {
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

interface AdminData {
  men: DashboardData;
  women:  DashboardData;
}

// ============================================
// CATEGORY TAB COMPONENT
// ============================================
function CategoryTabs({ activeTab, onTabChange }: { activeTab: 'men' | 'women'; onTabChange: (tab: 'men' | 'women') => void }) {
  return (
    <div className="flex gap-2 mb-8">
      <button
        onClick={() => onTabChange('men')}
        className={`px-6 py-3 rounded-lg font-black text-lg transition-all ${
          activeTab === 'men'
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
            : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
        }`}
      >
        👨 Men's Data
      </button>
      <button
        onClick={() => onTabChange('women')}
        className={`px-6 py-3 rounded-lg font-black text-lg transition-all ${
          activeTab === 'women'
            ? 'bg-gradient-to-r from-pink-600 to-pink-700 text-white shadow-lg shadow-pink-500/30'
            : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
        }`}
      >
        👩 Women's Data
      </button>
    </div>
  );
}

// ============================================
// IMPORTANCE BADGE
// ============================================
function ImportanceBadge({ importance }: { importance?:  string | null }) {
  if (!importance) return null;

  const badgeConfig:  Record<string, { bg: string; text: string; icon: string }> = {
    Friendly: { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: '⚽' },
    League: { bg: 'bg-blue-500/20', text:  'text-blue-400', icon: '🏆' },
    Cup: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: '🏆' },
    Finals: { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: '👑' },
  };

  const config = badgeConfig[importance as keyof typeof badgeConfig] || badgeConfig.Friendly;

  return (
    <span className={`px-2 py-1 rounded text-xs font-bold ${config.bg} ${config.text}`}>
      {config.icon} {importance}
    </span>
  );
}

// ============================================
// STAT CARD
// ============================================
function StatCard({
  label,
  value,
  icon:  Icon,
  gradient,
  subtext,
}:  {
  label: string;
  value: string | number;
  icon: React. ComponentType<any>;
  gradient:  string;
  subtext: string;
}) {
  return (
    <div className={`rounded-xl p-6 border transition-all ${gradient}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-gray-400 text-sm font-bold uppercase">{label}</p>
        <Icon size={20} className="text-white" />
      </div>
      <p className="text-3xl font-black text-white">{value}</p>
      <p className="text-xs text-gray-500 mt-2">{subtext}</p>
    </div>
  );
}

// ============================================
// LIVE MATCH CARD
// ============================================
function LiveMatchCard({ match, category }: { match: Match; category: 'men' | 'women' }) {
  const borderColor = category === 'men' ? 'border-red-500/50' : 'border-pink-500/50';
  const shadowColor = category === 'men' ? 'shadow-red-500/20' : 'shadow-pink-500/20';
  const gradientFrom = category === 'men' ?   'from-red-950' : 'from-pink-950';
  const gradientTo = category === 'men' ? 'to-red-900' : 'to-pink-900';
  const pulseColor = category === 'men' ?   'bg-red-500' : 'bg-pink-500';

  return (
    <div
      className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} border-2 ${borderColor} rounded-xl p-6 shadow-lg ${shadowColor}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 ${pulseColor} text-white rounded-full text-xs font-black animate-pulse flex items-center gap-1`}>
            <div className="w-2 h-2 bg-white rounded-full" />
            LIVE {match.matchMinute || 0}'
          </span>
          <ImportanceBadge importance={match. importance} />
        </div>
        <Link href={`/control-center/scores/${match.id}`} className="text-xs font-bold text-gray-300 hover:text-white transition">
          Update →
        </Link>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: match.homeFaculty.colorPrimary }}
            >
              {match.homeFaculty.abbreviation}
            </div>
            <span className="text-white font-bold truncate text-sm">{match.homeFaculty.name}</span>
          </div>
          <span className="text-3xl font-black text-white ml-2">{match.scoreHome}</span>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: match.awayFaculty.colorPrimary }}
            >
              {match.awayFaculty.abbreviation}
            </div>
            <span className="text-white font-bold truncate text-sm">{match.awayFaculty.name}</span>
          </div>
          <span className="text-3xl font-black text-white ml-2">{match.scoreAway}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// RESPONSIVE STANDINGS TABLE
// ============================================
function StandingsTable({ standings, category }: { standings: Faculty[]; category: 'men' | 'women' }) {
  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-xl border border-slate-700/50 overflow-hidden shadow-xl">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-700">
              <th className="px-6 py-4 text-left text-xs font-black text-gray-300 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-300 uppercase tracking-wider">Faculty</th>
              <th className="px-6 py-4 text-center text-xs font-black text-gray-300 uppercase tracking-wider">P</th>
              <th className="px-6 py-4 text-center text-xs font-black text-gray-300 uppercase tracking-wider">W</th>
              <th className="px-6 py-4 text-center text-xs font-black text-gray-300 uppercase tracking-wider">D</th>
              <th className="px-6 py-4 text-center text-xs font-black text-gray-300 uppercase tracking-wider">L</th>
              <th className="px-6 py-4 text-center text-xs font-black text-gray-300 uppercase tracking-wider">GF</th>
              <th className="px-6 py-4 text-center text-xs font-black text-gray-300 uppercase tracking-wider">GA</th>
              <th className="px-6 py-4 text-center text-xs font-black text-gray-300 uppercase tracking-wider">GD</th>
              <th className="px-6 py-4 text-center text-xs font-black text-gray-300 uppercase tracking-wider">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((faculty, index) => (
              <tr
                key={faculty.id}
                className={`border-b border-slate-700 transition-colors hover:bg-slate-800/50 ${
                  index < 3 ? 'bg-gradient-to-r from-yellow-950/20 to-transparent' : ''
                }`}
              >
                <td className="px-6 py-4">
                  <span className="text-lg font-black">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' :  index === 2 ? '🥉' : `#${index + 1}`}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                      style={{ backgroundColor: faculty. colorPrimary }}
                    >
                      {faculty.abbreviation}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm truncate">{faculty.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center text-white font-bold">{faculty.played}</td>
                <td className="px-6 py-4 text-center text-green-400 font-bold text-lg">{faculty.won}</td>
                <td className="px-6 py-4 text-center text-yellow-400 font-bold text-lg">{faculty.drawn}</td>
                <td className="px-6 py-4 text-center text-red-400 font-bold text-lg">{faculty.lost}</td>
                <td className="px-6 py-4 text-center text-blue-400 font-bold">{faculty.goalsFor}</td>
                <td className="px-6 py-4 text-center text-red-400 font-bold">{faculty.goalsAgainst}</td>
                <td
                  className={`px-6 py-4 text-center font-bold ${
                    faculty. goalDifference > 0
                      ? 'text-green-400'
                      : faculty.goalDifference < 0
                      ? 'text-red-400'
                      : 'text-gray-400'
                  }`}
                >
                  {faculty.goalDifference > 0 ? '+' : ''}
                  {faculty.goalDifference}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                    {faculty.points}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3 p-4">
        {standings.map((faculty, index) => (
          <div
            key={faculty.id}
            className={`rounded-lg p-4 border border-slate-700 transition-all ${
              index < 3 ? 'bg-gradient-to-r from-yellow-950/20 to-slate-800/40 border-yellow-600/30' : 'bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-2xl font-black">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </span>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                  style={{ backgroundColor: faculty.colorPrimary }}
                >
                  {faculty.abbreviation}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-bold text-sm truncate">{faculty.name}</p>
                  <p className="text-xs text-gray-500">{faculty.played} matches</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                  {faculty.points}
                </p>
                <p className="text-xs text-gray-500">pts</p>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              <div>
                <p className="text-gray-500 text-xs">W</p>
                <p className="text-green-400 font-bold text-lg">{faculty.won}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">D</p>
                <p className="text-yellow-400 font-bold text-lg">{faculty.drawn}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">L</p>
                <p className="text-red-400 font-bold text-lg">{faculty.lost}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">GF</p>
                <p className="text-blue-400 font-bold">{faculty.goalsFor}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">GD</p>
                <p
                  className={`font-bold ${
                    faculty. goalDifference > 0 ? 'text-green-400' : faculty.goalDifference < 0 ? 'text-red-400' : 'text-gray-400'
                  }`}
                >
                  {faculty.goalDifference > 0 ? '+' : ''}
                  {faculty.goalDifference}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// RECENT RESULTS CARD
// ============================================
function RecentResultCard({ match, category }: { match: Match; category: 'men' | 'women' }) {
  const homeWon = match.scoreHome > match.scoreAway;
  const awayWon = match. scoreAway > match.scoreHome;
  const isDraw = match.scoreHome === match. scoreAway;

  const getBgGradient = () => {
    if (homeWon) return 'from-green-950/30 to-slate-900/30 border-green-500/20';
    if (awayWon) return 'from-red-950/30 to-slate-900/30 border-red-500/20';
    return 'from-yellow-950/30 to-slate-900/30 border-yellow-500/20';
  };

  return (
    <div className={`bg-gradient-to-r ${getBgGradient()} rounded-lg md:rounded-xl p-3 sm:p-4 md:p-5 border border-slate-700 hover:border-slate-600 transition-all`}>
      {/* Mobile Layout - Stacked */}
      <div className="md:hidden space-y-3">
        {/* Date and Badge Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs sm:text-sm font-bold text-gray-400 whitespace-nowrap">
            {new Date(match.finishedAt || match.matchDate).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: '2-digit'
            })}
          </span>
          <ImportanceBadge importance={match. importance} />
        </div>

        {/* Score Display - Centered */}
        <div className="bg-slate-900/50 rounded-lg p-4 text-center space-y-2">
          {/* Home Team */}
          <div className="flex items-center justify-center gap-2">
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: match.homeFaculty.colorPrimary }}
            >
              {match.homeFaculty.abbreviation}
            </div>
            <span className={`text-xs sm:text-sm font-bold truncate flex-1 ${homeWon ? 'text-white' : 'text-gray-400'}`}>
              {match.homeFaculty.name}
            </span>
          </div>

          {/* Score */}
          <div className="flex items-center justify-center gap-2 py-2">
            <span className={`text-2xl sm:text-3xl font-black ${homeWon ? 'text-green-400' : 'text-gray-300'}`}>
              {match.scoreHome}
            </span>
            <span className="text-gray-500 font-bold">−</span>
            <span className={`text-2xl sm:text-3xl font-black ${awayWon ? 'text-green-400' : 'text-gray-300'}`}>
              {match.scoreAway}
            </span>
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-center gap-2">
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: match. awayFaculty.colorPrimary }}
            >
              {match.awayFaculty.abbreviation}
            </div>
            <span className={`text-xs sm:text-sm font-bold truncate flex-1 ${awayWon ? 'text-white' : 'text-gray-400'}`}>
              {match.awayFaculty.name}
            </span>
          </div>
        </div>

        {/* Result Badge */}
        <span
          className={`block text-center px-3 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap ${
            isDraw
              ? 'bg-yellow-500/20 text-yellow-400'
              : homeWon
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          }`}
        >
          {isDraw ? '🤝 Draw' : homeWon ? `✓ ${match.homeFaculty.abbreviation} Won` : `✓ ${match.awayFaculty.abbreviation} Won`}
        </span>
      </div>

      {/* Tablet & Desktop Layout - Horizontal */}
      <div className="hidden md:flex md:items-center md:justify-between md:gap-4 md:flex-wrap lg:flex-nowrap">
        {/* Date and Badge */}
        <div className="flex items-center gap-3 min-w-max">
          <span className="text-sm font-bold text-gray-400 whitespace-nowrap">
            {new Date(match.finishedAt || match.matchDate).toLocaleDateString('en-US', { 
              month: 'short', 
              day:  'numeric'
            })}
          </span>
          <ImportanceBadge importance={match.importance} />
        </div>

        {/* Home Team */}
        <div className="flex items-center gap-2 min-w-0 flex-1 lg:flex-none">
          <div
            className="w-8 h-8 lg:w-10 lg:h-10 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: match.homeFaculty. colorPrimary }}
          >
            {match.homeFaculty.abbreviation}
          </div>
          <span className={`text-sm lg:text-base font-bold truncate ${homeWon ? 'text-white' : 'text-gray-400'}`}>
            {match.homeFaculty.name}
          </span>
        </div>

        {/* Score */}
        <div className="flex items-center justify-center gap-2 min-w-max order-3 md:order-none">
          <span className={`text-xl lg:text-2xl font-black tabular-nums ${homeWon ?  'text-green-400' : 'text-gray-300'}`}>
            {match.scoreHome}
          </span>
          <span className="text-gray-500 font-bold">−</span>
          <span className={`text-xl lg:text-2xl font-black tabular-nums ${awayWon ? 'text-green-400' : 'text-gray-300'}`}>
            {match.scoreAway}
          </span>
        </div>

        {/* Away Team */}
        <div className="flex items-center gap-2 min-w-0 flex-1 lg:flex-none">
          <span className={`text-sm lg:text-base font-bold truncate ${awayWon ?  'text-white' : 'text-gray-400'}`}>
            {match.awayFaculty.name}
          </span>
          <div
            className="w-8 h-8 lg:w-10 lg:h-10 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: match.awayFaculty.colorPrimary }}
          >
            {match.awayFaculty. abbreviation}
          </div>
        </div>

        {/* Result Badge */}
        <span
          className={`px-3 py-1 lg:px-4 lg:py-2 rounded-lg text-xs lg:text-sm font-bold whitespace-nowrap min-w-max ${
            isDraw
              ? 'bg-yellow-500/20 text-yellow-400'
              : homeWon
              ? 'bg-green-500/20 text-green-400'
              :  'bg-red-500/20 text-red-400'
          }`}
        >
          {isDraw ? 'Draw' : homeWon ?  `${match.homeFaculty.abbreviation} Win` : `${match.awayFaculty.abbreviation} Win`}
        </span>
      </div>
    </div>
  );
}
// ============================================
// MAIN CONTROL CENTER COMPONENT
// ============================================
export default function ControlCenterDashboard() {
  const [activeTab, setActiveTab] = useState<'men' | 'women'>('men');
  const [data, setData] = useState<AdminData | null>(null);
  const [userName, setUserName] = useState<string>('Admin');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both men's and women's data in parallel
        const [menRes, womenRes] = await Promise.all([
          fetch('/api2/home-data', { method: 'GET', headers: { 'Content-Type': 'application/json' } }),
          fetch('/api2/women-data', { method: 'GET', headers: { 'Content-Type': 'application/json' } }),
        ]);

        if (!menRes.ok || !womenRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const [menData, womenData] = await Promise.all([menRes.json(), womenRes.json()]);

        setData({
          men: menData,
          women: womenData,
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-black text-white mb-2">Loading Dashboard</h2>
          <p className="text-gray-400 font-semibold">Fetching men's and women's data...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-2">Error Loading Data</h2>
          <p className="text-gray-400 font-semibold mb-6">{error || 'Failed to load dashboard data'}</p>
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

  const currentData = data[activeTab];
  const categoryColor = activeTab === 'men' ? 'blue' : 'pink';
  const categoryEmoji = activeTab === 'men' ? '👨' : '👩';

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-4xl font-black text-white mb-2">Welcome Back, {userName || 'Admin'}!   👋</h1>
        <p className="text-gray-400 font-semibold">Manage sports tournaments for both men's and women's categories</p>
      </div>

      {/* Category Tabs */}
      <CategoryTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total Matches"
          value={currentData. stats.totalMatches}
          icon={BarChart3}
          gradient={`bg-gradient-to-br from-${categoryColor}-950 to-${categoryColor}-900 rounded-xl p-6 border border-${categoryColor}-500/30`}
          subtext="Competitive only"
        />
        <StatCard
          label="Live Now"
          value={currentData. liveMatches. length}
          icon={Zap}
          gradient={`bg-gradient-to-br from-red-950 to-red-900 rounded-xl p-6 border border-red-500/30`}
          subtext="Active matches"
        />
        <StatCard
          label="Upcoming"
          value={currentData. upcomingMatches.length}
          icon={Calendar}
          gradient={`bg-gradient-to-br from-orange-950 to-orange-900 rounded-xl p-6 border border-orange-500/30`}
          subtext="Scheduled"
        />
        <StatCard
          label="Total Goals"
          value={currentData. stats.totalGoals}
          icon={Flame}
          gradient={`bg-gradient-to-br from-yellow-950 to-yellow-900 rounded-xl p-6 border border-yellow-500/30`}
          subtext="This season"
        />
        <StatCard
          label="Avg Goals/Match"
          value={currentData.stats.avgGoals}
          icon={TrendingUp}
          gradient={`bg-gradient-to-br from-green-950 to-green-900 rounded-xl p-6 border border-green-500/30`}
          subtext="Per game"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/control-center/matches/new"
          className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl p-6 border border-blue-500/30 transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <Calendar size={24} className="text-blue-200" />
            <h3 className="text-lg font-black text-white">Schedule Match</h3>
          </div>
          <p className="text-blue-200 text-sm font-semibold">Create a new match</p>
        </Link>

        <Link
          href="/control-center/scores"
          className="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl p-6 border border-green-500/30 transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <Trophy size={24} className="text-green-200" />
            <h3 className="text-lg font-black text-white">Update Scores</h3>
          </div>
          <p className="text-green-200 text-sm font-semibold">Edit live matches</p>
        </Link>

        <Link
          href="/control-center/faculties/new"
          className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-xl p-6 border border-purple-500/30 transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <Users size={24} className="text-purple-200" />
            <h3 className="text-lg font-black text-white">Add Faculty</h3>
          </div>
          <p className="text-purple-200 text-sm font-semibold">Register new faculty</p>
        </Link>
      </div>

      {/* Live Matches Section */}
      {currentData.liveMatches.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Zap size={28} className={activeTab === 'men' ? 'text-red-500' :  'text-pink-500'} />
            {categoryEmoji} Live Matches
          </h2>
          <div className="grid grid-cols-1 md: grid-cols-2 gap-4">
            {currentData. liveMatches.map((match) => (
              <LiveMatchCard key={match.id} match={match} category={activeTab} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Matches Section */}
      {currentData.upcomingMatches.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Calendar size={28} className="text-orange-500" />
            {categoryEmoji} Upcoming Matches
          </h2>
          <div className="space-y-3">
            {currentData.upcomingMatches.map((match) => (
              <div key={match.id} className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-all">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 whitespace-nowrap">
                      {new Date(match.matchDate).toLocaleDateString()} {new Date(match.matchDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <ImportanceBadge importance={match. importance} />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: match.homeFaculty. colorPrimary }}
                    >
                      {match.homeFaculty.abbreviation}
                    </div>
                    <span className="text-white font-bold text-sm hidden sm:inline">{match.homeFaculty. name}</span>
                    <span className="text-gray-500">vs</span>
                    <span className="text-white font-bold text-sm hidden sm:inline">{match.awayFaculty.name}</span>
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: match.awayFaculty.colorPrimary }}
                    >
                      {match.awayFaculty.abbreviation}
                    </div>
                  </div>
                  <Link href={`/control-center/matches/${match.id}`} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm font-bold transition">
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Results Section */}
      {currentData.recentMatches.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <TrendingUp size={28} className="text-green-500" />
            {categoryEmoji} Recent Results
          </h2>
          <div className="space-y-3">
            {currentData.recentMatches.map((match) => (
              <RecentResultCard key={match.id} match={match} category={activeTab} />
            ))}
          </div>
        </div>
      )}

      {/* Standings Section */}
      {currentData.standings.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Trophy size={28} className="text-yellow-500" />
            {categoryEmoji} Championship Standings
          </h2>
          <p className="text-gray-400 text-sm font-semibold">Competitive matches only • Updated live</p>
          <StandingsTable standings={currentData. standings} category={activeTab} />
        </div>
      )}

      {/* Footer Spacing */}
      <div className="h-12"></div>
    </div>
  );
}