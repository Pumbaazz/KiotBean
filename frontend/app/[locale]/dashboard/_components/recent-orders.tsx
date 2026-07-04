import { getTranslations } from "next-intl/server"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const orders = [
  { id: 1, bags: 50, gross: 3750, net: 3520, total: 100_320_000, date: "04/07/2026", status: "completed" },
  { id: 2, bags: 30, gross: 2250, net: 2110, total: 60_135_000, date: "04/07/2026", status: "completed" },
  { id: 3, bags: 80, gross: 6000, net: 5640, total: 160_740_000, date: "03/07/2026", status: "completed" },
]

export async function RecentOrders() {
  const t = await getTranslations()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("orders.orderCode")}</TableHead>
          <TableHead>{t("orders.totalBags")}</TableHead>
          <TableHead>{t("orders.netWeight")}</TableHead>
          <TableHead>{t("orders.totalAmount")}</TableHead>
          <TableHead>{t("common.date")}</TableHead>
          <TableHead>{t("common.status")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((o) => (
          <TableRow key={o.id}>
            <TableCell className="font-medium">#{o.id}</TableCell>
            <TableCell>{o.bags}</TableCell>
            <TableCell>{o.net.toLocaleString()} {t("dashboard.kg")}</TableCell>
            <TableCell>{o.total.toLocaleString()} {t("dashboard.vnd")}</TableCell>
            <TableCell>{o.date}</TableCell>
            <TableCell>
              <Badge variant="outline" className="text-green-600">
                {t("orders.completed")}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
