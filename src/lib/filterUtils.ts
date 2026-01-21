/**
 * Utility functions for working with filters
 */

import type { ActiveFilter } from "@/components/filters"

export interface FilterConfig {
  id: string
  label: string
  getValue: () => string | string[] | undefined
  getDisplayValue: (value: any) => string
}

/**
 * Convert filter values to ActiveFilter array
 */
export function buildActiveFilters(
  configs: FilterConfig[]
): ActiveFilter[] {
  const activeFilters: ActiveFilter[] = []

  configs.forEach((config) => {
    const value = config.getValue()

    if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
      return
    }

    if (Array.isArray(value)) {
      value.forEach((v) => {
        activeFilters.push({
          id: `${config.id}-${v}`,
          label: config.label,
          value: config.getDisplayValue(v),
        })
      })
    } else {
      activeFilters.push({
        id: config.id,
        label: config.label,
        value: config.getDisplayValue(value),
      })
    }
  })

  return activeFilters
}

/**
 * Remove a filter by ID
 */
export function removeFilterById(
  filterId: string,
  setters: Record<string, (value: any) => void>
) {
  // Extract the filter type and value from the ID
  const parts = filterId.split("-")
  const filterType = parts[0]
  const filterValue = parts.slice(1).join("-")

  const setter = setters[filterType]
  if (!setter) return

  // If it's an array filter (like belts or statuses)
  setter((prev: any) => {
    if (Array.isArray(prev)) {
      return prev.filter((v) => v !== filterValue)
    }
    // If it's a single value filter (like dates)
    return undefined
  })
}

/**
 * Clear all filters
 */
export function clearAllFilters(setters: Record<string, (value: any) => void>) {
  Object.values(setters).forEach((setter) => {
    setter((prev: any) => {
      if (Array.isArray(prev)) return []
      return undefined
    })
  })
}

/**
 * Apply filters to a dataset
 */
export function applyFilters<T>(
  data: T[],
  filters: {
    predicate: (item: T) => boolean
    enabled: boolean
  }[]
): T[] {
  return data.filter((item) => {
    return filters.every((filter) => {
      if (!filter.enabled) return true
      return filter.predicate(item)
    })
  })
}

/**
 * Create filter options from data
 */
export function createFilterOptions<T>(
  data: T[],
  getValue: (item: T) => string,
  getLabel: (item: T) => string
): Array<{ label: string; value: string; count: number }> {
  const counts = new Map<string, number>()
  const labels = new Map<string, string>()

  data.forEach((item) => {
    const value = getValue(item)
    const label = getLabel(item)
    counts.set(value, (counts.get(value) || 0) + 1)
    labels.set(value, label)
  })

  return Array.from(counts.entries())
    .map(([value, count]) => ({
      value,
      label: labels.get(value) || value,
      count,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

/**
 * Get date range filter predicate
 */
export function createDateRangeFilter(
  startDate?: Date,
  endDate?: Date,
  getDate?: (item: any) => Date
) {
  return (item: any) => {
    const itemDate = getDate ? getDate(item) : new Date(item.date)

    if (startDate && itemDate < startDate) return false
    if (endDate) {
      const endOfDay = new Date(endDate)
      endOfDay.setHours(23, 59, 59, 999)
      if (itemDate > endOfDay) return false
    }

    return true
  }
}

/**
 * Storage keys for saved filters
 */
export const FILTER_STORAGE_KEYS = {
  MEMBERS: "judo_saved_filters_members",
  PAYMENTS: "judo_saved_filters_payments",
  CLASSES: "judo_saved_filters_classes",
  ATTENDANCE: "judo_saved_filters_attendance",
  EVENTS: "judo_saved_filters_events",
}

/**
 * Save filters to localStorage
 */
export function saveFiltersToStorage(
  key: string,
  filters: any[]
) {
  try {
    localStorage.setItem(key, JSON.stringify(filters))
  } catch (error) {
    console.error("Failed to save filters:", error)
  }
}

/**
 * Load filters from localStorage
 */
export function loadFiltersFromStorage(key: string): any[] {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Failed to load filters:", error)
    return []
  }
}
