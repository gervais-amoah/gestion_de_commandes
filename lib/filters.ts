// /lib/filters.ts
import type { Order, OrderStatus } from "@/lib/types"

export function getStatusCounts(orders: Order[]): Record<OrderStatus, number> {
  return orders.reduce<Record<OrderStatus, number>>(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    },
    {
      pending: 0,
      processing: 0,
      completed: 0,
      cancelled: 0,
    }
  )
}
