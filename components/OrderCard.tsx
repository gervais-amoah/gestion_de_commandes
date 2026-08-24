"use client"

import { Order, OrderStatus } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Eye } from "lucide-react"
import { memo } from "react"

interface OrderCardProps {
  order: Order
  onView: (order: Order) => void
}

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
}

export const OrderCard = memo(function OrderCard({
  order,
  onView,
}: OrderCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold">{order.id}</span>
              <Badge className={statusColors[order.status]}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            <p className="text-sm font-medium">{order.customerName}</p>
            <p className="truncate text-sm text-muted-foreground">
              {order.email}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{formatDate(order.createdAt)}</span>
              <span>•</span>
              <span>{order.items.length} items</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3 sm:ml-0">
            <span className="text-lg font-bold">
              {formatCurrency(order.total)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(order)}
              aria-label={`View order ${order.id}`}
            >
              <Eye className="mr-1 h-4 w-4" />
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
