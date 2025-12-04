import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { FacultyForm } from '@/app/control-center/components/faculty-form';

export default function CreateFacultyPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/control-center/faculties"
        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold"
      >
        <ArrowLeft size={20} />
        Back to Faculties
      </Link>

      <div>
        <h1 className="text-3xl font-black text-white mb-2">Register New Faculty</h1>
        <p className="text-gray-400 font-semibold">Add a new faculty to your sports management system</p>
      </div>

      <FacultyForm />
    </div>
  );
}