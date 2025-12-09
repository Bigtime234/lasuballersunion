"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { 
  Home, 
  Zap,
  Calendar, 
  Users, 
  Menu, 
  X, 
  LogIn,
  Flame,
  Target,
  ChevronDown
} from 'lucide-react';
import { UserButton } from './user-button';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size: number }>;
  badge?: string;
}

interface DropdownItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size: number }>;
  description?: string;
}

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isWomensMenuOpen, setIsWomensMenuOpen] = useState(false);
  const [isMobileWomensOpen, setIsMobileWomensOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window. scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mainNavItems: NavItem[] = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Live Scores', href: '/livescorespagenav', icon: Zap, badge: 'LIVE' },
    { label: 'Fixtures', href: '/fixturespagenav', icon: Calendar },
    { label: 'Faculties', href: '/faculties', icon: Users },
  ];

  const womensDropdownItems: DropdownItem[] = [
    { label: 'Women\'s Home', href: '/women', icon: Home, description: 'Dashboard & Overview' },
    { label: 'Live Scores', href: '/women/livescores', icon: Zap, description: 'Live Matches' },
    { label: 'Standings', href: '/women/standings', icon: Target, description: 'League Table' },
    { label: 'Fixtures', href: '/women/fixtures', icon: Calendar, description: 'Upcoming Matches' },
    { label: 'Results', href: '/women/results', icon: Target, description: 'Match Results' },
  ];

  const isActiveRoute = (href: string): boolean => {
    if (! isMounted) return false;
    return pathname === href;
  };

  const isWomensRoute = (): boolean => {
    if (! isMounted) return false;
    return pathname.startsWith('/women');
  };

  const handleNavigate = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
    setIsWomensMenuOpen(false);
    setIsMobileWomensOpen(false);
  };

  if (! isMounted) {
    return <div className="h-16 sm:h-20" />;
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 shadow-2xl border-b border-amber-500/30'
            : 'bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 border-b border-amber-500/20'
        }`}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600"></div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo Section */}
           <Link
  href="/"
  className="flex items-center gap-2 sm:gap-3 shrink-0 group min-w-0"
>
  <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl shadow-lg group-hover:shadow-2xl group-hover:shadow-amber-500/50 transition-all duration-300 transform group-hover:scale-110 flex-shrink-0 bg-slate-900/50 backdrop-blur-md border border-amber-500/30">
    <Image
      src="/lasu-ballers-union.png"
      alt="LASU Ballers Union"
      width={56}
      height={56}
      className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain drop-shadow-lg"
      priority
    />
    <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse shadow-lg"></div>
  </div>
  <div className="flex flex-col min-w-0">
    <h1 className="font-black text-base sm:text-xl md:text-2xl bg-gradient-to-r from-amber-400 via-orange-300 to-red-500 bg-clip-text text-transparent tracking-tight truncate">
      LASU BALLERS
    </h1>
    <p className="text-xs sm:text-sm font-bold text-amber-400 tracking-wider truncate">
      UNION
    </p>
  </div>
</Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 ml-6">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.href);
                
                return (
                  <div key={item.href} className="relative group">
                    <button
                      onClick={() => handleNavigate(item.href)}
                      className={`flex items-center gap-2 px-3 xl:px-4 py-2. 5 rounded-lg font-bold text-sm transition-all duration-200 relative whitespace-nowrap ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/50 border border-amber-300/50'
                          : 'text-gray-200 hover:text-white border border-transparent hover:bg-white/10'
                      }`}
                    >
                      <Icon size={18} className="flex-shrink-0" />
                      <span className="hidden md:inline">{item.label}</span>
                      {item.badge && (
                        <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-black rounded-full shadow-lg animate-pulse">
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

              {/* Women's Sports Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsWomensMenuOpen(true)}
                onMouseLeave={() => setIsWomensMenuOpen(false)}
              >
                <button 
                  className={`flex items-center gap-2 px-3 xl:px-4 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 group whitespace-nowrap ${
                    isWomensRoute()
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/50 border border-pink-300/50'
                      : 'text-gray-200 hover:text-white border border-transparent hover:bg-white/10'
                  }`}
                >
                  <Flame size={18} className={`flex-shrink-0 ${isWomensRoute() ? 'text-white' : 'text-pink-400'}`} />
                  <span className="hidden md:inline">Women's Sports</span>
                  <ChevronDown size={16} className={`flex-shrink-0 transition-transform duration-200 ${isWomensMenuOpen ? 'rotate-180' : ''}`} />
                  {isWomensRoute() && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-pink-400 rounded-full shadow-lg shadow-pink-400/50"></div>
                  )}
                </button>
                
                <div className={`absolute left-0 mt-1 w-72 bg-gradient-to-br from-slate-800 via-slate-800 to-purple-900 rounded-xl shadow-2xl border border-pink-500/30 transition-all duration-200 backdrop-blur-sm ${
                  isWomensMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 rounded-xl pointer-events-none"></div>
                  
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-pink-500/20">
                    <div className="flex items-center gap-2">
                      <Flame size={20} className="text-pink-400 flex-shrink-0" />
                      <span className="font-black text-sm bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                        WOMEN'S CHAMPIONSHIP
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Excellence in Action 🏆</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {womensDropdownItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = isActiveRoute(item.href);
                      
                      return (
                        <button
                          key={item.href}
                          onClick={() => handleNavigate(item.href)}
                          className={`relative w-full flex items-start gap-3 px-4 py-3 text-sm font-bold transition-all duration-200 ${
                            isActive
                              ?  'bg-gradient-to-r from-pink-500/30 to-purple-500/30 text-pink-400 border-l-4 border-pink-500'
                              : 'text-gray-300 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <Icon size={18} className="mt-0.5 shrink-0" />
                          <div className="flex-1 text-left">
                            <div className="font-bold">{item.label}</div>
                            {item.description && (
                              <div className="text-xs text-gray-500 font-normal">{item.description}</div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
              {/* User Profile / Sign In */}
              {status === 'authenticated' && session ?  (
                <div className="relative group/user">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg blur opacity-25 group-hover/user:opacity-50 transition duration-300"></div>
                  <div className="relative">
                    <UserButton {... session} />
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleNavigate('/login')}
                  className="hidden sm:flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-bold text-xs sm:text-sm hover:from-amber-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-2xl hover:shadow-amber-500/50 transform hover:scale-105 whitespace-nowrap"
                >
                  <LogIn size={18} className="flex-shrink-0" />
                  <span className="hidden md:inline">Sign In</span>
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2. 5 rounded-lg text-amber-400 hover:bg-white/10 transition-all duration-200 border border-amber-500/30 hover:border-amber-500/60 flex-shrink-0"
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
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 sm:top-20 z-30 bg-gradient-to-b from-slate-900 via-indigo-900 to-slate-900 border-t-2 border-amber-500/30">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-2 max-h-[calc(100vh-100px)] overflow-y-auto">
            {/* Main Nav Items */}
            {mainNavItems.map((item) => {
              const Icon = item. icon;
              const isActive = isActiveRoute(item.href);
              
              return (
                <button
                  key={item.href}
                  onClick={() => handleNavigate(item.href)}
                  className={`relative w-full flex items-center gap-4 px-5 py-4 rounded-lg font-bold text-sm transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/50 border-2 border-amber-300'
                      : 'text-gray-200 hover:text-white hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <Icon size={22} className="flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-2 inline-block px-2 py-1 bg-red-500 text-white text-xs font-black rounded-full animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 bg-white rounded-full shadow-lg shadow-white/50 flex-shrink-0"></div>
                  )}
                </button>
              );
            })}

            {/* Women's Sports Collapsible */}
            <div className="space-y-2">
              <button
                onClick={() => setIsMobileWomensOpen(!isMobileWomensOpen)}
                className={`relative w-full flex items-center gap-4 px-5 py-4 rounded-lg font-bold text-sm transition-all duration-200 ${
                  isWomensRoute()
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/50 border-2 border-pink-300'
                    : 'text-gray-200 hover:text-white hover:bg-white/10 border border-transparent'
                }`}
              >
                <Flame size={22} className={`flex-shrink-0 ${isWomensRoute() ?  'text-white' : 'text-pink-400'}`} />
                <div className="flex-1 text-left">
                  <span>Women's Sports</span>
                </div>
                <ChevronDown size={20} className={`flex-shrink-0 transition-transform duration-200 ${isMobileWomensOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Women's Submenu */}
              {isMobileWomensOpen && (
                <div className="ml-4 space-y-1 border-l-2 border-pink-500/30 pl-4">
                  {womensDropdownItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isActiveRoute(item. href);
                    
                    return (
                      <button
                        key={item.href}
                        onClick={() => handleNavigate(item.href)}
                        className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-pink-500/30 to-purple-500/30 text-pink-400 border-l-4 border-pink-500'
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Icon size={18} className="flex-shrink-0" />
                        <div className="flex-1 text-left">
                          <div>{item.label}</div>
                          {item.description && (
                            <div className="text-xs text-gray-500 font-normal">{item.description}</div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {status === 'unauthenticated' && (
              <button
                onClick={() => handleNavigate('/login')}
                className="w-full mt-6 flex items-center justify-center gap-2 px-5 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-bold text-sm hover:from-amber-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-2xl hover:shadow-amber-500/50 transform hover:scale-105 border-2 border-amber-300/50"
              >
                <LogIn size={20} className="flex-shrink-0" />
                <span>Sign In to LASU Ballers</span>
              </button>
            )}

            {/* Mobile Footer */}
            <div className="mt-8 pt-6 border-t border-amber-500/20">
              <div className="text-center space-y-2">
                <p className="text-amber-400 font-black text-sm">🔥 WHERE CAMPUS LEGENDS ARE MADE 🔥</p>
                <p className="text-gray-400 text-xs">LASU Ballers Union 2024/25</p>
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