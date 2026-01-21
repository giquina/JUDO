# Calendar & Class Management System

> Comprehensive calendar view, class booking, and personalized recommendations for the Judo Club App

## Overview

This system provides a complete solution for managing class schedules, bookings, and personalized training recommendations. All components are frontend-only with mock data that can be easily replaced with Convex queries.

## Components

### 1. CalendarView
**Path:** `/src/components/dashboard/CalendarView.tsx`

A fully-featured calendar component with multiple view modes.

**Features:**
- Month, Week, and Day views
- Display scheduled classes with color coding
- Show attendance history (attended/missed)
- Display upcoming events and gradings
- Click day to see details
- Mini agenda for selected day
- Export to iCalendar/Google Calendar
- Sync with device calendar
- Responsive design with animations

**Usage:**
```tsx
import { CalendarView } from "@/components/dashboard";

function MyPage() {
  return <CalendarView />;
}
```

**View Modes:**
- **Month**: Grid view showing entire month with class indicators
- **Week**: 7-day view with detailed class information
- **Day**: Single day view with full class and event details

### 2. ClassBookingModal
**Path:** `/src/components/dashboard/ClassBookingModal.tsx`

Modal for viewing class details and managing bookings.

**Features:**
- View complete class details (time, coach, level, capacity, location)
- Book or cancel class
- Waitlist option when class is full
- Recurring booking option (book every week)
- See who else is attending
- Add to calendar
- Class difficulty rating
- Required equipment list
- Capacity indicator with progress bar

**Usage:**
```tsx
import { ClassBookingModal } from "@/components/dashboard";

function MyComponent() {
  const [selectedClass, setSelectedClass] = useState(null);

  return (
    <>
      <Button onClick={() => setSelectedClass(classInfo)}>
        Book Class
      </Button>

      {selectedClass && (
        <ClassBookingModal
          classInfo={selectedClass}
          onClose={() => setSelectedClass(null)}
        />
      )}
    </>
  );
}
```

### 3. WeeklySchedule
**Path:** `/src/components/dashboard/WeeklySchedule.tsx`

Grid layout showing all classes for the week.

**Features:**
- 7-day grid with time slots
- All available classes displayed
- User's bookings highlighted
- Quick book/cancel buttons
- Class capacity indicators
- Filter by level
- Mark usual classes with star
- Highlight scheduling conflicts
- Print schedule button
- Today column highlighted

**Usage:**
```tsx
import { WeeklySchedule } from "@/components/dashboard";

function SchedulePage() {
  return <WeeklySchedule />;
}
```

### 4. Recommendations
**Path:** `/src/components/dashboard/Recommendations.tsx`

Personalized recommendations based on user behavior and goals.

**Features:**
- AI-powered suggestions for:
  - Classes to try
  - Upcoming events
  - Training partners
  - Technique videos
  - Goals to set
  - Achievements close to unlocking
- Priority-based grouping (High/Medium/Low)
- Save recommendations for later
- Dismiss recommendations
- Daily training tip
- Why this recommendation tooltip
- Actionable buttons for each recommendation

**Usage:**
```tsx
import { Recommendations } from "@/components/dashboard";

function RecommendationsPage() {
  return <Recommendations />;
}
```

**Recommendation Types:**
- **Class**: Suggested classes based on level and attendance
- **Event**: Upcoming events user might be interested in
- **Partner**: Training partner suggestions
- **Achievement**: Progress toward achievements
- **Content**: Relevant videos and articles
- **Goal**: Suggested goals to set

### 5. SmartInsights
**Path:** `/src/components/dashboard/SmartInsights.tsx`

Data-driven insights about training patterns and progress.

**Features:**
- AI-powered analysis of:
  - Attendance trends
  - Streak status
  - Goal progress
  - Comparison to club average
  - Training patterns
  - Milestone tracking
- Key metrics summary cards
- Actionable suggestions
- Trend indicators
- Progress bars
- Motivational messages
- Visual indicators (color-coded by type)

**Usage:**
```tsx
import { SmartInsights } from "@/components/dashboard";

function InsightsPage() {
  return <SmartInsights />;
}
```

**Insight Types:**
- **Attendance**: "Your attendance is up 20% this month!"
- **Streak**: "Your streak is at risk - book a class!"
- **Progress**: "5 more sessions to hit your goal"
- **Comparison**: "You're in the top 25% for attendance"
- **Suggestion**: "You train most on Mondays"
- **Milestone**: "3 sessions away from next achievement"

