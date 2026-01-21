import { useState } from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface FilterDateRangeProps {
  startDate?: Date
  endDate?: Date
  onStartDateChange: (date: Date | undefined) => void
  onEndDateChange: (date: Date | undefined) => void
  className?: string
}

export function FilterDateRange({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className,
}: FilterDateRangeProps) {
  const [startOpen, setStartOpen] = useState(false)
  const [endOpen, setEndOpen] = useState(false)

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Popover open={startOpen} onOpenChange={setStartOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal min-w-[140px]",
              !startDate && "text-muted-foreground",
              startDate && "border-primary bg-primary/5"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? format(startDate, "MMM dd, yyyy") : "Start date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            selected={startDate}
            onSelect={(date) => {
              onStartDateChange(date)
              setStartOpen(false)
            }}
            disabled={(date) => {
              if (endDate && date > endDate) return true
              return false
            }}
          />
        </PopoverContent>
      </Popover>

      <span className="text-sm text-muted-foreground">to</span>

      <Popover open={endOpen} onOpenChange={setEndOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal min-w-[140px]",
              !endDate && "text-muted-foreground",
              endDate && "border-primary bg-primary/5"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {endDate ? format(endDate, "MMM dd, yyyy") : "End date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            selected={endDate}
            onSelect={(date) => {
              onEndDateChange(date)
              setEndOpen(false)
            }}
            disabled={(date) => {
              if (startDate && date < startDate) return true
              return false
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
