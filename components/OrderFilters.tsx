"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Search, Filter } from "lucide-react"
import { OrderStatus } from "@/lib/types"
import { memo } from "react"

interface OrderFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  selectedStatuses: OrderStatus[]
  onStatusToggle: (status: OrderStatus) => void
  onClearFilters: () => void
  totalResults: number
}

const statusOptions: OrderStatus[] = [
  "pending",
  "processing",
  "completed",
  "cancelled",
]

export const OrderFilters = memo(function OrderFilters({
  search,
  onSearchChange,
  selectedStatuses,
  onStatusToggle,
  onClearFilters,
  totalResults,
}: OrderFiltersProps) {
  const hasFilters = search || selectedStatuses.length > 0

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or order ID..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
            aria-label="Search orders"
          />
        </div>
        <Button
          variant="outline"
          onClick={onClearFilters}
          disabled={!hasFilters}
          className="whitespace-nowrap"
        >
          <X className="mr-1 h-4 w-4" />
          Clear Filters
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Filter className="mr-1 h-4 w-4 text-muted-foreground" />
        {statusOptions.map((status) => (
          <Badge
            key={status}
            variant={selectedStatuses.includes(status) ? "default" : "outline"}
            className="cursor-pointer capitalize transition-opacity hover:opacity-80"
            onClick={() => onStatusToggle(status)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onStatusToggle(status)
              }
            }}
          >
            {status}
            {selectedStatuses.includes(status) && (
              <X className="ml-1 h-3 w-3" />
            )}
          </Badge>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {totalResults} {totalResults === 1 ? "order" : "orders"}
        </span>
      </div>
    </div>
  )
})
