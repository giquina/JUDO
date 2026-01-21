# Dashboard Components

Professional payment history and profile management components for the JUDO Club App.

## Components

### 1. PaymentHistoryCard

Displays the last 5 payments with status badges, payment method details, and download receipt functionality.

**Features:**
- Recent payment list (last 5 transactions)
- Upcoming payment indicator
- Payment status badges (Paid, Pending, Failed, Refunded)
- Payment method icons (Visa, Mastercard, PayPal)
- Download receipt button
- View all payments link

**Usage:**
```tsx
import { PaymentHistoryCard } from "@/components/dashboard"

<PaymentHistoryCard
  onViewAll={() => setShowModal(true)}
  className="optional-classname"
/>
```

### 2. PaymentHistoryModal

Full-featured payment history modal with filtering, search, and export capabilities.

**Features:**
- Search by description or receipt number
- Filter by status (Completed, Pending, Failed, Refunded)
- Filter by date range (30 days, 90 days, 6 months, 1 year)
- Sort by date or amount
- Export to CSV
- Total spent calculation
- Calendar view (coming soon)
- Failed payment retry button
- Download individual receipts

**Usage:**
```tsx
import { PaymentHistoryModal } from "@/components/dashboard"

const [open, setOpen] = useState(false)

<PaymentHistoryModal
  open={open}
  onOpenChange={setOpen}
/>
```

### 3. SubscriptionManagement

Complete subscription and payment method management interface.

**Features:**
- Current subscription card with benefits
- Subscription tier comparison (Student, Standard, Premium)
- Upgrade/downgrade functionality
- Next billing date display
- Pause subscription option
- Cancel subscription with confirmation
- Payment method management
  - View all payment methods
  - Add new payment method
  - Set default payment method
  - Remove payment methods
- Subscription history

**Usage:**
```tsx
import { SubscriptionManagement } from "@/components/dashboard"

<SubscriptionManagement className="optional-classname" />
```

### 4. ProfileQuickEdit

Comprehensive profile editing modal with three tabs: Personal, Preferences, and Security.

**Features:**

**Personal Tab:**
- Profile photo upload (with validation)
- Full name
- Email address
- Phone number
- Emergency contact
- Bio (500 character limit)
- Real-time validation

**Preferences Tab:**
- Email notifications toggle
- SMS notifications toggle
- Push notifications toggle
- Privacy settings
  - Show belt rank
  - Show attendance stats

**Security Tab:**
- Change password (with validation)
- Delete account (with warning)
- Password strength requirements
- Show/hide password toggles

**Usage:**
```tsx
import { ProfileQuickEdit } from "@/components/dashboard"

const [open, setOpen] = useState(false)

<ProfileQuickEdit
  open={open}
  onOpenChange={setOpen}
/>
```

### 5. ProfileCard

User profile card with quick stats, social links, and action buttons.

**Features:**
- Profile photo with hover overlay for upload
- Name and email display
- Belt rank badge
- Member since date
- Quick stats:
  - Total sessions
  - Current streak (days)
  - Attendance percentage
- Action buttons:
  - Edit profile
  - Share profile
  - View member QR code
- Social media links (Facebook, Twitter, Instagram, LinkedIn)

**Usage:**
```tsx
import { ProfileCard } from "@/components/dashboard"

<ProfileCard className="optional-classname" />
```

## Mock Data

All components use mock data from `/home/user/JUDO/src/lib/mockPaymentData.ts`:

```tsx
import {
  mockPaymentHistory,
  mockPaymentMethods,
  currentSubscription,
  calculateTotalSpent,
  getUpcomingPayment
} from "@/lib/mockPaymentData"
```

### Available Mock Data:
- `mockPaymentHistory` - 12+ months of payment transactions
- `mockPaymentMethods` - Credit cards and PayPal
- `currentSubscription` - Current user subscription details
- `calculateTotalSpent()` - Helper function
- `getUpcomingPayment()` - Next billing date and amount

