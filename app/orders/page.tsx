"use client"

import { OrderDetailModal } from "@/components/OrderDetailModal"
import { OrderFilters } from "@/components/OrderFilters"
import { OrdersTable } from "@/components/orders/OrdersTable"
import { DataTablePagination } from "@/components/data-table/DataTablePagination"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useOrders } from "@/hooks/useOrders"
import { Order } from "@/lib/types"
import { AlertCircle, RefreshCw } from "lucide-react"
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
    goToPage,
    clearFilters,
    isUpdating,
    refetch,
    totalPages,
    sorting,
    setSorting,
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

  const handleRetry = useCallback(() => refetch(), [refetch])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Loading your orders...</p>
        </div>
        <OrdersTable
          orders={[]}
          isFetching
          sorting={sorting}
          onSortingChange={setSorting}
          onView={handleViewOrder}
        />
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
        <OrdersTable
          orders={orders}
          isFetching={isFetching}
          sorting={sorting}
          onSortingChange={setSorting}
          onView={handleViewOrder}
        />
      </div>

      <div className="mt-8 flex justify-center">
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          disabled={isFetching}
        />
      </div>

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
