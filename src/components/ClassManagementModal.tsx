import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ClassFormData {
  name: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  level: "beginner" | "intermediate" | "advanced" | "all";
  type: "kata" | "randori" | "newaza" | "general";
  maxCapacity: number;
  location: string;
  description: string;
}

interface ClassManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  classData?: ClassFormData;
  onSave: (data: ClassFormData) => void;
  onDelete?: () => void;
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function ClassManagementModal({
  open,
  onOpenChange,
  mode,
  classData,
  onSave,
  onDelete,
}: ClassManagementModalProps) {
  const [formData, setFormData] = useState<ClassFormData>(
    classData || {
      name: "",
      dayOfWeek: "Monday",
      startTime: "19:00",
      endTime: "20:30",
      level: "beginner",
      type: "general",
      maxCapacity: 25,
      location: "Main Dojo",
      description: "",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (onDelete && window.confirm("Are you sure you want to delete this class?")) {
      onDelete();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="heading-5">
            {mode === "create" ? "Create New Class" : "Edit Class"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Set up a new training session for your Judoka"
              : "Update class details and schedule"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Class Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Class Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Monday Evening Fundamentals"
              required
            />
          </div>

          {/* Schedule */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dayOfWeek">Day of Week *</Label>
              <Select
                value={formData.dayOfWeek}
                onValueChange={(value) =>
                  setFormData({ ...formData, dayOfWeek: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Class Type & Level */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Training Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "kata" | "randori" | "newaza" | "general") =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General (混合)</SelectItem>
                  <SelectItem value="kata">Kata (型) - Forms</SelectItem>
                  <SelectItem value="randori">Randori (乱取) - Free Practice</SelectItem>
                  <SelectItem value="newaza">Newaza (寝技) - Ground Work</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Kata = Forms practice, Randori = Free sparring, Newaza = Ground techniques
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Skill Level *</Label>
              <Select
                value={formData.level}
                onValueChange={(value: "beginner" | "intermediate" | "advanced" | "all") =>
                  setFormData({ ...formData, level: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner (White-Orange Belt)</SelectItem>
                  <SelectItem value="intermediate">Intermediate (Green-Blue Belt)</SelectItem>
                  <SelectItem value="advanced">Advanced (Brown-Black Belt)</SelectItem>
                  <SelectItem value="all">All Levels</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location & Capacity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="e.g., Main Dojo, Studio A"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxCapacity">Max Capacity *</Label>
              <Input
                id="maxCapacity"
                type="number"
                min="1"
                max="100"
                value={formData.maxCapacity}
                onChange={(e) =>
                  setFormData({ ...formData, maxCapacity: parseInt(e.target.value) })
                }
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Add details about this class (techniques covered, prerequisites, special equipment, etc.)"
              rows={3}
            />
          </div>

          <DialogFooter className="gap-2">
            {mode === "edit" && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="mr-auto"
              >
                Delete Class
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === "create" ? "Create Class" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
