"use client"

import type { ReactNode } from "react"
import { AppSidebar, type NavItem } from "@/components/ui/app-sidebar"
import { RoleSwitcher } from "./role-switcher"
import { LocaleSwitcher } from "./locale-switcher"
export function DashboardShell({ children, sidebarItems }: { children: ReactNode; sidebarItems: NavItem[] }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar items={sidebarItems} />
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-end gap-2 border-b border-border bg-card px-6">
          <LocaleSwitcher />
          <RoleSwitcher />
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
