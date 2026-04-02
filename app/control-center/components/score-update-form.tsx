'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateScoreSchema, type UpdateScoreInput } from '@/Types/matches';
import { updateMatchScore } from '@/lib/actions/matches';
import { AlertCircle, Loader, Play, CheckCircle2 } from 'lucide-react';

interface ScoreUpdateFormProps {
  matchId: number;
  initialData: {
    scoreHome: number;
    scoreAway: number;
    matchMinute: number;
    status: 'PENDING' | 'LIVE' | 'FINISHED';
    homeFaculty: { name: string; abbreviation: string; colorPrimary: string };
    awayFaculty: { name: string; abbreviation: string; colorPrimary: string };
  };
}

export function ScoreUpdateForm({ matchId, initialData }: ScoreUpdateFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<UpdateScoreInput>({
    resolver: zodResolver(updateScoreSchema),
    defaultValues: {
      scoreHome: initialData.scoreHome,
      scoreAway: initialData.scoreAway,
      matchMinute: initialData.matchMinute,
      status: initialData.status,
    },
  });

  const scoreHome = watch('scoreHome');
  const scoreAway = watch('scoreAway');
  const status = watch('status');

  const onSubmit = async (data: UpdateScoreInput) => {
    try {
      setIsSubmitting(true);
      setServerError('');
      const result = await updateMatchScore(matchId, data);
      if (result.error) {
        setServerError(result.error);
        return;
      }
      // ✅ Removed router.refresh() after push — revalidatePath handles this
      router.push('/control-center/scores');
    } catch (error: any) {
      setServerError(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickIncrease = (team: 'home' | 'away') => {
    if (team === 'home') setValue('scoreHome', scoreHome + 1);
    else setValue('scoreAway', scoreAway + 1);
  };

  const quickDecrease = (team: 'home' | 'away') => {
    if (team === 'home' && scoreHome > 0) setValue('scoreHome', scoreHome - 1);
    else if (team === 'away' && scoreAway > 0) setValue('scoreAway', scoreAway - 1);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">

      {/* Error Alert */}
      {serverError && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 font-bold text-sm">{serverError}</p>
        </div>
      )}

      {/* Status Badge */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-700">
        <span className="text-gray-400 font-semibold text-sm">Status</span>
        <span className={`px-3 py-1 rounded-lg font-bold text-xs ${
          status === 'PENDING' ? 'bg-gray-500/20 text-gray-400' :
          status === 'LIVE' ? 'bg-red-500/20 text-red-400 animate-pulse' :
          'bg-green-500/20 text-green-400'
        }`}>
          {status}
        </span>
      </div>

      {/* ✅ Score Section — stacks vertically on mobile, side by side on desktop */}
      <div className="bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden">

        {/* VS Header */}
        <div className="flex items-center justify-center gap-3 py-3 border-b border-slate-700 bg-slate-800/40">
          <TeamBadge faculty={initialData.homeFaculty} />
          <span className="text-slate-500 font-black text-sm">VS</span>
          <TeamBadge faculty={initialData.awayFaculty} />
        </div>

        {/* Score Controls */}
        <div className="flex items-stretch divide-x divide-slate-700">

          {/* Home Score */}
          <div className="flex-1 p-4 sm:p-6 space-y-3">
            <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Home</p>
            <p
              className="text-center text-sm font-black truncate"
              style={{ color: initialData.homeFaculty.colorPrimary }}
            >
              {initialData.homeFaculty.abbreviation}
            </p>
            <input
              type="number"
              {...register('scoreHome', { valueAsNumber: true })}
              className="w-full text-5xl sm:text-6xl font-black text-center bg-slate-800 border-2 border-slate-600 rounded-xl text-white focus:border-blue-500 outline-none transition py-3 leading-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => quickDecrease('home')}
                disabled={scoreHome === 0}
                className="flex-1 py-3 sm:py-4 bg-red-500/20 hover:bg-red-500/30 active:bg-red-500/50 disabled:opacity-30 disabled:cursor-not-allowed text-red-400 rounded-xl font-black text-xl transition touch-manipulation"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => quickIncrease('home')}
                className="flex-1 py-3 sm:py-4 bg-green-500/20 hover:bg-green-500/30 active:bg-green-500/50 text-green-400 rounded-xl font-black text-xl transition touch-manipulation"
              >
                +
              </button>
            </div>
            {errors.scoreHome && (
              <p className="text-red-400 text-xs text-center">{errors.scoreHome.message}</p>
            )}
          </div>

          {/* Away Score */}
          <div className="flex-1 p-4 sm:p-6 space-y-3">
            <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Away</p>
            <p
              className="text-center text-sm font-black truncate"
              style={{ color: initialData.awayFaculty.colorPrimary }}
            >
              {initialData.awayFaculty.abbreviation}
            </p>
            <input
              type="number"
              {...register('scoreAway', { valueAsNumber: true })}
              className="w-full text-5xl sm:text-6xl font-black text-center bg-slate-800 border-2 border-slate-600 rounded-xl text-white focus:border-blue-500 outline-none transition py-3 leading-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => quickDecrease('away')}
                disabled={scoreAway === 0}
                className="flex-1 py-3 sm:py-4 bg-red-500/20 hover:bg-red-500/30 active:bg-red-500/50 disabled:opacity-30 disabled:cursor-not-allowed text-red-400 rounded-xl font-black text-xl transition touch-manipulation"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => quickIncrease('away')}
                className="flex-1 py-3 sm:py-4 bg-green-500/20 hover:bg-green-500/30 active:bg-green-500/50 text-green-400 rounded-xl font-black text-xl transition touch-manipulation"
              >
                +
              </button>
            </div>
            {errors.scoreAway && (
              <p className="text-red-400 text-xs text-center">{errors.scoreAway.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Match Minute */}
      <div className="bg-slate-900 rounded-2xl border border-slate-700 p-4 sm:p-6 space-y-3">
        <label className="block text-sm font-bold text-gray-300">Match Minute</label>
        <input
          type="number"
          {...register('matchMinute', { valueAsNumber: true })}
          className="w-full text-4xl font-black text-center bg-slate-800 border-2 border-slate-600 rounded-xl text-white focus:border-blue-500 outline-none transition py-3"
        />
        {/* ✅ Quick minute buttons — 2x2 grid on mobile, row on desktop */}
        <div className="grid grid-cols-4 gap-2">
          {[45, 60, 75, 90].map((min) => (
            <button
              key={min}
              type="button"
              onClick={() => setValue('matchMinute', min)}
              className="py-3 bg-blue-500/20 hover:bg-blue-500/30 active:bg-blue-500/50 text-blue-400 rounded-xl font-bold text-sm transition touch-manipulation"
            >
              {min}'
            </button>
          ))}
        </div>
        {errors.matchMinute && (
          <p className="text-red-400 text-sm">{errors.matchMinute.message}</p>
        )}
      </div>

      {/* Status Control */}
      <div className="bg-slate-900 rounded-2xl border border-slate-700 p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-gray-300">Match Status</h3>
        {/* ✅ Full width tappable buttons — easy to hit on Android */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {(['PENDING', 'LIVE', 'FINISHED'] as const).map((stat) => (
            <button
              key={stat}
              type="button"
              onClick={() => setValue('status', stat)}
              className={`py-4 sm:py-3 px-2 rounded-xl font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm touch-manipulation ${
                status === stat
                  ? stat === 'PENDING'
                    ? 'bg-gray-500 text-white border-2 border-gray-400'
                    : stat === 'LIVE'
                    ? 'bg-red-500 text-white border-2 border-red-400 shadow-lg shadow-red-500/30'
                    : 'bg-green-500 text-white border-2 border-green-400'
                  : 'bg-slate-800 text-gray-400 border-2 border-slate-700 hover:border-slate-500'
              }`}
            >
              {stat === 'PENDING' && <div className="w-2 h-2 bg-current rounded-full" />}
              {stat === 'LIVE' && <Play size={14} />}
              {stat === 'FINISHED' && <CheckCircle2 size={14} />}
              {stat}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Buttons — stacked on mobile */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-4 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-base touch-manipulation"
        >
          {isSubmitting ? (
            <>
              <Loader size={20} className="animate-spin" />
              Updating...
            </>
          ) : (
            'Update Match'
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-4 sm:py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all touch-manipulation"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// Small helper component for team badge in header
function TeamBadge({ faculty }: { faculty: { name: string; abbreviation: string; colorPrimary: string } }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div
        className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-xs font-black"
        style={{ backgroundColor: faculty.colorPrimary }}
      >
        {faculty.abbreviation}
      </div>
      <span className="text-white font-bold text-sm truncate hidden sm:block">{faculty.name}</span>
    </div>
  );
}