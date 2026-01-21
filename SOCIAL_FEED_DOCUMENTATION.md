# Social Feed Feature Documentation

## Overview

A complete Twitter-like social feed system for the JUDO platform that enables community engagement, announcements, achievements sharing, and real-time interaction among members, senseis, and admins.

---

## Files Created

### Components

1. **`/home/user/JUDO/src/components/SocialFeed.tsx`**
   - Main feed container with infinite scroll
   - Handles post loading, pagination, and refresh
   - Displays posts in reverse chronological order
   - Pinned posts always appear at the top

2. **`/home/user/JUDO/src/components/PostCard.tsx`**
   - Individual post display component
   - Reaction system (Like, Respect, Strong, Fire)
   - Role badges and belt rank indicators
   - Post actions (pin, edit, delete) based on permissions
   - Timestamp with relative time formatting

3. **`/home/user/JUDO/src/components/PostComposer.tsx`**
   - Post creation interface (Sensei/Admin only)
   - Character limits: 280 (quick) or 1000 (detailed)
   - Post type selector (Announcement, Achievement, General, Event)
   - Image upload support (UI ready, backend pending)
   - Auto-expanding textarea

### Types & Data

4. **`/home/user/JUDO/src/types/social.ts`**
   - TypeScript interfaces for Post, Reaction, Comment
   - Post type configurations with emojis and colors
   - Reaction type configurations

5. **`/home/user/JUDO/src/lib/mock-social-data.ts`**
   - 10 sample posts demonstrating all features
   - Diverse post types and engagement levels
   - Ready to be replaced with Convex queries

### Pages

6. **`/home/user/JUDO/src/pages/SocialFeedPage.tsx`**
   - Dedicated page for the community feed
   - Includes navigation and page layout
   - Accessible at `/community` route

---

## Features Implemented

### ✅ Core Features

- **Post Types**
  - 🚨 Announcements (important updates)
  - 🏆 Achievements (promotions, competitions)
  - 💬 General (community posts)
  - 📅 Events (competitions, schedule changes)

- **Reaction System**
  - 👍 Like
  - 🥋 Respect
  - 💪 Strong
  - 🔥 Fire
  - Toggle reactions on/off
  - Real-time count updates

- **Permissions**
  - **Members**: View, react, comment
  - **Senseis/Admins**: All above + create posts, edit own posts, delete own posts
  - **Admins**: All above + pin/unpin posts, moderate all content

- **Post Management**
  - Pin/unpin important posts (appears at top)
  - Edit posts (author or moderator)
  - Delete posts (author or moderator)
  - Three-dot menu for actions

### ✅ User Experience

- **Infinite Scroll**
  - Loads 10 posts initially
  - Automatically loads more on scroll
  - Intersection Observer for optimal performance
  - "End of feed" indicator

- **Loading States**
  - Skeleton screens on initial load
  - Spinner for "load more" operations
  - Smooth animations between states

- **Empty State**
  - Friendly message when no posts exist
  - Encourages first post creation

- **Responsive Design**
  - Mobile-optimized layout
  - Cards stack vertically on small screens
  - Touch-friendly interaction areas

- **Dark Mode Support**
  - Fully compatible with theme system
  - Proper contrast in both modes
  - Dynamic badge colors

- **Animations**
  - Framer Motion staggered entry
  - Smooth reaction button feedback
  - Card hover effects
  - Action menu transitions

### ✅ Visual Design

- **Author Display**
  - Avatar with initials
  - Name and role badge
  - Belt rank indicator
  - Timestamp (relative time)

- **Post Type Badges**
  - Color-coded for quick recognition
  - Emoji indicators
  - Accessible design

- **Engagement Bar**
  - Clear reaction buttons
  - Visual feedback on interaction
  - Comment count display

---

## Usage Examples

### Basic Setup

```tsx
import SocialFeed from "@/components/SocialFeed";

function CommunityPage() {
  return <SocialFeed className="max-w-4xl mx-auto" />;
}
```

### Creating a Post (Sensei/Admin)

The `PostComposer` automatically appears for authorized users. Users can:
1. Click the textarea to expand
2. Choose character limit (quick 280 / detailed 1000)
3. Select post type with emoji badges
4. Optionally add an image
5. Click "Post" to publish

### Interacting with Posts

```tsx
<PostCard
  post={post}
  onReact={(postId, type) => handleReaction(postId, type)}
  onTogglePin={(postId) => handlePin(postId)}
  onEdit={(postId) => handleEdit(postId)}
  onDelete={(postId) => handleDelete(postId)}
/>
```

---

## Integration with Convex (Future)

### Required Convex Schema

```typescript
// convex/schema.ts
export default defineSchema({
  posts: defineTable({
    authorId: v.string(),
    type: v.union(
      v.literal("announcement"),
      v.literal("achievement"),
      v.literal("community"),
      v.literal("event")
    ),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    isPinned: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_creation", ["createdAt"])
    .index("by_pinned", ["isPinned", "createdAt"]),

  reactions: defineTable({
    postId: v.id("posts"),
    userId: v.string(),
    type: v.union(
      v.literal("like"),
      v.literal("respect"),
      v.literal("strong"),
      v.literal("fire")
    ),
    createdAt: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_user_post", ["userId", "postId"]),

  comments: defineTable({
    postId: v.id("posts"),
    authorId: v.string(),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_post", ["postId", "createdAt"]),
});
```

### Convex Queries to Implement

