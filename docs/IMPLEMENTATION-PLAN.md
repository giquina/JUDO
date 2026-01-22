# Judo Club App - Complete Implementation Plan

> From 8.5/10 to 10/10 - Comprehensive Roadmap

---

## Executive Summary

**Current State:** 8.5/10 - Functional UI with mock data
**Target State:** 10/10 - Production-ready professional app
**Estimated Phases:** 5 phases
**Key Deliverables:** Real data, payments, mobile PWA, judo authenticity

---

## Phase 1: Judo Authenticity & Branding
**Priority:** HIGH | **Complexity:** LOW

### 1.1 Terminology Updates

| Current Term | Judo Term | Location |
|--------------|-----------|----------|
| "Club" | "Dojo" | Headers, welcome messages |
| "Coach" | "Sensei" | Role labels, dashboard |
| "Member" | "Judoka" | Member references |
| "Training" | "Keiko" | Class descriptions |
| "Sparring" | "Randori" | Session types |
| "Forms" | "Kata" | Session types |
| "Beginner" | "Mukyu" | Pre-belt status |

### 1.2 Files to Update

```
src/pages/LandingPage.tsx
├── Hero: "Welcome to the Dojo"
├── Features: "Train with experienced Sensei"
├── Testimonials: "Fellow Judoka reviews"
└── CTA: "Begin your Judo journey"

src/pages/MemberDashboard.tsx
├── Greeting: "Welcome back, Judoka {name}"
├── Stats: "Your Keiko this month"
└── Progress: "Belt Journey"

src/pages/CoachDashboard.tsx
├── Title: "Sensei Dashboard"
├── Members: "Your Judoka"
└── Classes: "Keiko Schedule"

src/pages/AdminDashboard.tsx
├── Members: "Dojo Members"
└── Analytics: "Dojo Performance"

src/components/Navigation.tsx
├── Logo: "Judo Dojo"
└── Links: Use judo terms
```

### 1.3 Japanese Terms Glossary Component

Create `src/components/JudoGlossary.tsx`:
```typescript
const JUDO_TERMS = {
  dojo: { japanese: "道場", meaning: "Training hall" },
  sensei: { japanese: "先生", meaning: "Teacher/Coach" },
  judoka: { japanese: "柔道家", meaning: "Judo practitioner" },
  keiko: { japanese: "稽古", meaning: "Practice/Training" },
  randori: { japanese: "乱取り", meaning: "Free sparring" },
  kata: { japanese: "形", meaning: "Forms/Patterns" },
  rei: { japanese: "礼", meaning: "Bow/Respect" },
  hajime: { japanese: "始め", meaning: "Begin" },
  matte: { japanese: "待て", meaning: "Wait/Stop" },
  ippon: { japanese: "一本", meaning: "Full point" },
};
```

### 1.4 Deliverables
- [ ] Update all page titles with judo terms
- [ ] Create JudoGlossary component
- [ ] Add "Learn Judo Terms" section to landing page
- [ ] Update welcome messages
- [ ] Add Japanese characters where appropriate

---

## Phase 2: Real Convex Data Integration
**Priority:** CRITICAL | **Complexity:** HIGH

### 2.1 Database Schema Updates

