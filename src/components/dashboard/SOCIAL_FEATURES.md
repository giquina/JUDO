# Social Features Documentation

Complete social features implementation for the JUDO Club Manager app.

## Overview

The social features create an engaging, community-driven experience for club members with:

- **Training Partners**: Connect with compatible training partners
- **Leaderboards**: Friendly competition and progress tracking
- **Community Feed**: Share achievements and engage with the club
- **Social Notifications**: Stay updated on community activity
- **Member Profiles**: View detailed member information
- **Partner Discovery**: Find new training partners based on compatibility

## Components

### 1. TrainingPartners

Shows a member's frequent training partners with detailed statistics.

**Location**: `/src/components/dashboard/TrainingPartners.tsx`

**Features**:
- Top 5 training partners display
- Partner match score (compatibility)
- Times trained together
- Last training session
- Mutual favorite techniques
- Message and view profile actions
- Find new partners modal

**Usage**:
```tsx
import { TrainingPartners } from "@/components/dashboard";

function Dashboard() {
  return <TrainingPartners currentUserId="mem-001" />;
}
```

**Props**:
- `currentUserId?: string` - ID of the current user (default: "mem-001")
- `className?: string` - Additional CSS classes

---

### 2. Leaderboard

Multiple leaderboard types with filtering and ranking.

**Location**: `/src/components/dashboard/Leaderboard.tsx`

**Features**:
- 4 leaderboard types:
  - Most sessions this month
  - Longest current streak
  - Most improved
  - Top competitors (wins)
- Belt level filtering
- Rank change indicators (↑↓)
- Current user highlight
- Top 10 display
- Opt-in/opt-out toggle
- Privacy-respecting design

**Usage**:
```tsx
import { Leaderboard } from "@/components/dashboard";

function Dashboard() {
  return <Leaderboard currentUserId="mem-001" />;
}
```

**Props**:
- `currentUserId?: string` - ID of the current user
- `className?: string` - Additional CSS classes

---

### 3. CommunityFeed

Club-wide activity feed with social interactions.

**Location**: `/src/components/dashboard/CommunityFeed.tsx`

**Features**:
- Multiple post types:
  - Achievements
  - Event photos
  - Training tips
  - Competition results
  - Welcome messages
  - Announcements
- Like/react functionality
- Commenting system
- Share posts
- Report posts
- Category filtering
- Infinite scroll capability
- Real-time feel with mock data

**Usage**:
```tsx
import { CommunityFeed } from "@/components/dashboard";

function Dashboard() {
  return <CommunityFeed currentUserId="mem-001" />;
}
```

**Props**:
- `currentUserId?: string` - ID of the current user
- `className?: string` - Additional CSS classes

---

### 4. FindPartnersModal

Advanced member search and partner discovery.

**Location**: `/src/components/dashboard/FindPartnersModal.tsx`

**Features**:
- Search by name or bio
- Filter by:
  - Belt rank
  - Training focus (randori, kata, competition)
  - Experience level
  - Availability
- Compatibility match score (0-100)
- Member cards with:
  - Avatar and belt
  - Bio
  - Training stats
  - Availability
  - Favorite techniques
- Send partner request
- Smart matching algorithm

**Usage**:
```tsx
import { FindPartnersModal } from "@/components/dashboard";

function Component() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Find Partners</Button>
      <FindPartnersModal
        open={open}
        onOpenChange={setOpen}
        currentUserId="mem-001"
      />
    </>
  );
}
```

**Props**:
- `open: boolean` - Modal open state
- `onOpenChange: (open: boolean) => void` - Open state change handler
- `currentUserId: string` - ID of the current user

**Match Score Algorithm**:
The match score is calculated based on:
- Belt rank similarity (closer = better)
- Training focus overlap
- Schedule compatibility
- Similar session frequency
- Score range: 0-100

---

### 5. MemberProfileModal

Detailed member profile view.

**Location**: `/src/components/dashboard/MemberProfileModal.tsx`

**Features**:
- Public profile display
- Three tabs:
  - **Overview**: Bio, techniques, availability
  - **Stats**: Session counts, competition record, progress
  - **Activity**: Recent posts and achievements
- Training stats visualization
- Member achievements
- Mutual training partners
- Message button
- Add as training partner
- Schedule overlap indicator
- Progress bars

**Usage**:
```tsx
import { MemberProfileModal } from "@/components/dashboard";

function Component() {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  return (
    <MemberProfileModal
      open={!!selectedMember}
      onOpenChange={(open) => !open && setSelectedMember(null)}
      memberId={selectedMember || ""}
      currentUserId="mem-001"
    />
  );
}
```

**Props**:
- `open: boolean` - Modal open state
- `onOpenChange: (open: boolean) => void` - Open state change handler
- `memberId: string` - ID of the member to display
- `currentUserId: string` - ID of the current user

---

### 6. SocialNotifications

Real-time social activity notifications.

**Location**: `/src/components/dashboard/SocialNotifications.tsx`

**Features**:
- Notification types:
  - Training partner requests
  - Leaderboard position changes
  - Friend achievements
  - Event invites
  - New followers
  - Mentions in posts
- Unread count badge
- Read/unread states
- Accept/decline actions for requests
- Mark as read functionality
- Mark all as read
- Relative timestamps
- Click to navigate

**Usage**:
```tsx
import { SocialNotifications } from "@/components/dashboard";

function Dashboard() {
  return <SocialNotifications currentUserId="mem-001" />;
}
```

**Props**:
- `currentUserId?: string` - ID of the current user
- `className?: string` - Additional CSS classes

---

## Mock Data

**Location**: `/src/lib/mockSocialData.ts`

