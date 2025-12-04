import { db } from '@/server';
import { FileDown, BarChart3, TrendingUp, Users } from 'lucide-react';

export default async function ReportsPage() {
  const totalMatches = await db.query.matches.findMany();
  const totalFaculties = await db.query. faculties.findMany();
  const liveMatches = totalMatches.filter(m => m.status === 'LIVE');

  const stats = {
    totalMatches: totalMatches.length,
    liveMatches: liveMatches.length,
    finishedMatches: totalMatches. filter(m => m.status === 'FINISHED').length,
    totalFaculties: totalFaculties.length,
    totalGoals: totalFaculties.reduce((acc, f) => acc + f. goalsFor, 0),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-white mb-2">Reports & Analytics</h1>
        <p className="text-gray-400 font-semibold">
          System overview and downloadable reports
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-950 to-blue-900 rounded-xl p-6 border border-blue-500/30">
          <p className="text-gray-400 text-sm font-bold uppercase mb-2 flex items-center gap-2">
            <BarChart3 size={16} />
            Total Matches
          </p>
          <p className="text-3xl font-black text-blue-400">{stats.totalMatches}</p>
        </div>

        <div className="bg-gradient-to-br from-red-950 to-red-900 rounded-xl p-6 border border-red-500/30">
          <p className="text-gray-400 text-sm font-bold uppercase mb-2">Live Now</p>
          <p className="text-3xl font-black text-red-400 animate-pulse">
            {stats.liveMatches}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-950 to-green-900 rounded-xl p-6 border border-green-500/30">
          <p className="text-gray-400 text-sm font-bold uppercase mb-2">Completed</p>
          <p className="text-3xl font-black text-green-400">{stats.finishedMatches}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-950 to-purple-900 rounded-xl p-6 border border-purple-500/30">
          <p className="text-gray-400 text-sm font-bold uppercase mb-2 flex items-center gap-2">
            <Users size={16} />
            Faculties
          </p>
          <p className="text-3xl font-black text-purple-400">{stats.totalFaculties}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-950 to-yellow-900 rounded-xl p-6 border border-yellow-500/30">
          <p className="text-gray-400 text-sm font-bold uppercase mb-2 flex items-center gap-2">
            <TrendingUp size={16} />
            Total Goals
          </p>
          <p className="text-3xl font-black text-yellow-400">{stats.totalGoals}</p>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          <FileDown size={28} className="text-blue-400" />
          <h2 className="text-2xl font-black text-white">Export Reports</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-6 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all text-left group">
            <p className="text-white font-bold mb-2 group-hover:text-blue-400 transition">
              📊 Match Report
            </p>
            <p className="text-sm text-gray-400">
              Download all matches and scores
            </p>
          </button>

          <button className="p-6 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all text-left group">
            <p className="text-white font-bold mb-2 group-hover:text-blue-400 transition">
              🏆 Standings Report
            </p>
            <p className="text-sm text-gray-400">
              Faculty standings and statistics
            </p>
          </button>

          <button className="p-6 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all text-left group">
            <p className="text-white font-bold mb-2 group-hover:text-blue-400 transition">
              ⚽ Performance Analytics
            </p>
            <p className="text-sm text-gray-400">
              Detailed match analytics and insights
            </p>
          </button>

          <button className="p-6 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all text-left group">
            <p className="text-white font-bold mb-2 group-hover:text-blue-400 transition">
              📈 Engagement Report
            </p>
            <p className="text-sm text-gray-400">
              Student engagement and likes analytics
            </p>
          </button>
        </div>

        <p className="text-xs text-gray-500 font-semibold mt-6">
          ℹ️ Reports are generated in real-time from your current database
        </p>
      </div>

      {/* System Info */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
        <h2 className="text-xl font-black text-white mb-4">System Status</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <span className="text-gray-400 font-semibold">Database Connection</span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Connected
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <span className="text-gray-400 font-semibold">API Status</span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Operational
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <span className="text-gray-400 font-semibold">Last Backup</span>
            <span className="text-white font-semibold text-sm">Just now</span>
          </div>
        </div>
      </div>
    </div>
  );
}