## Integration Example

See `/home/user/JUDO/src/pages/DashboardDemo.tsx` for a complete example of how to use all components together.

```tsx
import { useState } from "react"
import {
  PaymentHistoryCard,
  PaymentHistoryModal,
  SubscriptionManagement,
  ProfileCard,
} from "@/components/dashboard"

export function MyDashboard() {
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  return (
    <div className="grid gap-6">
      <ProfileCard />
      <PaymentHistoryCard onViewAll={() => setShowPaymentModal(true)} />
      <SubscriptionManagement />

      <PaymentHistoryModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
      />
    </div>
  )
}
```

## Validation

All forms include real-time validation:

**Email:**
- Valid email format required
- Pattern: `name@domain.com`

**Phone:**
- Minimum 10 characters
- Pattern: `+XX XXX XXX XXXX`
- Allows: digits, spaces, hyphens, parentheses

**Password:**
- Minimum 8 characters
- Must match confirmation
- Current password required for changes

**Profile Photo:**
- Max size: 5MB
- Accepted formats: JPG, PNG, GIF
- Real-time preview

## Accessibility

All components follow WCAG 2.1 Level AA guidelines:
- Keyboard navigation support
- Focus management
- ARIA labels
- Color contrast compliance
- Screen reader support

## Styling

Built with:
- Tailwind CSS v4
- Shadcn/UI components
- Dark mode support
- Responsive design
- Framer Motion animations (ready to add)

## Security Features

- Password strength validation
- Confirmation dialogs for destructive actions
- File upload validation
- XSS protection (no innerHTML)
- Secure form handling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

All components use existing project dependencies:
- React 18
- TypeScript
- Tailwind CSS
- Shadcn/UI
- Lucide React (icons)
- Sonner (toasts)

## Future Enhancements

When integrating with Convex backend:
1. Replace mock data with Convex queries
2. Add real Stripe payment integration
3. Implement actual file upload to storage
4. Add real-time subscription updates
5. Enable calendar view in payment history
6. Add payment method verification

## Support

For questions or issues, refer to:
- Main project README: `/home/user/JUDO/README.md`
- Project instructions: `/home/user/JUDO/CLAUDE.md`
- Demo page: `/home/user/JUDO/src/pages/DashboardDemo.tsx`

---

# Quick Actions & Interactive Elements

Complete system of Quick Actions, Interactive Elements, and Polish features for the JUDO app.

## Interactive Components

### 6. Quick Actions Bar (`QuickActionsBar.tsx`)

Horizontal bar with quick access to common actions.

**Features:**
- 6-8 customizable actions
- Keyboard shortcuts (displayed on hover)
- Badge notifications
- Active state indicators
- Smooth animations
- Optional sticky positioning

**Usage:**
```tsx
import { QuickActionsBar } from "@/components/dashboard";

<QuickActionsBar
  actions={[
    {
      id: "check-in",
      label: "Check In",
      icon: <QrCode />,
      onClick: () => handleCheckIn(),
      shortcut: "C",
      badge: 3,
      active: true
    }
  ]}
  sticky={true}
/>
```

---

### 7. Dashboard Widgets

All widgets are located in `/components/dashboard/widgets/` and support click handlers, custom styling, and responsive design.

**StreakWidget** - Training streak display with flame animation
```tsx
<StreakWidget
  currentStreak={7}
  longestStreak={14}
  onClick={() => handleStreakClick()}
/>
```

**GoalWidget** - Goal progress card with progress bar
```tsx
<GoalWidget
  goal={{
    id: "1",
    title: "Train 3 times this week",
    progress: 2,
    target: 3,
    unit: "sessions",
    deadline: new Date()
  }}
/>
```

**EventWidget** - Event card with date, location, attendees
```tsx
<EventWidget
  event={{
    id: "1",
    title: "Seminar",
    date: new Date(),
    location: "Main Dojo",
    type: "seminar",
    isRegistered: true
  }}
/>
```

