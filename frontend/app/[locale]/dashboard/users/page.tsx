import { getTranslations } from "next-intl/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Shield, User } from "lucide-react"
const users = [
  { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@example.com", role: "superadmin" as const },
  { id: 2, name: "Trần Thị B", email: "tranthib@example.com", role: "user" as const },
  { id: 3, name: "Lê Văn C", email: "levanc@example.com", role: "user" as const },
]

export default async function UsersPage() {
  const t = await getTranslations()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">{t("users.title")}</h1>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>{t("users.userList")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("users.name")}</TableHead>
                <TableHead>{t("users.email")}</TableHead>
                <TableHead>{t("users.role")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Badge variant={u.role === "superadmin" ? "default" : "outline"} className="gap-1">
                      {u.role === "superadmin" ? <Shield className="size-3" /> : <User className="size-3" />}
                      {u.role === "superadmin" ? t("auth.superadmin") : t("auth.user")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
