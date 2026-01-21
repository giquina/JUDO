// Social Feed Types

export type PostType = "announcement" | "achievement" | "community" | "event";

export type ReactionType = "like" | "respect" | "strong" | "fire";

export interface Reaction {
  type: ReactionType;
  count: number;
  userReacted: boolean;
}

export interface Post {
  _id: string;
  authorId: string;
  authorName: string;
  authorRole: "member" | "coach" | "admin";
  authorBeltRank: string;
  authorPhoto?: string;
  type: PostType;
  content: string;
  imageUrl?: string;
  reactions: Reaction[];
  commentCount: number;
  isPinned: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Comment {
  _id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  content: string;
  createdAt: number;
}

export const POST_TYPE_CONFIG: Record<PostType, { emoji: string; label: string; color: string }> = {
  announcement: {
    emoji: "🚨",
    label: "Announcement",
    color: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  },
  achievement: {
    emoji: "🏆",
    label: "Achievement",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
  },
  community: {
    emoji: "💬",
    label: "General",
    color: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  },
  event: {
    emoji: "📅",
    label: "Event",
    color: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
  },
};

export const REACTION_CONFIG: Record<ReactionType, { emoji: string; label: string }> = {
  like: { emoji: "👍", label: "Like" },
  respect: { emoji: "🥋", label: "Respect" },
  strong: { emoji: "💪", label: "Strong" },
  fire: { emoji: "🔥", label: "Fire" },
};
