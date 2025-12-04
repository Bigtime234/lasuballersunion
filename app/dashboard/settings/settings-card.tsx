// app/admin/layout.tsx

import { auth } from "@/server/auth"
import { 
  LayoutDashboard,
  Trophy, 
  Plus, 
  Users, 
  Calendar,
  Settings,
  FileDown,
  BarChart3,
  Home,
  Bell
} from "lucide-react"
import DashboardNav from "@/app/components/navigation/dashboard-nav"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  // Redirect if not logged in
  if (!session) {
    redirect('/login')
  }
  
  // Redirect if not admin
  if (session.user.role !== "admin") {
    redirect('/')
  }

  // Admin-only links
  const adminLinks = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard size={18} />,
    },
    {
      label: "Add Match",
      path: "/admin/matches/create",
      icon: <Plus size={18} />,
    },
    {
      label: "Manage Matches",
      path: "/admin/matches",
      icon: <Calendar size={18} />,
    },
    {
      label: "Update Score",
      path: "/admin/scores",
      icon: <Trophy size={18} />,
    },
    {
      label: "Manage Faculties",
      path: "/admin/faculties",
      icon: <Users size={18} />,
    },
    {
      label: "Analytics",
      path: "/admin/analytics",
      icon: <BarChart3 size={18} />,
    },
    {
      label: "Reports",
      path: "/admin/reports",
      icon: <FileDown size={18} />,
    },
    {
      label: "Settings",
      path: "/admin/settings",
      icon: <Settings size={18} />,
    },
  ] as const

  // Quick actions at top (optional)
  const quickActions = [
    {
      label: "View Public Site",
      path: "/",
      icon: <Home size={18} />,
    },
    {
      label: "Notifications",
      path: "/admin/notifications",
      icon: <Bell size={18} />,
    },
  ] as const

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      <DashboardNav 
        allLinks={adminLinks} 
        quickActions={quickActions}
        user={session.user}
      />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}