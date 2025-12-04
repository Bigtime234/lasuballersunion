"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const allLinks: { label: string; path: string; icon: React.JSX.Element }[] = [
    { label: "Home", path: "/dashboard", icon: <span aria-hidden>🏠</span> },
    { label: "Reports", path: "/dashboard/reports", icon: <span aria-hidden>📊</span> },
    { label: "Settings", path: "/dashboard/settings", icon: <span aria-hidden>⚙️</span> },
  ]

  return (
    <div>
      <nav className="py-2 overflow-auto mb-4">
        <ul className="flex gap-6 text-xs font-semibold ">
          <AnimatePresence>
            {allLinks.map((link) => (
              <motion.li whileTap={{ scale: 0.95 }} key={link.path}>
                <Link
                  className={cn(
                    "flex gap-1 flex-col items-center relative",
                    pathname === link.path && "text-primary"
                  )}
                  href={link.path}
                >
                  {link.icon}
                  {link.label}
                  {pathname === link.path ? (
                    <motion.div
                      className="h-[2px] w-full rounded-full absolute bg-primary z-0 left-0 -bottom-1"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      layoutId="underline"
                      transition={{ type: "spring", stiffness: 35 }}
                    />
                  ) : null}
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </nav>
      <main>{children}</main>
    </div>
  )
}