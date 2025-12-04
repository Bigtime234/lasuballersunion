import { getFaculty } from '@/lib/actions/faculties';
import Link from 'next/link';
import { ArrowLeft, Trophy, Target, Activity } from 'lucide-react';

export default async function FacultyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const facultyId = parseInt(id, 10);

  if (isNaN(facultyId)) {
    return <div className="text-red-400 font-bold text-lg">❌ Invalid faculty ID</div>;
  }

  const faculty = await getFaculty(facultyId);

  if (!faculty) {
    return (
      <div className="text-red-400 font-bold text-lg">
        ❌ Faculty not found
      </div>
    );
  }

  const winRate = faculty.played > 0 ? ((faculty.won / faculty.played) * 100). toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <Link
        href="/control-center/faculties"
        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold"
      >
        <ArrowLeft size={20} />
        Back to Faculties
      </Link>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-4xl font-black shadow-lg"
            style={{ backgroundColor: faculty.colorPrimary }}
          >
            {faculty.abbreviation}
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-black text-white mb-2">{faculty.name}</h1>
            <div className="flex flex-wrap gap-4">
              <div>
                <p className="text-gray-400 text-sm font-bold uppercase">Points</p>
                <p className="text-3xl font-black text-blue-400">{faculty.points}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm font-bold uppercase">Win Rate</p>
                <p className="text-3xl font-black text-green-400">{winRate}%</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm font-bold uppercase">Current Streak</p>
                <p className="text-3xl font-black text-yellow-400">
                  {faculty.currentStreak}W
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 pb-8 border-b border-slate-700">
          <div className="bg-slate-800/50 rounded-xl p-4">
            <p className="text-gray-400 text-sm font-bold uppercase mb-2">Matches Played</p>
            <p className="text-3xl font-black text-white">{faculty.played}</p>
          </div>
          <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30">
            <p className="text-green-400 text-sm font-bold uppercase mb-2">Wins</p>
            <p className="text-3xl font-black text-green-400">{faculty.won}</p>
          </div>
          <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/30">
            <p className="text-yellow-400 text-sm font-bold uppercase mb-2">Draws</p>
            <p className="text-3xl font-black text-yellow-400">{faculty.drawn}</p>
          </div>
          <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30">
            <p className="text-red-400 text-sm font-bold uppercase mb-2">Losses</p>
            <p className="text-3xl font-black text-red-400">{faculty.lost}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 rounded-xl p-4">
            <p className="text-gray-400 text-sm font-bold uppercase mb-2 flex items-center gap-1">
              <Target size={16} />
              Goals For
            </p>
            <p className="text-3xl font-black text-blue-400">{faculty.goalsFor}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4">
            <p className="text-gray-400 text-sm font-bold uppercase mb-2 flex items-center gap-1">
              <Activity size={16} />
              Goals Against
            </p>
            <p className="text-3xl font-black text-red-400">{faculty.goalsAgainst}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4">
            <p className="text-gray-400 text-sm font-bold uppercase mb-2">Goal Difference</p>
            <p
              className={`text-3xl font-black ${
                faculty.goalDifference > 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {faculty.goalDifference > 0 ? '+' : ''}{faculty.goalDifference}
            </p>
          </div>
        </div>

        {(faculty.championshipsWon > 0 || faculty. runnerUpCount > 0 || faculty.thirdPlaceCount > 0) && (
          <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b border-slate-700">
            <div className="text-center">
              <p className="text-2xl mb-1">🥇</p>
              <p className="text-gray-400 text-sm font-bold">Championships</p>
              <p className="text-2xl font-black text-yellow-400">{faculty.championshipsWon}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl mb-1">🥈</p>
              <p className="text-gray-400 text-sm font-bold">Runner Up</p>
              <p className="text-2xl font-black text-gray-400">{faculty.runnerUpCount}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl mb-1">🥉</p>
              <p className="text-gray-400 text-sm font-bold">Third Place</p>
              <p className="text-2xl font-black text-orange-400">{faculty.thirdPlaceCount}</p>
            </div>
          </div>
        )}

        <Link
          href={`/control-center/faculties/${faculty.id}/edit`}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-bold transition-all inline-block"
        >
          Edit Faculty
        </Link>
      </div>
    </div>
  );
}