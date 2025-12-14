import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/server/auth';
import Link from 'next/link';
import { LayoutDashboard, Trophy, Calendar, Users, BarChart3, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default async function ControlCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Protect route
  if (! session || session.user.role !== 'admin') {
    redirect('/');
  }

  const navItems = [
    { label: 'Dashboard', href: '/control-center', icon: LayoutDashboard },
    { label: 'Matches', href: '/control-center/matches', icon: Calendar },
    { label: 'Update Scores', href: '/control-center/scores', icon: Trophy },
    { label: 'Faculties', href: '/control-center/faculties', icon: Users },
    { label: 'Create Season', href: '/control-center/seasons', icon: BarChart3 },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-blue-500/20 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-blue-500/20">
          <Link href="/control-center" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <LayoutDashboard size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Control</h2>
              <p className="text-xs text-gray-400 font-bold">Center</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-blue-500/20 transition-all group"
              >
                <Icon size={20} className="group-hover:text-blue-400 transition" />
                <span className="font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-blue-500/20 space-y-3">
          <div className="px-4 py-3 bg-slate-800 rounded-lg">
            <p className="text-xs text-gray-400 font-bold uppercase">Admin</p>
            <p className="text-sm font-bold text-white truncate">{session.user.name}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="min-h-screen p-8">
          {children}
        </div>
      </main>
    </div>
  );
}