"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type Role = "superadmin" | "user"

const RoleContext = createContext<{
  role: Role
  setRole: (r: Role) => void
}>({ role: "user", setRole: () => {} })

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("user")
  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  return useContext(RoleContext)
}
