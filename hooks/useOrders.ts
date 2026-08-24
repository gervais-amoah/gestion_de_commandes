"use client"

import { fetchOrders, updateOrderStatus } from "@/lib/api"
import { Order, OrderStatus, OrdersResponse } from "@/lib/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useDebounce } from "./useDebounce"

const PAGE_SIZE = 10 // Show 10 orders per page for better pagination demo

export function useOrders() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<OrderStatus[]>([])

  const debouncedSearch = useDebounce(search, 300)
  const queryClient = useQueryClient()

  // Query for orders
  const { data, isLoading, isFetching, error, refetch } =
    useQuery<OrdersResponse>({
      queryKey: ["orders", page, debouncedSearch, selectedStatuses],
      queryFn: () =>
        fetchOrders(page, PAGE_SIZE, debouncedSearch, selectedStatuses),
      staleTime: 30 * 1000, // 30 seconds
    })

  // Mutation for updating order status
  const statusMutation = useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: string
      status: OrderStatus
    }) => updateOrderStatus(orderId, status),
    onMutate: async ({ orderId, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["orders"] })

      // Snapshot previous value
      const previousOrders = queryClient.getQueryData<OrdersResponse>([
        "orders",
        page,
        debouncedSearch,
        selectedStatuses,
      ])

      // Optimistically update
      queryClient.setQueryData<OrdersResponse>(
        ["orders", page, debouncedSearch, selectedStatuses],
        (old) => {
          if (!old) return old
          return {
            ...old,
            orders: old.orders.map((order: Order) =>
              order.id === orderId ? { ...order, status } : order
            ),
          }
        }
      )

      return { previousOrders }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousOrders) {
        queryClient.setQueryData(
          ["orders", page, debouncedSearch, selectedStatuses],
          context.previousOrders
        )
      }
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    statusMutation.mutate({ orderId, status })
  }

  const loadMore = () => {
    if (data && page < data.totalPages) {
      setPage((prev) => prev + 1)
    }
  }

  const goToPage = (newPage: number) => {
    const maxPage = data?.totalPages ?? 1
    const clamped = Math.min(Math.max(newPage, 1), maxPage)
    setPage(clamped)
  }

  const clearFilters = () => {
    setSearch("")
    setSelectedStatuses([])
    setPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleStatusesChange = (
    updater: OrderStatus[] | ((prev: OrderStatus[]) => OrderStatus[])
  ) => {
    setSelectedStatuses(updater)
    setPage(1)
  }

  return {
    orders: data?.orders || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    currentPage: page,
    isLoading,
    isFetching,
    error,
    search,
    setSearch: handleSearchChange,
    selectedStatuses,
    setSelectedStatuses: handleStatusesChange,
    handleStatusChange,
    loadMore,
    goToPage,
    clearFilters,
    isUpdating: statusMutation.isPending,
    refetch,
  }
}
