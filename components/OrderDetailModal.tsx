// components/orders/order-detail-modal.tsx
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
import { Skeleton } from "@/components/ui/skeleton"
import { Order, OrderStatus } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import { AlertCircle, CheckCircle2, Clock, Copy, XCircle } from "lucide-react"
import { memo, useCallback } from "react"
import { toast } from "sonner"

interface OrderDetailModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
  onStatusChange: (orderId: string, status: OrderStatus) => void
  isUpdating: boolean
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { icon: React.ReactNode; color: string; label: string }
> = {
  pending: {
    icon: <Clock className="h-3.5 w-3.5" />,
    color: "bg-amber-500/15 text-amber-600 border-amber-500/25",
    label: "En attente",
  },
  processing: {
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    color: "bg-blue-500/15 text-blue-600 border-blue-500/25",
    label: "En traitement",
  },
  completed: {
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    color: "bg-emerald-500/15 text-emerald-600 border-emerald-500/25",
    label: "Terminée",
  },
  cancelled: {
    icon: <XCircle className="h-3.5 w-3.5" />,
    color: "bg-rose-500/15 text-rose-600 border-rose-500/25",
    label: "Annulée",
  },
}

export const OrderDetailModal = memo(function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onStatusChange,
  isUpdating,
}: OrderDetailModalProps) {
  const handleStatusChange = useCallback(
    (value: OrderStatus | null) => {
      if (!value || !order) return
      onStatusChange(order.id, value)
    },
    [order, onStatusChange]
  )

  const handleCopyOrderId = useCallback(async () => {
    if (!order) return
    try {
      await navigator.clipboard.writeText(order.id)
      toast.success("Order ID copied to clipboard")
    } catch {
      toast.error("Failed to copy order ID")
    }
  }, [order])

  if (!order) return null

  const statusConfig = STATUS_CONFIG[order.status]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] w-full max-w-2xl overflow-hidden p-0 sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
        <DialogHeader className="border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
              <DialogTitle className="truncate text-base font-semibold tracking-tight sm:text-lg md:text-xl">
                Commande #{order.id.slice(0, 8)}
              </DialogTitle>
              <button
                onClick={handleCopyOrderId}
                className="shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                aria-label="Copy order ID"
                type="button"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
            <Badge
              className={`${statusConfig.color} mr-8 shrink-0 px-2.5 py-1 text-xs font-medium capitalize`}
            >
              <span className="flex items-center gap-1.5">
                {statusConfig.icon}
                {statusConfig.label}
              </span>
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-8rem)] px-4 py-4 sm:px-6">
          <div className="space-y-5 sm:space-y-6">
            {/* Customer & Date - Responsive Grid */}
            <div className="grid grid-cols-1 gap-3 rounded-lg bg-slate-50 p-3 sm:grid-cols-2 sm:gap-4 sm:p-4">
              <div className="space-y-0.5">
                <p className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                  Client
                </p>
                <p className="font-medium text-slate-900">
                  {order.customerName}
                </p>
                <p className="text-sm text-slate-600">{order.email}</p>
              </div>
              <div className="space-y-0.5 sm:text-right">
                <p className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                  Date
                </p>
                <p className="font-medium text-slate-900">
                  {formatDate(order.createdAt)}
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {formatCurrency(order.total)}
                </p>
              </div>
            </div>

            {/* Status Update */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                Mettre à jour le statut
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <Select
                  value={order.status}
                  onValueChange={handleStatusChange}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="w-full sm:w-[200px] lg:w-[220px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      [
                        "pending",
                        "processing",
                        "completed",
                        "cancelled",
                      ] as const
                    ).map((status) => (
                      <SelectItem
                        key={status}
                        value={status}
                        className="capitalize"
                      >
                        {STATUS_CONFIG[status].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isUpdating && <Skeleton className="h-4 w-20 shrink-0" />}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                Adresse de livraison
              </p>
              <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm leading-relaxed">
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}</p>
                <p className="text-slate-600">
                  {order.shippingAddress.country}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                  Articles ({order.items.length})
                </p>
              </div>
              {order.items.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                  Aucun article dans cette commande
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <div className="divide-y divide-slate-100">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-1 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-slate-900">
                            {item.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {item.quantity} × {formatCurrency(item.price)}
                          </p>
                        </div>
                        <p className="font-medium text-slate-900 sm:ml-4 sm:shrink-0">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t-2 border-slate-200 bg-slate-50 px-3 py-3 font-semibold">
                    <p className="text-sm tracking-wider text-slate-600 uppercase">
                      Total
                    </p>
                    <p className="text-base">{formatCurrency(order.total)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
})
