import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import BeltBadge from "@/components/BeltBadge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  MessageCircle,
  Share2,
  Flag,
  Trophy,
  Lightbulb,
  Camera,
  UserPlus,
  Megaphone,
  Filter,
  ChevronDown,
  Send,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockCommunityPosts, type CommunityPost } from "@/lib/mockSocialData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CommunityFeedProps {
  currentUserId?: string;
  className?: string;
}

type PostCategory = "all" | "achievement" | "training" | "technique" | "social" | "milestone";

export function CommunityFeed({
  currentUserId = "mem-001",
  className,
}: CommunityFeedProps) {
  const [posts, setPosts] = useState<CommunityPost[]>(mockCommunityPosts);
  const [category, setCategory] = useState<PostCategory>("all");
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [showLoadMore, setShowLoadMore] = useState(true);

  const filteredPosts = posts.filter((post) => {
    if (category === "all") return true;
    return post.category === category;
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const getPostIcon = (type: CommunityPost["type"]) => {
    switch (type) {
      case "achievement":
        return <Trophy className="h-4 w-4 text-yellow-600" />;
      case "photo":
        return <Camera className="h-4 w-4 text-blue-600" />;
      case "tip":
        return <Lightbulb className="h-4 w-4 text-green-600" />;
      case "competition":
        return <Trophy className="h-4 w-4 text-purple-600" />;
      case "welcome":
        return <UserPlus className="h-4 w-4 text-pink-600" />;
      case "announcement":
        return <Megaphone className="h-4 w-4 text-orange-600" />;
    }
  };

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post._id === postId) {
          const liked = post.likes.includes(currentUserId);
          return {
            ...post,
            likes: liked
              ? post.likes.filter((id) => id !== currentUserId)
              : [...post.likes, currentUserId],
          };
        }
        return post;
      })
    );
  };

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  const handleComment = (postId: string) => {
    const text = commentText[postId]?.trim();
    if (!text) return;

    setPosts((prev) =>
      prev.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            comments: [
              ...post.comments,
              {
                _id: `comment-${Date.now()}`,
                authorId: currentUserId,
                authorName: "You",
                authorBelt: "blue" as const,
                content: text,
                createdAt: Date.now(),
              },
            ],
          };
        }
        return post;
      })
    );

    setCommentText((prev) => ({ ...prev, [postId]: "" }));
    toast.success("Comment posted!");
  };

  const handleShare = (_postId: string) => {
    toast.success("Post link copied to clipboard!");
  };

  const handleReport = (_postId: string) => {
    toast.success("Post reported. Thank you for keeping our community safe.");
  };

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl">Community Feed</CardTitle>
            <CardDescription>
              Club-wide activity and updates
            </CardDescription>
          </div>
        </div>

        <div className="pt-3">
          <Select
            value={category}
            onValueChange={(value) => setCategory(value as PostCategory)}
          >
            <SelectTrigger className="h-9">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Posts</SelectItem>
              <SelectItem value="achievement">Achievements</SelectItem>
              <SelectItem value="training">Training</SelectItem>
              <SelectItem value="technique">Techniques</SelectItem>
              <SelectItem value="social">Social</SelectItem>
              <SelectItem value="milestone">Milestones</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="flex-1 pt-4 pb-4 px-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="px-6 space-y-4">
            {filteredPosts.map((post, index) => {
              const isLiked = post.likes.includes(currentUserId);
              const showComments = expandedComments.has(post._id);

              return (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 border-2 border-background">
                          <AvatarImage src={post.authorAvatar} alt={post.authorName} />
                          <AvatarFallback className="text-xs font-semibold">
                            {getInitials(post.authorName)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-sm">{post.authorName}</h4>
                            <BeltBadge
                              rank={post.authorBelt}
                              showTooltip={false}
                              className="text-xs"
                            />
                            <Badge variant="outline" className="text-xs gap-1">
                              {getPostIcon(post.type)}
                              {post.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {getRelativeTime(post.createdAt)}
                          </p>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleShare(post._id)}>
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleReport(post._id)}
                              className="text-destructive"
                            >
                              <Flag className="h-4 w-4 mr-2" />
                              Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <p className="text-sm leading-relaxed">{post.content}</p>

                      {post.imageUrl && (
                        <div className="rounded-lg overflow-hidden border bg-muted">
                          <img
                            src={post.imageUrl}
                            alt="Post image"
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      )}

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant={isLiked ? "default" : "ghost"}
                            size="sm"
                            className="gap-2 h-8"
                            onClick={() => handleLike(post._id)}
                          >
                            <Heart
                              className={cn(
                                "h-4 w-4",
                                isLiked && "fill-current"
                              )}
                            />
                            <span className="text-xs">{post.likes.length}</span>
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 h-8"
                            onClick={() => toggleComments(post._id)}
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-xs">{post.comments.length}</span>
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 h-8"
                          onClick={() => handleShare(post._id)}
                        >
                          <Share2 className="h-4 w-4" />
                          <span className="text-xs">Share</span>
                        </Button>
                      </div>

                      <AnimatePresence>
                        {showComments && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="space-y-3 overflow-hidden"
                          >
                            <Separator />

                            {post.comments.length > 0 && (
                              <div className="space-y-3">
                                {post.comments.map((comment) => (
                                  <div
                                    key={comment._id}
                                    className="flex gap-2 text-sm"
                                  >
                                    <div className="flex-1 bg-muted rounded-lg p-3">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-xs">
                                          {comment.authorName}
                                        </span>
                                        <BeltBadge
                                          rank={comment.authorBelt}
                                          showTooltip={false}
                                          className="text-xs"
                                        />
                                        <span className="text-xs text-muted-foreground">
                                          {getRelativeTime(comment.createdAt)}
                                        </span>
                                      </div>
                                      <p className="text-sm">{comment.content}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="flex gap-2">
                              <Textarea
                                placeholder="Write a comment..."
                                value={commentText[post._id] || ""}
                                onChange={(e) =>
                                  setCommentText((prev) => ({
                                    ...prev,
                                    [post._id]: e.target.value,
                                  }))
                                }
                                className="min-h-[60px] text-sm"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                                    handleComment(post._id);
                                  }
                                }}
                              />
                              <Button
                                size="icon"
                                onClick={() => handleComment(post._id)}
                                disabled={!commentText[post._id]?.trim()}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            {filteredPosts.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No posts in this category yet</p>
              </div>
            )}

            {showLoadMore && filteredPosts.length > 0 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowLoadMore(false)}
              >
                Load more posts
              </Button>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
