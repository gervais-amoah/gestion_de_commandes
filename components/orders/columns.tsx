"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Order, OrderStatus } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Eye } from "lucide-react"

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
}

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
        <DataTableColumnHeader column={column} title="Order" />
      ),
      cell: ({ row }) => (
        <span className="text-sm font-semibold">{row.original.id}</span>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge className={statusColors[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "customerName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Customer" />
      ),
      cell: ({ row }) => (
        <div className="min-w-0">
          <p className="text-sm font-medium">{row.original.customerName}</p>
          <p className="truncate text-sm text-muted-foreground">
            {row.original.email}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: "items",
      header: "Items",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.items.length}
        </span>
      ),
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total" />
      ),
      meta: { headerClassName: "text-right", cellClassName: "text-right" },
      cell: ({ row }) => (
        <span className="text-sm font-bold">
          {formatCurrency(row.original.total)}
        </span>
      ),
    },
    {
      id: "actions",
      enableSorting: false,
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(row.original)}
          aria-label={`View order ${row.original.id}`}
        >
          <Eye className="mr-1 h-4 w-4" />
          View
        </Button>
      ),
    },
  ]
}
