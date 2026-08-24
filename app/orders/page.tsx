"use client"

import { OrderDetailModal } from "@/components/OrderDetailModal"
import { OrderFilters } from "@/components/OrderFilters"
import { OrderRow } from "@/components/OrderRow"
import { OrderSkeleton } from "@/components/OrderSkeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useOrders } from "@/hooks/useOrders"
import { Order } from "@/lib/types"
import { AlertCircle, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"
import { useCallback, useState } from "react"

export default function OrdersPage() {
  const {
    orders,
    total,
    currentPage,
    isLoading,
    isFetching,
    error,
    search,
    setSearch,
    selectedStatuses,
    setSelectedStatuses,
    handleStatusChange,
    goToPage, // <-- replaces loadMore; set current page directly
    clearFilters,
    isUpdating,
    refetch,
    totalPages,
  } = useOrders()

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleViewOrder = useCallback((order: Order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedOrder(null)
  }, [])

  const handleStatusToggle = useCallback(
    (status: Order["status"]) => {
      setSelectedStatuses((prev) =>
        prev.includes(status)
          ? prev.filter((s) => s !== status)
          : [...prev, status]
      )
    },
    [setSelectedStatuses]
  )

  const handleRetry = useCallback(() => {
    refetch()
  }, [refetch])

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) goToPage(currentPage - 1)
  }, [currentPage, goToPage])

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) goToPage(currentPage + 1)
  }, [currentPage, totalPages, goToPage])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Loading your orders...</p>
        </div>
        <OrderSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load orders</AlertTitle>
          <AlertDescription className="flex items-center gap-4">
            <span>
              There was an error loading your orders. Please try again.
            </span>
            <Button variant="outline" size="sm" onClick={handleRetry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (orders.length === 0 && !isFetching) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Orders</h1>
        </div>
        <OrderFilters
          search={search}
          onSearchChange={setSearch}
          selectedStatuses={selectedStatuses}
          onStatusToggle={handleStatusToggle}
          onClearFilters={clearFilters}
          totalResults={total}
        />
        <div className="mt-12 text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <AlertCircle className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No orders found</h3>
          <p className="text-muted-foreground">
            {search || selectedStatuses.length > 0
              ? "Try adjusting your filters to find what you're looking for."
              : "No orders have been placed yet."}
          </p>
          {(search || selectedStatuses.length > 0) && (
            <Button onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Main view with classic pagination
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Orders</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {total} total orders
            </span>
            {isFetching && (
              <span className="text-sm text-muted-foreground">
                (Updating...)
              </span>
            )}
          </div>
        </div>
      </div>

      <OrderFilters
        search={search}
        onSearchChange={setSearch}
        selectedStatuses={selectedStatuses}
        onStatusToggle={handleStatusToggle}
        onClearFilters={clearFilters}
        totalResults={total}
      />

      <div className="mt-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-[100px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFetching ? (
                <OrderSkeleton />
              ) : (
                orders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    onView={handleViewOrder}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination footer */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage <= 1 || isFetching}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>

          <div className="mx-2 flex items-center gap-1">
            {getPageNumbers(currentPage, totalPages).map((p, i) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="px-2 text-muted-foreground"
                >
                  …
                </span>
              ) : (
                <Button
                  key={p}
                  variant={p === currentPage ? "default" : "outline"}
                  size="sm"
                  className="w-9"
                  onClick={() => goToPage(p as number)}
                  disabled={isFetching}
                >
                  {p}
                </Button>
              )
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages || isFetching}
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}

      <OrderDetailModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onStatusChange={handleStatusChange}
        isUpdating={isUpdating}
      />
    </div>
  )
}

// Builds a compact page list like: 1 ... 4 5 [6] 7 8 ... 20
function getPageNumbers(current: number, total: number): (number | "...")[] {
  const delta = 1
  const range: (number | "...")[] = []
  const rangeStart = Math.max(2, current - delta)
  const rangeEnd = Math.min(total - 1, current + delta)

  range.push(1)
  if (rangeStart > 2) range.push("...")
  for (let i = rangeStart; i <= rangeEnd; i++) range.push(i)
  if (rangeEnd < total - 1) range.push("...")
  if (total > 1) range.push(total)

  return range
}
