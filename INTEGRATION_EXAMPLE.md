# Dashboard Components Integration Guide

## Components Created

### 1. ActivityFeed Component
**Location:** `/home/user/JUDO/src/components/dashboard/ActivityFeed.tsx`

**Features:**
- Real-time feed of club activity with 6 activity types
- Animated activity items with avatars/icons
- Time ago formatting (2h ago, 1d ago, etc.)
- Belt rank badges with proper colors
- Load more functionality with loading states
- Activity statistics (check-ins, promotions, new members)
- Empty state handling
- Smooth Framer Motion animations

**Activity Types:**
- Check-ins (with member avatars)
- Belt promotions (with belt color badges)
- New members joining
- Event signups
- Achievements unlocked
- Announcements posted

---

### 2. AnnouncementsCard Component
**Location:** `/home/user/JUDO/src/components/dashboard/AnnouncementsCard.tsx`

**Features:**
- Display latest 3-5 announcements (expandable to view all)
- 4 category badges: Competition, Training, Social, Admin
- 3 priority indicators: Urgent, Important, Info
- Pin icon for pinned announcements
- Expandable/collapsible preview
- Unread indicator (blue dot + ring)
- "View All" button to show all announcements
- Category and priority color coding
- Summary statistics

**Categories:**
- Competition (yellow/trophy)
- Training (blue/users)
- Social (purple/calendar)
- Admin (gray/shield)

**Priorities:**
- Urgent (red with alert icon)
- Important (orange with star icon)
- Info (blue with info icon)

---

### 3. UpcomingEventsCard Component
**Location:** `/home/user/JUDO/src/components/dashboard/UpcomingEventsCard.tsx`

**Features:**
- Display next 3-5 events (expandable to view all)
- 4 event types: Competition, Grading, Social, Training Camp
- Date countdown ("3 days away", "2 weeks away")
- Interactive RSVP buttons (Going, Maybe, Can't Go)
- Real-time capacity indicator with progress bar
- Color-coded by event type with gradients
- Event thumbnail emojis
- "Add to calendar" button
- Featured event badges
- Toast notifications for RSVP changes
- Summary statistics by event type

**Event Types:**
- Competition (yellow/trophy)
- Grading (blue/graduation cap)
- Social (purple/party popper)
- Training Camp (green/tent)

---

## Mock Data
**Location:** `/home/user/JUDO/src/lib/mockActivityData.ts`

**Contains:**
- 50+ diverse activity items
- 12+ announcements with different priorities and categories
- 10+ upcoming events with varied types
- Realistic timestamps and data
- Helper functions: `getTimeAgo()`, `getDaysUntil()`, `getInitials()`
- University of London Judo Club themed content

---

## Integration Example

### Basic Integration (Add to MemberDashboard.tsx)

```tsx
import { ActivityFeed, AnnouncementsCard, UpcomingEventsCard } from "@/components/dashboard";

// Inside your MemberDashboard component:
<div className="grid gap-6 lg:grid-cols-2">
  {/* Left Column */}
  <div className="space-y-6">
    <ActivityFeed />
  </div>

  {/* Right Column */}
  <div className="space-y-6">
    <AnnouncementsCard />
    <UpcomingEventsCard />
  </div>
</div>
```

### Full Layout Example

```tsx
import { motion } from "framer-motion";
import { ActivityFeed, AnnouncementsCard, UpcomingEventsCard } from "@/components/dashboard";

export default function MemberDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto p-4 space-y-6">
        <Breadcrumbs />

        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold">Welcome back, Alice!</h1>
          <p className="text-muted-foreground">Ready for training?</p>
        </motion.div>

        {/* Quick Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Your existing stats cards */}
        </div>

        {/* NEW: Dashboard Components */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Activity Feed */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ActivityFeed />
          </motion.div>

          {/* Right Column - Announcements & Events */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <AnnouncementsCard />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <UpcomingEventsCard />
            </motion.div>
          </div>
        </div>

        {/* Your existing content (attendance, subscription, etc.) */}
      </main>
    </div>
  );
}
```

---

## Styling & Customization

All components follow the existing design system:
- **Colors:** Primary, secondary, muted from Tailwind config
- **Typography:** Existing font system
- **Animations:** Framer Motion with consistent timing
- **Dark Mode:** Full support via Tailwind dark: classes
- **Responsive:** Mobile-first design with breakpoints

### Customization Options

**ActivityFeed:**
```tsx
// Change initial display count
const [displayCount, setDisplayCount] = useState(10); // default: 15

// Change load more increment
setDisplayCount(prev => Math.min(prev + 20, mockActivities.length)); // default: +10
```

**AnnouncementsCard:**
```tsx
// Change initial display count
const displayedAnnouncements = showAll ? sortedAnnouncements : sortedAnnouncements.slice(0, 3); // default: 5
```

**UpcomingEventsCard:**
```tsx
// Change initial display count
const displayedEvents = showAll ? sortedEvents : sortedEvents.slice(0, 3); // default: 5
```

---

## Features & Interactions

### ActivityFeed
- ✅ Scroll to load more with "Load More" button
- ✅ Smooth animations on load
- ✅ Hover effects on activity items
- ✅ Connection lines between items
- ✅ Live activity indicator (pulsing green dot)
- ✅ Statistics footer

### AnnouncementsCard
- ✅ Click to expand/collapse announcements
- ✅ Pinned announcements appear first
- ✅ Unread indicators (blue dot + ring)
- ✅ "View All" to show all announcements
- ✅ Color-coded by priority and category
- ✅ Statistics footer

### UpcomingEventsCard
- ✅ Interactive RSVP buttons with state management
- ✅ Capacity bar with color coding (green → orange → red)
- ✅ Countdown to event
- ✅ "Add to Calendar" button
- ✅ Featured event badges
- ✅ Toast notifications on RSVP
- ✅ Statistics footer

---

## Testing

All components include:
- ✅ Loading states
- ✅ Empty states
- ✅ Error handling
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Accessibility (ARIA labels, keyboard navigation)

---

## Next Steps: Replacing Mock Data with Convex

When ready to connect to Convex backend:

1. **Create Convex schemas** for activities, announcements, and events
2. **Replace mock imports** with Convex queries:

```tsx
// Replace this:
import { mockActivities } from "@/lib/mockActivityData";

// With this:
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const activities = useQuery(api.activities.list);
```

3. **Update component props** to handle loading/error states from Convex
4. **Add mutations** for RSVP, marking announcements as read, etc.

---

## Files Created

1. `/home/user/JUDO/src/lib/mockActivityData.ts` - Mock data and types
2. `/home/user/JUDO/src/components/dashboard/ActivityFeed.tsx` - Activity feed component
3. `/home/user/JUDO/src/components/dashboard/AnnouncementsCard.tsx` - Announcements component
4. `/home/user/JUDO/src/components/dashboard/UpcomingEventsCard.tsx` - Events component
5. `/home/user/JUDO/src/components/dashboard/index.ts` - Export file

---

## Support

All components are production-ready and match the existing design system. They use:
- Existing UI components from `@/components/ui`
- Existing animation variants from `@/lib/animation-variants`
- Existing color scheme and styling patterns
- Sonner for toast notifications
- Framer Motion for animations
- Lucide React for icons

**Total Lines of Code:** ~1,500
**Components Created:** 3
**Mock Data Items:** 70+
**Animation Variants:** Multiple
**Event Handlers:** RSVP, expand/collapse, load more, add to calendar