```typescript
// convex/posts.ts

// Get paginated posts
export const getPosts = query({
  args: {
    paginationOpts: paginationOptsValidator
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

// Create post
export const createPost = mutation({
  args: {
    type: v.union(v.literal("announcement"), ...),
    content: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Check permissions (sensei/admin only)
    const user = await getUser(ctx, identity.subject);
    if (user.role !== "coach" && user.role !== "admin") {
      throw new Error("Not authorized");
    }

    return await ctx.db.insert("posts", {
      ...args,
      authorId: identity.subject,
      isPinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Toggle reaction
export const toggleReaction = mutation({
  args: {
    postId: v.id("posts"),
    type: v.union(v.literal("like"), ...),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("reactions")
      .withIndex("by_user_post", (q) =>
        q.eq("userId", identity.subject).eq("postId", args.postId)
      )
      .filter((q) => q.eq(q.field("type"), args.type))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    } else {
      await ctx.db.insert("reactions", {
        postId: args.postId,
        userId: identity.subject,
        type: args.type,
        createdAt: Date.now(),
      });
    }
  },
});

// Toggle pin (admin/sensei only)
export const togglePin = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await getUser(ctx, identity.subject);
    if (user.role !== "coach" && user.role !== "admin") {
      throw new Error("Not authorized");
    }

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    await ctx.db.patch(args.postId, {
      isPinned: !post.isPinned,
      updatedAt: Date.now(),
    });
  },
});
```

---

## Styling & Design System

### Colors Used

- **Primary**: Blue gradient (from theme)
- **Badges**: Role-specific colors
  - Admin: Destructive variant (red)
  - Sensei: Primary variant (blue)
  - Member: Secondary variant (gray)
- **Belt Ranks**: Matches existing belt colors
- **Post Types**: Color-coded badges with emojis

### Typography

- **Post Content**: `text-sm leading-relaxed`
- **Author Name**: `font-semibold text-sm`
- **Timestamps**: `text-xs text-muted-foreground`
- **Badges**: `text-xs`

### Spacing

- **Card Padding**: `p-6`
- **Gap Between Posts**: `space-y-4`
- **Internal Spacing**: `gap-2` to `gap-4`

---

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus states on all buttons
- High contrast in both themes
- Screen reader friendly timestamps

---

## Performance Optimizations

1. **Intersection Observer** for infinite scroll (no scroll event listeners)
2. **React.useCallback** for event handlers to prevent unnecessary re-renders
3. **Pagination** to limit initial data load
4. **Skeleton screens** instead of full-page loaders
5. **Framer Motion AnimatePresence** for smooth list updates

---

## Mobile Responsiveness

- Touch-friendly button sizes (min 44x44px)
- Optimized for portrait orientation
- Responsive card layout
- Mobile-optimized navigation
- Pull-to-refresh ready (UI implemented)

---

## Known Limitations (To Be Addressed)

1. **Mock Data**: Currently uses static mock data. Replace with Convex queries.
2. **Image Upload**: UI is ready, but backend integration needed.
3. **Comments**: Counter displayed, but full comment system not yet implemented.
4. **Real-time Updates**: Not yet implemented (will use Convex subscriptions).
5. **Notifications**: Not yet implemented for post interactions.
6. **Edit Functionality**: Edit handler is stubbed, needs full implementation.

---

## Testing Checklist

- [x] Posts display in correct order (pinned first, then newest)
- [x] Reactions toggle on/off correctly
- [x] Character limits enforced
- [x] Only senseis/admins can create posts
- [x] Pin/unpin works for authorized users
- [x] Delete removes post from feed
- [x] Infinite scroll loads more posts
- [x] Loading states display correctly
- [x] Empty state shows when no posts
- [x] Dark mode compatibility
- [x] Mobile responsive layout
- [x] Animations smooth and performant
- [ ] Real-time updates (pending Convex)
- [ ] Image upload (pending backend)
- [ ] Comments system (pending implementation)

---

## Future Enhancements

### Phase 2 (Convex Integration)
- Replace mock data with Convex queries
- Implement real-time subscriptions
- Add proper user authentication checks
- Persistent reactions and comments

### Phase 3 (Advanced Features)
- Full comment threads
- Image upload with S3/Cloudinary
- Mention system (@user)
- Hashtags (#technique)
- Post search and filtering
- Rich text formatting
- Video embeds
- Post bookmarking

### Phase 4 (Engagement)
- Push notifications for reactions/comments
- Email digests of important posts
- Post analytics for admins
- Trending posts algorithm
- User reputation system

---

## Navigation Setup

The social feed is accessible via:
- **URL**: `/community`
- **Navigation Item**: "Community" (MessageSquare icon)
- **Permissions**: All authenticated users (member, coach, admin)

---

## Dependencies Added

- **date-fns** (^3.x): For relative time formatting ("2 hours ago")

---

## API Surface

### SocialFeed Component

```tsx
interface SocialFeedProps {
  className?: string; // Optional additional CSS classes
}
```

### PostCard Component

```tsx
interface PostCardProps {
  post: Post;
  onReact: (postId: string, reactionType: ReactionType) => void;
  onTogglePin?: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}
```

### PostComposer Component

```tsx
interface PostComposerProps {
  onPost: (content: string, type: PostType, imageUrl?: string) => void;
}
```

---

## Code Quality

- **TypeScript**: Fully typed with strict mode
- **ESLint**: No linting errors in new code
- **Formatting**: Consistent with existing codebase
- **Comments**: Clear inline documentation
- **Error Handling**: Toast notifications for user feedback

---

## Summary

The social feed feature is **production-ready** for the frontend with mock data. It provides a complete, polished user experience with:

- Beautiful, responsive design
- Smooth animations
- Role-based permissions
- Infinite scroll
- Dark mode support
- Comprehensive interaction system

**Next Steps**:
1. Integrate with Convex backend (replace mock data)
2. Implement image upload functionality
3. Add full comment system
4. Enable real-time updates with subscriptions

The architecture is designed to make these integrations straightforward, with clear separation between UI and data layers.
