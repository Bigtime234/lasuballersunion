import { db } from '@/server';
import { MatchForm } from '@/app/control-center/components/match-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function CreateMatchPage() {
  const allFaculties = await db.query. faculties.findMany({
    orderBy: (faculties, { asc }) => [asc(faculties.name)],
  });
  const allSeasons = await db.query.seasons.findMany({
    orderBy: (seasons, { desc }) => [desc(seasons.startDate)],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/control-center/matches"
          className="p-2 hover:bg-slate-800 rounded-lg transition"
        >
          <ArrowLeft size={24} className="text-gray-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-white">Schedule New Match</h1>
          <p className="text-gray-400 font-semibold mt-1">Fill in the details below</p>
        </div>
      </div>

      <MatchForm faculties={allFaculties} seasons={allSeasons} />
    </div>
  );
}