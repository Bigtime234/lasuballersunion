"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFacultySchema, type CreateFacultyInput } from '@/Types/faculties';
import { createFaculty, updateFaculty } from '@/lib/actions/faculties';
import { AlertCircle, Loader } from 'lucide-react';

interface FacultyFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export function FacultyForm({ initialData, isEditing = false }: FacultyFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [previewColor, setPreviewColor] = useState(initialData?.colorPrimary || '#3B82F6');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<any>({
    resolver: zodResolver(createFacultySchema),
    defaultValues: initialData || {
      name: '',
      abbreviation: '',
      colorPrimary: '#3B82F6',
      colorSecondary: '#1E40AF',
      logo: '',
    },
  });

  const colorPrimary = watch('colorPrimary');
  const abbreviation = watch('abbreviation');

  React.useEffect(() => {
    setPreviewColor(colorPrimary);
  }, [colorPrimary]);

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      setServerError('');

      let result;
      if (isEditing && initialData) {
        result = await updateFaculty(initialData.id, data);
      } else {
        result = await createFaculty(data);
      }

      if (result. error) {
        setServerError(result.error);
        return;
      }

      router.push('/control-center/faculties');
      router.refresh();
    } catch (error: any) {
      setServerError(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-linear-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700 max-w-2xl">
      
      {/* Error Alert */}
      {serverError && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
          <p className="text-red-400 font-bold">{serverError}</p>
        </div>
      )}

      {/* Faculty Name */}
      <div>
        <label className="block text-sm font-bold text-gray-300 mb-2">Faculty Name</label>
        <input
          type="text"
          placeholder="e.g., Faculty of Science"
          {...register('name')}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
        />
        {errors. name && (
          <p className="text-red-400 text-sm mt-1">{errors.name.message as string}</p>
        )}
      </div>

      {/* Abbreviation */}
      <div>
        <label className="block text-sm font-bold text-gray-300 mb-2">Abbreviation</label>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="e.g., SCI"
            maxLength={5}
            {...register('abbreviation')}
            className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition uppercase"
          />
          {abbreviation && (
            <div
              className="w-16 h-12 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg"
              style={{ backgroundColor: previewColor }}
            >
              {abbreviation}
            </div>
          )}
        </div>
        {errors. abbreviation && (
          <p className="text-red-400 text-sm mt-1">{errors.abbreviation.message as string}</p>
        )}
      </div>

      {/* Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">Primary Color</label>
          <div className="flex gap-3">
            <input
              type="color"
              {... register('colorPrimary')}
              className="w-16 h-12 rounded-lg cursor-pointer border border-slate-600"
            />
            <input
              type="text"
              {... register('colorPrimary')}
              placeholder="#000000"
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white font-mono focus:border-blue-500 outline-none transition"
            />
          </div>
          {errors.colorPrimary && (
            <p className="text-red-400 text-sm mt-1">{errors.colorPrimary.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">Secondary Color</label>
          <div className="flex gap-3">
            <input
              type="color"
              {...register('colorSecondary')}
              className="w-16 h-12 rounded-lg cursor-pointer border border-slate-600"
            />
            <input
              type="text"
              {...register('colorSecondary')}
              placeholder="#000000"
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white font-mono focus:border-blue-500 outline-none transition"
            />
          </div>
          {errors.colorSecondary && (
            <p className="text-red-400 text-sm mt-1">{errors.colorSecondary.message as string}</p>
          )}
        </div>
      </div>

      {/* Logo URL (Optional) */}
      <div>
        <label className="block text-sm font-bold text-gray-300 mb-2">Logo URL (Optional)</label>
        <input
          type="url"
          placeholder="https://example.com/logo.png"
          {...register('logo')}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
        />
        {errors. logo && (
          <p className="text-red-400 text-sm mt-1">{errors.logo.message as string}</p>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4 pt-6 border-t border-slate-700">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-lg font-bold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ?  (
            <>
              <Loader size={20} className="animate-spin" />
              Processing...
            </>
          ) : (
            isEditing ? 'Update Faculty' : 'Create Faculty'
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}