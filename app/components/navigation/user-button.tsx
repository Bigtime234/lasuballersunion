"use client"
import { Session } from "next-auth"
import { Logout } from "@/lib/actions/authgoogle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  LogOut, 
  Settings, 
  Trophy, 
  User, 
  Zap, 
  CreditCard,
  ShieldCheck
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export const UserButton = ({ user: initialUser }: Session) => {
  const router = useRouter()
  const { data: session } = useSession()
  
  // Use the most up-to-date user data from session, fallback to initialUser
  const user = session?.user || initialUser
  
  const getUserInitials = (name?: string | null) => {
    if (!name) return "U"
    const names = name.split(" ")
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase()
    }
    return name.charAt(0).toUpperCase()
  }

  if (!user) return null

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="focus:outline-none">
        <div className="relative group">
          {/* Avatar Trigger - Styled like a Team Badge */}
          <Avatar className="w-10 h-10 sm:w-11 sm:h-11 border-2 border-slate-800 transition-all duration-300 group-hover:border-blue-500 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <AvatarImage
              key={user.image}
              src={user.image || ""}
              alt={user.name || "User"}
              className="object-cover"
            />
            <AvatarFallback className="bg-slate-800 text-blue-400 font-bold border border-slate-700">
              {getUserInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          
          {/* Online Status Dot */}
          <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border-2 border-slate-950"></span>
          </span>
        </div>
      </DropdownMenuTrigger>
      
      {/* Dropdown Content - Styled like a Player Stats Card */}
      <DropdownMenuContent 
        className="w-80 p-0 shadow-2xl border border-slate-800 bg-slate-950 text-slate-200" 
        align="end"
        sideOffset={8}
      >
        {/* Card Header / Jersey Background */}
        <div className="relative bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 p-6 overflow-hidden">
          {/* Decorative Pattern */}
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Trophy size={100} />
          </div>
          
          <div className="relative flex items-center gap-4 z-10">
            <Avatar className="w-16 h-16 border-4 border-slate-950 shadow-xl">
              <AvatarImage
                key={user.image}
                src={user.image || ""}
                alt={user.name || "User"}
                className="object-cover"
              />
              <AvatarFallback className="bg-blue-600 text-white font-bold text-xl">
                {getUserInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white truncate uppercase tracking-tight">
                  {user.name}
                </h3>
                {/* Verified Badge */}
                <ShieldCheck size={16} className="text-blue-400 flex-shrink-0" />
              </div>
              <p className="text-slate-400 text-xs truncate font-mono mb-2">
                {user.email}
              </p>
              
              {/* Mini Stats Badge */}
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-xs font-bold text-blue-400">
                <Zap size={10} className="fill-blue-400" />
                <span>FAN LEVEL 1</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-2 space-y-1">
          <DropdownMenuLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider px-4 py-2">
            My League
          </DropdownMenuLabel>

          {/* Profile */}
          <DropdownMenuItem
            onClick={() => router.push("/women")}
            className="group py-3 px-4 rounded-lg cursor-pointer focus:bg-slate-900 focus:text-white transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200 text-slate-400 border border-slate-800 group-hover:border-blue-500">
                <User size={18} />
              </div>
              <div>
                <p className="font-bold text-slate-200 group-hover:text-white">Womens page</p>
                <p className="text-xs text-slate-500 group-hover:text-slate-300">view womens page</p>
              </div>
            </div>
          </DropdownMenuItem>

          {/* My Teams (Was Appointments) */}
          <DropdownMenuItem
            onClick={() => router.push("/livescorespagenav")}
            className="group py-3 px-4 rounded-lg cursor-pointer focus:bg-slate-900 focus:text-white transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors duration-200 text-slate-400 border border-slate-800 group-hover:border-orange-500">
                <Trophy size={18} />
              </div>
              <div>
                <p className="font-bold text-slate-200 group-hover:text-white">Live scores</p>
                <p className="text-xs text-slate-500 group-hover:text-slate-300">View live scores</p>
              </div>
            </div>
          </DropdownMenuItem>

          {/* Settings */}
          

          <DropdownMenuSeparator className="bg-slate-800 my-2" />

          {/* Sign Out */}
          <DropdownMenuItem
            onClick={() => Logout()}
            className="group py-3 px-4 rounded-lg cursor-pointer focus:bg-red-950/30 focus:text-red-400 transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors duration-200 text-slate-400 border border-slate-800 group-hover:border-red-600">
                <LogOut size={18} />
              </div>
              <div>
                <p className="font-bold text-slate-200 group-hover:text-red-400">Log Out</p>
                <p className="text-xs text-slate-500 group-hover:text-red-300">End session</p>
              </div>
            </div>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}