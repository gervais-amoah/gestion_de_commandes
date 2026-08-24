// components/orders/order-detail-modal.tsx
"use client"

import { Button } from "@/components/ui/button"
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
  CreditCard,
  Mail,
  Package,
  Tag,
  Truck,
  User,
  X,
} from "lucide-react"
import { memo, useCallback } from "react"
import { STATUS_CONFIG, StatusBadge } from "./orders/StatusBadge"

interface OrderDetailModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
  onStatusChange: (orderId: string, status: OrderStatus) => void
  isUpdating: boolean
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] w-full max-w-lg overflow-hidden p-0 sm:max-w-lg">
        {/* Custom Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full hover:bg-slate-100"
        >
          <X className="h-4 w-4 text-slate-500" />
          <span className="sr-only">Fermer</span>
        </Button>

        <DialogHeader className="border-b border-slate-100 px-6 py-5 pr-12">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">
              Commande {order.id}
            </DialogTitle>
            <div className="shrink-0 text-right">
              <p className="text-xs font-medium text-slate-500 uppercase">
                Total
              </p>
              <p className="text-xl font-bold text-slate-900">
                {formatCurrency(order.total)}
              </p>
            </div>
          </div>

          <div className="mt-3">
            <StatusBadge status={order.status} variant="default" />
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
                  icon={<Package className="h-4 w-4 text-slate-400" />}
                  label="Statut"
                >
                  <StatusBadge status={order.status} variant="compact" />
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

            {/* Status Update Section */}
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

// Helper component for detail rows
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
