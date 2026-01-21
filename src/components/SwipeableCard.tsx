import { useState, useRef } from "react"
import { motion, useAnimation } from "framer-motion"
import type { PanInfo } from "framer-motion"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SwipeableCardProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  leftAction?: {
    icon?: React.ReactNode
    color?: string
    label?: string
  }
  rightAction?: {
    icon?: React.ReactNode
    color?: string
    label?: string
  }
  className?: string
  threshold?: number
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction = {
    icon: <X className="h-6 w-6" />,
    color: "bg-red-500",
    label: "Delete",
  },
  rightAction = {
    icon: <Check className="h-6 w-6" />,
    color: "bg-green-500",
    label: "Complete",
  },
  className,
  threshold = 100,
}: SwipeableCardProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [swipeDistance, setSwipeDistance] = useState(0)
  const controls = useAnimation()
  const constraintsRef = useRef(null)

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setSwipeDistance(info.offset.x)
  }

  const handleDragEnd = async (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)
    const swipeThreshold = threshold

    if (Math.abs(info.offset.x) > swipeThreshold) {
      if (info.offset.x > 0 && onSwipeRight) {
        // Swipe right
        await controls.start({
          x: window.innerWidth,
          opacity: 0,
          transition: { duration: 0.3 },
        })
        onSwipeRight()
      } else if (info.offset.x < 0 && onSwipeLeft) {
        // Swipe left
        await controls.start({
          x: -window.innerWidth,
          opacity: 0,
          transition: { duration: 0.3 },
        })
        onSwipeLeft()
      }
    } else {
      // Reset position
      controls.start({
        x: 0,
        transition: { type: "spring", damping: 20, stiffness: 300 },
      })
    }

    setSwipeDistance(0)
  }

  const leftOpacity = Math.min(Math.abs(swipeDistance) / threshold, 1)
  const rightOpacity = Math.min(Math.abs(swipeDistance) / threshold, 1)
  const showLeftAction = swipeDistance < 0 && onSwipeLeft
  const showRightAction = swipeDistance > 0 && onSwipeRight

  return (
    <div ref={constraintsRef} className={cn("relative overflow-hidden", className)}>
      {/* Left Action Background */}
      {onSwipeLeft && (
        <motion.div
          className={cn(
            "absolute inset-y-0 right-0 flex items-center justify-end px-6",
            leftAction.color
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: showLeftAction ? leftOpacity : 0 }}
        >
          <div className="flex flex-col items-center gap-1 text-white">
            {leftAction.icon}
            {leftAction.label && (
              <span className="text-xs font-medium">{leftAction.label}</span>
            )}
          </div>
        </motion.div>
      )}

      {/* Right Action Background */}
      {onSwipeRight && (
        <motion.div
          className={cn(
            "absolute inset-y-0 left-0 flex items-center justify-start px-6",
            rightAction.color
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: showRightAction ? rightOpacity : 0 }}
        >
          <div className="flex flex-col items-center gap-1 text-white">
            {rightAction.icon}
            {rightAction.label && (
              <span className="text-xs font-medium">{rightAction.label}</span>
            )}
          </div>
        </motion.div>
      )}

      {/* Swipeable Content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: onSwipeLeft ? -threshold * 2 : 0, right: onSwipeRight ? threshold * 2 : 0 }}
        dragElastic={0.2}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={controls}
        className={cn(
          "relative bg-background touch-pan-y",
          isDragging && "cursor-grabbing"
        )}
        style={{ touchAction: "pan-y" }}
      >
        {children}
      </motion.div>
    </div>
  )
}
