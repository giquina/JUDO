# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Judo Club Manager for University of London at Birkbeck - a React/TypeScript web app with Convex backend.

**Live:** https://judo-club-app.vercel.app
**Dashboard:** https://dashboard.convex.dev/t/muhammad-giquina/judo/scintillating-clam-299

## Current Rating: 6.5/10 | Target: 9.0/10

### Critical Issues (Fix First)
1. **INP Performance** - 13s+ interaction delays on button clicks
2. **Broken Pages** - Payments 404, Analytics redirect loop
3. **Navigation Confusion** - 3 competing nav systems (top buttons, sidebar, bottom mobile)

### Working Features
- PWA with service worker
- QR check-in system
- Role-based dashboards (Member/Coach/Admin)
- 12 sub-pages for all roles
- Dark mode, animations, toast notifications

## Build & Development Commands

```bash
npm run dev          # Start Vite dev server (localhost:5173)
npm run build        # Generate icons + TypeScript check + Vite build
npm run lint         # ESLint
npx convex dev       # Start Convex backend (requires separate terminal)
npx convex deploy    # Deploy Convex to production
```

## Architecture

### Provider Hierarchy (main.tsx)
```
StrictMode
└── ConvexProvider (real-time backend)
    └── AuthProvider (custom auth context)
        └── App
            └── ThemeProvider (dark mode)
                └── BrowserRouter (React Router)
```

### Authentication (DEV_MODE)

Currently uses mock authentication in `src/lib/auth.tsx`:
```typescript
const DEV_MODE = false;  // Disabled for testing
const DEV_USER_ROLE: "member" | "coach" | "admin" = "admin";
```

Test accounts:
- `a.chen@bbk.ac.uk` - Member
- `coach@bbk.ac.uk` - Coach
- `admin@bbk.ac.uk` - Admin

### Route Structure

**Public Routes:**
- `/` - Landing page (redirects if authenticated)
- `/login` - Login page
- `/pricing` - Subscription pricing

**Member Routes** (member, coach, admin):
- `/member` - Dashboard
- `/member/classes` - Class schedule
- `/member/checkin` - QR check-in
- `/member/progress` - Belt progress
- `/member/profile` - Profile settings

**Coach Routes** (coach, admin):
- `/coach` - Dashboard
- `/coach/classes` - Manage classes
- `/coach/attendance` - Track attendance
- `/coach/members` - View members
- `/coach/profile` - Profile settings

**Admin Routes** (admin only):
- `/admin` - Dashboard with KPIs
- `/admin/members` - Member management
- `/admin/payments` - Payment tracking
- `/admin/analytics` - Club analytics
- `/admin/settings` - System settings

### Code Splitting

All 20 page components are lazy-loaded via `React.lazy()` in `App.tsx`.

### Convex Schema (convex/schema.ts)

Five tables with indexes:
- **members** - userId, beltRank, subscriptionStatus/Tier
- **classes** - dayOfWeek, coachId, level, capacity
- **attendance** - memberId, classId, checkInTime, status
- **payments** - memberId, stripePaymentIntentId, status, amount
- **admins** - userId, role (coach/treasurer/super_admin), permissions

### Key Patterns

**UI Components:** Shadcn/UI style in `src/components/ui/` using class-variance-authority and Tailwind
**Animations:** Framer Motion throughout (`PageTransition`, `AnimatedCard`)
**Toasts:** Sonner with `richColors` positioned `top-center`
**Path alias:** `@/` maps to `src/`

### PWA Configuration

PWA enabled via `vite-plugin-pwa` with:
- Auto-update service worker
- Offline caching for Convex API (NetworkFirst)
- Font caching (CacheFirst)
- Custom icons in `public/`

## Common Tasks

### Add a new page
1. Create `src/pages/[Name]Page.tsx` (export default)
2. Add lazy import in `App.tsx`
3. Add Route with `ProtectedRoute` wrapper if needed
4. Add to MobileNavigation component if applicable

### Add Convex function
1. Create/edit `convex/functions/[domain].ts`
2. Update `convex/schema.ts` if new table
3. Use `useQuery`/`useMutation` hooks in React components
4. Handle loading states with existing `Spinner` or `skeleton` components

### Switch test user role
Edit `src/lib/auth.tsx`:
```typescript
const DEV_MODE = true;
const DEV_USER_ROLE = "member" | "coach" | "admin"
```

### Environment Variables
- `VITE_CONVEX_URL` - Convex deployment URL (required)

## File Structure

```
src/
├── components/
│   ├── ui/                 # Shadcn UI components
│   ├── MobileNavigation.tsx # Bottom nav (role-specific)
│   └── ProtectedRoute.tsx   # Route access control
├── pages/
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── MemberDashboard.tsx
│   ├── CoachDashboard.tsx
│   ├── AdminDashboard.tsx
│   ├── member/             # 4 member sub-pages
│   ├── coach/              # 4 coach sub-pages
│   └── admin/              # 4 admin sub-pages
├── lib/
│   └── auth.tsx            # Auth provider + DEV_MODE
└── App.tsx                 # Router + lazy imports
convex/
├── schema.ts               # Database schema
└── functions/              # Queries/mutations
```

## See Also

- `TODO.md` - Prioritized task list with design feedback
- `SUGGESTIONS.md` - Feature suggestions with impact ratings