**PartnerWidget** - Training partner card
```tsx
<PartnerWidget
  partner={{
    name: "Sarah",
    belt: "Blue Belt",
    beltColor: "blue",
    sessionsWithYou: 12
  }}
/>
```

**AchievementWidget** - Achievement unlock notification
```tsx
<AchievementWidget
  achievement={{
    title: "First Month",
    description: "Completed first month",
    rarity: "rare",
    unlockedAt: new Date(),
    points: 100
  }}
/>
```

**TipWidget** - Daily training tip
```tsx
<TipWidget
  tip={{
    title: "Perfect Your Breakfall",
    content: "Focus on technique...",
    category: "technique"
  }}
/>
```

**QuoteWidget** - Motivational quote
```tsx
<QuoteWidget
  quote={{
    text: "The ultimate aim...",
    author: "Gichin Funakoshi"
  }}
/>
```

**WeatherWidget** - Weather for training
```tsx
<WeatherWidget
  weather={{
    temperature: 22,
    condition: "sunny",
    location: "London"
  }}
/>
```

---

### 8. Confetti System (`/lib/confetti.ts`)

Celebration animations for achievements and milestones.

**Functions:**
- `celebrate()` - Basic confetti
- `achievementConfetti()` - Achievement unlock with dual-sided bursts
- `streakConfetti(streak)` - Fire-colored confetti for streaks
- `beltPromotionConfetti(color)` - Belt-colored fireworks
- `goalConfetti()` - Green confetti for goals
- `bookingConfetti()` - Blue confetti for bookings
- `continuousConfetti(duration)` - Continuous side-to-side confetti

**Usage:**
```tsx
import {
  achievementConfetti,
  beltPromotionConfetti,
  streakConfetti
} from "@/lib/confetti";

// On achievement unlock
achievementConfetti();

// On belt promotion (color-coded)
beltPromotionConfetti("yellow");

// On streak milestone
streakConfetti(7); // 7-day streak
```

---

### 9. Success Animations (`SuccessAnimation.tsx`)

Fullscreen success animations with icons and messages.

**Types:**
- **Checkmark** - Completed actions
- **Trophy** - Achievements
- **Flame** - Streaks
- **Belt** - Belt promotions

**Usage:**
```tsx
import {
  CheckmarkAnimation,
  TrophyAnimation,
  FlameAnimation,
  BeltUpgradeAnimation
} from "@/components/dashboard";

<CheckmarkAnimation
  show={showAnimation}
  onComplete={() => setShowAnimation(false)}
  message="Action completed!"
/>

<TrophyAnimation
  show={showTrophy}
  message="Achievement Unlocked!"
  size="lg"
/>
```

---

### 10. Dashboard Customization (`CustomizeDashboard.tsx`)

Modal for customizing dashboard appearance and layout.

**Features:**
- Toggle section visibility with eye icon
- Drag-and-drop reordering (via Framer Motion Reorder)
- Layout mode selection (grid/list)
- Density settings (compact/comfortable/spacious)
- Auto-saves to localStorage
- Reset to default option

**Usage:**
```tsx
import {
  CustomizeDashboard,
  useDashboardPreferences
} from "@/components/dashboard";

function Dashboard() {
  const { preferences, updatePreferences } = useDashboardPreferences();
  const [showCustomize, setShowCustomize] = useState(false);

  return (
    <>
      <Button onClick={() => setShowCustomize(true)}>
        <Settings /> Customize
      </Button>

      <CustomizeDashboard
        open={showCustomize}
        onOpenChange={setShowCustomize}
        preferences={preferences}
        onSave={updatePreferences}
      />
    </>
  );
}
```

---

### 11. Dashboard Tour (`DashboardTour.tsx`)

Interactive onboarding walkthrough with spotlight highlighting.

