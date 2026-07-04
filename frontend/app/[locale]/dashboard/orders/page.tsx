import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { OrdersTable } from "../_components/orders-table"
export default async function OrdersPage() {
  const t = await getTranslations()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("orders.title")}</h1>
        <Link href="/dashboard/orders/create">
          <Button>
            <Plus className="mr-1 size-4" />
            {t("orders.createOrder")}
          </Button>
        </Link>
      </div>
      <div className="shadow-sm">
        <OrdersTable />
      </div>
    </div>
  )
}
