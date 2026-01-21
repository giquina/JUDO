import { useState } from "react"
import { Save, Star, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

export interface SavedFilter {
  id: string
  name: string
  filters: Record<string, any>
  isFavorite?: boolean
}

interface SavedFiltersProps {
  currentFilters: Record<string, any>
  savedFilters: SavedFilter[]
  onSave: (name: string, filters: Record<string, any>) => void
  onLoad: (filters: Record<string, any>) => void
  onDelete: (id: string) => void
  onToggleFavorite: (id: string) => void
}

export function SavedFilters({
  currentFilters,
  savedFilters,
  onSave,
  onLoad,
  onDelete,
  onToggleFavorite,
}: SavedFiltersProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filterName, setFilterName] = useState("")

  const handleSave = () => {
    if (!filterName.trim()) {
      toast.error("Please enter a filter name")
      return
    }

    onSave(filterName, currentFilters)
    setFilterName("")
    setIsDialogOpen(false)
    toast.success(`Filter "${filterName}" saved`)
  }

  const hasActiveFilters = Object.keys(currentFilters).some(
    (key) => currentFilters[key] !== undefined && currentFilters[key] !== ""
  )

  return (
    <div className="flex items-center gap-2">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={!hasActiveFilters}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Save Filters
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Filter Preset</DialogTitle>
            <DialogDescription>
              Give your filter combination a name to save it for later use.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="filter-name">Filter Name</Label>
              <Input
                id="filter-name"
                placeholder="e.g., Active Black Belts"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Filter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {savedFilters.length > 0 && (
        <div className="flex items-center gap-2 border-l pl-2">
          <span className="text-sm text-muted-foreground">Saved:</span>
          <div className="flex gap-1 flex-wrap">
            <AnimatePresence>
              {savedFilters.map((filter) => (
                <motion.div
                  key={filter.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="inline-flex items-center gap-1 rounded-md border bg-card px-2 py-1 text-sm group hover:border-primary transition-colors"
                >
                  <button
                    onClick={() => onToggleFavorite(filter.id)}
                    className="p-0.5 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`h-3 w-3 ${
                        filter.isFavorite
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => onLoad(filter.filters)}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {filter.name}
                  </button>
                  <button
                    onClick={() => onDelete(filter.id)}
                    className="p-0.5 opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}
