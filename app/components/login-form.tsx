"use client";

import React from 'react';
import { Trophy, ArrowLeft, CheckCircle, Zap, Flame, Activity } from 'lucide-react';
import { FaGoogle } from "react-icons/fa";
import { Login } from '@/lib/actions/authgoogle'
import { Session } from 'next-auth'
import { auth } from "@/server/auth"
import Image from "next/image";

export default function SportsLoginForm() {
  return (
    <div className="flex flex-col gap-8 min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background - matching homepage */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>

      {/* Main Card */}
      <div className="overflow-hidden shadow-2xl border border-red-500/20 max-w-5xl mx-auto mt-4 sm:mt-8 bg-slate-800/60 backdrop-blur-lg rounded-2xl sm:rounded-3xl relative z-10 w-full mx-4 sm:mx-auto">
        <div className="grid p-0 md:grid-cols-2">
          {/* Left side - Form */}
          <div className="p-6 sm:p-8 md:p-12 bg-gradient-to-br from-slate-900/95 to-slate-950/95">
            <div className="flex flex-col gap-6 sm:gap-8 h-full justify-between" style={{ minHeight: "auto" }}>
              {/* Header section */}
              <div className="flex flex-col gap-4 sm:gap-6">
                <div className="flex flex-col items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
                  {/* Logo matching homepage style */}
                  <div className="relative w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 mb-1 sm:mb-2">
                    <Image
                      src="/lasu-ballers-union.png"
                      alt="LASU Ballers Union Logo"
                      width={128}
                      height={128}
                      className="rounded-full object-cover shadow-2xl border-4 border-red-500/40 hover:border-red-500/60 transition-all duration-500"
                      priority
                    />
                    {/* Pulsing ring effect */}
                    <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
                  </div>
                  
                  <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight bg-gradient-to-r from-red-400 via-orange-300 to-red-500 bg-clip-text text-transparent drop-shadow-2xl">
                      LASU LIVE
                    </h1>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      SCORES
                    </h2>
                    <div className="w-16 sm:w-20 md:w-24 h-1 sm:h-1. 5 bg-gradient-to-r from-red-500 via-orange-400 to-red-600 mx-auto mt-2 sm:mt-3 rounded-full shadow-lg shadow-red-500/50"></div>
                    <p className="text-red-400 text-xs sm:text-sm font-bold uppercase tracking-widest mt-1. 5 sm:mt-2 flex items-center justify-center gap-1 sm:gap-2">
                      <Zap size={12} className="animate-pulse sm:w-4 sm:h-4" />
                      Official Sports Portal
                    </p>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed font-medium">
                    Join thousands of passionate student athletes.  Sign in to follow live matches, track standings, and celebrate championship glory!  🏆⚽
                  </p>
                </div>
              </div>

              {/* Authentication section */}
              <div className="flex flex-col gap-4 sm:gap-6">
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 font-medium flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-. 682. 057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10. 586 7.707 9. 293a1 1 0 00-1.414 1. 414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Secure Authentication via Google
                  </p>
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base font-black rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg sm:shadow-2xl bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-300 hover:border-gray-400 group"
                    onClick={() => Login()}
                  >
                    {/* Google Icon */}
                    <FaGoogle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 group-hover:scale-110 transition-transform" />
                    <span className="tracking-wide whitespace-nowrap">Continue with Google</span>
                  </button>
                </div>

                {/* Benefits section - matching homepage style */}
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-red-500/30 backdrop-blur-sm shadow-lg sm:shadow-xl relative overflow-hidden">
                  {/* Decorative effects */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
                  
                  <div className="relative z-10">
                    <p className="text-center text-red-400 font-black text-sm sm:text-base mb-4 sm:mb-5 flex items-center justify-center gap-2">
                      <Flame className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                      ATHLETE PORTAL ACCESS
                    </p>
                    <div className="grid gap-2 sm:gap-3. 5">
                      <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-gray-200 bg-slate-900/50 rounded-lg p-2. 5 sm:p-3 hover:bg-slate-800/70 transition-all hover:translate-x-1 border border-slate-700/50">
                        <div className="p-1 sm:p-1.5 bg-red-500/20 rounded-lg flex-shrink-0">
                          <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                        </div>
                        <span className="font-semibold">🔴 Real-time live match scores & updates</span>
                      </div>
                      <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-gray-200 bg-slate-900/50 rounded-lg p-2.5 sm:p-3 hover:bg-slate-800/70 transition-all hover:translate-x-1 border border-slate-700/50">
                        <div className="p-1 sm:p-1.5 bg-yellow-500/20 rounded-lg flex-shrink-0">
                          <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                        </div>
                        <span className="font-semibold">🏆 Full championship standings & rankings</span>
                      </div>
                      <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-gray-200 bg-slate-900/50 rounded-lg p-2.5 sm:p-3 hover:bg-slate-800/70 transition-all hover:translate-x-1 border border-slate-700/50">
                        <div className="p-1 sm:p-1.5 bg-blue-500/20 rounded-lg flex-shrink-0">
                          <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                        </div>
                        <span className="font-semibold">📊 Player stats, profiles & achievements</span>
                      </div>
                      <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-gray-200 bg-slate-900/50 rounded-lg p-2.5 sm:p-3 hover:bg-slate-800/70 transition-all hover:translate-x-1 border border-slate-700/50">
                        <div className="p-1 sm:p-1.5 bg-purple-500/20 rounded-lg flex-shrink-0">
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                        </div>
                        <span className="font-semibold">📅 Match fixtures, results & team news</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Image with overlay */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-950 relative hidden md:block overflow-hidden min-h-screen">
            {/* Main Image */}
            <Image
              src="/lasu-ballers-union.png"
              alt="LASU Ballers Union - Student Athletes"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 0px, 50vw"
            />
            
            {/* Gradient overlays matching homepage */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-900/50 to-slate-950/80"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 via-transparent to-blue-900/30"></div>
            
            {/* Content overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white p-6 sm:p-8 relative z-10 max-w-md">
                {/* Large decorative trophy */}
                <div className="mb-6 sm:mb-8 relative">
                  <div className="w-32 sm:w-40 h-32 sm:h-40 bg-gradient-to-br from-red-600 to-red-700 rounded-full mx-auto flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-500 border-8 border-red-500/20">
                    <Trophy className="text-white w-16 sm:w-20 h-16 sm:h-20" />
                  </div>
                  <div className="absolute inset-0 bg-red-500/30 rounded-full blur-3xl animate-pulse"></div>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 drop-shadow-2xl tracking-tight leading-tight">
                  <span className="bg-gradient-to-r from-red-400 via-orange-300 to-yellow-400 bg-clip-text text-transparent">
                    WHERE LEGENDS
                  </span>
                  <br />
                  <span className="text-white">ARE MADE</span>
                </h2>
                <p className="text-lg sm:text-xl opacity-90 drop-shadow-lg font-bold mb-4 sm:mb-6">
                  Official home of LASU student athletics
                </p>
                <div className="w-20 sm:w-24 h-1 sm:h-1.5 bg-gradient-to-r from-red-500 to-orange-400 mx-auto rounded-full shadow-lg"></div>
                
                {/* Stats showcase - matching homepage */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-8 sm:mt-10">
                  <div className="bg-slate-900/60 backdrop-blur-md rounded-lg sm:rounded-xl p-2 sm:p-4 border border-red-500/30 hover:border-red-500/50 transition-all">
                    <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">2. 5K+</p>
                    <p className="text-xs uppercase tracking-wider text-gray-300 font-bold mt-1">Athletes</p>
                  </div>
                  <div className="bg-slate-900/60 backdrop-blur-md rounded-lg sm:rounded-xl p-2 sm:p-4 border border-blue-500/30 hover:border-blue-500/50 transition-all">
                    <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">150+</p>
                    <p className="text-xs uppercase tracking-wider text-gray-300 font-bold mt-1">Matches</p>
                  </div>
                  <div className="bg-slate-900/60 backdrop-blur-md rounded-lg sm:rounded-xl p-2 sm:p-4 border border-purple-500/30 hover:border-purple-500/50 transition-all">
                    <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">12</p>
                    <p className="text-xs uppercase tracking-wider text-gray-300 font-bold mt-1">Faculties</p>
                  </div>
                </div>

                {/* Decorative sports icons */}
                <div className="flex justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 opacity-80">
                  <div className="w-8 sm:w-10 h-8 sm:h-10 bg-slate-900/60 backdrop-blur-sm rounded-full flex items-center justify-center border border-red-500/30 hover:border-red-500/50 transition-all hover:scale-110">
                    <span className="text-lg sm:text-xl">⚽</span>
                  </div>
                  <div className="w-8 sm:w-10 h-8 sm:h-10 bg-slate-900/60 backdrop-blur-sm rounded-full flex items-center justify-center border border-blue-500/30 hover:border-blue-500/50 transition-all hover:scale-110">
                    <span className="text-lg sm:text-xl">🏀</span>
                  </div>
                  <div className="w-8 sm:w-10 h-8 sm:h-10 bg-slate-900/60 backdrop-blur-sm rounded-full flex items-center justify-center border border-purple-500/30 hover:border-purple-500/50 transition-all hover:scale-110">
                    <span className="text-lg sm:text-xl">🏐</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - matching homepage style */}
      <div className="text-center pb-4 sm:pb-8 relative z-10 px-4">
        <div className="flex justify-center items-center gap-2 sm:gap-4 mb-3 sm:mb-4 flex-col sm:flex-row">
          <a
            href="/"
            className="text-red-400 hover:text-red-300 transition-colors font-bold flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider group"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Portal
          </a>
        </div>
        <p className="text-xs text-gray-400">
          By continuing, you agree to our{' '}
          <a href="#" className="text-red-400 hover:text-red-300 underline underline-offset-4 font-medium">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-red-400 hover:text-red-300 underline underline-offset-4 font-medium">
            Privacy Policy
          </a>
          .
        </p>
        <p className="text-xs text-gray-500 mt-2 sm:mt-3 font-semibold">
          © 2025 LASU Ballers Union - Empowering Student Athletes 🏆⚽
        </p>
      </div>
    </div>
  );
}