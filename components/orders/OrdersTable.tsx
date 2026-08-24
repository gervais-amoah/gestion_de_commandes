"use client"

import { useMemo } from "react"
import { OnChangeFn, SortingState } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table/DataTable"
import { getOrderColumns } from "./columns"
import { Order } from "@/lib/types"

interface OrdersTableProps {
  orders: Order[]
  isFetching: boolean
  sorting: SortingState
  onSortingChange: OnChangeFn<SortingState>
  onView: (order: Order) => void
}

export function OrdersTable({
  orders,
  isFetching,
  sorting,
  onSortingChange,
  onView,
}: OrdersTableProps) {
  const columns = useMemo(() => getOrderColumns({ onView }), [onView])

  return (
    <DataTable
      columns={columns}
      data={orders}
      sorting={sorting}
      onSortingChange={onSortingChange}
      isFetching={isFetching}
      skeletonRowCount={10}
      emptyMessage="No orders found."
    />
  )
}
