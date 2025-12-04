'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateScoreSchema, type UpdateScoreInput } from '@/Types/matches';
import { updateMatchScore } from '@/lib/actions/matches';
import { AlertCircle, Loader, Play, Pause, CheckCircle2 } from 'lucide-react';

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
      scoreHome: initialData. scoreHome,
      scoreAway: initialData.scoreAway,
      matchMinute: initialData.matchMinute,
      status: initialData.status,
    },
  });

  const scoreHome = watch('scoreHome');
  const scoreAway = watch('scoreAway');
  const matchMinute = watch('matchMinute');
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

      router.push('/control-center/scores');
      router.refresh();
    } catch (error: any) {
      setServerError(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickIncrease = (team: 'home' | 'away') => {
    if (team === 'home') {
      setValue('scoreHome', scoreHome + 1);
    } else {
      setValue('scoreAway', scoreAway + 1);
    }
  };

  const quickDecrease = (team: 'home' | 'away') => {
    if (team === 'home' && scoreHome > 0) {
      setValue('scoreHome', scoreHome - 1);
    } else if (team === 'away' && scoreAway > 0) {
      setValue('scoreAway', scoreAway - 1);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
      
      {/* Error Alert */}
      {serverError && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 font-bold">{serverError}</p>
        </div>
      )}

      {/* Current Status Badge */}
      <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
        <span className="text-gray-400 font-semibold">Current Status:</span>
        <span className={`px-4 py-2 rounded-lg font-bold text-sm ${
          status === 'PENDING' ? 'bg-gray-500/20 text-gray-400' :
          status === 'LIVE' ? 'bg-red-500/20 text-red-400 animate-pulse' :
          'bg-green-500/20 text-green-400'
        }`}>
          {status}
        </span>
      </div>

      {/* Score Update Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white">Update Score</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Home Team */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: initialData.homeFaculty.colorPrimary }}
              >
                {initialData.homeFaculty.abbreviation}
              </div>
              <span className="font-bold text-white">{initialData. homeFaculty.name}</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => quickDecrease('home')}
                  disabled={scoreHome === 0}
                  className="px-3 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold transition"
                >
                  −
                </button>
                <input
                  type="number"
                  {... register('scoreHome', { valueAsNumber: true })}
                  className="flex-1 text-4xl font-black text-center bg-slate-700 border-2 border-slate-600 rounded-lg text-white focus:border-blue-500 outline-none transition py-2"
                />
                <button
                  type="button"
                  onClick={() => quickIncrease('home')}
                  className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition"
                >
                  +
                </button>
              </div>
              {errors.scoreHome && (
                <p className="text-red-400 text-sm">{errors.scoreHome.message}</p>
              )}
            </div>
          </div>

          {/* Match Minute */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <label className="block text-sm font-bold text-gray-300 mb-4">Match Minute</label>
            <input
              type="number"
              {...register('matchMinute', { valueAsNumber: true })}
              className="w-full text-4xl font-black text-center bg-slate-700 border-2 border-slate-600 rounded-lg text-white focus:border-blue-500 outline-none transition py-2 mb-3"
            />
            <div className="flex gap-2">
              {[45, 60, 75, 90]. map((min) => (
                <button
                  key={min}
                  type="button"
                  onClick={() => setValue('matchMinute', min)}
                  className="flex-1 px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded font-bold text-sm transition"
                >
                  {min}'
                </button>
              ))}
            </div>
            {errors.matchMinute && (
              <p className="text-red-400 text-sm mt-2">{errors.matchMinute.message}</p>
            )}
          </div>

          {/* Away Team */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: initialData.awayFaculty.colorPrimary }}
              >
                {initialData.awayFaculty.abbreviation}
              </div>
              <span className="font-bold text-white">{initialData.awayFaculty.name}</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => quickDecrease('away')}
                  disabled={scoreAway === 0}
                  className="px-3 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold transition"
                >
                  −
                </button>
                <input
                  type="number"
                  {...register('scoreAway', { valueAsNumber: true })}
                  className="flex-1 text-4xl font-black text-center bg-slate-700 border-2 border-slate-600 rounded-lg text-white focus:border-blue-500 outline-none transition py-2"
                />
                <button
                  type="button"
                  onClick={() => quickIncrease('away')}
                  className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition"
                >
                  +
                </button>
              </div>
              {errors.scoreAway && (
                <p className="text-red-400 text-sm">{errors.scoreAway.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Control */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Match Status</h3>
        <div className="grid grid-cols-3 gap-3">
          {(['PENDING', 'LIVE', 'FINISHED'] as const).map((stat) => (
            <button
              key={stat}
              type="button"
              onClick={() => setValue('status', stat)}
              className={`py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                status === stat
                  ? stat === 'PENDING'
                    ? 'bg-gray-500 text-white border-2 border-gray-400'
                    : stat === 'LIVE'
                    ? 'bg-red-500 text-white border-2 border-red-400 shadow-lg shadow-red-500/50'
                    : 'bg-green-500 text-white border-2 border-green-400'
                  : 'bg-slate-700 text-gray-400 border-2 border-slate-600 hover:border-slate-500'
              }`}
            >
              {stat === 'PENDING' && <div className="w-2 h-2 bg-current rounded-full" />}
              {stat === 'LIVE' && <Play size={16} />}
              {stat === 'FINISHED' && <CheckCircle2 size={16} />}
              {stat}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-6 border-t border-slate-700">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-bold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ?  (
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
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}