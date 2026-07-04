import { getTranslations } from "next-intl/server"
import { Coffee, ShoppingCart, Wallet, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RecentOrders } from "./_components/recent-orders"
export default async function DashboardPage() {
  const t = await getTranslations()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-foreground">{t("dashboard.title")}</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-t-3 border-primary shadow-sm">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("dashboard.totalOrders")}</CardTitle>
            <ShoppingCart className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-t-3 border-primary shadow-sm">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("dashboard.netWeightToday")}</CardTitle>
            <Coffee className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2,450 {t("dashboard.kg")}</div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-t-3 border-primary shadow-sm">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("dashboard.totalExpenseToday")}</CardTitle>
            <Wallet className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">48.5 {t("common.total")}</div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-t-3 border-primary shadow-sm">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("dashboard.currentPrice")}</CardTitle>
            <DollarSign className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">28,500 {t("dashboard.vnd")}/{t("dashboard.kg")}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>{t("dashboard.recentOrders")}</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentOrders />
        </CardContent>
      </Card>
    </div>
  )
}
