"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPrice, createPurchaseOrder } from "@/lib/api"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
export default function CreateOrderPage() {
  const t = useTranslations()
  const [currentPrice, setCurrentPrice] = useState(0)
  const [form, setForm] = useState({
    totalBags: 50,
    grossWeight: 3750,
    bagTareWeight: 500,
    moisture: 16,
    impurityRate: 1.5,
    unitPrice: 28500,
    paymentMethod: "Tiền mặt",
  })
  const [result, setResult] = useState<{ id: number; netWeight: number; totalAmount: number } | null>(null)

  useEffect(() => {
    getPrice().then((p) => {
      if (p) setForm((f) => ({ ...f, unitPrice: p.price }))
    })
  }, [])

  const netWeight =
    form.grossWeight -
    form.bagTareWeight -
    form.grossWeight * (form.impurityRate / 100) -
    (form.moisture > 15 ? form.grossWeight * ((form.moisture - 15) / 100) : 0)

  const totalAmount = netWeight * form.unitPrice

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await createPurchaseOrder({
      totalBags: form.totalBags,
      grossWeight: form.grossWeight,
      bagTareWeight: form.bagTareWeight,
      moisture: form.moisture,
      impurityRate: form.impurityRate,
      unitPrice: form.unitPrice,
      paymentMethod: form.paymentMethod,
    })
    setResult(res)
  }

  if (result) {
    return (
      <div className="mx-auto flex max-w-lg flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("orders.orderCreated")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p className="text-sm">{t("orders.orderId")} <strong className="font-semibold">#{result.id}</strong></p>
            <p className="text-sm">{t("orders.netWeight")}: <strong className="font-semibold">{result.netWeight.toFixed(2)} {t("dashboard.kg")}</strong></p>
            <p className="text-sm">{t("orders.totalAmount")}: <strong className="font-semibold">{result.totalAmount.toLocaleString()} {t("dashboard.vnd")}</strong></p>
            <Link href="/dashboard/orders">
              <Button variant="outline" className="mt-2">
                <ArrowLeft className="mr-1 size-4" />
                {t("orders.backToList")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/orders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{t("orders.createOrder")}</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="totalBags">{t("orders.totalBags")}</Label>
            <Input id="totalBags" type="number" value={form.totalBags} onChange={(e) => setForm({ ...form, totalBags: +e.target.value })} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="grossWeight">{t("orders.grossWeight")} (kg)</Label>
            <Input id="grossWeight" type="number" value={form.grossWeight} onChange={(e) => setForm({ ...form, grossWeight: +e.target.value })} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="bagTareWeight">{t("orders.bagTareWeight")} (kg)</Label>
            <Input id="bagTareWeight" type="number" value={form.bagTareWeight} onChange={(e) => setForm({ ...form, bagTareWeight: +e.target.value })} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="moisture">{t("orders.moisture")} (%)</Label>
            <Input id="moisture" type="number" step="0.1" value={form.moisture} onChange={(e) => setForm({ ...form, moisture: +e.target.value })} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="impurityRate">{t("orders.impurityRate")} (%)</Label>
            <Input id="impurityRate" type="number" step="0.1" value={form.impurityRate} onChange={(e) => setForm({ ...form, impurityRate: +e.target.value })} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="unitPrice">{t("orders.unitPrice")} ({t("dashboard.vnd")})</Label>
            <Input id="unitPrice" type="number" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: +e.target.value })} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="paymentMethod">{t("orders.paymentMethod")}</Label>
          <Input id="paymentMethod" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} />
        </div>

        <Card className="bg-muted">
          <CardContent className="pt-4 flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">{t("orders.netWeight")}: <span className="font-semibold text-foreground">{netWeight.toFixed(2)} {t("dashboard.kg")}</span></p>
            <p className="text-sm text-muted-foreground">{t("orders.totalAmount")}: <span className="font-semibold text-foreground">{totalAmount.toLocaleString()} {t("dashboard.vnd")}</span></p>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">{t("orders.createOrder")}</Button>
      </form>
    </div>
  )
}
