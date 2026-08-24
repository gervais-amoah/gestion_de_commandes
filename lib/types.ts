export interface Order {
  id: string
  customerName: string
  email: string
  total: number
  status: "pending" | "processing" | "completed" | "cancelled"
  createdAt: string
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export type OrderStatus = Order["status"]
export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "completed",
  "cancelled",
]

export interface OrdersResponse {
  orders: Order[]
  total: number
  page: number
  totalPages: number
}
