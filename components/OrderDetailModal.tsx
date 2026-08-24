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
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  Calendar,
  Clock,
  CreditCard,
  Mail,
  Package,
  Tag,
  Truck,
  User,
  X,
} from "lucide-react"
import { memo, useCallback } from "react"

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
    icon: <Clock className="h-3 w-3" />,
    color: "bg-amber-50 text-amber-600 border-amber-200",
    label: "En attente",
  },
  processing: {
    icon: <Package className="h-3 w-3" />,
    color: "bg-blue-50 text-blue-600 border-blue-200",
    label: "En traitement",
  },
  completed: {
    icon: <Package className="h-3 w-3" />,
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    label: "Terminée",
  },
  cancelled: {
    icon: <X className="h-3 w-3" />,
    color: "bg-rose-50 text-rose-600 border-rose-200",
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

  if (!order) return null

  const statusConfig = STATUS_CONFIG[order.status]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] w-full max-w-lg overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="relative border-b border-slate-100 px-6 py-5">
          <div className="">
            <DialogTitle className="text-2xl font-semibold tracking-tight text-slate-900">
              Commande {order.id}
            </DialogTitle>
          </div>

          <div className="mt-3 flex items-center justify-between pr-10">
            <Badge
              variant="outline"
              className={`${statusConfig.color} p-3 text-xs font-medium`}
            >
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {statusConfig.label}
              </span>
            </Badge>
            <div className="text-right">
              <p className="text-xs font-medium text-slate-500 uppercase">
                Total
              </p>
              <p className="text-xl font-bold text-slate-900">
                {formatCurrency(order.total)}
              </p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-8rem)] px-6 py-5">
          <div className="space-y-4">
            {/* Informations client Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                <User className="h-4 w-4 text-slate-500" />
                Informations client
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-slate-900">
                    {order.customerName}
                  </p>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <Mail className="h-3.5 w-3.5" />
                    {order.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Détails de la commande Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                Détails de la commande
              </div>
              <div className="space-y-3">
                <Row
                  icon={<Calendar className="h-4 w-4 text-slate-400" />}
                  label="Date"
                >
                  {/* {formatDate(order.createdAt)} */}
                  {format(new Date(order.createdAt), "dd MMMM yyyy, HH:mm", {
                    locale: fr,
                  })}
                </Row>
                <Row
                  icon={<Tag className="h-4 w-4 text-slate-400" />}
                  label="ID de commande"
                >
                  {order.id}
                </Row>
                <Row
                  icon={<CreditCard className="h-4 w-4 text-slate-400" />}
                  label="Mode de paiement"
                >
                  Carte bancaire
                </Row>
                <Row
                  icon={<Truck className="h-4 w-4 text-slate-400" />}
                  label="Méthode de livraison"
                >
                  Livraison standard
                </Row>
                <Row
                  icon={<Clock className="h-4 w-4 text-slate-400" />}
                  label="Statut"
                >
                  <span
                    className={`font-medium ${statusConfig.color.split(" ")[1]}`}
                  >
                    {statusConfig.label}
                  </span>
                </Row>
              </div>
            </div>

            {/* Articles Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                Articles ({order.items.length})
              </div>

              {order.items.length === 0 ? (
                <div className="py-6 text-center text-sm text-slate-500">
                  Aucun article dans cette commande
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                        <Package className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-slate-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Quantité: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-slate-900">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status Update Section (kept functional but styled minimally) */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <label className="mb-2 block text-xs font-medium tracking-wider text-slate-500 uppercase">
                Mettre à jour le statut
              </label>
              <Select
                value={order.status}
                onValueChange={handleStatusChange}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-full">
                  {order.status ? (
                    <span>{STATUS_CONFIG[order.status].label}</span>
                  ) : (
                    <SelectValue placeholder="Sélectionner un statut" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map(
                    (status) => (
                      <SelectItem
                        key={status}
                        value={status}
                        className="capitalize"
                      >
                        {STATUS_CONFIG[status].label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              {isUpdating && <Skeleton className="mt-2 h-4 w-20" />}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
})

// Helper component for detail rows to keep code clean
function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2.5 text-slate-600">
        {icon}
        <span>{label}</span>
      </div>
      <div className="font-medium text-slate-900">{children}</div>
    </div>
  )
}
