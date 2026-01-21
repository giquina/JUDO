# Testing Social Features - Quick Guide

A step-by-step guide to test all social features in the JUDO app.

## Quick Test Setup

### Option 1: Add to Existing Page (Fastest)

Add this to any existing page to test immediately:

```tsx
// In your page file (e.g., src/pages/test-social.tsx)
import { SocialFeaturesDemo } from "@/components/dashboard/SocialFeaturesDemo";

export default function TestSocialPage() {
  return <SocialFeaturesDemo currentUserId="mem-001" layout="tabbed" />;
}
```

Then visit `/test-social` in your browser.

### Option 2: Add to Dashboard

```tsx
// In your dashboard page
import { TrainingPartners, Leaderboard, CommunityFeed } from "@/components/dashboard";

// Add to your existing dashboard layout
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <TrainingPartners currentUserId="mem-001" />
  <Leaderboard currentUserId="mem-001" />
  <div className="lg:col-span-3">
    <CommunityFeed currentUserId="mem-001" />
  </div>
</div>
```

---

## Test Scenarios

### 1. Training Partners Component

**What to test:**
- [ ] Top 5 partners display
- [ ] Match scores show (should be 72-85%)
- [ ] Avatar images load
- [ ] Belt badges display correctly
- [ ] "Message" button shows toast
- [ ] "View Profile" opens modal
- [ ] "Find Partners" button opens search modal
- [ ] Times trained together shows
- [ ] Last trained date shows
- [ ] Mutual techniques display as badges

**Test with different users:**
```tsx
<TrainingPartners currentUserId="mem-001" /> // Has 5 partners
<TrainingPartners currentUserId="mem-003" /> // New member, fewer partners
<TrainingPartners currentUserId="mem-005" /> // Sensei, many partners
```

### 2. Leaderboard Component

**What to test:**
- [ ] All 4 tabs work (Sessions, Streak, Improved, Wins)
- [ ] Top 10 members display
- [ ] Rank change indicators show (↑↓)
- [ ] Current user is highlighted
- [ ] Belt filter dropdown works
- [ ] "Show me on leaderboard" toggle works
- [ ] User rank shows at bottom
- [ ] Medal icons for top 3
- [ ] Smooth tab transitions

**Try different filters:**
- Switch between all 4 leaderboard types
- Filter by different belt levels
- Toggle opt-in/opt-out
- Check if your rank appears correctly

### 3. Community Feed Component

**What to test:**
- [ ] Posts display with avatars
- [ ] Post types show correct icons
- [ ] Like button works (toggle on/off)
- [ ] Like count updates
- [ ] Comment section expands/collapses
- [ ] Write and post comments
- [ ] Comments appear immediately
- [ ] Category filter dropdown works
- [ ] Images in posts load
- [ ] "Share" shows toast
- [ ] Timestamps show correctly
- [ ] Belt badges display

**Interactions to try:**
- Like/unlike several posts
- Expand comments on a post
- Write a comment and post it
- Filter by different categories
- Try the dropdown menu on posts

### 4. Find Partners Modal

**What to test:**
- [ ] Modal opens from "Find Partners" button
- [ ] Search box filters by name
- [ ] Belt rank filter works
- [ ] Focus checkboxes filter results
- [ ] Clear filters button works
- [ ] Match scores display (0-100%)
- [ ] Member count updates with filters
- [ ] "Connect" button shows toast
- [ ] Scrolling works with many members
- [ ] Close button works

**Try searching for:**
- Type "John" in search
- Filter by "Blue Belt"
- Check "randori" focus
- Combine multiple filters
- Clear all and see all 29 members

### 5. Member Profile Modal

**What to test:**
- [ ] Modal opens when clicking "View Profile"
- [ ] Three tabs work (Overview, Stats, Activity)
- [ ] Avatar displays at top
- [ ] Belt badge shows
- [ ] Bio displays
- [ ] Favorite techniques show
- [ ] Availability shows
- [ ] Stats display in cards
- [ ] Progress bars work
- [ ] Recent posts show (if any)
- [ ] "Message" button shows toast
- [ ] "Add Partner" button shows toast
- [ ] Close button works

**View different members:**
- View mem-001 (John - Blue belt, active)
- View mem-005 (David - Black belt sensei)
- View mem-003 (Mike - White belt beginner)
- View mem-002 (Sarah - Brown belt senior)

### 6. Social Notifications Component

**What to test:**
- [ ] Unread count badge shows (should be 2)
- [ ] Notifications display
- [ ] Unread notifications highlighted
- [ ] Icons match notification types
- [ ] Timestamps show correctly
- [ ] Click notification marks as read
- [ ] "Accept" button on partner request works
- [ ] "Decline" button on partner request works
- [ ] "Mark all read" button works
- [ ] Empty state shows when no notifications
- [ ] Avatar shows for user-related notifications