```typescript
// convex/schema.ts - Complete Schema

// Members Table
members: defineTable({
  userId: v.string(),           // Auth user ID
  email: v.string(),
  name: v.string(),
  beltRank: v.string(),         // "white" | "yellow" | etc.
  beltPromotionDate: v.number(), // Last promotion timestamp
  subscriptionStatus: v.string(), // "active" | "inactive" | "pending"
  subscriptionTier: v.string(),  // "student" | "standard" | "premium"
  stripeCustomerId: v.optional(v.string()),
  totalSessions: v.number(),
  joinDate: v.number(),
  profileImage: v.optional(v.string()),
  emergencyContact: v.optional(v.object({
    name: v.string(),
    phone: v.string(),
    relationship: v.string(),
  })),
  medicalNotes: v.optional(v.string()),
  dateOfBirth: v.optional(v.number()),
})
  .index("by_email", ["email"])
  .index("by_belt", ["beltRank"])
  .index("by_subscription", ["subscriptionStatus"]),

// Classes Table
classes: defineTable({
  name: v.string(),              // "Adult Beginners", "Advanced Randori"
  type: v.string(),              // "keiko" | "randori" | "kata" | "competition"
  dayOfWeek: v.number(),         // 0-6 (Sunday-Saturday)
  startTime: v.string(),         // "18:00"
  endTime: v.string(),           // "19:30"
  coachId: v.id("members"),
  maxCapacity: v.number(),
  beltRequirement: v.optional(v.string()), // Minimum belt to attend
  ageRestriction: v.optional(v.object({
    minAge: v.number(),
    maxAge: v.number(),
  })),
  isActive: v.boolean(),
})
  .index("by_day", ["dayOfWeek"])
  .index("by_coach", ["coachId"]),

// Attendance Table
attendance: defineTable({
  memberId: v.id("members"),
  classId: v.id("classes"),
  date: v.number(),              // Timestamp
  checkInTime: v.number(),
  checkInMethod: v.string(),     // "qr" | "manual" | "card"
  notes: v.optional(v.string()),
})
  .index("by_member", ["memberId"])
  .index("by_class", ["classId"])
  .index("by_date", ["date"]),

// Payments Table
payments: defineTable({
  memberId: v.id("members"),
  amount: v.number(),            // In pence
  currency: v.string(),          // "gbp"
  type: v.string(),              // "subscription" | "drop_in" | "grading_fee"
  status: v.string(),            // "completed" | "pending" | "failed" | "refunded"
  stripePaymentId: v.optional(v.string()),
  stripeInvoiceId: v.optional(v.string()),
  description: v.string(),
  createdAt: v.number(),
})
  .index("by_member", ["memberId"])
  .index("by_status", ["status"])
  .index("by_date", ["createdAt"]),

// Gradings Table
gradings: defineTable({
  memberId: v.id("members"),
  fromBelt: v.string(),
  toBelt: v.string(),
  date: v.number(),
  examinerId: v.id("members"),   // Coach who examined
  passed: v.boolean(),
  notes: v.optional(v.string()),
  techniques: v.array(v.object({
    name: v.string(),
    score: v.number(),           // 1-5
  })),
})
  .index("by_member", ["memberId"])
  .index("by_date", ["date"]),

// Incidents Table (Safety)
incidents: defineTable({
  memberId: v.id("members"),
  type: v.string(),              // "injury" | "concussion" | "other"
  date: v.number(),
  description: v.string(),
  severity: v.string(),          // "minor" | "moderate" | "severe"
  firstAidGiven: v.string(),
  reportedBy: v.id("members"),
  clearedToTrain: v.boolean(),
  clearedDate: v.optional(v.number()),
  medicalNotes: v.optional(v.string()),
})
  .index("by_member", ["memberId"])
  .index("by_type", ["type"]),
```

### 2.2 Convex Functions to Create

```
convex/
├── members.ts
│   ├── list()              - Get all members (admin/coach)
│   ├── get(id)             - Get single member
│   ├── getByEmail(email)   - Get by email
│   ├── create(data)        - Create new member
│   ├── update(id, data)    - Update member
│   ├── updateBelt(id, belt) - Promote belt
│   └── getStats()          - Dashboard stats
│
├── classes.ts
│   ├── list()              - Get all classes
│   ├── getToday()          - Today's classes
│   ├── getByCoach(coachId) - Coach's classes
│   ├── create(data)        - Create class
│   ├── update(id, data)    - Update class
│   └── delete(id)          - Delete class
│
├── attendance.ts
│   ├── checkIn(memberId, classId) - Record attendance
│   ├── getByMember(memberId)      - Member's history
│   ├── getByClass(classId)        - Class attendance
│   ├── getByDate(date)            - Daily attendance
│   ├── getStreak(memberId)        - Training streak
│   └── getStats()                 - Attendance analytics
│
├── payments.ts
│   ├── list()              - All payments
│   ├── getByMember(memberId) - Member payments
│   ├── create(data)        - Record payment
│   ├── getRevenue(period)  - Revenue stats
│   └── getPending()        - Pending payments
│
├── gradings.ts
│   ├── list()              - All gradings
│   ├── getByMember(memberId) - Member gradings
│   ├── create(data)        - Record grading
│   ├── getEligible()       - Members eligible for grading
│   └── getUpcoming()       - Scheduled gradings
│
└── incidents.ts
    ├── list()              - All incidents
    ├── getByMember(memberId) - Member incidents
    ├── create(data)        - Report incident
    ├── clearMember(id)     - Clear to train
    └── getActive()         - Uncleared incidents
```

### 2.3 React Hook Integration

