import type { ReactNode } from "react"
import { X, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FilterChip } from "./FilterChip"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export interface ActiveFilter {
  id: string
  label: string
  value: string
}

interface FilterBarProps {
  children?: ReactNode
  activeFilters: ActiveFilter[]
  onRemoveFilter: (id: string) => void
  onClearAll: () => void
  isOpen?: boolean
  onToggle?: () => void
  resultCount?: number
  className?: string
}

export function FilterBar({
  children,
  activeFilters,
  onRemoveFilter,
  onClearAll,
  isOpen,
  onToggle,
  resultCount,
  className,
}: FilterBarProps) {
  const hasActiveFilters = activeFilters.length > 0

  return (
    <div className={cn("space-y-3", className)}>
      {/* Filter Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {onToggle && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggle}
              className={cn(
                "gap-2",
                isOpen && "bg-primary/10 border-primary"
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                  {activeFilters.length}
                </span>
              )}
            </Button>
          )}

          {children}

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="gap-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              Clear all
            </Button>
          )}
        </div>

        {resultCount !== undefined && (
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            {resultCount.toLocaleString()} {resultCount === 1 ? "result" : "results"}
          </div>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="flex items-center gap-2 flex-wrap"
        >
          <span className="text-sm text-muted-foreground">Active filters:</span>
          <div className="flex gap-2 flex-wrap">
            <AnimatePresence>
              {activeFilters.map((filter) => (
                <FilterChip
                  key={filter.id}
                  label={filter.label}
                  value={filter.value}
                  onRemove={() => onRemoveFilter(filter.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  )
}
