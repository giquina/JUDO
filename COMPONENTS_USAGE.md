# Loading States & Empty States Components - Usage Guide

## Overview

Comprehensive loading states and empty state components for the JUDO app. All components use Framer Motion animations, Tailwind CSS, and match the existing design system.

---

## 1. Loading Component

**Location:** `/home/user/JUDO/src/components/Loading.tsx`

### Features
- 3 variants: `spinner`, `skeleton`, `pulse`
- 3 sizes: `sm`, `md`, `lg`
- Optional text label
- Full-screen mode
- Centered with Framer Motion animations

### Usage

```tsx
import Loading from "@/components/Loading";

// Basic spinner
<Loading />

// With text
<Loading text="Loading members..." />

// Different variants
<Loading variant="spinner" size="lg" />
<Loading variant="skeleton" />
<Loading variant="pulse" size="sm" />

// Full screen loading
<Loading fullScreen text="Initializing..." />
```

---

## 2. Skeleton Components

**Location:** `/home/user/JUDO/src/components/skeletons/`

### Available Skeletons

#### SkeletonCard
```tsx
import { SkeletonCard, SkeletonClassCard, SkeletonStatsCard } from "@/components/skeletons";

// Generic cards
<SkeletonCard count={3} />

// Class cards
<SkeletonClassCard count={2} />

// Stats cards
<SkeletonStatsCard count={4} />
```

#### SkeletonTable
```tsx
import { SkeletonTable, SkeletonTableRow } from "@/components/skeletons";

// Full table
<SkeletonTable rows={10} columns={5} />

// Single row
<SkeletonTableRow />
```

#### SkeletonDashboard
```tsx
import { SkeletonDashboard, SkeletonMemberDashboard } from "@/components/skeletons";

// Admin dashboard
<SkeletonDashboard />

// Member profile
<SkeletonMemberDashboard />
```

#### SkeletonChat
```tsx
import {
  SkeletonChatMessage,
  SkeletonChatThread,
  SkeletonGroupList,
  SkeletonChatLayout,
} from "@/components/skeletons";

// Single message
<SkeletonChatMessage isOwn={false} />

// Message thread
<SkeletonChatThread count={8} />

// Group list
<SkeletonGroupList count={5} />

// Full chat layout
<SkeletonChatLayout />
```

#### SkeletonList
```tsx
import {
  SkeletonList,
  SkeletonAnnouncementList,
  SkeletonEventList,
  SkeletonMediaGrid,
} from "@/components/skeletons";

// Generic list
<SkeletonList count={5} />

// Announcements
<SkeletonAnnouncementList count={3} />

// Events
<SkeletonEventList count={6} />

// Media grid
<SkeletonMediaGrid count={12} />
```

### Shimmer Animation

All skeletons include a shimmer effect added to Tailwind config:

```js
// tailwind.config.js - already configured
keyframes: {
  shimmer: {
    "0%": { transform: "translateX(-100%)" },
    "100%": { transform: "translateX(100%)" },
  },
},
animation: {
  shimmer: "shimmer 2s infinite",
},
```

---

## 3. Empty State Components

**Location:** `/home/user/JUDO/src/components/empty-states/`

### EmptyMembers
```tsx
import { EmptyMembers } from "@/components/empty-states";

<EmptyMembers
  onAddMember={() => console.log("Add member")}
  searchQuery=""
/>

// With search results
<EmptyMembers searchQuery="John" />
```

### EmptyClasses
```tsx
import { EmptyClasses } from "@/components/empty-states";

<EmptyClasses
  onCreateClass={() => console.log("Create class")}
  filterApplied={false}
/>
```

### EmptyPayments
```tsx
import { EmptyPayments } from "@/components/empty-states";

<EmptyPayments
  onAddPayment={() => console.log("Add payment")}
  onSetupStripe={() => console.log("Setup Stripe")}
  filterApplied={false}
/>
```

### EmptyAttendance
```tsx
import { EmptyAttendance } from "@/components/empty-states";

<EmptyAttendance
  onStartTracking={() => console.log("Start tracking")}
  onScanQR={() => console.log("Scan QR")}
  dateRange="This Week"
/>
```

### EmptyAnnouncements
```tsx
import { EmptyAnnouncements } from "@/components/empty-states";

<EmptyAnnouncements
  onCreateAnnouncement={() => console.log("Create")}
/>
```

### EmptyEvents
```tsx
import { EmptyEvents } from "@/components/empty-states";

<EmptyEvents
  onCreateEvent={() => console.log("Create event")}
  filterApplied={false}
/>
```

### EmptyMedia
```tsx
import { EmptyMedia } from "@/components/empty-states";

<EmptyMedia
  onUploadMedia={() => console.log("Upload")}
  mediaType="all" // "all" | "images" | "videos"
  filterApplied={false}
/>
```

---

## 4. Error State Component

**Location:** `/home/user/JUDO/src/components/ErrorState.tsx`

### Error Types
- `network` - Connection issues
- `permission` - Access denied
- `not-found` - 404 errors
- `server` - 500 errors
- `unknown` - Generic errors

### Usage

