# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Judo Club Manager for University of London at Birkbeck - a React/TypeScript web app with Convex backend.

**Live:** https://judo-club-app.vercel.app

## Commands

```bash
npm run dev          # Vite dev server (localhost:5173)
npm run build        # TypeScript check + Vite production build
npm run lint         # ESLint
npx convex dev       # Convex backend (separate terminal)
npx convex deploy    # Deploy Convex to production
```

## Architecture

### Provider Hierarchy (main.tsx)
```
StrictMode → ConvexProvider → AuthProvider → App → ThemeProvider → BrowserRouter
```

### Authentication
Mock auth in `src/lib/auth.tsx`:
```typescript
const DEV_MODE = false;  // Set true for auto-login
const DEV_USER_ROLE: "member" | "coach" | "admin" = "admin";
```

### Route Structure
- **Public:** `/`, `/login`, `/pricing`
- **Member** (all roles): `/member`, `/member/classes`, `/member/checkin`, `/member/progress`, `/member/profile`
- **Coach** (coach, admin): `/coach`, `/coach/classes`, `/coach/attendance`, `/coach/members`, `/coach/profile`
- **Admin** (admin only): `/admin`, `/admin/members`, `/admin/payments`, `/admin/analytics`, `/admin/settings`

### Key Patterns
- **UI:** Shadcn/UI components in `src/components/ui/`
- **Navigation:** Role-specific sidebars (`AdminSidebar`, `CoachSidebar`, `MemberSidebar`) + `MobileNavigation` for mobile
- **Code splitting:** All pages lazy-loaded via `React.lazy()` in `App.tsx`
- **Path alias:** `@/` maps to `src/`
- **Toasts:** Sonner with `richColors` at `top-center`

### Convex Schema (convex/schema.ts)
Tables: `members`, `classes`, `attendance`, `payments`, `admins`

## Adding Pages

1. Create `src/pages/[Name]Page.tsx` (export default)
2. Add lazy import in `App.tsx`
3. Add Route with `ProtectedRoute` wrapper
4. Add to relevant Sidebar component

## Environment Variables

- `VITE_CONVEX_URL` - Convex deployment URL (required)

## Related Files

- `AGENT.md` - Universal AI assistant instructions
- `TODO.md` - Task tracking
- `SUGGESTIONS.md` - Feature suggestions
