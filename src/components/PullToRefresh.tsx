import { useState, useRef, useEffect } from "react"
import type { ReactNode } from "react"
import { motion, useAnimation } from "framer-motion"
import { Loader2, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: ReactNode
  className?: string
  threshold?: number
}

export function PullToRefresh({
  onRefresh,
  children,
  className,
  threshold = 80,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [canPull, setCanPull] = useState(false)
  const startY = useRef(0)
  const controls = useAnimation()

  const checkIfCanPull = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    return scrollTop === 0
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!checkIfCanPull()) {
      setCanPull(false)
      return
    }
    setCanPull(true)
    startY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!canPull || isRefreshing) return

    const currentY = e.touches[0].clientY
    const distance = currentY - startY.current

    if (distance > 0) {
      // Prevent default scroll when pulling down
      if (distance > 10) {
        e.preventDefault()
      }
      // Apply resistance
      const resistedDistance = Math.min(distance * 0.5, threshold * 1.5)
      setPullDistance(resistedDistance)
    }
  }

  const handleTouchEnd = async () => {
    if (!canPull || isRefreshing) return

    if (pullDistance >= threshold) {
      setIsRefreshing(true)
      controls.start({
        y: threshold,
        transition: { type: "spring", damping: 20 },
      })

      try {
        await onRefresh()
      } catch (error) {
        console.error("Refresh failed:", error)
      } finally {
        setIsRefreshing(false)
        setPullDistance(0)
        controls.start({
          y: 0,
          transition: { type: "spring", damping: 20 },
        })
      }
    } else {
      setPullDistance(0)
      controls.start({
        y: 0,
        transition: { type: "spring", damping: 20 },
      })
    }

    setCanPull(false)
  }

  useEffect(() => {
    if (!isRefreshing && !canPull) {
      controls.start({
        y: 0,
        transition: { type: "spring", damping: 20 },
      })
    }
  }, [pullDistance, isRefreshing, canPull])

  const progress = Math.min((pullDistance / threshold) * 100, 100)
  const shouldTrigger = pullDistance >= threshold

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull Indicator */}
      <motion.div
        animate={controls}
        style={{ y: pullDistance }}
        className="relative z-10"
      >
        <div className="absolute top-0 left-0 right-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: pullDistance > 0 ? 1 : 0 }}
            className={cn(
              "flex flex-col items-center gap-2 py-4 transition-colors",
              shouldTrigger ? "text-primary" : "text-muted-foreground"
            )}
          >
            {isRefreshing ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-xs font-medium">Refreshing...</span>
              </>
            ) : (
              <>
                <motion.div
                  animate={{ rotate: shouldTrigger ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowDown className="h-6 w-6" />
                </motion.div>
                <span className="text-xs font-medium">
                  {shouldTrigger ? "Release to refresh" : "Pull to refresh"}
                </span>
                {/* Progress Ring */}
                <svg className="h-8 w-8 -rotate-90">
                  <circle
                    cx="16"
                    cy="16"
                    r="12"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="opacity-20"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="12"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 12}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 12 - (progress / 100) * 2 * Math.PI * 12
                    }`}
                    className="transition-all"
                  />
                </svg>
              </>
            )}
          </motion.div>
        </div>

        {children}
      </motion.div>
    </div>
  )
}
