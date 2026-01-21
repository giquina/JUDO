# Quick Start Guide - Payment & Profile Components

**5-Minute Integration Guide**

---

## Option 1: View the Demo (Recommended First Step)

1. **Add the demo route to your app:**

```tsx
// In your main App.tsx or router file
import DashboardDemo from './pages/DashboardDemo'

// Add to your routes
<Route path="/demo/payment-profile" element={<DashboardDemo />} />
```

2. **Visit the demo:**
```
http://localhost:5173/demo/payment-profile
```

3. **Test all features:**
   - Click around the Overview tab
   - Try the filters in Payment History
   - Export CSV
   - Edit profile
   - Change subscription tier
   - Manage payment methods

---

## Option 2: Add to Existing Dashboard

### Step 1: Import Components

```tsx
import { useState } from 'react'
import {
  PaymentHistoryCard,
  PaymentHistoryModal,
  SubscriptionManagement,
  ProfileCard,
} from '@/components/dashboard'
```

### Step 2: Add State

```tsx
const [showPaymentHistory, setShowPaymentHistory] = useState(false)
```

### Step 3: Use Components

```tsx
// In your dashboard layout
return (
  <div className="grid gap-6 p-6">
    {/* Profile Section */}
    <ProfileCard />

    {/* Payment History */}
    <PaymentHistoryCard
      onViewAll={() => setShowPaymentHistory(true)}
    />

    {/* Full Payment History Modal */}
    <PaymentHistoryModal
      open={showPaymentHistory}
      onOpenChange={setShowPaymentHistory}
    />
  </div>
)
```

### Step 4: Add Subscription Management (Optional)

```tsx
// In a separate "Subscription" or "Billing" page
<SubscriptionManagement />
```

---

## Option 3: Individual Component Usage

### Just Payment History Card

```tsx
import { PaymentHistoryCard } from '@/components/dashboard'

<PaymentHistoryCard
  onViewAll={() => console.log('View all clicked')}
/>
```

### Just Profile Card

```tsx
import { ProfileCard } from '@/components/dashboard'

<ProfileCard />
```

### Just Subscription Management

```tsx
import { SubscriptionManagement } from '@/components/dashboard'

<SubscriptionManagement />
```

---

## Complete Example (Copy-Paste Ready)

```tsx
import { useState } from 'react'
import {
  PaymentHistoryCard,
  PaymentHistoryModal,
  SubscriptionManagement,
  ProfileCard,
} from '@/components/dashboard'

export function UserDashboard() {
  const [showPaymentHistory, setShowPaymentHistory] = useState(false)

  return (
    <div className="container mx-auto space-y-6 p-6">
      <h1 className="text-3xl font-bold">My Dashboard</h1>

      {/* Two Column Layout */}
      <div className="grid gap-6 md:grid-cols-2">
        <ProfileCard />
        <PaymentHistoryCard
          onViewAll={() => setShowPaymentHistory(true)}
        />
      </div>

      {/* Full Width Subscription Management */}
      <SubscriptionManagement />

      {/* Payment History Modal */}
      <PaymentHistoryModal
        open={showPaymentHistory}
        onOpenChange={setShowPaymentHistory}
      />
    </div>
  )
}
```

---

## What You Get

✅ **Profile Card** with:
- Photo upload
- Quick stats (sessions, streak, attendance)
- Edit profile button
- QR code
- Social links

✅ **Payment History** with:
- Last 5 payments
- Status badges
- Download receipts
- Filter & search
- Export to CSV

✅ **Subscription Management** with:
- Current plan display
- Tier comparison
- Upgrade/downgrade
- Payment methods
- Pause/cancel options

---

## Customization

### Change Colors

All components use Tailwind semantic colors:
```tsx
// No changes needed - respects your theme!
```

### Modify Layout

```tsx
// Stack vertically instead of grid
<div className="space-y-6">
  <ProfileCard />
  <PaymentHistoryCard />
</div>

// Or 3 columns on large screens
<div className="grid gap-6 lg:grid-cols-3">
  {/* ... */}
</div>
```

### Hide Features

```tsx
// Don't want social links? Edit ProfileCard.tsx:
// Comment out the social links section (lines ~140-170)

// Don't want pause subscription? Edit SubscriptionManagement.tsx:
// Remove the pause button (around line 85)
```

---

## Troubleshooting

### "Cannot find module '@/components/dashboard'"
✅ **Solution:** Make sure the path alias is set in `tsconfig.json` and `vite.config.ts`

### "Icons not showing"
✅ **Solution:** Run `npm install lucide-react` (should already be installed)

### "Toasts not appearing"
✅ **Solution:** Make sure Sonner is imported in your main App:
```tsx
import { Toaster } from 'sonner'

<Toaster position="top-right" />
```

### "Dark mode not working"
✅ **Solution:** Ensure ThemeProvider wraps your app

---

## Mock Data Location

All mock data is in: `/home/user/JUDO/src/lib/mockPaymentData.ts`

Edit this file to:
- Change payment amounts
- Add more payment history
- Modify subscription tiers
- Update payment methods

---

## Next Steps

1. ✅ Test the demo page
2. ✅ Integrate into your dashboard
3. ✅ Customize as needed
4. 🔄 When ready: Replace mock data with Convex
5. 🔄 When ready: Integrate Stripe payments

---

## Need Help?

- **Full Documentation:** `/home/user/JUDO/src/components/dashboard/README.md`
- **Complete Summary:** `/home/user/JUDO/PAYMENT_PROFILE_COMPONENTS_SUMMARY.md`
- **Demo Page:** `/home/user/JUDO/src/pages/DashboardDemo.tsx`

---

**That's it! You're ready to go. 🎉**

Total setup time: 5-10 minutes
