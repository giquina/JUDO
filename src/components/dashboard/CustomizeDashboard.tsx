import * as React from "react";
import { Settings, Eye, EyeOff, RotateCcw, GripVertical } from "lucide-react";
import { Reorder } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface DashboardSection {
  id: string;
  label: string;
  visible: boolean;
  order: number;
}

export interface DashboardPreferences {
  sections: DashboardSection[];
  layout: "grid" | "list";
  density: "compact" | "comfortable" | "spacious";
  colorTheme?: string;
}

export interface CustomizeDashboardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferences: DashboardPreferences;
  onSave: (preferences: DashboardPreferences) => void;
}

const defaultSections: DashboardSection[] = [
  { id: "quick-actions", label: "Quick Actions", visible: true, order: 0 },
  { id: "streak", label: "Training Streak", visible: true, order: 1 },
  { id: "goals", label: "Goals", visible: true, order: 2 },
  { id: "events", label: "Upcoming Events", visible: true, order: 3 },
  { id: "partners", label: "Training Partners", visible: true, order: 4 },
  { id: "achievements", label: "Achievements", visible: true, order: 5 },
  { id: "tips", label: "Daily Tips", visible: true, order: 6 },
  { id: "quotes", label: "Motivational Quotes", visible: true, order: 7 },
  { id: "weather", label: "Weather", visible: false, order: 8 },
];

export function CustomizeDashboard({
  open,
  onOpenChange,
  preferences,
  onSave,
}: CustomizeDashboardProps) {
  const [localPreferences, setLocalPreferences] =
    React.useState<DashboardPreferences>(preferences);

  // Update local preferences when modal opens
  React.useEffect(() => {
    if (open) {
      setLocalPreferences(preferences);
    }
  }, [open, preferences]);

  const toggleSection = (sectionId: string) => {
    setLocalPreferences((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? { ...section, visible: !section.visible }
          : section
      ),
    }));
  };

  const reorderSections = (newOrder: DashboardSection[]) => {
    setLocalPreferences((prev) => ({
      ...prev,
      sections: newOrder.map((section, index) => ({
        ...section,
        order: index,
      })),
    }));
  };

  const resetToDefault = () => {
    setLocalPreferences({
      sections: defaultSections,
      layout: "grid",
      density: "comfortable",
    });
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem("dashboardPreferences", JSON.stringify(localPreferences));
    onSave(localPreferences);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Customize Dashboard
          </DialogTitle>
          <DialogDescription>
            Personalize your dashboard layout and appearance
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-4">
          {/* Layout Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Layout</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="layout">View Mode</Label>
                <Select
                  value={localPreferences.layout}
                  onValueChange={(value: "grid" | "list") =>
                    setLocalPreferences((prev) => ({ ...prev, layout: value }))
                  }
                >
                  <SelectTrigger id="layout">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="list">List</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="density">Density</Label>
                <Select
                  value={localPreferences.density}
                  onValueChange={(value: "compact" | "comfortable" | "spacious") =>
                    setLocalPreferences((prev) => ({ ...prev, density: value }))
                  }
                >
                  <SelectTrigger id="density">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="spacious">Spacious</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Sections Visibility & Order */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Sections</h3>
              <span className="text-xs text-muted-foreground">
                Drag to reorder
              </span>
            </div>

            <Reorder.Group
              axis="y"
              values={localPreferences.sections}
              onReorder={reorderSections}
              className="space-y-2"
            >
              {localPreferences.sections.map((section) => (
                <Reorder.Item
                  key={section.id}
                  value={section}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border bg-card cursor-grab active:cursor-grabbing",
                    !section.visible && "opacity-50"
                  )}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />

                  <div className="flex-1">
                    <span className="text-sm font-medium">{section.label}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {section.visible ? (
                      <Eye className="h-4 w-4 text-green-500" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    <Switch
                      checked={section.visible}
                      onCheckedChange={() => toggleSection(section.id)}
                    />
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={resetToDefault}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Hook to load and manage dashboard preferences
export function useDashboardPreferences() {
  const [preferences, setPreferences] = React.useState<DashboardPreferences>(() => {
    const saved = localStorage.getItem("dashboardPreferences");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {
          sections: defaultSections,
          layout: "grid",
          density: "comfortable",
        };
      }
    }
    return {
      sections: defaultSections,
      layout: "grid",
      density: "comfortable",
    };
  });

  const updatePreferences = React.useCallback(
    (newPreferences: DashboardPreferences) => {
      setPreferences(newPreferences);
      localStorage.setItem("dashboardPreferences", JSON.stringify(newPreferences));
    },
    []
  );

  return { preferences, updatePreferences };
}
