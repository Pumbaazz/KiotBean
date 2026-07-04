import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // ponytail: static detail view, wire to API when backend endpoint exists
  if (id !== "1" && id !== "2" && id !== "3") notFound()

  const t = await getTranslations()
  const order = { id: +id, bags: 50, gross: 3750, net: 3520, price: 28500, total: 100_320_000, date: "04/07/2026", moisture: 16, impurity: 1.5, payment: "Tiền mặt" }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/orders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{t("orders.orderCode")}{order.id}</h1>
        <Badge variant="outline" className="text-green-600">{t("orders.completed")}</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-sm">{t("orders.orderInfo")}</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("orders.totalBags")}</span><span className="font-medium">{order.bags}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("orders.grossWeight")}</span><span className="font-medium">{order.gross} {t("dashboard.kg")}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("orders.moisture")}</span><span className="font-medium">{order.moisture}%</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("orders.impurityRate")}</span><span className="font-medium">{order.impurity}%</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">{t("orders.payment")}</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("orders.netWeight")}</span><span className="font-medium">{order.net} {t("dashboard.kg")}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("orders.unitPrice")}</span><span className="font-medium">{order.price.toLocaleString()} {t("dashboard.vnd")}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("orders.totalAmount")}</span><span className="font-semibold">{order.total.toLocaleString()} {t("dashboard.vnd")}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("orders.paymentMethod")}</span><span className="font-medium">{order.payment}</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
