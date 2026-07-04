"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Coffee, type LucideIcon } from "lucide-react"
export type NavItem = {
  href: string
  label: string
  icon: LucideIcon
}

export function AppSidebar({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-[240px] flex-col border-r border-sidebar-border bg-sidebar">
      <Link href="/dashboard" className="flex items-center gap-2 border-b border-sidebar-border p-4 no-underline">
        <Coffee className="text-sidebar-primary" />
        <span className="text-lg font-semibold text-sidebar-foreground">KiotBean</span>
      </Link>
      <nav className="flex flex-1 flex-col gap-0.5 p-2">
        {items.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground no-underline transition-colors hover:bg-sidebar-accent/50 ${active ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}`}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
