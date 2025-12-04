import { getFaculty } from '@/lib/actions/faculties';
import { FacultyForm } from '@/app/control-center/components/faculty-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function EditFacultyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const facultyId = parseInt(id, 10);

  if (isNaN(facultyId)) {
    return <div className="text-red-400 font-bold text-lg">❌ Invalid faculty ID</div>;
  }

  const facultyData = await getFaculty(facultyId);

  if (! facultyData) {
    return (
      <div className="text-red-400 font-bold text-lg">
        ❌ Faculty not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href={`/control-center/faculties/${facultyId}`}
        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold"
      >
        <ArrowLeft size={20} />
        Back
      </Link>

      <div>
        <h1 className="text-3xl font-black text-white mb-2">Edit Faculty</h1>
        <p className="text-gray-400 font-semibold">Update faculty information</p>
      </div>

      <FacultyForm initialData={facultyData} isEditing={true} />
    </div>
  );
}