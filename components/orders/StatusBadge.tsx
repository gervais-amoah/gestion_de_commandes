// components/orders/StatusBadge.tsx

import { Badge } from "@/components/ui/badge"
import { OrderStatus } from "@/lib/types"
import { Clock, Package, CheckCircle2, XCircle } from "lucide-react"
import { memo } from "react"

export const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; className: string; icon: React.ReactNode }
> = {
  pending: {
    label: "En attente",
    className: "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100",
    icon: <Clock className="mr-1 h-3 w-3" />,
  },
  processing: {
    label: "En traitement",
    className: "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100",
    icon: <Package className="mr-1 h-3 w-3" />,
  },
  completed: {
    label: "Terminée",
    className:
      "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100",
    icon: <CheckCircle2 className="mr-1 h-3 w-3" />,
  },
  cancelled: {
    label: "Annulée",
    className: "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100",
    icon: <XCircle className="mr-1 h-3 w-3" />,
  },
}

interface StatusBadgeProps {
  status: OrderStatus
  variant?: "default" | "compact" // compact hides icon for dense tables
}

export const StatusBadge = memo(function StatusBadge({
  status,
  variant = "default",
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]

  return (
    <Badge variant="outline" className={`font-medium ${config.className}`}>
      {variant === "default" && config.icon}
      {config.label}
    </Badge>
  )
})
