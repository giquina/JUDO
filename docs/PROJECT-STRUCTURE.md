# Project Structure - Judo Club App

> Quick reference for developers

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS v4 + Shadcn/UI |
| Animations | Framer Motion |
| Notifications | Sonner (toast) |
| Backend | Convex (real-time database) |
| Payments | Stripe |
| Hosting | Vercel |
| Version Control | GitHub |

---

## Folder Structure

```
JUDO APP/
├── .vercel/                    # Vercel deployment config
├── convex/                     # Convex backend
│   ├── schema.ts              # Database schema
│   ├── members.ts             # Member queries/mutations
│   ├── classes.ts             # Class functions
│   ├── attendance.ts          # Check-in functions
│   └── _generated/            # Auto-generated types
├── docs/                       # Documentation
│   ├── judo-standards/        # Judo governance docs
│   │   ├── JUDO-GOVERNANCE.md # IJF/BJA references
│   │   └── SAFETY-PROTOCOLS.md # Safety guidelines
│   ├── dev-guides/            # Developer guides
│   └── features/              # Feature specs
├── public/                     # Static assets
├── src/
│   ├── components/            # Reusable components
│   │   ├── ui/               # Shadcn UI components
│   │   ├── Navigation.tsx    # App navigation
│   │   ├── ProtectedRoute.tsx # Auth guard
│   │   ├── PageTransition.tsx # Page animations
│   │   └── ErrorBoundary.tsx # Error handling
│   ├── lib/                   # Utilities
│   │   ├── auth.tsx          # Auth provider
│   │   ├── judo-constants.ts # Belt/grading constants
│   │   ├── stripe.ts         # Stripe integration
│   │   └── utils.ts          # Helper functions
│   ├── pages/                 # Page components
│   │   ├── LandingPage.tsx   # Public landing page
│   │   ├── LoginPage.tsx     # Auth page
│   │   ├── MemberDashboard.tsx
│   │   ├── CoachDashboard.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── PricingPage.tsx
│   │   └── SubscriptionSuccess.tsx
│   ├── types/                 # TypeScript types
│   ├── App.tsx               # Main router
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── CLAUDE.md                   # Claude Code instructions
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts
```

---

## Key Files

### Authentication (`src/lib/auth.tsx`)
- `AuthProvider` - Wraps app with auth context
- `useAuth()` - Hook for auth state
- `DEV_MODE` - Toggle for development auto-login
- `DEV_USER_ROLE` - Set role for testing (member/coach/admin)

```typescript
// Development settings
const DEV_MODE = true;
const DEV_USER_ROLE: "member" | "coach" | "admin" = "admin";
```

### Routing (`src/App.tsx`)
- `HomeRedirect` - Smart redirect based on auth status
- `ProtectedRoute` - Guards dashboard routes by role

### Belt Constants (`src/lib/judo-constants.ts`)
- `BELT_RANKS` - All belt grades with colors and timing
- `BELT_COLOR_CLASSES` - Tailwind classes for belts
- `TECHNIQUE_AGE_RESTRICTIONS` - Safety limits
- Helper functions for belt progression

---

## Authentication Flow

```
┌─────────────────┐
│  User visits /  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     No      ┌─────────────────┐
│ Authenticated?  │────────────▶│  Landing Page   │
└────────┬────────┘             └─────────────────┘
         │ Yes
         ▼
┌─────────────────┐
│  Redirect by    │
│     Role        │
└────────┬────────┘
         │
    ┌────┼────┐
    ▼    ▼    ▼
 /member /coach /admin
```

### DEV_MODE (Development)
When `DEV_MODE = true`:
- Auto-login on page load
- No email/magic link required
- Role set by `DEV_USER_ROLE`

### Production
When `DEV_MODE = false`:
- Magic link email flow
- Session stored in localStorage
- Real authentication required

---

## Adding New Features

### 1. New Page
```bash
# Create page component
src/pages/MyFeaturePage.tsx

# Add route in App.tsx
<Route path="/my-feature" element={
  <ProtectedRoute allowedRoles={["member", "coach", "admin"]}>
    <MyFeaturePage />
  </ProtectedRoute>
} />

# Add to navigation if needed
src/components/Navigation.tsx
```

### 2. New Component
```bash
# Create component
src/components/MyComponent.tsx

# For UI primitives
src/components/ui/my-component.tsx
```

### 3. New Convex Function
```bash
# Add to relevant file or create new
convex/myfeature.ts

# Update schema if needed
convex/schema.ts

# Use in React
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
```

---

## Deployment

### Auto-Deploy (Recommended)
```bash
git add -A
git commit -m "Your message"
git push origin main
# Vercel auto-deploys from GitHub
```

### Manual Deploy
```bash
npm run build              # Build locally
npx vercel --prod --yes    # Deploy to Vercel
```

### Environment Variables
Set in Vercel dashboard:
- `VITE_CONVEX_URL` - Convex deployment URL
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe public key

---

## Common Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (localhost:5173) |
| `npm run build` | Production build |
| `npx convex dev` | Start Convex dev server |
| `npx convex deploy` | Deploy Convex to production |
| `npx vercel` | Deploy preview |
| `npx vercel --prod` | Deploy production |

---

## URLs

| Environment | URL |
|-------------|-----|
| Development | http://localhost:5173 |
| Production | https://judo-club-app.vercel.app |
| Convex Dashboard | https://dashboard.convex.dev |
| GitHub | https://github.com/giquina/JUDO |

---

## Testing Different Roles

Edit `src/lib/auth.tsx`:
```typescript
const DEV_USER_ROLE: "member" | "coach" | "admin" = "member";
```

Then refresh the page to test that role's experience.

---

**Last Updated:** January 2026