```typescript
// Example: src/pages/MemberDashboard.tsx

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function MemberDashboard() {
  // Real data queries
  const member = useQuery(api.members.getCurrent);
  const attendance = useQuery(api.attendance.getByMember, { memberId: member?._id });
  const streak = useQuery(api.attendance.getStreak, { memberId: member?._id });
  const todayClasses = useQuery(api.classes.getToday);
  const recentGradings = useQuery(api.gradings.getByMember, { memberId: member?._id });

  // Mutations
  const checkIn = useMutation(api.attendance.checkIn);

  // Loading state
  if (!member) return <LoadingSpinner />;

  // Render with real data
  return (
    <PageTransition>
      <h1>Welcome, Judoka {member.name}</h1>
      <StatsCard title="Training Streak" value={streak?.days || 0} />
      {/* ... */}
    </PageTransition>
  );
}
```

### 2.4 Migration Strategy

1. **Keep mock data as fallback** - Don't break existing UI
2. **Add feature flag** - `USE_REAL_DATA = true/false`
3. **Migrate one page at a time** - Start with MemberDashboard
4. **Test thoroughly** - Each page before moving on
5. **Seed real data** - Create seed script for demo data

### 2.5 Deliverables
- [ ] Update convex/schema.ts with complete schema
- [ ] Create all Convex query functions
- [ ] Create all Convex mutation functions
- [ ] Add loading states to all pages
- [ ] Add error handling for failed queries
- [ ] Create seed data script
- [ ] Migrate MemberDashboard to real data
- [ ] Migrate CoachDashboard to real data
- [ ] Migrate AdminDashboard to real data
- [ ] Remove mock data files

---

## Phase 3: Stripe Payment Integration
**Priority:** HIGH | **Complexity:** HIGH

### 3.1 Stripe Setup

```
Required Stripe Products:
├── Student Membership (£15/month)
├── Standard Membership (£25/month)
├── Premium Membership (£40/month)
├── Drop-in Session (£10)
└── Grading Fee (£25)
```

### 3.2 Backend Functions (Convex HTTP Actions)

```typescript
// convex/http.ts - Stripe endpoints

// Create checkout session
POST /api/stripe/create-checkout
Request: { priceId, memberId, mode: "subscription" | "payment" }
Response: { url: string }

// Handle webhooks
POST /api/stripe/webhook
Events to handle:
├── checkout.session.completed
├── customer.subscription.created
├── customer.subscription.updated
├── customer.subscription.deleted
├── invoice.paid
├── invoice.payment_failed
└── payment_intent.succeeded

// Customer portal
POST /api/stripe/create-portal
Request: { memberId }
Response: { url: string }

// Cancel subscription
POST /api/stripe/cancel-subscription
Request: { memberId }
Response: { success: boolean }
```

### 3.3 Frontend Components

```
src/components/payments/
├── SubscriptionCard.tsx      - Show current subscription
├── PricingTable.tsx          - Pricing options
├── PaymentHistory.tsx        - Transaction list
├── CheckoutButton.tsx        - Initiate checkout
├── ManageSubscription.tsx    - Portal link
└── PaymentStatus.tsx         - Success/failure states
```

### 3.4 Payment Flow

```
User Journey:
1. User views pricing → PricingPage.tsx
2. Clicks "Subscribe" → CheckoutButton.tsx
3. Redirected to Stripe Checkout
4. Completes payment
5. Webhook fires → convex/http.ts
6. Database updated → member.subscriptionStatus = "active"
7. Redirected to SubscriptionSuccess.tsx
8. Member dashboard shows active subscription
```

### 3.5 Environment Variables

```env
# .env.local
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Stripe Price IDs
STRIPE_PRICE_STUDENT=price_xxx
STRIPE_PRICE_STANDARD=price_xxx
STRIPE_PRICE_PREMIUM=price_xxx
STRIPE_PRICE_DROPIN=price_xxx
STRIPE_PRICE_GRADING=price_xxx
```

### 3.6 Deliverables
- [ ] Set up Stripe products and prices
- [ ] Create Convex HTTP actions for Stripe
- [ ] Implement webhook handler
- [ ] Create CheckoutButton component
- [ ] Create SubscriptionCard component
- [ ] Create PaymentHistory component
- [ ] Add payment status to member dashboard
- [ ] Test full payment flow
- [ ] Add subscription management (cancel/upgrade)
- [ ] Add invoice/receipt emails

---

## Phase 4: Belt Journey & Progress Tracking
**Priority:** MEDIUM | **Complexity:** MEDIUM

