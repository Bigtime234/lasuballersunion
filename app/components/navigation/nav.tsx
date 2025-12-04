"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { 
  Home, 
  Trophy, 
  Calendar, 
  Users, 
  TrendingUp, 
  Menu, 
  X, 
  LogIn,
  Zap,
  Award
} from 'lucide-react';
import { UserButton } from './user-button';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size: number }>;
  badge?: string;
}

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window. addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mainNavItems: NavItem[] = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Live Scores', href: '/livescorespagenav', icon: Zap, badge: 'LIVE' },
    { label: 'Standings', href: '/standingsnav', icon: Trophy },
    { label: 'Fixtures', href: '/fixturespagenav', icon: Calendar },
    { label: 'Faculties', href: '/faculties', icon: Users },
  ];

  const secondaryNavItems: NavItem[] = [
    { label: 'Top Scorers', href: '/top-scorers', icon: Award },
    { label: 'Statistics', href: '/stats', icon: TrendingUp },
  ];

  const isActiveRoute = (href: string): boolean => {
    if (! isMounted) return false;
    return pathname === href;
  };

  const handleNavigate = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
  };

  if (! isMounted) {
    return <div className="h-16 sm:h-20" />;
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-linear-to-r from-slate-900 via-indigo-900 to-slate-900 shadow-2xl border-b border-amber-500/30'
            : 'bg-linear-to-r from-slate-900 via-indigo-900 to-slate-900 border-b border-amber-500/20'
        }`}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-500 via-orange-500 to-red-600"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo Section */}
            <Link
              href="/"
              className="flex items-center gap-3 shrink-0 group"
            >
              <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-amber-400 via-orange-500 to-red-600 rounded-xl shadow-lg group-hover:shadow-2xl group-hover:shadow-amber-500/50 transition-all duration-300 transform group-hover:scale-110">
                <Trophy size={24} className="text-white drop-shadow-lg" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-linear-to-r from-red-500 to-pink-500 rounded-full animate-pulse shadow-lg"></div>
              </div>
              <div className="flex flex-col">
                <h1 className="font-black text-lg sm:text-2xl bg-linear-to-r from-amber-400 via-orange-300 to-red-500 bg-clip-text text-transparent tracking-tight">
                  LASU SPORTS
                </h1>
                <p className="text-xs sm:text-sm font-bold text-amber-400 tracking-wider">
                  CAMPUS ATHLETICS HUB
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item. href);
                
                return (
                  <div key={item.href} className="relative group">
                    <button
                      onClick={() => handleNavigate(item.href)}
                      className={`flex items-center gap-2 px-4 py-2. 5 rounded-lg font-bold text-sm transition-all duration-200 relative ${
                        isActive
                          ? 'bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/50 border border-amber-300/50'
                          : 'text-gray-200 hover:text-white border border-transparent hover:bg-white/10'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-linear-to-r from-red-500 to-pink-600 text-white text-xs font-black rounded-full shadow-lg animate-pulse">
                          {item.badge}
                        </span>
                      )}
                      {isActive && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1. 5 h-1.5 bg-amber-400 rounded-full shadow-lg shadow-amber-400/50"></div>
                      )}
                    </button>
                  </div>
                );
              })}

              {/* More Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm text-gray-200 hover:text-white border border-transparent hover:bg-white/10 transition-all duration-200 group-hover:text-amber-400">
                  <Award size={18} />
                  <span>More</span>
                </button>
                
                <div className="absolute right-0 mt-1 w-56 bg-linear-to-br from-slate-800 via-slate-800 to-indigo-900 rounded-xl shadow-2xl border border-amber-500/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-linear-to-r from-amber-500/5 to-orange-500/5 rounded-xl pointer-events-none"></div>
                  {secondaryNavItems.map((item) => {
                    const Icon = item. icon;
                    const isActive = isActiveRoute(item.href);
                    
                    return (
                      <button
                        key={item.href}
                        onClick={() => handleNavigate(item.href)}
                        className={`relative w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all duration-200 ${
                          isActive
                            ?  'bg-linear-to-r from-amber-500/30 to-orange-500/30 text-amber-400 border-l-4 border-amber-500'
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-3 shrink-0">
              {/* User Profile / Sign In */}
              {status === 'authenticated' && session ? (
                <div className="relative group/user">
                  <div className="absolute inset-0 bg-linear-to-r from-amber-500 to-orange-600 rounded-lg blur opacity-25 group-hover/user:opacity-50 transition duration-300"></div>
                  <div className="relative">
                    <UserButton {... session} />
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleNavigate('/login')}
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-amber-500 to-orange-600 text-white rounded-lg font-bold text-sm hover:from-amber-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-2xl hover:shadow-amber-500/50 transform hover:scale-105"
                >
                  <LogIn size={18} />
                  <span>Sign In</span>
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2. 5 rounded-lg text-amber-400 hover:bg-white/10 transition-all duration-200 border border-amber-500/30 hover:border-amber-500/60"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X size={24} />
                ) : (
                  <Menu size={24} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 z-30 bg-linear-to-b from-slate-900 via-indigo-900 to-slate-900 border-t-2 border-amber-500/30">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-2 max-h-[calc(100vh-100px)] overflow-y-auto">
            {[...mainNavItems, ...secondaryNavItems].map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              
              return (
                <button
                  key={item. href}
                  onClick={() => handleNavigate(item.href)}
                  className={`relative w-full flex items-center gap-4 px-5 py-4 rounded-lg font-bold text-sm transition-all duration-200 group ${
                    isActive
                      ? 'bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/50 border-2 border-amber-300'
                      : 'text-gray-200 hover:text-white hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <Icon size={22} />
                  <div className="flex-1 text-left">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-2 inline-block px-2 py-1 bg-red-500 text-white text-xs font-black rounded-full animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 bg-white rounded-full shadow-lg shadow-white/50"></div>
                  )}
                </button>
              );
            })}

            {status === 'unauthenticated' && (
              <button
                onClick={() => handleNavigate('/login')}
                className="w-full mt-6 flex items-center justify-center gap-2 px-5 py-4 bg-linear-to-r from-amber-500 to-orange-600 text-white rounded-lg font-bold text-sm hover:from-amber-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-2xl hover:shadow-amber-500/50 transform hover:scale-105 border-2 border-amber-300/50"
              >
                <LogIn size={20} />
                <span>Sign In to LASU Sports</span>
              </button>
            )}

            {/* Mobile Footer */}
            <div className="mt-8 pt-6 border-t border-amber-500/20">
              <div className="text-center space-y-2">
                <p className="text-amber-400 font-black text-sm">🔥 WHERE CAMPUS LEGENDS ARE MADE 🔥</p>
                <p className="text-gray-400 text-xs">LASU Athletic Department 2024/25</p>
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* Spacer */}
      <div className="h-16 sm:h-20" />

      {/* Animations */}
      <style jsx global>{`
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        . animate-pulse {
          animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </>
  );
};

export default Header;