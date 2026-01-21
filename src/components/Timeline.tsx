import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export interface TimelineEvent {
  id: string
  title: string
  description?: string
  timestamp: Date
  icon?: ReactNode
  type?: "default" | "success" | "warning" | "error" | "info"
  expandable?: boolean
  details?: ReactNode
}

interface TimelineProps {
  events: TimelineEvent[]
  className?: string
}

const typeColors = {
  default: "bg-muted text-muted-foreground",
  success: "bg-green-500 text-white",
  warning: "bg-yellow-500 text-white",
  error: "bg-red-500 text-white",
  info: "bg-blue-500 text-white",
}

const typeBorderColors = {
  default: "border-muted",
  success: "border-green-500",
  warning: "border-yellow-500",
  error: "border-red-500",
  info: "border-blue-500",
}

export function Timeline({ events, className }: TimelineProps) {
  return (
    <div className={cn("relative space-y-6", className)}>
      {/* Vertical Line */}
      <div className="absolute left-[15px] top-8 bottom-0 w-[2px] bg-border" />

      {events.map((event, index) => {
        const type = event.type || "default"

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative flex gap-4"
          >
            {/* Icon */}
            <div
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                typeColors[type]
              )}
            >
              {event.icon || (
                <div className="h-2 w-2 rounded-full bg-current" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <div
                className={cn(
                  "rounded-lg border bg-card p-4 transition-all hover:border-primary/50",
                  typeBorderColors[type]
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <h4 className="font-semibold text-sm">{event.title}</h4>
                    {event.description && (
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <time className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(event.timestamp, "MMM dd, yyyy")}
                    <br />
                    {format(event.timestamp, "HH:mm")}
                  </time>
                </div>

                {event.details && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 pt-3 border-t"
                  >
                    {event.details}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
