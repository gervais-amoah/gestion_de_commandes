"use client"

import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Order, OrderStatus } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react"
import { memo } from "react"

interface OrderDetailModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
  onStatusChange: (orderId: string, status: OrderStatus) => void
  isUpdating: boolean
}

const statusIcons: Record<OrderStatus, React.ReactNode> = {
  pending: <Clock className="h-4 w-4" />,
  processing: <AlertCircle className="h-4 w-4" />,
  completed: <CheckCircle2 className="h-4 w-4" />,
  cancelled: <XCircle className="h-4 w-4" />,
}

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
}

export const OrderDetailModal = memo(function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onStatusChange,
  isUpdating,
}: OrderDetailModalProps) {
  if (!order) return null

  const handleStatusChange = (value: OrderStatus | null) => {
    // value can be null when the selection is cleared; ignore that case
    if (value === null) return
    if (["pending", "processing", "completed", "cancelled"].includes(value)) {
      onStatusChange(order.id, value)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="grid max-h-[90vh] max-w-3xl grid-rows-[auto_1fr] overflow-hidden">
        <DialogHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <DialogTitle className="text-xl">Order {order.id}</DialogTitle>
            <Badge
              className={`${statusColors[order.status]} px-3 py-1 text-sm`}
            >
              <span className="flex items-center gap-1">
                {statusIcons[order.status]}
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </Badge>
          </div>
        </DialogHeader>
        <ScrollArea className="min-h-0 flex-1 pr-4">
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="grid grid-cols-1 gap-4 rounded-lg bg-muted/50 p-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Customer
                </p>
                <p className="font-semibold">{order.customerName}</p>
                <p className="text-sm text-muted-foreground">{order.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Order Date
                </p>
                <p className="font-semibold">{formatDate(order.createdAt)}</p>
                <p className="text-sm text-muted-foreground">
                  Total: {formatCurrency(order.total)}
                </p>
              </div>
            </div>

            {/* Status Update */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Update Status
              </p>
              <Select
                value={order.status}
                onValueChange={handleStatusChange}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["pending", "processing", "completed", "cancelled"].map(
                    (status) => (
                      <SelectItem
                        key={status}
                        value={status}
                        className="capitalize"
                      >
                        {status}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Shipping Address */}
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                Shipping Address
              </p>
              <div className="rounded-lg bg-muted/30 p-4 text-sm">
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Items */}
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                Items ({order.items.length})
              </p>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg bg-muted/30 p-3"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
                <div className="flex justify-between rounded-lg bg-muted/50 p-3 font-bold">
                  <p>Total</p>
                  <p>{formatCurrency(order.total)}</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
})
