// /components/OrderFilters.tsx
"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"
import type { OrderStatus } from "@/lib/types"
import { memo } from "react"

interface OrderFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  selectedStatuses: OrderStatus[]
  onStatusToggle: (status: OrderStatus) => void
  onClearFilters: () => void
  statusCounts: Record<OrderStatus, number>
  totalResults: number
}

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "En attente" },
  { value: "processing", label: "En cours" },
  { value: "completed", label: "Terminées" },
  { value: "cancelled", label: "Annulées" },
]

export const OrderFilters = memo(function OrderFilters({
  search,
  onSearchChange,
  selectedStatuses,
  onStatusToggle,
  onClearFilters,
  statusCounts,
  totalResults,
}: OrderFiltersProps) {
  const isAllActive = selectedStatuses.length === 0

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, email ou ID..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-full pl-9"
            aria-label="Rechercher des commandes"
          />
        </div>
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="whitespace-nowrap"
        >
          <Filter className="mr-2 h-4 w-4" />
          Vider les filtres
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant={isAllActive ? "default" : "outline"}
          className="cursor-pointer p-3 transition-opacity hover:opacity-80"
          onClick={onClearFilters}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              onClearFilters()
            }
          }}
        >
          Toutes ({totalResults})
        </Badge>

        {statusOptions.map((option) => {
          const isActive = selectedStatuses.includes(option.value)
          const count = statusCounts[option.value] ?? 0

          return (
            <Badge
              key={option.value}
              variant={isActive ? "default" : "outline"}
              className="cursor-pointer p-3 transition-opacity hover:opacity-80"
              onClick={() => onStatusToggle(option.value)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onStatusToggle(option.value)
                }
              }}
            >
              {option.label} ({count})
            </Badge>
          )
        })}
      </div>
    </div>
  )
})