**Try interactions:**
- Click "Mark all read"
- Accept a partner request
- Decline a partner request
- Click individual notifications

---

## Visual Checks

### Responsive Design

Test on different screen sizes:

**Desktop (>1024px):**
- Components should be side-by-side
- 3-column layouts work
- Full content visible

**Tablet (768-1024px):**
- Components stack nicely
- 2-column layouts
- Readable font sizes

**Mobile (<768px):**
- Single column layout
- Bottom navigation appears
- Touch targets are large enough
- Scrolling is smooth

### Dark Mode

Toggle dark mode and check:
- [ ] All text is readable
- [ ] Backgrounds contrast well
- [ ] Borders are visible
- [ ] Belt badges look good
- [ ] Cards have proper shadows
- [ ] Hover states work

### Animations

Watch for smooth animations:
- [ ] List items fade in with stagger
- [ ] Modals slide in
- [ ] Tabs transition smoothly
- [ ] Comments expand/collapse
- [ ] Hover effects are subtle
- [ ] No janky movements

---

## Browser Testing

Recommended browsers to test:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Performance Checks

### Expected Behavior

**Fast:**
- Component initial render < 100ms
- Smooth 60fps animations
- No lag when scrolling
- Instant filter updates
- Quick modal open/close

**Potential Issues:**
If you see lag:
1. Check browser console for errors
2. Verify Framer Motion is installed
3. Check if animations can be reduced
4. Test with fewer mock data items

---

## Common Issues & Solutions

### Issue: "Module not found" errors

**Solution:**
```bash
# Install missing dependencies
npm install framer-motion sonner
```

### Issue: Types not found

**Solution:**
```bash
# Make sure TypeScript is configured
npm install -D @types/react @types/node
```

### Issue: Styles not applying

**Solution:**
```bash
# Rebuild Tailwind
npm run dev
# or
npm run build
```

### Issue: Mock data not showing

**Solution:**
- Check that `/src/lib/mockSocialData.ts` exists
- Verify imports in components
- Check browser console for errors

### Issue: Images not loading

**Solution:**
- Mock data uses DiceBear avatars (external API)
- Check internet connection
- Avatars should load from: `https://api.dicebear.com/`

---

## Test Data Reference

### Available Test Users

| ID | Name | Belt | Sessions | Streak | Notes |
|---|---|---|---|---|---|
| mem-001 | John Smith | Blue | 156 | 12 | Active competitor |
| mem-002 | Sarah Jones | Brown | 245 | 8 | Senior instructor |
| mem-003 | Mike Wilson | White | 24 | 3 | New member |
| mem-004 | Emily Brown | Yellow | 68 | 5 | First competition |
| mem-005 | David Taylor | Black | 512 | 24 | Head coach |
| mem-006 | Lisa Anderson | Green | 92 | 7 | Regular member |
| mem-007-030 | Various | Mixed | Varies | Varies | Other members |

### Test Different Scenarios

**High Activity User:**
```tsx
<Component currentUserId="mem-005" /> // David - Black belt sensei
```

**New Member:**
```tsx
<Component currentUserId="mem-003" /> // Mike - White belt beginner
```

**Average Member:**
```tsx
<Component currentUserId="mem-001" /> // John - Blue belt (default)
```

---

## Success Criteria

You should see:

✅ All components render without errors
✅ Mock data populates all sections
✅ Interactive elements respond to clicks
✅ Modals open and close properly
✅ Filters and search work correctly
✅ Animations are smooth
✅ Responsive on all screen sizes
✅ Dark mode works properly
✅ Toast notifications appear
✅ No console errors

---

## Next Steps After Testing

Once everything works:

1. **Customize Styling** (if needed)
   - Adjust colors in Tailwind config
   - Modify spacing/sizing
   - Change animation speeds

2. **Add to Navigation**
   - Add links to social pages
   - Update menu items
   - Add notification badges

3. **Plan Backend Integration**
   - Review Convex schema needs
   - Plan data structure
   - Design API endpoints

4. **Enhance Features**
   - Add real-time updates
   - Implement chat integration
   - Add file upload support

---

## Need Help?

**Documentation:**
- Component API: `SOCIAL_FEATURES.md`
- Quick Start: `SocialQuickStart.tsx`
- Summary: `SOCIAL_FEATURES_SUMMARY.md`

**Debug:**
1. Check browser console for errors
2. Verify all imports are correct
3. Check TypeScript errors in IDE
4. Review component props

**Test in Isolation:**
```tsx
// Test one component at a time
import { TrainingPartners } from "@/components/dashboard";

export default function Test() {
  return (
    <div className="p-8">
      <TrainingPartners currentUserId="mem-001" />
    </div>
  );
}
```

---

**Happy Testing!** 🥋

All features should work out of the box. If you encounter any issues, check the documentation files or inspect the component code directly.