```tsx
import { ErrorState, NetworkError, NotFoundError } from "@/components/ErrorState";

// Generic error
<ErrorState
  type="unknown"
  title="Custom Title"
  message="Custom message"
  onRetry={() => console.log("Retry")}
  onReportIssue={() => console.log("Report")}
  onGoHome={() => navigate("/")}
/>

// Network error
<NetworkError
  onRetry={() => refetch()}
/>

// 404 error
<NotFoundError
  onGoHome={() => navigate("/")}
/>

// Server error with details
<ErrorState
  type="server"
  error={new Error("API failed")}
  onRetry={() => refetch()}
/>
```

### Convenience Components

```tsx
import {
  NetworkError,
  PermissionError,
  NotFoundError,
  ServerError,
} from "@/components/ErrorState";

<NetworkError onRetry={handleRetry} />
<PermissionError />
<NotFoundError onGoHome={() => navigate("/")} />
<ServerError onRetry={handleRetry} />
```

---

## 5. Integration Examples

### In a Data Fetching Component

```tsx
import { useState, useEffect } from "react";
import Loading from "@/components/Loading";
import { SkeletonTable } from "@/components/skeletons";
import { EmptyMembers } from "@/components/empty-states";
import { ErrorState } from "@/components/ErrorState";

function MembersPage() {
  const { data, loading, error, refetch } = useMembers();

  if (loading) {
    return <SkeletonTable rows={10} />;
  }

  if (error) {
    return <ErrorState type="network" onRetry={refetch} />;
  }

  if (!data || data.length === 0) {
    return <EmptyMembers onAddMember={() => setShowModal(true)} />;
  }

  return <MembersTable data={data} />;
}
```

### In a Dashboard

```tsx
import { SkeletonDashboard } from "@/components/skeletons";
import { ErrorState } from "@/components/ErrorState";

function Dashboard() {
  const { data, loading, error } = useDashboardData();

  if (loading) return <SkeletonDashboard />;
  if (error) return <ErrorState type="server" onRetry={() => window.location.reload()} />;

  return <DashboardContent data={data} />;
}
```

### With Search/Filter

```tsx
function MembersSearch() {
  const [search, setSearch] = useState("");
  const filtered = members.filter(m => m.name.includes(search));

  return (
    <>
      <SearchInput value={search} onChange={setSearch} />
      {filtered.length === 0 ? (
        <EmptyMembers searchQuery={search} />
      ) : (
        <MembersList members={filtered} />
      )}
    </>
  );
}
```

---

## 6. Design Features

### Animations
- **Framer Motion** for enter/exit animations
- **Shimmer effects** on skeletons
- **Floating icons** with organic movement
- **Pulse rings** for emphasis
- **Gradient backgrounds** for depth

### Color Schemes
- **Members:** Blue/Purple gradient
- **Classes:** Emerald/Teal gradient
- **Payments:** Amber/Orange gradient
- **Attendance:** Indigo/Violet gradient
- **Announcements:** Rose/Pink gradient
- **Events:** Violet/Purple gradient
- **Media:** Cyan/Blue gradient

### Responsive
- Mobile-first design
- Grid layouts adapt to screen size
- Stacked buttons on mobile
- Flexible max-widths

---

## 7. Best Practices

1. **Use specific skeletons** that match your content layout
2. **Match skeleton count** to expected data length
3. **Provide meaningful empty state actions** that help users progress
4. **Include retry handlers** in error states
5. **Use appropriate error types** for better UX
6. **Consider loading states hierarchy:**
   - Initial load: Full skeleton layout
   - Refresh: Subtle spinner
   - Background: No loading indicator

---

## 8. Files Created

### Loading Component
- `/home/user/JUDO/src/components/Loading.tsx` ✓

### Skeleton Components
- `/home/user/JUDO/src/components/skeletons/SkeletonCard.tsx` ✓
- `/home/user/JUDO/src/components/skeletons/SkeletonTable.tsx` ✓
- `/home/user/JUDO/src/components/skeletons/SkeletonDashboard.tsx` ✓
- `/home/user/JUDO/src/components/skeletons/SkeletonChat.tsx` ✓
- `/home/user/JUDO/src/components/skeletons/SkeletonList.tsx` ✓
- `/home/user/JUDO/src/components/skeletons/index.ts` ✓

### Empty State Components
- `/home/user/JUDO/src/components/empty-states/EmptyMembers.tsx` ✓
- `/home/user/JUDO/src/components/empty-states/EmptyClasses.tsx` ✓
- `/home/user/JUDO/src/components/empty-states/EmptyPayments.tsx` ✓
- `/home/user/JUDO/src/components/empty-states/EmptyAttendance.tsx` ✓
- `/home/user/JUDO/src/components/empty-states/EmptyAnnouncements.tsx` ✓
- `/home/user/JUDO/src/components/empty-states/EmptyEvents.tsx` ✓
- `/home/user/JUDO/src/components/empty-states/EmptyMedia.tsx` ✓
- `/home/user/JUDO/src/components/empty-states/index.ts` ✓

### Error Component
- `/home/user/JUDO/src/components/ErrorState.tsx` ✓

### Configuration
- Updated `/home/user/JUDO/tailwind.config.js` with shimmer animation ✓

---

## Total Files: 16 ✓

All components are production-ready with:
- TypeScript support
- Framer Motion animations
- Tailwind CSS styling
- Responsive design
- Accessible markup
- Consistent design language
