'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createMatchSchema, type CreateMatchInput } from '@/Types/matches';
import { createMatch, updateMatch } from '@/lib/actions/matches';
import { Calendar, MapPin, AlertCircle, Loader } from 'lucide-react';

interface MatchFormProps {
  faculties: Array<{ id: number; name: string; abbreviation: string }>;
  seasons?: Array<{ id: number; name: string }>;
  initialData?: any;
  isEditing?: boolean;
}

export function MatchForm({ faculties, seasons = [], initialData, isEditing = false }: MatchFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<any>({
    resolver: zodResolver(createMatchSchema),
    defaultValues: initialData || {
      homeFacultyId: undefined,
      awayFacultyId: undefined,
      category: 'men',
      matchDate: '',
      venue: '',
      seasonId: undefined,
      importance: '',
      notes: '',
    },
  });

  const homeFacultyId = watch('homeFacultyId');
  const awayFacultyId = watch('awayFacultyId');

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      setServerError('');

      let result;
      if (isEditing && initialData) {
        result = await updateMatch(initialData.id, data);
      } else {
        result = await createMatch(data);
      }

      if (result.error) {
        setServerError(result.error);
        return;
      }

      router.push('/control-center/matches');
      router.refresh();
    } catch (error: any) {
      setServerError(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
      
      {/* Error Alert */}
      {serverError && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-bold">{serverError}</p>
          </div>
        </div>
      )}

      {/* Home & Away Faculties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">Home Faculty</label>
          <select
            {...register('homeFacultyId', { valueAsNumber: true })}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
          >
            <option value="">Select home faculty</option>
            {faculties.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.abbreviation})
              </option>
            ))}
          </select>
          {errors.homeFacultyId && (
            <p className="text-red-400 text-sm mt-1">{errors.homeFacultyId.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">Away Faculty</label>
          <select
            {...register('awayFacultyId', { valueAsNumber: true })}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
          >
            <option value="">Select away faculty</option>
            {faculties.map((f) => (
              <option key={f.id} value={f.id} disabled={f.id === homeFacultyId}>
                {f.name} ({f.abbreviation})
              </option>
            ))}
          </select>
          {errors.awayFacultyId && (
            <p className="text-red-400 text-sm mt-1">{errors.awayFacultyId.message as string}</p>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-bold text-gray-300 mb-2">Category</label>
        <div className="flex gap-4">
          {(['men', 'women'] as const).map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value={cat}
                {...register('category')}
                className="w-4 h-4 accent-blue-500"
              />
              <span className="text-gray-300 capitalize font-semibold">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Match Date & Time */}
      <div>
        <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
          <Calendar size={16} />
          Match Date & Time
        </label>
        <input
          type="datetime-local"
          {...register('matchDate')}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
        />
        {errors.matchDate && (
          <p className="text-red-400 text-sm mt-1">{errors.matchDate.message as string}</p>
        )}
      </div>

      {/* Venue */}
      <div>
        <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
          <MapPin size={16} />
          Venue
        </label>
        <input
          type="text"
          placeholder="e.g., Main Field, Sports Complex"
          {...register('venue')}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
        />
        {errors.venue && (
          <p className="text-red-400 text-sm mt-1">{errors.venue.message as string}</p>
        )}
      </div>

      {/* Season (Optional) */}
      {seasons.length > 0 && (
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">Season (Optional)</label>
          <select
            {...register('seasonId', { valueAsNumber: true })}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
          >
            <option value="">Select season</option>
            {seasons.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Importance */}
      <div>
        <label className="block text-sm font-bold text-gray-300 mb-2">Importance (Optional)</label>
        <select
          {...register('importance')}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
        >
          <option value="">Select importance</option>
          <option value="Friendly">Friendly</option>
          <option value="League">League</option>
          <option value="Cup">Cup</option>
          <option value="Finals">Finals</option>
        </select>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-bold text-gray-300 mb-2">Notes (Optional)</label>
        <textarea
          placeholder="Any additional notes about this match..."
          {...register('notes')}
          rows={4}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition resize-none"
        />
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-bold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader size={20} className="animate-spin" />
              Processing...
            </>
          ) : (
            isEditing ? 'Update Match' : 'Create Match'
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