**Features:**
- Step-by-step walkthrough with progress dots
- Element highlighting with spotlight effect
- Position-aware tooltips (top/bottom/left/right)
- Keyboard navigation (arrows, ESC)
- Skip option
- Only shows once (saved to localStorage)
- "Take tour again" capability

**Usage:**
```tsx
import { DashboardTour, useDashboardTour } from "@/components/dashboard";

function Dashboard() {
  const { showTour, completeTour, skipTour, startTour } = useDashboardTour();

  return (
    <>
      <Button onClick={startTour}>Take Tour Again</Button>

      <DashboardTour
        open={showTour}
        onComplete={completeTour}
        onSkip={skipTour}
      />
    </>
  );
}
```

**Add data-tour attributes to highlight elements:**
```tsx
<div data-tour="quick-actions">
  <QuickActionsBar />
</div>

<div data-tour="streak">
  <StreakWidget />
</div>
```

---

### 12. Help Widget (`HelpWidget.tsx`)

Floating help button with quick access to support resources.

**Features:**
- Floating action button (bottom-right)
- Expandable help panel
- Quick actions grid:
  - FAQs
  - Keyboard Shortcuts
  - Take Tour
  - Contact Support
- Searchable help articles
- Article categories
- Notification indicator
- Smooth animations

**Usage:**
```tsx
import { HelpWidget } from "@/components/dashboard";

<HelpWidget
  onOpenShortcuts={() => setShowShortcuts(true)}
  onStartTour={startTour}
  onContactSupport={() => openSupportChat()}
/>
```

---

### 13. Loading States (`DashboardSkeleton.tsx`)

Skeleton loaders for dashboard sections with staggered animations.

**Components:**
- `DashboardSkeleton` - Full dashboard skeleton
- `WidgetSkeleton` - Individual widget skeleton
- `SkeletonBox` - Reusable skeleton primitive

**Usage:**
```tsx
import { DashboardSkeleton, WidgetSkeleton } from "@/components/dashboard";

// Full dashboard loading
{isLoading ? <DashboardSkeleton /> : <DashboardContent />}

// Individual widget loading
<WidgetSkeleton className="h-48" />

// Custom skeleton
<SkeletonBox className="h-10 w-32" delay={0.1} />
```

---

## Keyboard Shortcuts Integration

Dashboard actions support keyboard shortcuts that work globally:

**Default Shortcuts:**
- `C` - Check In
- `B` - Book Class
- `S` - View Schedule
- `M` - Messages
- `G` - Goals
- `P` - Profile
- `?` - Show all shortcuts
- `ESC` - Close modals

**Register Custom Shortcuts:**
```tsx
import { useKeyboardShortcuts } from "@/components/KeyboardShortcuts";

// In your component
useKeyboardShortcuts(
  () => setShowShortcuts(true), // Handler for '?'
  {
    c: () => handleCheckIn(),
    b: () => handleBookClass(),
    g: () => handleGoals(),
    // Add more shortcuts
  }
);
```

---

## Complete Integration Example

See `/components/dashboard/DashboardExample.tsx` for a comprehensive demonstration:

```tsx
import { DashboardExample } from "@/components/dashboard/DashboardExample";

// Complete demo with all features
<DashboardExample />
```

The example includes:
- Quick Actions Bar
- All 8 widgets
- Confetti celebrations
- Success animations
- Dashboard customization
- Tour system
- Help widget
- Keyboard shortcuts
- Loading states
- Toast notifications

---

## Micro-interactions

All components include polished micro-interactions:

### Animations
- **Hover effects** - Scale up, lift, glow
- **Click feedback** - Scale down on press
- **Loading** - Staggered fade-in with delays
- **Progress** - Smooth bar animations
- **Icons** - Bounce, rotate, pulse
- **Numbers** - Count-up animations
- **Transitions** - Smooth state changes

### Interactive States
- **Hover** - Visual feedback on all clickable elements
- **Active** - Pressed state with scale
- **Focus** - Keyboard navigation highlights
- **Disabled** - Reduced opacity and no interaction

