import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export interface FilterOption {
  label: string
  value: string
  count?: number
}

interface FilterDropdownProps {
  label: string
  options: FilterOption[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  className?: string
}

export function FilterDropdown({
  label,
  options,
  selectedValues,
  onChange,
  className,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false)

  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value))
    } else {
      onChange([...selectedValues, value])
    }
  }

  const clearAll = () => {
    onChange([])
  }

  const selectAll = () => {
    onChange(options.map((opt) => opt.value))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-between gap-2 min-w-[150px]",
            selectedValues.length > 0 && "border-primary bg-primary/5",
            className
          )}
        >
          <span className="truncate">
            {label}
            {selectedValues.length > 0 && (
              <span className="ml-1 font-semibold">({selectedValues.length})</span>
            )}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <div className="p-3 border-b flex items-center justify-between">
          <span className="font-semibold text-sm">{label}</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={selectAll}
            >
              All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={clearAll}
            >
              Clear
            </Button>
          </div>
        </div>
        <div className="max-h-[300px] overflow-y-auto p-2">
          <AnimatePresence>
            {options.map((option, index) => {
              const isSelected = selectedValues.includes(option.value)
              return (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer"
                  onClick={() => toggleOption(option.value)}
                >
                  <Checkbox
                    id={option.value}
                    checked={isSelected}
                    onCheckedChange={() => toggleOption(option.value)}
                  />
                  <Label
                    htmlFor={option.value}
                    className="flex-1 cursor-pointer font-normal"
                  >
                    {option.label}
                  </Label>
                  {option.count !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      {option.count}
                    </span>
                  )}
                  {isSelected && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </PopoverContent>
    </Popover>
  )
}
