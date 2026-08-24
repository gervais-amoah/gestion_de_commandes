"use client"

import { useState, useCallback, useRef } from "react"
import { useOrders } from "@/hooks/useOrders"
import { OrderCard } from "@/components/OrderCard"
import { OrderFilters } from "@/components/OrderFilters"
import { OrderSkeleton } from "@/components/OrderSkeleton"
import { OrderDetailModal } from "@/components/OrderDetailModal"
import { Order } from "@/lib/types"
import { Virtuoso, VirtuosoHandle } from "react-virtuoso"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

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
    loadMore,
    clearFilters,
    isUpdating,
    refetch,
    totalPages,
  } = useOrders()

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const virtuosoRef = useRef<VirtuosoHandle>(null)

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

  // Loading state
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

  // Error state with retry
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

  // Empty state
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

  // Main view with virtualized list
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
        {isFetching && orders.length === 0 ? (
          <OrderSkeleton />
        ) : (
          <Virtuoso
            ref={virtuosoRef}
            data={orders}
            totalCount={total}
            endReached={loadMore}
            overscan={200}
            components={{
              Footer: () => {
                if (currentPage < totalPages && !isFetching) {
                  return (
                    <div className="py-4 text-center">
                      <Button
                        variant="outline"
                        onClick={loadMore}
                        disabled={isFetching}
                      >
                        Load More
                      </Button>
                    </div>
                  )
                }
                if (isFetching) {
                  return (
                    <div className="py-4">
                      <OrderSkeleton />
                    </div>
                  )
                }
                if (currentPage >= totalPages && total > 0) {
                  return (
                    <div className="py-8 text-center text-muted-foreground">
                      <p>You&apos;ve seen all {total} orders</p>
                    </div>
                  )
                }
                return null
              },
            }}
            itemContent={(index, order) => (
              <div className="mb-4">
                <OrderCard order={order} onView={handleViewOrder} />
              </div>
            )}
          />
        )}
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
