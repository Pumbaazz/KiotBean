import { getTranslations } from "next-intl/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus } from "lucide-react"
const records = [
  { id: 1, type: "CHI", amount: 100_320_000, date: "04/07/2026" },
  { id: 2, type: "CHI", amount: 60_135_000, date: "04/07/2026" },
  { id: 3, type: "THU", amount: 500_000_000, date: "03/07/2026" },
  { id: 4, type: "CHI", amount: 160_740_000, date: "03/07/2026" },
]

export default async function CashFlowPage() {
  const t = await getTranslations()
  const totalIn = records.filter((r) => r.type === "THU").reduce((s, r) => s + r.amount, 0)
  const totalOut = records.filter((r) => r.type === "CHI").reduce((s, r) => s + r.amount, 0)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">{t("cashflow.title")}</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("cashflow.totalIn")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-lg font-bold">
              <Plus className="text-green-600" />
              {totalIn.toLocaleString()} {t("dashboard.vnd")}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("cashflow.totalOut")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-lg font-bold">
              <Minus className="text-red-500" />
              {totalOut.toLocaleString()} {t("dashboard.vnd")}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("cashflow.balance")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-lg font-bold">{(totalIn - totalOut).toLocaleString()} {t("dashboard.vnd")}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("cashflow.type")}</TableHead>
                <TableHead>{t("cashflow.amount")}</TableHead>
                <TableHead>{t("cashflow.category")}</TableHead>
                <TableHead>{t("common.date")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <Badge variant={r.type === "THU" ? "default" : "destructive"}>{r.type}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{r.amount.toLocaleString()} {t("dashboard.vnd")}</TableCell>
                  <TableCell>{t("cashflow.in")}</TableCell>
                  <TableCell>{r.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
