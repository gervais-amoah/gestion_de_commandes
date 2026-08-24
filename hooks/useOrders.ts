// hooks/useOrders.ts

"use client"

import { fetchOrders, updateOrderStatus } from "@/lib/api"
import {
  Order,
  OrderSortColumn,
  OrdersResponse,
  OrderStatus,
  SortDirection,
} from "@/lib/types"
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { OnChangeFn, SortingState } from "@tanstack/react-table"
import { useState } from "react"
import { useDebounce } from "./useDebounce"

const PAGE_SIZE = 10

function ordersQueryKey(
  page: number,
  search: string,
  statuses: OrderStatus[],
  sortBy: OrderSortColumn,
  sortDir: SortDirection
) {
  return ["orders", page, search, statuses, sortBy, sortDir] as const
}

export function useOrders() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<OrderStatus[]>([])
  const [sorting, setSortingState] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ])

  const debouncedSearch = useDebounce(search, 300)
  const queryClient = useQueryClient()

  const sortBy = (sorting[0]?.id as OrderSortColumn) ?? "createdAt"
  const sortDir: SortDirection = sorting[0]?.desc ? "desc" : "asc"

  const queryKey = ordersQueryKey(
    page,
    debouncedSearch,
    selectedStatuses,
    sortBy,
    sortDir
  )

  const { data, isLoading, isFetching, error, refetch } =
    useQuery<OrdersResponse>({
      queryKey,
      queryFn: () =>
        fetchOrders(
          page,
          PAGE_SIZE,
          debouncedSearch,
          selectedStatuses,
          sortBy,
          sortDir
        ),
      staleTime: 30 * 1000,
      placeholderData: keepPreviousData, // <-- keeps current rows mounted during page/sort changes
    })

  const statusMutation = useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: string
      status: OrderStatus
    }) => updateOrderStatus(orderId, status),
    onMutate: async ({ orderId, status }) => {
      await queryClient.cancelQueries({ queryKey: ["orders"] })
      const previousOrders = queryClient.getQueryData<OrdersResponse>(queryKey)

      queryClient.setQueryData<OrdersResponse>(queryKey, (old) => {
        if (!old) return old
        return {
          ...old,
          orders: old.orders.map((order: Order) =>
            order.id === orderId ? { ...order, status } : order
          ),
        }
      })

      return { previousOrders }
    },
    onError: (err, variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(queryKey, context.previousOrders)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    statusMutation.mutate({ orderId, status })
  }

  const goToPage = (newPage: number) => {
    const maxPage = data?.totalPages ?? 1
    setPage(Math.min(Math.max(newPage, 1), maxPage))
  }

  const setSorting: OnChangeFn<SortingState> = (updater) => {
    setSortingState(updater)
    setPage(1) // a new sort invalidates what "page 3" means
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
    goToPage,
    clearFilters,
    sorting,
    setSorting,
    isUpdating: statusMutation.isPending,
    refetch,
  }
}
