import client from "./client"

export async function getPrice(): Promise<{ price: number } | null> {
  try {
    const { data } = await client.get("/api/price")
    return data
  } catch {
    return null
  }
}

export async function setPrice(price: number): Promise<{ price: number }> {
  const { data } = await client.post("/api/price", { price })
  return data
}

export async function createPurchaseOrder(data: {
  totalBags: number
  grossWeight: number
  bagTareWeight: number
  moisture: number
  impurityRate: number
  unitPrice: number
  paymentMethod: string
}) {
  const { data: res } = await client.post("/api/purchase-orders", data)
  return res
}