### 4.1 Belt Journey Visualization

```typescript
// src/components/BeltJourney.tsx

Features:
├── Visual progress bar (white → black)
├── Current belt highlight with glow
├── Next belt requirements
├── Time until eligible for promotion
├── Techniques needed for next belt
├── Achievement badges
└── Animated transitions on promotion
```

### 4.2 Technique Library

```typescript
// src/lib/judo-techniques.ts

interface Technique {
  name: string;
  japaneseName: string;
  category: "nage-waza" | "katame-waza" | "atemi-waza";
  subcategory: string;
  beltRequirement: string;
  description: string;
  videoUrl?: string;
  imageUrl?: string;
}

// Categories:
// Nage-waza (Throwing techniques)
// ├── Te-waza (Hand techniques)
// ├── Koshi-waza (Hip techniques)
// ├── Ashi-waza (Foot/leg techniques)
// └── Sutemi-waza (Sacrifice techniques)
//
// Katame-waza (Grappling techniques)
// ├── Osaekomi-waza (Pins)
// ├── Shime-waza (Chokes)
// └── Kansetsu-waza (Joint locks)
```

### 4.3 Progress Tracking Features

```
Member Profile Additions:
├── Belt Journey visualization
├── Techniques learned checklist
├── Training log (hours, sessions)
├── Attendance streak
├── Competition history
├── Personal bests
└── Coach notes/feedback
```

### 4.4 Grading System

```typescript
// src/components/GradingEligibility.tsx

Display:
├── Days since last grading
├── Minimum days required
├── Sessions attended since last grading
├── Techniques to demonstrate
├── Eligibility status (Ready/Not Ready)
└── "Request Grading" button (if eligible)
```

### 4.5 Deliverables
- [ ] Create BeltJourney component
- [ ] Create TechniqueLibrary component
- [ ] Create TrainingLog component
- [ ] Create GradingEligibility component
- [ ] Add progress tracking to member dashboard
- [ ] Create coach view for member progress
- [ ] Add achievement/badge system
- [ ] Create grading request workflow

---

## Phase 5: Mobile & PWA Optimization
**Priority:** HIGH | **Complexity:** MEDIUM

### 5.1 PWA Configuration

```typescript
// vite.config.ts - Add PWA plugin

import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Judo Dojo Manager',
        short_name: 'Judo Dojo',
        description: 'University of London Judo Club',
        theme_color: '#7c3aed',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    }),
  ],
});
```

### 5.2 Mobile Navigation

```typescript
// src/components/MobileNavigation.tsx

Features:
├── Bottom tab bar (Home, Classes, Check-in, Profile)
├── Swipe gestures for navigation
├── Pull-to-refresh
├── Touch-friendly buttons (min 44px)
├── Haptic feedback on actions
└── Floating action button for quick check-in
```

### 5.3 Push Notifications

```typescript
// Notification triggers:
├── Class reminder (1 hour before)
├── Check-in confirmation
├── Belt promotion
├── Payment due/received
├── Grading eligibility
└── Club announcements
```

### 5.4 Offline Support

```typescript
// Service worker caching:
├── Static assets (CSS, JS, images)
├── Recent attendance data
├── Member profile
├── Class schedule
└── Offline check-in queue (sync when online)
```

### 5.5 Mobile-Specific UI

```
Responsive Breakpoints:
├── Mobile: < 640px
│   ├── Single column layout
│   ├── Bottom navigation
│   ├── Larger touch targets
│   ├── Swipe cards
│   └── Collapsible sections
├── Tablet: 640px - 1024px
│   ├── Two column layout
│   ├── Side navigation
│   └── Split views
└── Desktop: > 1024px
    ├── Multi-column dashboard
    ├── Top navigation
    └── Full feature access
```

### 5.6 Deliverables
- [ ] Add vite-plugin-pwa
- [ ] Create manifest.json
- [ ] Create app icons (192px, 512px)
- [ ] Create MobileNavigation component
- [ ] Implement pull-to-refresh
- [ ] Add touch gestures
- [ ] Set up push notification service
- [ ] Implement offline mode
- [ ] Create mobile-specific layouts
- [ ] Test on iOS and Android devices

---

## Phase 6: Polish & Production Ready
**Priority:** MEDIUM | **Complexity:** LOW-MEDIUM

### 6.1 Visual Enhancements

```
Assets to Add:
├── Judo action photos (hero, features)
├── Belt rank icons (custom SVGs)
├── Technique illustrations
├── Coach profile photos
├── Club logo variations
└── Social media images
```

