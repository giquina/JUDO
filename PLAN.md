# Implementation Plan: Complete Navigation & Functionality

## Current State Analysis

### Existing Routes (App.tsx)
| Route | Page | Status |
|-------|------|--------|
| `/` | Landing/Home redirect | ✅ Working |
| `/login` | Login page | ✅ Working |
| `/pricing` | Pricing page | ✅ Working |
| `/subscription/success` | Subscription success | ✅ Working |
| `/member` | Member dashboard | ✅ Working |
| `/coach` | Coach dashboard | ✅ Working |
| `/admin` | Admin dashboard | ✅ Working |

### Missing Routes (from MobileNavigation.tsx)

**Member Routes (5 missing):**
| Route | Label | Status |
|-------|-------|--------|
| `/member/classes` | Keiko | ❌ Missing |
| `/member/checkin` | Check-in | ❌ Missing |
| `/member/progress` | Progress | ❌ Missing |
| `/member/profile` | Profile | ❌ Missing |

**Coach Routes (4 missing):**
| Route | Label | Status |
|-------|-------|--------|
| `/coach/classes` | Keiko | ❌ Missing |
| `/coach/attendance` | Attendance | ❌ Missing |
| `/coach/members` | Judoka | ❌ Missing |
| `/coach/profile` | Profile | ❌ Missing |

**Admin Routes (4 missing):**
| Route | Label | Status |
|-------|-------|--------|
| `/admin/members` | Judoka | ❌ Missing |
| `/admin/payments` | Payments | ❌ Missing |
| `/admin/analytics` | Analytics | ❌ Missing |
| `/admin/settings` | Settings | ❌ Missing |

---

## Implementation Plan

### Phase 1: Create Missing Pages (12 pages)

#### 1.1 Member Pages
- [ ] `MemberClassesPage.tsx` - View class schedule, book classes
- [ ] `MemberCheckinPage.tsx` - QR code scanner for check-in
- [ ] `MemberProgressPage.tsx` - Belt journey, achievements, stats
- [ ] `MemberProfilePage.tsx` - User profile, settings, subscription

#### 1.2 Coach Pages
- [ ] `CoachClassesPage.tsx` - Manage classes, view schedule
- [ ] `CoachAttendancePage.tsx` - Scan QR, mark attendance
- [ ] `CoachMembersPage.tsx` - View all members, their progress
- [ ] `CoachProfilePage.tsx` - Coach profile, settings

#### 1.3 Admin Pages
- [ ] `AdminMembersPage.tsx` - Full member management (CRUD)
- [ ] `AdminPaymentsPage.tsx` - Payment history, invoices, refunds
- [ ] `AdminAnalyticsPage.tsx` - Charts, reports, metrics
- [ ] `AdminSettingsPage.tsx` - Club settings, config, admins

### Phase 2: Add Routes to App.tsx

```tsx
// Member routes
<Route path="/member/classes" element={<ProtectedRoute><MemberClassesPage /></ProtectedRoute>} />
<Route path="/member/checkin" element={<ProtectedRoute><MemberCheckinPage /></ProtectedRoute>} />
<Route path="/member/progress" element={<ProtectedRoute><MemberProgressPage /></ProtectedRoute>} />
<Route path="/member/profile" element={<ProtectedRoute><MemberProfilePage /></ProtectedRoute>} />

// Coach routes
<Route path="/coach/classes" element={<ProtectedRoute allowedRoles={["coach","admin"]}><CoachClassesPage /></ProtectedRoute>} />
<Route path="/coach/attendance" element={<ProtectedRoute allowedRoles={["coach","admin"]}><CoachAttendancePage /></ProtectedRoute>} />
<Route path="/coach/members" element={<ProtectedRoute allowedRoles={["coach","admin"]}><CoachMembersPage /></ProtectedRoute>} />
<Route path="/coach/profile" element={<ProtectedRoute allowedRoles={["coach","admin"]}><CoachProfilePage /></ProtectedRoute>} />

// Admin routes
<Route path="/admin/members" element={<ProtectedRoute allowedRoles={["admin"]}><AdminMembersPage /></ProtectedRoute>} />
<Route path="/admin/payments" element={<ProtectedRoute allowedRoles={["admin"]}><AdminPaymentsPage /></ProtectedRoute>} />
<Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={["admin"]}><AdminAnalyticsPage /></ProtectedRoute>} />
<Route path="/admin/settings" element={<ProtectedRoute allowedRoles={["admin"]}><AdminSettingsPage /></ProtectedRoute>} />
```

### Phase 3: Connect to Real Data (Convex)

#### 3.1 Replace Mock Auth
- [ ] Implement Convex auth with magic links
- [ ] Connect to real user/member data
- [ ] Handle session persistence

#### 3.2 Connect Dashboards to Convex
- [ ] Members: `useQuery(api.members.list)`
- [ ] Classes: `useQuery(api.classes.list)`
- [ ] Attendance: `useMutation(api.attendance.checkIn)`
- [ ] Payments: `useQuery(api.payments.list)`

### Phase 4: Stripe Integration
- [ ] Create Stripe checkout sessions
- [ ] Handle webhooks for subscription events
- [ ] Update member subscription status in Convex
- [ ] Show payment history

### Phase 5: Additional Features
- [ ] Push notifications (PWA)
- [ ] Offline support
- [ ] Export data (CSV/PDF)

---

## Priority Order

### Immediate (Navigation Fix)
1. Create 12 stub pages with basic UI
2. Add routes to App.tsx
3. Verify all navigation works

### Short-term (Functionality)
4. Build out page content with mock data
5. Connect to Convex queries/mutations
6. Implement real auth

### Medium-term (Payments)
7. Stripe integration
8. Subscription management

### Long-term (Polish)
9. Push notifications
10. Offline mode
11. Data export

---

## Estimated Scope

| Phase | Pages/Components | Complexity |
|-------|------------------|------------|
| Phase 1 | 12 pages | Medium |
| Phase 2 | 1 file (App.tsx) | Low |
| Phase 3 | 10+ components | High |
| Phase 4 | Backend + Frontend | High |
| Phase 5 | PWA features | Medium |

**Total missing pages: 12**
**Total missing routes: 12**
