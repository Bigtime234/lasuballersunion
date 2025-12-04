import { db } from '@/server';
import Link from 'next/link';
import { Plus, Trophy, Users as UsersIcon } from 'lucide-react';
import { desc } from 'drizzle-orm';

export default async function FacultiesPage() {
  const allFaculties = await db.query.faculties.findMany({
    orderBy: (faculties, { desc }) => [desc(faculties.points)],
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Manage Faculties</h1>
          <p className="text-gray-400 font-semibold flex items-center gap-2">
            <UsersIcon size={18} />
            {allFaculties.length} faculties registered
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

      {/* Faculties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allFaculties.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700">
            <p className="text-gray-400 font-semibold mb-4">No faculties added yet</p>
            <Link
              href="/control-center/faculties/new"
              className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-all"
            >
              Create First Faculty
            </Link>
          </div>
        ) : (
          allFaculties.map((fac, index) => (
            <div
              key={fac.id}
              className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all hover:shadow-xl"
            >
              {/* Rank Badge */}
              <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-black shadow-lg">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
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
                  <p className="text-2xl font-black text-white">{fac. played}</p>
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
                  href={`/control-center/faculties/${fac.id}`}
                  className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-bold transition"
                >
                  View
                </Link>
                <Link
                  href={`/control-center/faculties/${fac.id}/edit`}
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}