### 6.2 Performance Optimization

```typescript
// Code splitting
const MemberDashboard = lazy(() => import('./pages/MemberDashboard'));
const CoachDashboard = lazy(() => import('./pages/CoachDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Image optimization
import { Image } from '@/components/ui/optimized-image';

// Bundle analysis
npm run build -- --analyze
```

### 6.3 SEO & Meta Tags

```html
<!-- public/index.html -->
<title>Judo Dojo Manager | University of London Judo Club</title>
<meta name="description" content="Manage your judo club membership, track belt progression, and check in to classes at the University of London Judo Club at Birkbeck." />
<meta property="og:image" content="/og-image.png" />
```

### 6.4 Analytics

```typescript
// Add tracking for:
├── Page views
├── Check-ins
├── Sign-ups
├── Payment conversions
├── Feature usage
└── Error rates
```

### 6.5 Testing

```
Test Coverage:
├── Unit tests (components)
├── Integration tests (Convex functions)
├── E2E tests (user flows)
├── Accessibility audit (WCAG 2.1)
├── Performance audit (Lighthouse)
└── Security audit (OWASP)
```

### 6.6 Documentation

```
docs/
├── USER-GUIDE.md           - For members
├── COACH-GUIDE.md          - For coaches/sensei
├── ADMIN-GUIDE.md          - For administrators
├── API-REFERENCE.md        - Convex functions
├── DEPLOYMENT.md           - Deploy instructions
└── TROUBLESHOOTING.md      - Common issues
```

### 6.7 Deliverables
- [ ] Add real judo photos
- [ ] Create custom belt rank icons
- [ ] Implement code splitting
- [ ] Add image optimization
- [ ] Configure SEO meta tags
- [ ] Set up analytics
- [ ] Write unit tests
- [ ] Write E2E tests
- [ ] Run accessibility audit
- [ ] Run performance audit
- [ ] Complete user documentation
- [ ] Final security review

---

## Implementation Timeline

```
Week 1: Phase 1 (Judo Authenticity)
├── Day 1-2: Update terminology across all pages
├── Day 3: Create JudoGlossary component
├── Day 4: Add Japanese terms to UI
└── Day 5: Review and polish

Week 2-3: Phase 2 (Convex Data)
├── Day 1-2: Update database schema
├── Day 3-5: Create all Convex functions
├── Day 6-8: Migrate dashboards to real data
├── Day 9: Create seed data
└── Day 10: Testing and bug fixes

Week 4: Phase 3 (Stripe Payments)
├── Day 1: Set up Stripe products
├── Day 2-3: Create checkout flow
├── Day 4: Implement webhooks
├── Day 5: Add subscription management
└── Day 6-7: Testing payment flows

Week 5: Phase 4 (Belt Journey)
├── Day 1-2: Create BeltJourney component
├── Day 3: Build TechniqueLibrary
├── Day 4: Add grading system
└── Day 5: Integration and polish

Week 6: Phase 5 (Mobile/PWA)
├── Day 1: Configure PWA
├── Day 2-3: Mobile navigation
├── Day 4: Push notifications
└── Day 5: Offline support

Week 7: Phase 6 (Polish)
├── Day 1-2: Visual enhancements
├── Day 3: Performance optimization
├── Day 4: Testing
└── Day 5: Documentation and launch
```

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Design Rating | 8.5/10 | 10/10 |
| Lighthouse Performance | ~70 | 90+ |
| Lighthouse Accessibility | ~80 | 95+ |
| Bundle Size | 1MB+ | <500KB |
| Time to Interactive | ~3s | <1.5s |
| Mobile Usability | Good | Excellent |
| Test Coverage | 0% | 80%+ |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Stripe integration complexity | Use Stripe's pre-built Checkout |
| Convex learning curve | Follow official docs, start simple |
| Mobile performance | Lazy loading, code splitting |
| Data migration issues | Keep mock data as fallback |
| Scope creep | Stick to MVP features first |

---

## Quick Start Commands

```bash
# Start development
npm run dev

# Start Convex
npx convex dev

# Build and test
npm run build

# Deploy
git push origin main  # Auto-deploys to Vercel

# Run Stripe webhooks locally
stripe listen --forward-to localhost:5173/api/stripe/webhook
```

---

**Document Version:** 1.0
**Created:** January 2026
**Author:** Claude Code
**Status:** Ready for Implementation
