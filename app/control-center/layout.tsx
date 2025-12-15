'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Trophy, Calendar, Users, BarChart3, LogOut, Menu, X } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

export default function ControlCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Protect route
  React.useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user.role !== 'admin')) {
      router.push('/');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-bold">Loading Control Center...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || ! session) {
    return null;
  }

  const navItems = [
    { label:  'Dashboard', href: '/control-center', icon: LayoutDashboard },
    { label:  'Matches', href: '/control-center/matches', icon:  Calendar },
    { label: 'Update Scores', href: '/control-center/scores', icon:  Trophy },
    { label: 'Faculties', href: '/control-center/faculties', icon: Users },
    { label:  'Create Season', href: '/control-center/seasons', icon:  BarChart3 },
  ];

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Mobile/Tablet Menu Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - Desktop (64 width) */}
      <aside className={`
        fixed lg:relative left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-950 
        border-r border-blue-500/20 flex flex-col transition-all duration-300 z-40
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="p-4 md:p-6 border-b border-blue-500/20 flex items-center justify-between">
          <Link href="/control-center" className="flex items-center gap-2 md:gap-3 flex-1">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <LayoutDashboard size={20} className="md:w-6 md:h-6 text-white" />
            </div>
            <div className="hidden md:block">
              <h2 className="text-lg md:text-xl font-black text-white">Control</h2>
              <p className="text-xs text-gray-400 font-bold">Center</p>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            onClick={closeSidebar}
            className="lg:hidden p-2 hover:bg-blue-500/20 rounded-lg transition"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 md:p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className="flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg text-gray-300 hover: text-white hover:bg-blue-500/20 transition-all group"
              >
                <Icon size={18} className="md:w-5 md:h-5 group-hover:text-blue-400 transition flex-shrink-0" />
                <span className="font-semibold text-sm md:text-base">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer - Admin Info */}
        <div className="p-3 md:p-4 border-t border-blue-500/20 space-y-3">
          <div className="px-3 md:px-4 py-2 md:py-3 bg-slate-800 rounded-lg">
            <p className="text-xs text-gray-400 font-bold uppercase">Admin</p>
            <p className="text-xs md:text-sm font-bold text-white truncate">{session. user.name}</p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 md:px-4 py-2 md:py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-bold text-sm md:text-base transition-all transform hover:scale-105"
          >
            <LogOut size={18} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {/* Top Bar - Mobile/Tablet */}
        <div className="lg:hidden sticky top-0 z-20 bg-gradient-to-r from-slate-900 to-slate-950 border-b border-blue-500/20 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-blue-500/20 rounded-lg transition"
            aria-label="Toggle menu"
          >
            <Menu size={24} className="text-white" />
          </button>

          <h1 className="text-lg font-black text-white">Control Center</h1>

          <div className="w-10 h-10" /> {/* Spacer for alignment */}
        </div>

        {/* Content Area */}
        <div className="min-h-screen p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}