### 6. ClassSearch
**Path:** `/src/components/dashboard/ClassSearch.tsx`

Advanced search and filtering system for finding classes.

**Features:**
- Text search (name, coach, type)
- Advanced filters:
  - Day of week
  - Time range
  - Level
  - Coach
  - Class type
  - Location
  - Availability
- Quick filters (My Usual, Beginner, Evening, Weekend, Available)
- Save custom filters
- Load saved filters
- Filter count badge
- Clear all filters
- Results with quick book buttons
- Expandable filter accordion

**Usage:**
```tsx
import { ClassSearch } from "@/components/dashboard";

function SearchPage() {
  return <ClassSearch />;
}
```

## Mock Data

All mock data is centralized in `/src/lib/mockCalendarData.ts`.

**Available Data:**
- Classes (recurring weekly schedule)
- Events (gradings, competitions, seminars, socials)
- Bookings (user's class bookings)
- Attendance history (past 3 months)
- Recommendations (personalized suggestions)
- Insights (smart analytics)
- Training partners
- Coaches

**Helper Functions:**
```typescript
// Get class instances for date range
getClassInstancesForDateRange(startDate, endDate)

// Check if user has booking
hasBooking(classId, date, bookings)

// Get attendance status
getAttendanceStatus(classId, date, attendance)
```

## Integration with Convex

To integrate with Convex, replace mock data with queries:

```typescript
// Instead of:
import { mockCalendarData } from "@/lib/mockCalendarData";
const { classes, events, bookings } = mockCalendarData;

// Use:
const classes = useQuery(api.classes.list);
const events = useQuery(api.events.upcoming);
const bookings = useQuery(api.bookings.myBookings);
```

## Demo Page

A complete demo page is available at `/src/pages/CalendarDemo.tsx` showing all components integrated with tabs.

**Usage:**
```tsx
import CalendarDemo from "@/pages/CalendarDemo";

// Add to your router
<Route path="/calendar" element={<CalendarDemo />} />
```

## Styling

All components use:
- **Tailwind CSS v4** for styling
- **Shadcn/UI** components
- **Framer Motion** for animations
- **Lucide React** for icons
- **Sonner** for toast notifications

**Color Coding:**
- Classes use `classInfo.color` for visual distinction
- Events use type-based colors
- Status indicators (attended=green, missed=red, booked=blue)

## Responsive Design

All components are fully responsive:
- Mobile: Stacked layouts, simplified views
- Tablet: 2-column layouts
- Desktop: Full grid layouts with all features

## Accessibility

- Keyboard navigation support
- ARIA labels
- Focus management
- Screen reader friendly
- High contrast mode support

## Performance

- Memoized calculations for expensive operations
- Lazy loading of modals
- Optimized re-renders
- Smooth animations (60fps)

## Future Enhancements

When integrating with Convex:
1. Real-time updates (bookings, capacity changes)
2. Waitlist management
3. Payment integration
4. Push notifications
5. Email reminders
6. Social features (invite friends)
7. Machine learning recommendations
8. Analytics dashboard

## File Structure

```
src/
├── components/
│   └── dashboard/
│       ├── CalendarView.tsx
│       ├── ClassBookingModal.tsx
│       ├── WeeklySchedule.tsx
│       ├── Recommendations.tsx
│       ├── SmartInsights.tsx
│       ├── ClassSearch.tsx
│       └── index.ts
├── lib/
│   └── mockCalendarData.ts
└── pages/
    └── CalendarDemo.tsx
```

## Type Definitions

All TypeScript types are defined in `mockCalendarData.ts`:
- `JudoClass`
- `CalendarEvent`
- `ClassBooking`
- `AttendanceRecord`
- `Recommendation`
- `SmartInsight`
- `TrainingPartner`
- `BeltRank`
- `ClassLevel`
- `ClassType`

## Dependencies

Required packages (already in project):
- react
- framer-motion
- sonner
- lucide-react
- tailwindcss
- @radix-ui/react-* (via shadcn/ui)

## Testing

To test components:
1. Import into any page
2. Use CalendarDemo.tsx as reference
3. Mock data will populate automatically
4. All interactions work without backend

## Support

For questions or issues:
1. Check this README
2. Review mockCalendarData.ts for data structure
3. See CalendarDemo.tsx for usage examples
4. Check individual component JSDoc comments

---

**Version:** 1.0.0
**Last Updated:** January 2026
**Author:** Claude Code Assistant
