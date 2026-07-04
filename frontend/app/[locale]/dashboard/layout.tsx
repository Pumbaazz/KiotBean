"use client"

import type { ReactNode } from "react"
import { useTranslations } from "next-intl"
import { RoleProvider, useRole } from "@/lib/use-role"
import { DashboardShell } from "./_components/shell"
import {
  LayoutDashboard,
  ShoppingCart,
  Wallet,
  DollarSign,
  Users,
} from "lucide-react"

const allLinks = [
  { href: "/dashboard", key: "dashboard", icon: LayoutDashboard, roles: ["superadmin", "user"] as const },
  { href: "/dashboard/orders", key: "orders", icon: ShoppingCart, roles: ["superadmin", "user"] as const },
  { href: "/dashboard/cashflow", key: "cashflow", icon: Wallet, roles: ["superadmin"] as const },
  { href: "/dashboard/price", key: "price", icon: DollarSign, roles: ["superadmin", "user"] as const },
  { href: "/dashboard/users", key: "users", icon: Users, roles: ["superadmin"] as const },
]

function DashboardContent({ children }: { children: ReactNode }) {
  const t = useTranslations("nav")
  const { role } = useRole()
  const items = allLinks
    .filter((l) => (l.roles as readonly string[]).includes(role))
    .map((l) => ({ href: l.href, label: t(l.key), icon: l.icon }))

  return <DashboardShell sidebarItems={items}>{children}</DashboardShell>
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <RoleProvider>
      <DashboardContent>{children}</DashboardContent>
    </RoleProvider>
  )
}