The mock data includes:

### Data Structures

**SocialMember** (30+ members):
- Personal info (name, email, avatar)
- Belt rank and join date
- Training stats (sessions, streaks)
- Achievements
- Favorite techniques
- Training focus preferences
- Availability schedule
- Privacy settings

**TrainingPartner**:
- Partner relationships
- Times trained together
- Last session timestamp
- Match score
- Mutual techniques
- Status (active/pending/inactive)

**CommunityPost** (6+ posts):
- Author information
- Post type and content
- Images
- Likes and comments
- Timestamps
- Categories

**LeaderboardEntry**:
- Generated dynamically based on type
- Member ranking
- Score/metric
- Rank change indicators

**SocialNotification** (4+ notifications):
- Notification type
- Title and message
- Related user info
- Read status
- Action URLs
- Timestamps

### Helper Functions

```tsx
// Get member by ID
const member = getMemberById("mem-001");

// Get training partners for a member
const partners = getTrainingPartnersForMember("mem-001");

// Generate leaderboard
const leaderboard = generateLeaderboard("sessions");
// Types: "sessions" | "streak" | "improved" | "competitions"
```

---

## Demo Components

### SocialFeaturesDemo

Full-featured demo page with two layouts:

**Tabbed Layout** (default):
```tsx
import { SocialFeaturesDemo } from "@/components/dashboard/SocialFeaturesDemo";

<SocialFeaturesDemo currentUserId="mem-001" layout="tabbed" />
```

**Grid Layout**:
```tsx
<SocialFeaturesDemo currentUserId="mem-001" layout="grid" />
```

### SocialDashboardWidget

Compact widget for main dashboard:
```tsx
import { SocialDashboardWidget } from "@/components/dashboard/SocialFeaturesDemo";

<SocialDashboardWidget
  currentUserId="mem-001"
  onNavigate={(section) => router.push(`/social/${section}`)}
/>
```

---

## Integration Guide

### Step 1: Add to Your Dashboard

```tsx
import {
  TrainingPartners,
  Leaderboard,
  CommunityFeed,
  SocialNotifications,
} from "@/components/dashboard";

function Dashboard() {
  const userId = useCurrentUser(); // Your auth hook

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <TrainingPartners currentUserId={userId} />
      <Leaderboard currentUserId={userId} />
      <div className="lg:col-span-2">
        <CommunityFeed currentUserId={userId} />
      </div>
    </div>
  );
}
```

### Step 2: Add Navigation

```tsx
import { Users, Trophy, MessageCircle, Bell } from "lucide-react";

const socialNavItems = [
  { icon: Users, label: "Training Partners", href: "/social/partners" },
  { icon: Trophy, label: "Leaderboard", href: "/social/leaderboard" },
  { icon: MessageCircle, label: "Community", href: "/social/feed" },
  { icon: Bell, label: "Notifications", href: "/social/notifications" },
];
```

### Step 3: Connect to Real Data

When ready to connect to Convex (or your backend):

1. **Replace mock data imports**:
```tsx
// Before
import { getTrainingPartnersForMember } from "@/lib/mockSocialData";

// After
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const partners = useQuery(api.social.getTrainingPartners, {
  userId: currentUserId,
});
```

2. **Add mutations for interactions**:
```tsx
const sendPartnerRequest = useMutation(api.social.sendPartnerRequest);
const likePost = useMutation(api.social.likePost);
const addComment = useMutation(api.social.addComment);
```

3. **Update notification system**:
Connect to real-time notifications using Convex subscriptions or webhooks.

---

## Design Principles

1. **Privacy First**: Members can opt out of leaderboards and control profile visibility
2. **Encouraging**: Focus on positive reinforcement and community building
3. **Accessible**: Full keyboard navigation and screen reader support
4. **Responsive**: Works on mobile, tablet, and desktop
5. **Performant**: Optimized with animations and lazy loading
6. **Engaging**: Gamification elements without being overwhelming

---

## Customization

### Theming

All components use Tailwind CSS and shadcn/ui theming:

```tsx
// Customize colors in your tailwind.config.js
colors: {
  primary: {...},  // Accent color for CTAs
  secondary: {...}, // Secondary accents
  muted: {...},    // Background tones
}
```

### Animations

Powered by Framer Motion. Adjust animation variants:

```tsx
// Example: Speed up animations
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2 }} // Faster
>
```

### Match Score Tuning

Adjust the compatibility algorithm in `FindPartnersModal`:

```tsx
const calculateMatchScore = (member: SocialMember): number => {
  let score = 50; // Base score

  // Customize weights:
  score += beltSimilarity * 20;  // Belt rank weight
  score += focusOverlap * 10;    // Training focus weight
  score += scheduleOverlap * 3;  // Schedule weight

  return Math.min(100, score);
};
```

---

## Future Enhancements

Potential features for real backend integration:

- [ ] Real-time chat integration
- [ ] Push notifications
- [ ] Advanced search filters
- [ ] Training session scheduling
- [ ] Photo/video uploads
- [ ] Direct messaging
- [ ] Event RSVP system
- [ ] Achievement badges
- [ ] Progress tracking graphs
- [ ] Weekly/monthly reports
- [ ] Export social data
- [ ] Privacy settings management
- [ ] Block/mute users
- [ ] Report moderation queue

---

## Support

For questions or issues:
- Check component props and examples above
- Review the demo implementation in `SocialFeaturesDemo.tsx`
- Inspect mock data structure in `mockSocialData.ts`
- Test with different user IDs to see various states

---

**Version**: 1.0
**Last Updated**: January 2026
**Status**: Frontend Complete - Ready for Backend Integration
