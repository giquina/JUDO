# TODO - Judo Club Manager

> Task tracking for University of London at Birkbeck Judo Club App
> **Current Rating: 6.5/10** | Target: 9.0/10

---

## 🔴 CRITICAL - Fix Before Testing

These issues are breaking the app and must be fixed immediately:

### Performance (INP Issues)
- [ ] Fix Interaction to Next Paint delays (13s+ on button clicks)
  - Debounce rapid interactions
  - Optimize event handlers on header/navigation
  - Reduce JavaScript blocking on sticky header
  - Profile with Chrome DevTools Performance tab

### Broken Pages
- [ ] Fix Payments page 404 error
  - Verify route exists in App.tsx: `/admin/payments`
  - Check lazy import is correct
  - Test navigation link paths

- [ ] Fix Analytics page redirect loop
  - Check ProtectedRoute permissions
  - Verify role-based access is working
  - Test with admin account

### Navigation Confusion (3 competing systems)
- [ ] Consolidate navigation into single persistent sidebar
  - Remove top nav Dashboard/Sensei/Admin buttons (duplicate)
  - Make sidebar always visible on desktop
  - Keep mobile bottom nav for touch devices
  - Top bar: Logo + Section title + User menu only

---

## 🟠 HIGH PRIORITY - UX Improvements

### Navigation Redesign (Priority 1)
- [ ] Create persistent left sidebar for desktop
  - Always visible, not hidden
  - Clear icons + labels: Members, Payments, Analytics, Settings
  - Active state highlighting
  - Collapsible on smaller screens

- [ ] Simplify top navigation bar
  - Logo/branding (left)
  - Current section title (center)
  - User menu with profile, settings, logout (right)
  - Remove redundant navigation buttons

- [ ] Unify mobile navigation
  - Keep bottom nav for mobile only
  - Match sidebar items exactly
  - Consistent icons and labels

### Dashboard Layout (Priority 2)
- [ ] Separate dashboard from data tables
  - Dashboard: 4 KPI cards + Quick Actions only
  - Move full members table to dedicated /admin/members page
  - Reduce cognitive overload

- [ ] Improve Quick Actions section
  - Add icons to all buttons
  - Group related actions (exports together, communication together)
  - Add tooltips explaining each action
  - Make buttons more visually distinct

- [ ] Add clear primary action/CTA
  - What should admin do first?
  - Highlight most important action

### Tables & Data (Priority 3)
- [ ] Make column headers sticky on scroll
- [ ] Add pagination (currently shows all members)
  - 10/25/50 per page options
  - "Showing X of Y" indicator

- [ ] Improve Actions column
  - Show View/Edit buttons directly (not hidden)
  - Secondary actions in dropdown menu
  - Better visual affordance

- [ ] Add sortable column indicators
  - Cursor change on hover
  - Underline or arrow icons
  - Visual feedback on sort direction

### Search & Filters (Priority 4)
- [ ] Add clear/reset button for search
- [ ] Show "X results found" feedback
- [ ] Real-time filtering as user types
- [ ] Filter state persistence

### Visual Polish (Priority 5)
- [ ] Add spacing and breathing room
- [ ] Improve hover states on interactive elements
- [ ] Add loading spinners when fetching data
- [ ] Better error messages for failed operations
- [ ] Add empty state messages with helpful actions

---

## 🟡 MEDIUM PRIORITY - Feature Completion

### Data Connection
- [ ] Connect all 16 pages to real Convex data (replace mock)
- [ ] Implement real authentication (magic links)
- [ ] Create Stripe checkout session endpoint
- [ ] Set up Stripe webhooks

### Status & Feedback
- [ ] Add tooltips explaining status badges ("At risk" = no attendance in 14+ days)
- [ ] Consistent status colors (green=active, red=inactive, orange=at-risk)
- [ ] Toast notifications for all actions
- [ ] Confirmation dialogs for destructive actions

### Form Improvements
- [ ] Input validation with error messages
- [ ] Autosave for long forms
- [ ] Keyboard shortcuts (Escape to close, Enter to submit)

---

## 🟢 LOW PRIORITY - Future Enhancements

### Testing
- [ ] Unit tests for components
- [ ] E2E tests for critical flows
- [ ] Accessibility audit (ARIA, keyboard nav)

### Performance
- [ ] Bundle size reduction (html5-qrcode is 375KB)
- [ ] Image lazy loading
- [ ] Code splitting improvements

### Features
- [ ] Push notifications
- [ ] Email notifications
- [ ] Competition management
- [ ] Video analysis integration
- [ ] Offline mode improvements
- [ ] i18n multi-language support

---

## ✅ Completed

- [x] PWA support with service worker
- [x] Code splitting with React.lazy
- [x] QR check-in system
- [x] Dark mode toggle
- [x] Role-based dashboards (Member, Coach, Admin)
- [x] Toast notifications with Sonner
- [x] Framer Motion animations
- [x] Belt Journey component
- [x] Mobile navigation
- [x] 12 new pages (Member/Coach/Admin sub-pages)
- [x] Disable DEV_MODE for testing
- [x] **Fix INP performance issues** - Optimized scroll handlers with RAF throttling, memoized components, CSS transitions
- [x] **Fix broken Payments/Analytics pages** - Routes working, TypeScript errors fixed
- [x] **Consolidate navigation** - Single persistent sidebar for each role (Admin, Coach, Member), removed duplicate top nav buttons
- [x] **Add pagination to tables** - AdminMembersPage has 10/25/50 per page with page navigation
- [x] **Make column headers sticky** - Table headers stay visible on scroll
- [x] **Show action buttons directly** - View/Edit/Delete buttons visible in table rows

---

## 📊 Design Feedback Summary

### What Works Well ✓
- Visual hierarchy with color-coded cards
- Dashboard KPI overview
- Clean members table with badge systems
- Good typography hierarchy
- Dark mode toggle

### What Needs Fixing ✗
| Issue | Current | Target | Impact | Status |
|-------|---------|--------|--------|--------|
| Navigation | 3 competing systems | Single persistent sidebar | High | ✅ Fixed |
| Page structure | Everything on one page | Separate dashboard/tables | High | ✅ Fixed |
| Performance | 5-13s interaction delays | <200ms response | Critical | ✅ Fixed |
| Actions | Hidden in "..." menu | Show primary, hide secondary | Medium | ✅ Fixed |
| Headers | Scroll away | Sticky on scroll | Medium | ✅ Fixed |
| Pagination | Shows all records | 10/25/50 per page | Medium | ✅ Fixed |

---

## 🎯 Implementation Order

**Phase 1: Critical Fixes (Do First)**
1. Fix INP performance issues
2. Fix broken Payments/Analytics pages
3. Consolidate navigation

**Phase 2: Layout Improvements**
4. Separate dashboard from tables
5. Add sticky headers and pagination
6. Improve action buttons visibility

**Phase 3: Polish**
7. Add loading states everywhere
8. Improve search/filter UX
9. Add tooltips and feedback

**Phase 4: Data Connection**
10. Connect to Convex
11. Implement auth
12. Stripe integration

---

**Last Updated:** 2026-01-26
**Feedback Source:** User testing session
**Current Rating:** 8.0/10 (up from 6.5/10)