---

## Best Practices

### Performance
1. Use React.memo for expensive widgets
2. Debounce search inputs
3. Lazy load modals
4. Optimize re-renders with useMemo/useCallback
5. Use GPU-accelerated animations (transform, opacity)

### UX Guidelines
1. **Confetti** - Use sparingly for major achievements only
2. **Animations** - Don't overwhelm users, respect motion preferences
3. **Feedback** - Provide immediate feedback for all actions
4. **Loading** - Always show loading states
5. **Empty states** - Handle no-data scenarios gracefully
6. **Mobile** - Ensure touch targets are 44x44px minimum
7. **Accessibility** - Keyboard navigation for all features

### Customization
1. Allow users to hide/show widgets
2. Remember user preferences
3. Provide sensible defaults
4. Make reset easy
5. Don't force features

---

## Accessibility Features

All components follow WCAG 2.1 Level AA:

- **Keyboard Navigation** - All actions accessible via keyboard
- **Focus Management** - Clear focus indicators
- **ARIA Labels** - Screen reader support
- **Color Contrast** - 4.5:1 minimum
- **Motion** - Respects `prefers-reduced-motion`
- **Semantic HTML** - Proper element usage
- **Alt Text** - All images have descriptions

---

## Customization & Theming

All components accept `className` for custom styling:

```tsx
<StreakWidget className="border-2 border-primary shadow-xl" />
<GoalWidget className="bg-gradient-to-br from-blue-500 to-purple-500" />
```

**Density Control:**
```tsx
<div className={cn(
  "grid gap-6",
  density === "compact" && "gap-4",
  density === "comfortable" && "gap-6",
  density === "spacious" && "gap-8"
)}>
  {widgets}
</div>
```

**Layout Control:**
```tsx
<div className={cn(
  "grid",
  layout === "grid" && "md:grid-cols-2 lg:grid-cols-3",
  layout === "list" && "grid-cols-1"
)}>
  {widgets}
</div>
```

---

## Dependencies

All features use existing project dependencies:

**Installed:**
- `canvas-confetti` - Confetti animations
- `@types/canvas-confetti` - TypeScript types
- `framer-motion` - Animations and Reorder
- `sonner` - Toast notifications
- `@radix-ui/*` - UI primitives
- `lucide-react` - Icons
- `date-fns` - Date formatting

**No Additional Installs Needed** (already in project)

---

## File Structure

```
/components/dashboard/
├── QuickActionsBar.tsx
├── CustomizeDashboard.tsx
├── DashboardTour.tsx
├── HelpWidget.tsx
├── SuccessAnimation.tsx
├── DashboardSkeleton.tsx
├── DashboardExample.tsx
├── index.ts
├── widgets/
│   ├── StreakWidget.tsx
│   ├── GoalWidget.tsx
│   ├── EventWidget.tsx
│   ├── PartnerWidget.tsx
│   ├── AchievementWidget.tsx
│   ├── TipWidget.tsx
│   ├── QuoteWidget.tsx
│   ├── WeatherWidget.tsx
│   └── index.ts
└── README.md

/lib/
└── confetti.ts
```

---

## Future Enhancements

When integrating with Convex backend:

1. **Real-time Updates**
   - Live streak updates
   - Real-time goal progress
   - Event registrations
   - Achievement unlocks

2. **Data Persistence**
   - Save dashboard preferences to database
   - Sync across devices
   - Store tour completion status
   - Track help article views

3. **Advanced Features**
   - Personalized tips based on belt/progress
   - Weather API integration
   - Partner recommendations
   - Achievement suggestions

4. **Analytics**
   - Track widget interactions
   - Monitor confetti triggers
   - Measure tour completion rates
   - Optimize quick actions

---

**Version:** 1.0
**Last Updated:** January 2026
**Components:** 13 main components + 8 widgets
