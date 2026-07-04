import { getTranslations } from "next-intl/server"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const orders = [
  { id: 1, bags: 50, gross: 3750, net: 3520, price: 28500, total: 100_320_000, date: "04/07/2026", status: "completed" },
  { id: 2, bags: 30, gross: 2250, net: 2110, price: 28500, total: 60_135_000, date: "04/07/2026", status: "completed" },
  { id: 3, bags: 80, gross: 6000, net: 5640, price: 28500, total: 160_740_000, date: "03/07/2026", status: "completed" },
  { id: 4, bags: 40, gross: 3000, net: 2810, price: 28000, total: 78_680_000, date: "02/07/2026", status: "completed" },
  { id: 5, bags: 60, gross: 4500, net: 4230, price: 28000, total: 118_440_000, date: "01/07/2026", status: "completed" },
]

export async function OrdersTable() {
  const t = await getTranslations()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("orders.orderCode")}</TableHead>
          <TableHead>{t("orders.totalBags")}</TableHead>
          <TableHead>{t("orders.netWeight")}</TableHead>
          <TableHead>{t("orders.unitPrice")}</TableHead>
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
            <TableCell>{o.price.toLocaleString()} {t("dashboard.vnd")}</TableCell>
            <TableCell>{o.total.toLocaleString()} {t("dashboard.vnd")}</TableCell>
            <TableCell>{o.date}</TableCell>
            <TableCell>
              <Badge variant="outline" className="text-green-600">{t("orders.completed")}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
