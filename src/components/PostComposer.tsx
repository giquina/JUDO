import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { ImagePlus, X } from "lucide-react";
import type { PostType } from "@/types/social";
import { POST_TYPE_CONFIG } from "@/types/social";

interface PostComposerProps {
  onPost: (content: string, type: PostType, imageUrl?: string) => void;
}

const CHARACTER_LIMITS = {
  quick: 280,
  detailed: 1000,
};

export default function PostComposer({ onPost }: PostComposerProps) {
  const { user, role } = useAuth();
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState<PostType>("community");
  const [characterLimit, setCharacterLimit] = useState<"quick" | "detailed">("quick");
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [isExpanded, setIsExpanded] = useState(false);

  // Only senseis and admins can post
  const canPost = role === "coach" || role === "admin";

  if (!canPost) {
    return null;
  }

  const currentLimit = CHARACTER_LIMITS[characterLimit];
  const remainingChars = currentLimit - content.length;
  const isOverLimit = remainingChars < 0;
  const isNearLimit = remainingChars <= 20 && remainingChars >= 0;

  const handlePost = () => {
    if (!content.trim()) {
      toast.error("Post content cannot be empty");
      return;
    }

    if (isOverLimit) {
      toast.error(`Post exceeds character limit by ${Math.abs(remainingChars)} characters`);
      return;
    }

    onPost(content, postType, imageUrl);
    setContent("");
    setImageUrl(undefined);
    setIsExpanded(false);
    toast.success("Post published successfully!");
  };

  const handleImageUpload = () => {
    // Mock image upload - in production, would use actual file upload
    toast.info("Image upload coming soon!");
    // For demo, you could set a placeholder:
    // setImageUrl("https://via.placeholder.com/600x400");
  };

  const removeImage = () => {
    setImageUrl(undefined);
  };

  return (
    <Card className="sticky top-4 z-10 shadow-lg">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground">
              {role === "coach" ? "Sensei" : "Admin"}
            </p>
          </div>
        </div>

        {/* Textarea */}
        <Textarea
          placeholder="What's happening at the dojo?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          className="min-h-[80px] mb-3 resize-none"
          maxLength={characterLimit === "quick" ? undefined : currentLimit}
        />

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Character Limit Toggle */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-muted-foreground">Character limit:</span>
                <div className="flex gap-1">
                  <Button
                    variant={characterLimit === "quick" ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setCharacterLimit("quick")}
                  >
                    Quick (280)
                  </Button>
                  <Button
                    variant={characterLimit === "detailed" ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setCharacterLimit("detailed")}
                  >
                    Detailed (1000)
                  </Button>
                </div>
              </div>

              {/* Post Type Selector */}
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-2">Post type:</p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(POST_TYPE_CONFIG) as PostType[]).map((type) => {
                    const config = POST_TYPE_CONFIG[type];
                    const isSelected = postType === type;

                    return (
                      <button
                        key={type}
                        onClick={() => setPostType(type)}
                        className={cn(
                          "transition-all",
                          isSelected && "ring-2 ring-primary ring-offset-2"
                        )}
                      >
                        <Badge
                          variant={isSelected ? "default" : "outline"}
                          className={cn(
                            "cursor-pointer hover:opacity-80",
                            !isSelected && config.color
                          )}
                        >
                          {config.emoji} {config.label}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Image Upload (Optional) */}
              {imageUrl ? (
                <div className="mb-3 relative rounded-lg overflow-hidden border">
                  <img
                    src={imageUrl}
                    alt="Upload preview"
                    className="w-full h-auto object-cover max-h-64"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="mb-3 gap-2"
                  onClick={handleImageUpload}
                >
                  <ImagePlus className="h-4 w-4" />
                  Add Image
                </Button>
              )}

              {/* Character Count */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className={cn(
                    "text-xs font-medium transition-colors",
                    isOverLimit && "text-destructive",
                    isNearLimit && !isOverLimit && "text-yellow-600 dark:text-yellow-500"
                  )}
                >
                  {remainingChars} characters remaining
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={handlePost}
                  disabled={!content.trim() || isOverLimit}
                  className="flex-1"
                >
                  Post
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setContent("");
                    setImageUrl(undefined);
                    setIsExpanded(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick stats when collapsed */}
        {!isExpanded && content.length > 0 && (
          <div className="text-xs text-muted-foreground">
            {content.length}/{currentLimit} characters
          </div>
        )}
      </CardContent>
    </Card>
  );
}
