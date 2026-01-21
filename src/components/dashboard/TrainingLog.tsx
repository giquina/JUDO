import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Star,
  Users,
  Activity,
  Heart,
  AlertCircle,
  Trophy,
  Calendar,
  Clock,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trainingLog, type TrainingSession } from "@/lib/mockProgressData";
import { cn } from "@/lib/utils";

export function TrainingLog() {
  const [sessions, setSessions] = useState<TrainingSession[]>(trainingLog);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<TrainingSession>>({
    type: "Intermediate",
    duration: 90,
    rating: 5,
    energyLevel: 4,
    mood: "good",
  });

  const handleAddSession = () => {
    const newSession: TrainingSession = {
      id: `log-${Date.now()}`,
      date: new Date(),
      type: formData.type as TrainingSession["type"],
      duration: formData.duration || 90,
      rating: formData.rating,
      notes: formData.notes,
      techniquesPracticed: formData.techniquesPracticed || [],
      trainingPartners: formData.trainingPartners,
      energyLevel: formData.energyLevel,
      mood: formData.mood as TrainingSession["mood"],
      injuries: formData.injuries,
      personalRecords: formData.personalRecords,
    };

    setSessions([newSession, ...sessions]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleDeleteSession = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };

  const resetForm = () => {
    setFormData({
      type: "Intermediate",
      duration: 90,
      rating: 5,
      energyLevel: 4,
      mood: "good",
    });
  };

  const getMoodEmoji = (mood?: TrainingSession["mood"]) => {
    switch (mood) {
      case "excellent":
        return "🔥";
      case "good":
        return "😊";
      case "okay":
        return "😐";
      case "tired":
        return "😴";
      case "injured":
        return "🤕";
      default:
        return "😊";
    }
  };

  const getMoodColor = (mood?: TrainingSession["mood"]) => {
    switch (mood) {
      case "excellent":
        return "text-green-500";
      case "good":
        return "text-blue-500";
      case "okay":
        return "text-yellow-500";
      case "tired":
        return "text-orange-500";
      case "injured":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getClassTypeColor = (type: TrainingSession["type"]) => {
    switch (type) {
      case "Beginners":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Intermediate":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Advanced":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "Randori":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "Kata":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "Competition":
        return "bg-pink-500/10 text-pink-500 border-pink-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Training Log</h2>
          <p className="text-muted-foreground mt-1">
            Track your sessions and monitor progress
          </p>
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Add Session
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Training Session</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Class Type */}
              <div className="space-y-2">
                <Label>Class Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value as TrainingSession["type"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginners">Beginners</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Randori">Randori</SelectItem>
                    <SelectItem value="Kata">Kata</SelectItem>
                    <SelectItem value="Competition">Competition</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: parseInt(e.target.value) })
                  }
                />
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <Label>Session Rating</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="transition-all hover:scale-110"
                    >
                      <Star
                        className={cn(
                          "w-8 h-8",
                          formData.rating && star <= formData.rating
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-gray-300"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy Level */}
              <div className="space-y-2">
                <Label>Energy Level</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({ ...formData, energyLevel: level })}
                      className={cn(
                        "w-12 h-12 rounded-lg border-2 transition-all hover:scale-105",
                        formData.energyLevel === level
                          ? "border-primary bg-primary/10"
                          : "border-muted"
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood */}
              <div className="space-y-2">
                <Label>Mood</Label>
                <Select
                  value={formData.mood}
                  onValueChange={(value) =>
                    setFormData({ ...formData, mood: value as TrainingSession["mood"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">🔥 Excellent</SelectItem>
                    <SelectItem value="good">😊 Good</SelectItem>
                    <SelectItem value="okay">😐 Okay</SelectItem>
                    <SelectItem value="tired">😴 Tired</SelectItem>
                    <SelectItem value="injured">🤕 Injured</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label>Session Notes</Label>
                <Textarea
                  placeholder="How was your training today? Any breakthroughs or challenges?"
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                />
              </div>

              {/* Techniques Practiced */}
              <div className="space-y-2">
                <Label>Techniques Practiced (comma-separated)</Label>
                <Input
                  placeholder="e.g., O-soto-gari, Uchi-mata, Newaza"
                  value={formData.techniquesPracticed?.join(", ") || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      techniquesPracticed: e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter((t) => t),
                    })
                  }
                />
              </div>

              {/* Training Partners */}
              <div className="space-y-2">
                <Label>Training Partners (comma-separated)</Label>
                <Input
                  placeholder="e.g., Alex, Sarah, James"
                  value={formData.trainingPartners?.join(", ") || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      trainingPartners: e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter((t) => t),
                    })
                  }
                />
              </div>

              {/* Personal Records */}
              <div className="space-y-2">
                <Label>Personal Records (optional)</Label>
                <Input
                  placeholder="Any achievements or milestones?"
                  value={formData.personalRecords?.join(", ") || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personalRecords: e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter((t) => t),
                    })
                  }
                />
              </div>

              {/* Injuries */}
              <div className="space-y-2">
                <Label>Injuries (optional)</Label>
                <Input
                  placeholder="Any injuries or discomfort?"
                  value={formData.injuries?.join(", ") || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      injuries: e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter((t) => t),
                    })
                  }
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAddSession} className="flex-1">
                Add Session
              </Button>
              <Button
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetForm();
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Training Sessions List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Activity className="w-6 h-6 text-primary" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Badge className={cn("border", getClassTypeColor(session.type))}>
                            {session.type}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {session.date.toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {session.duration} min
                          </div>
                        </div>

                        {/* Rating */}
                        {session.rating && (
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "w-4 h-4",
                                  i < session.rating!
                                    ? "fill-yellow-500 text-yellow-500"
                                    : "text-gray-300"
                                )}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Mood Indicator */}
                      <div className={cn("text-2xl", getMoodColor(session.mood))}>
                        {getMoodEmoji(session.mood)}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteSession(session.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {session.notes && (
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm">{session.notes}</p>
                    </div>
                  )}

                  {/* Details Grid */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Techniques */}
                    {session.techniquesPracticed && session.techniquesPracticed.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                          <Activity className="w-4 h-4 text-primary" />
                          Techniques Practiced
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {session.techniquesPracticed.map((tech, i) => (
                            <Badge key={i} variant="outline">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Training Partners */}
                    {session.trainingPartners && session.trainingPartners.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                          <Users className="w-4 h-4 text-blue-500" />
                          Training Partners
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {session.trainingPartners.map((partner, i) => (
                            <Badge key={i} variant="secondary">
                              {partner}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Energy Level */}
                    {session.energyLevel && (
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                          <Heart className="w-4 h-4 text-red-500" />
                          Energy Level
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className={cn(
                                "w-8 h-2 rounded-full",
                                i < session.energyLevel!
                                  ? "bg-gradient-to-r from-red-500 to-orange-500"
                                  : "bg-muted"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Personal Records */}
                  {session.personalRecords && session.personalRecords.length > 0 && (
                    <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                      <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                        <Trophy className="w-4 h-4 text-green-500" />
                        Personal Records
                      </div>
                      <ul className="space-y-1">
                        {session.personalRecords.map((record, i) => (
                          <li key={i} className="text-sm text-green-600 dark:text-green-400">
                            • {record}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Injuries */}
                  {session.injuries && session.injuries.length > 0 && (
                    <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                      <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        Injuries / Concerns
                      </div>
                      <ul className="space-y-1">
                        {session.injuries.map((injury, i) => (
                          <li key={i} className="text-sm text-red-600 dark:text-red-400">
                            • {injury}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
