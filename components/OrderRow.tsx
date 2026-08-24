// components/OrderRow.tsx
"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { Order, OrderStatus } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Eye } from "lucide-react"
import { memo } from "react"

interface OrderRowProps {
  order: Order
  onView: (order: Order) => void
}

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
}

export const OrderRow = memo(function OrderRow({
  order,
  onView,
}: OrderRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold">{order.id}</span>
          <Badge className={`w-fit ${statusColors[order.status]}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
      </TableCell>
      <TableCell className="min-w-0">
        <p className="text-sm font-medium">{order.customerName}</p>
        <p className="truncate text-sm text-muted-foreground">{order.email}</p>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatDate(order.createdAt)}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {order.items.length}
      </TableCell>
      <TableCell className="text-right text-sm font-bold">
        {formatCurrency(order.total)}
      </TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(order)}
          aria-label={`View order ${order.id}`}
        >
          <Eye className="mr-1 h-4 w-4" />
          View
        </Button>
      </TableCell>
    </TableRow>
  )
})
