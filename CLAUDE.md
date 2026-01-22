# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Judo Club Manager for University of London at Birkbeck - a React/TypeScript web app with Convex backend.

**Live:** https://judo-club-app.vercel.app
**Dashboard:** https://dashboard.convex.dev/t/muhammad-giquina/judo/scintillating-clam-299

## Build & Development Commands

```bash
npm run dev          # Start Vite dev server (localhost:5173)
npm run build        # Generate icons + TypeScript check + Vite build
npm run lint         # ESLint
npx convex dev       # Start Convex backend (requires separate terminal)
npx convex deploy    # Deploy Convex to production
```

**Build includes icon generation:** The build script runs `scripts/generate-icons.mjs` before TypeScript compilation.

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
const DEV_MODE = true;  // Auto-login enabled
const DEV_USER_ROLE: "member" | "coach" | "admin" = "admin";
```

Test accounts (when DEV_MODE=false):
- `a.chen@bbk.ac.uk` - Member
- `coach@bbk.ac.uk` - Coach
- `admin@bbk.ac.uk` - Admin

**To test different roles:** Edit `DEV_USER_ROLE` in `src/lib/auth.tsx`

### Route Protection

`ProtectedRoute` component enforces role-based access:
- `/member` - member, coach, admin
- `/coach` - coach, admin only
- `/admin` - admin only

### Code Splitting

All page components are lazy-loaded via `React.lazy()` in `App.tsx`.

### Convex Schema (convex/schema.ts)

Four main tables with indexes:
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

## Current State

**Working:** UI/UX, animations, toast notifications, loading states, error handling, dark mode, QR check-in, role-based dashboards

**Mock/Incomplete:**
- Auth uses mock data (Convex auth with magic links not connected)
- Components use local state instead of Convex queries
- Stripe integration not connected
- Push notifications not implemented

## Common Tasks

### Add a new page
1. Create `src/pages/[Name]Page.tsx` (export default)
2. Add lazy import in `App.tsx`
3. Add Route with `ProtectedRoute` wrapper if needed
4. Add to Navigation component if applicable

### Add Convex function
1. Create/edit `convex/functions/[domain].ts`
2. Update `convex/schema.ts` if new table
3. Use `useQuery`/`useMutation` hooks in React components
4. Handle loading states with existing `Spinner` or `skeleton` components

### Environment Variables
- `VITE_CONVEX_URL` - Convex deployment URL (required)
