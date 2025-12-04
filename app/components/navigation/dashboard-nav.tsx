// app/components/navigation/dashboard-nav.tsx

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { signOut } from "next-auth/react"

type NavLink = {
  label: string
  path: string
  icon: React.ReactNode
}

type DashboardNavProps = {
  allLinks: readonly NavLink[]
  quickActions?: readonly NavLink[]
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export default function DashboardNav({ 
  allLinks, 
  quickActions,
  user 
}: DashboardNavProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/95 backdrop-blur-lg px-6 pb-4 shadow-2xl">
          {/* Logo/Header */}
          <div className="flex h-20 shrink-0 items-center border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900">ADMIN</h1>
                <p className="text-xs font-semibold text-gray-500">Command Center</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {quickActions && quickActions.length > 0 && (
            <div className="space-y-1">
              <p className="px-3 text-xs font-black text-gray-500 uppercase tracking-wider">
                Quick Actions
              </p>
              {quickActions.map((link) => {
                const isActive = pathname === link.path
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={cn(
                      "flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Main Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <p className="px-3 text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
                  Management
                </p>
                <ul role="list" className="space-y-1">
                  {allLinks.map((link) => {
                    const isActive = pathname === link.path
                    return (
                      <li key={link.path}>
                        <Link
                          href={link.path}
                          className={cn(
                            "flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                            isActive
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:scale-105"
                          )}
                        >
                          {link.icon}
                          <span>{link.label}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>

              {/* User Section at Bottom */}
              <li className="mt-auto">
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-x-3 px-3 py-3 bg-gray-50 rounded-lg mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name?.[0]?.toUpperCase() || "A"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {user.name || "Admin"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white/95 backdrop-blur-lg px-4 py-4 shadow-sm lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1 text-sm font-black text-gray-900">
          LASU Sports Admin
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="relative z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-xl">⚡</span>
                </div>
                <span className="text-lg font-black text-gray-900">ADMIN</span>
              </div>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {quickActions?.map((link) => (
                    <Link
                      key={link.path}
                      href={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100"
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
                <div className="space-y-2 py-6">
                  {allLinks.map((link) => (
                    <Link
                      key={link.path}
                      href={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-semibold",
                        pathname === link.path
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "text-gray-900 hover:bg-gray-100"
                      )}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Spacer (Desktop) */}
      <div className="lg:pl-72">
        {/* Content goes here via {children} in layout */}
      </div>
    </>
  )
}