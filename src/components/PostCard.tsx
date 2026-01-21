import { useState } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import {
  MessageCircle,
  Pin,
  MoreVertical,
  Edit2,
  Trash2,
} from "lucide-react";
import type { Post, ReactionType } from "@/types/social";
import { POST_TYPE_CONFIG, REACTION_CONFIG } from "@/types/social";

interface PostCardProps {
  post: Post;
  onReact: (postId: string, reactionType: ReactionType) => void;
  onTogglePin?: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

const BELT_COLORS: Record<string, string> = {
  white: "bg-gray-100 text-gray-800 border border-gray-300",
  yellow: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  orange: "bg-orange-100 text-orange-800 border border-orange-300",
  green: "bg-green-100 text-green-800 border border-green-300",
  blue: "bg-blue-600 text-white border border-blue-700",
  brown: "bg-amber-800 text-white border border-amber-900",
  black: "bg-gray-900 text-white border border-gray-950",
};

const ROLE_BADGE_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  admin: { label: "Admin", variant: "destructive" },
  coach: { label: "Sensei", variant: "default" },
  member: { label: "Member", variant: "secondary" },
};

export default function PostCard({ post, onReact, onTogglePin, onEdit, onDelete }: PostCardProps) {
  const { user, role } = useAuth();
  const [showActions, setShowActions] = useState(false);
  const isAuthor = user?.email === getEmailFromAuthorId(post.authorId);
  const canModerate = role === "admin" || role === "coach";
  const canEdit = isAuthor || canModerate;
  const canDelete = isAuthor || canModerate;
  const canPin = canModerate;

  const postTypeConfig = POST_TYPE_CONFIG[post.type];
  const roleBadge = ROLE_BADGE_CONFIG[post.authorRole];

  const handleReaction = (reactionType: ReactionType) => {
    onReact(post._id, reactionType);
    toast.success(`Reacted with ${REACTION_CONFIG[reactionType].emoji}`);
  };

  const handleTogglePin = () => {
    if (onTogglePin) {
      onTogglePin(post._id);
      toast.success(post.isPinned ? "Post unpinned" : "Post pinned");
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(post._id);
      setShowActions(false);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(post._id);
      toast.success("Post deleted");
      setShowActions(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={cn(
          "relative transition-shadow hover:shadow-md",
          post.isPinned && "border-l-4 border-l-primary"
        )}
      >
        {post.isPinned && (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="gap-1">
              <Pin className="h-3 w-3" />
              Pinned
            </Badge>
          </div>
        )}

        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-semibold">
                {post.authorName.charAt(0)}
              </div>
            </div>

            {/* Author Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm">{post.authorName}</span>
                <Badge variant={roleBadge.variant} className="text-xs">
                  {roleBadge.label}
                </Badge>
                <Badge className={cn("text-xs capitalize", BELT_COLORS[post.authorBeltRank])}>
                  {post.authorBeltRank} Belt
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={cn("text-xs", postTypeConfig.color)}>
                  {postTypeConfig.emoji} {postTypeConfig.label}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                </span>
              </div>
            </div>

            {/* Actions Menu */}
            {(canEdit || canDelete || canPin) && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowActions(!showActions)}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>

                {showActions && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-0 mt-1 w-40 bg-card border rounded-md shadow-lg z-10"
                  >
                    {canPin && onTogglePin && (
                      <button
                        onClick={handleTogglePin}
                        className="w-full px-4 py-2 text-sm text-left hover:bg-accent flex items-center gap-2 transition-colors"
                      >
                        <Pin className="h-3 w-3" />
                        {post.isPinned ? "Unpin" : "Pin"}
                      </button>
                    )}
                    {canEdit && onEdit && (
                      <button
                        onClick={handleEdit}
                        className="w-full px-4 py-2 text-sm text-left hover:bg-accent flex items-center gap-2 transition-colors"
                      >
                        <Edit2 className="h-3 w-3" />
                        Edit
                      </button>
                    )}
                    {canDelete && onDelete && (
                      <button
                        onClick={handleDelete}
                        className="w-full px-4 py-2 text-sm text-left hover:bg-destructive hover:text-destructive-foreground flex items-center gap-2 transition-colors rounded-b-md"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    )}
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="mb-4">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Image (if present) */}
          {post.imageUrl && (
            <div className="mb-4 rounded-lg overflow-hidden">
              <img
                src={post.imageUrl}
                alt="Post attachment"
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Reactions Bar */}
          <div className="flex items-center gap-2 py-3 border-t border-b">
            {(["like", "respect", "strong", "fire"] as ReactionType[]).map((reactionType) => {
              const reaction = post.reactions.find((r) => r.type === reactionType);
              const config = REACTION_CONFIG[reactionType];
              const isActive = reaction?.userReacted || false;
              const count = reaction?.count || 0;

              return (
                <Button
                  key={reactionType}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-8 gap-1 transition-all",
                    isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                  )}
                  onClick={() => handleReaction(reactionType)}
                >
                  <span>{config.emoji}</span>
                  {count > 0 && <span className="text-xs font-medium">{count}</span>}
                </Button>
              );
            })}
          </div>

          {/* Comments */}
          <div className="mt-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2 text-muted-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">
                {post.commentCount} {post.commentCount === 1 ? "comment" : "comments"}
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Helper function to get email from author ID (mock implementation)
function getEmailFromAuthorId(authorId: string): string {
  const mapping: Record<string, string> = {
    "1": "a.chen@bbk.ac.uk",
    "2": "coach@bbk.ac.uk",
    "3": "admin@bbk.ac.uk",
  };
  return mapping[authorId] || "";
}
