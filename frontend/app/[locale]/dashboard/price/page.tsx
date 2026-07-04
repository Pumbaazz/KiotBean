"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPrice, setPrice } from "@/lib/api"
import { useRole } from "@/lib/use-role"
export default function PricePage() {
  const t = useTranslations()
  const { role } = useRole()
  const [priceState, setPriceState] = useState<number | null>(null)
  const [newPrice, setNewPrice] = useState("")

  useEffect(() => {
    getPrice().then((p) => {
      if (p) {
        setPriceState(p.price)
        setNewPrice(p.price.toString())
      }
    })
  }, [])

  const handleSetPrice = async () => {
    const val = parseFloat(newPrice)
    if (isNaN(val)) return
    const res = await setPrice(val)
    setPriceState(res.price)
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <h1 className="text-3xl font-bold">{t("price.title")}</h1>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>{t("price.currentPrice")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={priceState !== null ? "text-4xl font-bold text-primary" : "text-muted-foreground"}>
            {priceState !== null ? `${priceState.toLocaleString()} ${t("dashboard.vnd")}/${t("dashboard.kg")}` : t("price.noPrice")}
          </p>
        </CardContent>
      </Card>

      {role === "superadmin" && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>{t("price.updatePrice")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="price">{t("price.newPrice")}</Label>
              <Input id="price" type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
            </div>
            <Button onClick={handleSetPrice} className="w-full">{t("price.update")}</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
