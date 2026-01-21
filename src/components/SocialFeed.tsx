import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PostCard from "./PostCard";
import PostComposer from "./PostComposer";
import EmptyState from "./EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { mockPosts } from "@/lib/mock-social-data";
import { RefreshCw, Loader2, MessageSquare } from "lucide-react";
import type { Post, PostType, ReactionType } from "@/types/social";

const POSTS_PER_PAGE = 10;

interface SocialFeedProps {
  className?: string;
}

export default function SocialFeed({ className }: SocialFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  // Initial load
  useEffect(() => {
    loadInitialPosts();
  }, []);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    const trigger = loadMoreTriggerRef.current;
    if (trigger) {
      observer.observe(trigger);
    }

    return () => {
      if (trigger) {
        observer.unobserve(trigger);
      }
    };
  }, [hasMore, isLoadingMore, isLoading]);

  const loadInitialPosts = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const sortedPosts = sortPosts([...mockPosts]);
    setPosts(sortedPosts);

    const initial = sortedPosts.slice(0, POSTS_PER_PAGE);
    setDisplayedPosts(initial);
    setHasMore(sortedPosts.length > POSTS_PER_PAGE);
    setPage(1);
    setIsLoading(false);
  };

  const loadMorePosts = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const nextPage = page + 1;
    const startIndex = page * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const morePosts = posts.slice(startIndex, endIndex);

    setDisplayedPosts((prev) => [...prev, ...morePosts]);
    setPage(nextPage);
    setHasMore(endIndex < posts.length);
    setIsLoadingMore(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadInitialPosts();
    setIsRefreshing(false);
  };

  const handleNewPost = (content: string, type: PostType, imageUrl?: string) => {
    const newPost: Post = {
      _id: `post-${Date.now()}`,
      authorId: "3", // Current user (mock)
      authorName: "Admin User", // From auth context
      authorRole: "admin",
      authorBeltRank: "black",
      type,
      content,
      imageUrl,
      reactions: [],
      commentCount: 0,
      isPinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const updatedPosts = sortPosts([newPost, ...posts]);
    setPosts(updatedPosts);

    // Update displayed posts
    const newDisplayed = sortPosts([newPost, ...displayedPosts]);
    setDisplayedPosts(newDisplayed.slice(0, page * POSTS_PER_PAGE));
  };

  const handleReact = useCallback((postId: string, reactionType: ReactionType) => {
    const updatePostReactions = (post: Post) => {
      if (post._id !== postId) return post;

      const existingReaction = post.reactions.find((r) => r.type === reactionType);

      if (existingReaction) {
        // Toggle reaction
        return {
          ...post,
          reactions: post.reactions.map((r) =>
            r.type === reactionType
              ? {
                  ...r,
                  count: r.userReacted ? r.count - 1 : r.count + 1,
                  userReacted: !r.userReacted,
                }
              : r
          ),
        };
      } else {
        // Add new reaction
        return {
          ...post,
          reactions: [
            ...post.reactions,
            { type: reactionType, count: 1, userReacted: true },
          ],
        };
      }
    };

    setPosts((prev) => prev.map(updatePostReactions));
    setDisplayedPosts((prev) => prev.map(updatePostReactions));
  }, []);

  const handleTogglePin = useCallback((postId: string) => {
    const togglePin = (post: Post) => {
      if (post._id !== postId) return post;
      return { ...post, isPinned: !post.isPinned };
    };

    const updatedPosts = posts.map(togglePin);
    const sortedPosts = sortPosts(updatedPosts);

    setPosts(sortedPosts);
    setDisplayedPosts(sortedPosts.slice(0, page * POSTS_PER_PAGE));
  }, [posts, page]);

  const handleEdit = useCallback((postId: string) => {
    // TODO: Implement edit functionality
    console.log("Edit post:", postId);
  }, []);

  const handleDelete = useCallback((postId: string) => {
    const updatedPosts = posts.filter((p) => p._id !== postId);
    setPosts(updatedPosts);
    setDisplayedPosts(updatedPosts.slice(0, page * POSTS_PER_PAGE));
    setHasMore(updatedPosts.length > page * POSTS_PER_PAGE);
  }, [posts, page]);

  // Sort posts: pinned first, then by date
  const sortPosts = (postsToSort: Post[]): Post[] => {
    return [...postsToSort].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.createdAt - a.createdAt;
    });
  };

  return (
    <div className={cn("space-y-6", className)} ref={scrollContainerRef}>
      {/* Post Composer */}
      <PostComposer onPost={handleNewPost} />

      {/* Refresh Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Community Feed</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && <FeedSkeleton />}

      {/* Empty State */}
      {!isLoading && displayedPosts.length === 0 && (
        <EmptyState
          icon={<MessageSquare />}
          title="No posts yet"
          description="Be the first to share something with the community!"
        />
      )}

      {/* Posts */}
      {!isLoading && displayedPosts.length > 0 && (
        <motion.div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {displayedPosts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PostCard
                  post={post}
                  onReact={handleReact}
                  onTogglePin={handleTogglePin}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Load More Trigger */}
      <div ref={loadMoreTriggerRef} className="h-20 flex items-center justify-center">
        {isLoadingMore && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading more posts...</span>
          </div>
        )}

        {!isLoadingMore && !hasMore && displayedPosts.length > 0 && (
          <p className="text-sm text-muted-foreground">You've reached the end!</p>
        )}
      </div>
    </div>
  );
}

// Loading skeleton for initial load
function FeedSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>

          {/* Reactions */}
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
