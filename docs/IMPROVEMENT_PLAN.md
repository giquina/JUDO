# Judo Club App - Improvement Plan

## Current Rating: 6.5/10

---

## Phase 1: Core Functionality (6.5 → 8.0)

### 1.1 Connect Convex Database
- [ ] Initialize Convex project (`npx convex dev`)
- [ ] Connect React app to Convex provider
- [ ] Replace mock data with real Convex queries
- [ ] Implement real-time data syncing

### 1.2 Authentication System
- [ ] Set up Convex Auth with email magic links
- [ ] Domain whitelist for @bbk.ac.uk students
- [ ] Session management and persistence
- [ ] Protected routes (redirect if not logged in)
- [ ] Role-based access control (member/coach/admin)

### 1.3 QR Check-in Integration
- [ ] Connect check-in to Convex attendance mutations
- [ ] Validate QR codes (expiry, class matching)
- [ ] Prevent duplicate check-ins
- [ ] Real-time attendance updates for coaches

---

## Phase 2: Polish & UX (8.0 → 9.0)

### 2.1 Loading States & Skeletons
- [ ] Add skeleton loaders for all data fetches
- [ ] Button loading states with spinners
- [ ] Optimistic UI updates
- [ ] Page transition animations

### 2.2 Error Handling
- [ ] Global error boundary component
- [ ] Toast notifications for errors/success
- [ ] Form validation with error messages
- [ ] Network error recovery

### 2.3 UI Improvements
- [ ] Smooth page transitions (Framer Motion)
- [ ] Micro-interactions on buttons/cards
- [ ] Pull-to-refresh on mobile
- [ ] Better empty states with illustrations
- [ ] Confetti animation on check-in success

### 2.4 Profile & Settings
- [ ] Edit profile page
- [ ] Change notification preferences
- [ ] View subscription details
- [ ] Belt progression history timeline

---

## Phase 3: Advanced Features (9.0 → 9.5)

### 3.1 PWA Enhancement
- [ ] Service worker for offline caching
- [ ] Install prompt (Add to Home Screen)
- [ ] Offline check-in queue (sync when online)
- [ ] Push notifications
- [ ] App icon and splash screen

### 3.2 Stripe Payments
- [ ] Stripe Checkout integration
- [ ] Subscription management portal
- [ ] Payment history with receipts
- [ ] Webhook handling for status updates
- [ ] Failed payment retry flow

### 3.3 Notifications
- [ ] Email reminders for upcoming classes
- [ ] Subscription renewal reminders
- [ ] Check-in confirmation emails
- [ ] Coach: Low attendance alerts

---

## Phase 4: Excellence (9.5 → 10.0)

### 4.1 Analytics & Insights
- [ ] Member progress charts
- [ ] Attendance trends visualization
- [ ] Revenue analytics for admin
- [ ] Belt progression predictions

### 4.2 Advanced Features
- [ ] Class booking/reservation system
- [ ] Waitlist for full classes
- [ ] Coach notes per member
- [ ] Grading schedule and tracking
- [ ] Competition registration

### 4.3 Performance & Polish
- [ ] Code splitting for faster loads
- [ ] Image optimization
- [ ] Lighthouse score 95+
- [ ] Accessibility audit (WCAG 2.1)
- [ ] Cross-browser testing

---

## Quick Wins (Immediate Impact)

These can be done quickly for visible improvement:

1. **Toast Notifications** - Success/error feedback
2. **Loading Spinners** - Better perceived performance
3. **Smooth Transitions** - Page fade in/out
4. **Better Empty States** - When no data exists
5. **Form Validation** - Inline error messages

---

## Estimated Ratings After Each Phase

| Phase | Rating | Key Deliverable |
|-------|--------|-----------------|
| Current | 6.5/10 | UI + Mock Data |
| Phase 1 | 8.0/10 | Real Auth + Database |
| Phase 2 | 9.0/10 | Polish + UX |
| Phase 3 | 9.5/10 | PWA + Payments |
| Phase 4 | 10/10 | Analytics + Advanced |

---

## Recommended Next Steps

**Immediate (Today):**
1. Add toast notifications (sonner library)
2. Add loading spinners to buttons
3. Add page transitions

**This Week:**
1. Set up Convex connection (requires manual auth)
2. Connect dashboards to real data
3. Implement actual check-in flow

**Next Week:**
1. Stripe payment integration
2. PWA manifest and service worker
3. Profile editing

---

## Dependencies to Install

```bash
# For Phase 2 improvements
npm install sonner framer-motion
npm install @tanstack/react-query  # Already installed
```

---

*Plan created: January 2026*
*Target: Production-ready by end of month*
