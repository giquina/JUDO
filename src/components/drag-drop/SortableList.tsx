import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core"
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useState } from "react"
import type { ReactNode } from "react"
import { GripVertical } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface SortableItem {
  id: string
  [key: string]: any
}

interface SortableItemProps {
  item: SortableItem
  renderItem: (item: SortableItem) => ReactNode
  isDragging?: boolean
}

function SortableItemComponent({ item, renderItem }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isCurrentlyDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-2 rounded-lg border bg-card p-3 transition-all",
        isCurrentlyDragging && "opacity-50 cursor-grabbing",
        !isCurrentlyDragging && "hover:border-primary/50"
      )}
    >
      <button
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-accent rounded transition-colors touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </button>
      <div className="flex-1">{renderItem(item)}</div>
    </div>
  )
}

interface SortableListProps {
  items: SortableItem[]
  onReorder: (items: SortableItem[]) => void
  renderItem: (item: SortableItem) => ReactNode
  className?: string
}

export function SortableList({
  items,
  onReorder,
  renderItem,
  className,
}: SortableListProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)
      const newItems = arrayMove(items, oldIndex, newIndex)
      onReorder(newItems)
    }

    setActiveId(null)
  }

  const activeItem = items.find((item) => item.id === activeId)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className={cn("space-y-2", className)}>
          {items.map((item) => (
            <SortableItemComponent
              key={item.id}
              item={item}
              renderItem={renderItem}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeItem ? (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.05 }}
            className="flex items-center gap-2 rounded-lg border-2 border-primary bg-card p-3 shadow-lg"
          >
            <GripVertical className="h-5 w-5 text-primary" />
            <div className="flex-1">{renderItem(activeItem)}</div>
          </motion.div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
