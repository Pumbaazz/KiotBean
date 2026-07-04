"use client"

import { useTranslations } from "next-intl"
import { useRole } from "@/lib/use-role"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserCog, User } from "lucide-react"

export function RoleSwitcher() {
  const { role, setRole } = useRole()
  const tauth = useTranslations("auth")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {role === "superadmin" ? <UserCog /> : <User />}
          {role === "superadmin" ? tauth("superadmin") : tauth("user")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={role} onValueChange={(v) => setRole(v as "superadmin" | "user")}>
          <DropdownMenuRadioItem value="superadmin">
            <UserCog className="mr-2 size-4" />
            {tauth("superadmin")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="user">
            <User className="mr-2 size-4" />
            {tauth("user")}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
