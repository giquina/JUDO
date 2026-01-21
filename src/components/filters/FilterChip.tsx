import { X } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FilterChipProps {
  label: string
  value: string
  onRemove: () => void
  className?: string
}

export function FilterChip({ label, value, onRemove, className }: FilterChipProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary",
        className
      )}
    >
      <span className="text-xs text-muted-foreground">{label}:</span>
      <span>{value}</span>
      <button
        onClick={onRemove}
        className="ml-1 rounded-full p-0.5 hover:bg-primary/20 transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-3 w-3" />
      </button>
    </motion.div>
  )
}
