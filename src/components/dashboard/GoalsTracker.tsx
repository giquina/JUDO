import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Plus,
  Check,
  Trash2,
  Edit2,
  Calendar,
  TrendingUp,
  Award,
  Flame,
  Users,
  Trophy,
  Lightbulb,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { userGoals, suggestedGoals, type Goal } from '@/lib/mockAchievementsData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function GoalsTracker() {
  const [goals, setGoals] = useState<Goal[]>(userGoals);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuggestedGoals, setShowSuggestedGoals] = useState(false);
  const [celebratingGoal, setCelebratingGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    type: 'attendance' as Goal['type'],
    targetValue: 10,
    deadline: '',
  });

  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);

  const getGoalIcon = (type: Goal['type']) => {
    switch (type) {
      case 'attendance':
        return <Users className="w-4 h-4" />;
      case 'belt':
        return <Award className="w-4 h-4" />;
      case 'technique':
        return <Target className="w-4 h-4" />;
      case 'competition':
        return <Trophy className="w-4 h-4" />;
      case 'streak':
        return <Flame className="w-4 h-4" />;
    }
  };

  const getGoalColor = (type: Goal['type']) => {
    switch (type) {
      case 'attendance':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'belt':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'technique':
        return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'competition':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'streak':
        return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    }
  };

  const calculateProgress = (goal: Goal) => {
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  };

  const getDaysUntilDeadline = (deadline: Date) => {
    const today = new Date();
    const diff = deadline.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleCreateGoal = () => {
    const goal: Goal = {
      id: `goal_${Date.now()}`,
      title: newGoal.title,
      description: newGoal.description,
      type: newGoal.type,
      targetValue: newGoal.targetValue,
      currentValue: 0,
      deadline: newGoal.deadline ? new Date(newGoal.deadline) : undefined,
      completed: false,
    };

    setGoals([...goals, goal]);
    setShowCreateModal(false);
    setNewGoal({
      title: '',
      description: '',
      type: 'attendance',
      targetValue: 10,
      deadline: '',
    });
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(goals.filter((g) => g.id !== goalId));
  };

  const handleCompleteGoal = (goalId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (goal) {
      const updatedGoal = {
        ...goal,
        completed: true,
        completedAt: new Date(),
        currentValue: goal.targetValue,
      };
      setGoals(goals.map((g) => (g.id === goalId ? updatedGoal : g)));
      setCelebratingGoal(updatedGoal);
      setTimeout(() => setCelebratingGoal(null), 3000);
    }
  };

  const handleAddSuggestedGoal = (suggested: typeof suggestedGoals[0]) => {
    const goal: Goal = {
      id: `goal_${Date.now()}`,
      title: suggested.title,
      description: suggested.description,
      type: suggested.type,
      targetValue: suggested.targetValue,
      currentValue: 0,
      completed: false,
    };
    setGoals([...goals, goal]);
    setShowSuggestedGoals(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" />
            <CardTitle className="text-xl">Goals</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSuggestedGoals(true)}
              className="gap-1"
            >
              <Lightbulb className="w-3 h-3" />
              Suggested
            </Button>
            <Button size="sm" onClick={() => setShowCreateModal(true)} className="gap-1">
              <Plus className="w-4 h-4" />
              New Goal
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Active Goals */}
          {activeGoals.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Active Goals ({activeGoals.length})</h4>
              <div className="space-y-3">
                {activeGoals.map((goal) => {
                  const progress = calculateProgress(goal);
                  const daysLeft = goal.deadline ? getDaysUntilDeadline(goal.deadline) : null;

                  return (
                    <motion.div
                      key={goal.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={cn('p-4 rounded-lg border', getGoalColor(goal.type))}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="mt-1">{getGoalIcon(goal.type)}</div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium line-clamp-1">{goal.title}</h5>
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {goal.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toast.info("Edit goal feature coming soon")}
                              className="h-8 w-8 p-0"
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteGoal(goal.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {goal.currentValue} / {goal.targetValue}
                            </span>
                            <span className="font-medium">{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between">
                          {daysLeft !== null && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {daysLeft > 0
                                  ? `${daysLeft} days left`
                                  : daysLeft === 0
                                  ? 'Due today'
                                  : `${Math.abs(daysLeft)} days overdue`}
                              </span>
                            </div>
                          )}
                          <Button
                            size="sm"
                            onClick={() => handleCompleteGoal(goal.id)}
                            className="ml-auto gap-1"
                            disabled={progress < 100}
                          >
                            <Check className="w-3 h-3" />
                            {progress >= 100 ? 'Complete' : 'Mark Complete'}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed Goals */}
          {completedGoals.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground">
                Completed ({completedGoals.length})
              </h4>
              <div className="space-y-2">
                {completedGoals.slice(0, 3).map((goal) => (
                  <motion.div
                    key={goal.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 rounded-lg bg-green-500/10 border border-green-500/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <div>
                          <p className="text-sm font-medium line-clamp-1">{goal.title}</p>
                          {goal.completedAt && (
                            <p className="text-xs text-muted-foreground">
                              Completed {goal.completedAt.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {activeGoals.length === 0 && completedGoals.length === 0 && (
            <div className="text-center py-8 space-y-3">
              <div className="text-4xl">🎯</div>
              <div>
                <h4 className="font-medium mb-1">No goals yet</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Set your first goal and start tracking your progress!
                </p>
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Goal
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Goal Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Goal</DialogTitle>
            <DialogDescription>Set a personal training goal to stay motivated</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Goal Title</Label>
              <Input
                id="title"
                placeholder="e.g., Attend 15 classes this month"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Why is this goal important to you?"
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newGoal.type}
                  onValueChange={(value) => setNewGoal({ ...newGoal, type: value as Goal['type'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="attendance">Attendance</SelectItem>
                    <SelectItem value="belt">Belt Rank</SelectItem>
                    <SelectItem value="technique">Technique</SelectItem>
                    <SelectItem value="competition">Competition</SelectItem>
                    <SelectItem value="streak">Streak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="target">Target Value</Label>
                <Input
                  id="target"
                  type="number"
                  min="1"
                  value={newGoal.targetValue}
                  onChange={(e) => setNewGoal({ ...newGoal, targetValue: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline (Optional)</Label>
              <Input
                id="deadline"
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateGoal} disabled={!newGoal.title || !newGoal.description}>
              Create Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suggested Goals Modal */}
      <Dialog open={showSuggestedGoals} onOpenChange={setShowSuggestedGoals}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suggested Goals</DialogTitle>
            <DialogDescription>Quick goals to help you stay on track</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {suggestedGoals.map((suggested, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => handleAddSuggestedGoal(suggested)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getGoalIcon(suggested.type)}</div>
                  <div className="flex-1">
                    <h5 className="font-medium mb-1">{suggested.title}</h5>
                    <p className="text-sm text-muted-foreground">{suggested.description}</p>
                  </div>
                  <Plus className="w-4 h-4 text-muted-foreground" />
                </div>
              </motion.div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Completion Celebration */}
      <AnimatePresence>
        {celebratingGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-2xl shadow-2xl max-w-md mx-4 text-white text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Goal Completed!</h3>
              <p className="text-lg mb-4">{celebratingGoal.title}</p>
              <Badge variant="secondary" className="bg-white/20 text-white text-lg px-4 py-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                +100 XP
              </Badge>
              {/* Confetti particles */}
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  animate={{
                    opacity: 0,
                    x: (Math.random() - 0.5) * 400,
                    y: (Math.random() - 0.5) * 400,
                    scale: 0,
                  }}
                  transition={{ duration: 1.5, delay: i * 0.02 }}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
