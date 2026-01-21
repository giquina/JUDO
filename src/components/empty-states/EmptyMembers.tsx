import { motion } from "framer-motion";
import { Users, UserPlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyMembersProps {
  onAddMember?: () => void;
  searchQuery?: string;
}

export function EmptyMembers({ onAddMember, searchQuery }: EmptyMembersProps) {
  const isSearching = searchQuery && searchQuery.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
        }}
        className="relative mb-8"
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-2xl" />

        {/* Icon Container */}
        <div className="relative bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-8 rounded-full border border-blue-500/20">
          {isSearching ? (
            <Search className="w-16 h-16 text-blue-500" />
          ) : (
            <Users className="w-16 h-16 text-blue-500" />
          )}

          {/* Floating Particles */}
          {!isSearching && (
            <>
              <motion.div
                animate={{
                  y: [-10, 10, -10],
                  x: [-5, 5, -5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-2 -right-2 w-3 h-3 bg-blue-500 rounded-full opacity-60"
              />
              <motion.div
                animate={{
                  y: [10, -10, 10],
                  x: [5, -5, 5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-2 -left-2 w-2 h-2 bg-purple-500 rounded-full opacity-60"
              />
            </>
          )}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-3 mb-8 max-w-md"
      >
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {isSearching ? "No Members Found" : "No Members Yet"}
        </h3>
        <p className="text-muted-foreground">
          {isSearching
            ? `No members match "${searchQuery}". Try adjusting your search criteria.`
            : "Start building your dojo community by adding your first member. Track their progress, manage attendance, and help them grow."}
        </p>
      </motion.div>

      {/* Actions */}
      {!isSearching && onAddMember && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Button onClick={onAddMember} size="lg" className="gap-2">
            <UserPlus className="w-4 h-4" />
            Add Your First Member
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            <Users className="w-4 h-4" />
            Import Members
          </Button>
        </motion.div>
      )}

      {/* Help Text */}
      {!isSearching && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-muted-foreground mt-6"
        >
          Members can track their training, view schedules, and manage payments
        </motion.p>
      )}
    </motion.div>
  );
}
