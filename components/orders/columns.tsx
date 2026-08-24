// /components/orders/columns.ts
"use client"

import { memo } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Order } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Eye } from "lucide-react"
import { StatusBadge } from "./StatusBadge"

// --- Memoized Cell Components ---

const IdCell = memo(function IdCell({ id }: { id: string }) {
  return <span className="text-sm font-semibold">{id}</span>
})

// ✅ Simplified: delegates entirely to StatusBadge
const StatusCell = memo(function StatusCell({
  status,
}: {
  status: Order["status"]
}) {
  return <StatusBadge status={status} variant="compact" />
})

const CustomerCell = memo(function CustomerCell({
  name,
  email,
}: {
  name: string
  email: string
}) {
  return (
    <div className="min-w-0">
      <p className="text-sm font-medium">{name}</p>
      <p className="truncate text-sm text-muted-foreground">{email}</p>
    </div>
  )
})

const DateCell = memo(function DateCell({ date }: { date: string }) {
  return (
    <span className="text-sm text-muted-foreground">{formatDate(date)}</span>
  )
})

const ItemsCell = memo(function ItemsCell({ count }: { count: number }) {
  return <span className="text-sm text-muted-foreground">{count}</span>
})

const TotalCell = memo(function TotalCell({ total }: { total: number }) {
  return <span className="text-sm font-bold">{formatCurrency(total)}</span>
})

const ActionsCell = memo(function ActionsCell({
  orderId,
  onView,
}: {
  orderId: string
  onView: () => void
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onView}
      aria-label={`Voir la commande ${orderId}`}
    >
      <Eye className="mr-1 h-4 w-4" />
      Voir
    </Button>
  )
})

// --- Column Definitions ---

interface GetOrderColumnsOptions {
  onView: (order: Order) => void
}

export function getOrderColumns({
  onView,
}: GetOrderColumnsOptions): ColumnDef<Order>[] {
  return [
    {
      accessorKey: "id",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Commande" />
      ),
      cell: ({ row }) => <IdCell id={row.original.id} />,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Statut" />
      ),
      cell: ({ row }) => <StatusCell status={row.original.status} />,
    },
    {
      accessorKey: "customerName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Client" />
      ),
      cell: ({ row }) => (
        <CustomerCell
          name={row.original.customerName}
          email={row.original.email}
        />
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => <DateCell date={row.original.createdAt} />,
    },
    {
      id: "items",
      header: "Articles",
      enableSorting: false,
      cell: ({ row }) => <ItemsCell count={row.original.items.length} />,
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total" />
      ),
      meta: { headerClassName: "text-right", cellClassName: "text-right" },
      cell: ({ row }) => <TotalCell total={row.original.total} />,
    },
    {
      id: "actions",
      enableSorting: false,
      cell: ({ row }) => (
        <ActionsCell
          orderId={row.original.id}
          onView={() => onView(row.original)}
        />
      ),
    },
  ]
}
