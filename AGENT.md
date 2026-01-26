# AGENT.md

This file provides guidance to any AI assistant (Claude, ChatGPT, Gemini, Copilot, etc.) when working with code in this repository.

## Project Overview

**Judo Club Manager** for University of London at Birkbeck - a React/TypeScript web app with Convex backend.

| Resource | URL |
|----------|-----|
| Live Site | https://judo-club-app.vercel.app |
| Convex Dashboard | https://dashboard.convex.dev/t/muhammad-giquina/judo/scintillating-clam-299 |
| GitHub | https://github.com/giquina/JUDO |

## Current Status

**Rating:** 8.0/10 | **Target:** 9.0/10

### Working Features
- PWA with service worker and offline support
- QR check-in system for attendance
- Role-based dashboards (Member/Coach/Admin)
- Persistent sidebar navigation for each role
- 15 pages with pagination, filters, and sorting
- Dark mode, animations, toast notifications

### Remaining Work
- Connect to real Convex data (currently using mock)
- Implement real authentication (magic links)
- Stripe payment integration
- Push notifications

## Build & Development Commands

```bash
# Development
npm run dev          # Start Vite dev server (localhost:5173)
npx convex dev       # Start Convex backend (separate terminal)

# Production
npm run build        # Generate icons + TypeScript check + Vite build
npx convex deploy    # Deploy Convex to production

# Quality
npm run lint         # ESLint check
```

## Architecture

### Tech Stack
- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + Shadcn/UI components
- **Animations:** Framer Motion
- **Backend:** Convex (real-time database)
- **Auth:** Magic links (mock in dev)
- **Payments:** Stripe (not connected)
- **Hosting:** Vercel

### Provider Hierarchy (main.tsx)
```
StrictMode
└── ConvexProvider (real-time backend)
    └── AuthProvider (custom auth context)
        └── App
            └── ThemeProvider (dark mode)
                └── BrowserRouter (React Router)
```

### Authentication

Currently uses mock authentication in `src/lib/auth.tsx`:
```typescript
const DEV_MODE = false;  // Set to true for auto-login
const DEV_USER_ROLE: "member" | "coach" | "admin" = "admin";
```

Test accounts (use "Demo: Click to Sign In" button):
- `admin@bbk.ac.uk` - Admin access
- `coach@bbk.ac.uk` - Coach access
- `a.chen@bbk.ac.uk` - Member access

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
- `/admin/members` - Member management with pagination
- `/admin/payments` - Payment tracking
- `/admin/analytics` - Club analytics
- `/admin/settings` - System settings

### Code Splitting

All 20 page components are lazy-loaded via `React.lazy()` in `App.tsx`.

### Database Schema (convex/schema.ts)

Five tables:
- **members** - userId, beltRank, subscriptionStatus/Tier
- **classes** - dayOfWeek, coachId, level, capacity
- **attendance** - memberId, classId, checkInTime, status
- **payments** - memberId, stripePaymentIntentId, status, amount
- **admins** - userId, role (coach/treasurer/super_admin), permissions

### Key Patterns

| Pattern | Implementation |
|---------|----------------|
| UI Components | Shadcn/UI in `src/components/ui/` |
| Animations | Framer Motion (`PageTransition`, `AnimatedCard`) |
| Toasts | Sonner with `richColors` at `top-center` |
| Path alias | `@/` maps to `src/` |
| Navigation | Role-specific sidebars + mobile bottom nav |

## File Structure

```
src/
├── components/
│   ├── ui/                  # Shadcn UI components
│   ├── AdminSidebar.tsx     # Admin navigation sidebar
│   ├── CoachSidebar.tsx     # Coach navigation sidebar
│   ├── MemberSidebar.tsx    # Member navigation sidebar
│   ├── MobileNavigation.tsx # Bottom nav (mobile only)
│   ├── Navigation.tsx       # Top bar (logo, theme, user)
│   └── ProtectedRoute.tsx   # Route access control
├── pages/
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── MemberDashboard.tsx
│   ├── CoachDashboard.tsx
│   ├── AdminDashboard.tsx
│   ├── member/              # 4 member sub-pages
│   ├── coach/               # 4 coach sub-pages
│   └── admin/               # 4 admin sub-pages
├── lib/
│   └── auth.tsx             # Auth provider + DEV_MODE
└── App.tsx                  # Router + lazy imports

convex/
├── schema.ts                # Database schema
└── functions/               # Queries/mutations

public/
├── icon-192.png             # PWA icons
├── icon-512.png
└── favicon.png
```

## Common Tasks

### Add a new page
1. Create `src/pages/[Name]Page.tsx` (export default)
2. Add lazy import in `App.tsx`
3. Add Route with `ProtectedRoute` wrapper
4. Add to relevant Sidebar component
5. Add to MobileNavigation if needed

### Add Convex function
1. Create/edit `convex/functions/[domain].ts`
2. Update `convex/schema.ts` if new table
3. Use `useQuery`/`useMutation` hooks in React
4. Handle loading with `Spinner` or `skeleton`

### Switch test user role
Edit `src/lib/auth.tsx`:
```typescript
const DEV_MODE = true;
const DEV_USER_ROLE = "admin"; // or "coach" or "member"
```

### Deploy changes
```bash
npm run build          # Verify build works
git add . && git commit -m "message"
git push               # Auto-deploys to Vercel
npx vercel --prod      # Or manual deploy
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_CONVEX_URL` | Convex deployment URL (required) |

## Related Documentation

- `TODO.md` - Prioritized task list with progress tracking
- `SUGGESTIONS.md` - Feature suggestions with impact ratings
- `PLAN.md` - Implementation roadmap

---

**Last Updated:** 2026-01-26
