# Accessibility Quick Start Guide

Quick reference for implementing accessibility features in the JUDO app.

---

## TL;DR - Essential Rules

1. **All icon buttons MUST have aria-label**
2. **All clickable cards MUST support Enter/Space keys**
3. **All form inputs MUST have associated labels**
4. **All images MUST have alt text**
5. **All modals MUST trap focus**
6. **Touch targets MUST be minimum 44x44px**

---

## Common Patterns

### Icon Button
```tsx
<Button
  variant="ghost"
  size="icon"
  aria-label="Close dialog"  // ← REQUIRED!
>
  <X className="h-4 w-4" />
</Button>
```

### Clickable Card
```tsx
import { AccessibleCard } from '@/components/AccessibleCard';

<AccessibleCard
  onClick={handleClick}
  ariaLabel="View member details"  // ← REQUIRED!
>
  <CardContent>...</CardContent>
</AccessibleCard>
```

### Form Field
```tsx
<Label htmlFor="email">Email</Label>  {/* ← REQUIRED! */}
<Input id="email" type="email" />
```

### Keyboard Shortcut
```tsx
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcuts';

useKeyboardShortcut('k', handleSearch, { ctrl: true });
```

### Image
```tsx
<img src="photo.jpg" alt="Profile photo of Alice Chen" />  {/* ← REQUIRED! */}
```

---

## Import Cheat Sheet

```tsx
// Components
import { AccessibleCard } from '@/components/AccessibleCard';
import { FocusTrap } from '@/components/FocusTrap';
import { SkipLinks } from '@/components/SkipLinks';

// Keyboard Shortcuts
import {
  useKeyboardShortcut,
  useKeyboardShortcuts,
  useCommonShortcuts,
  formatShortcut,
} from '@/hooks/useKeyboardShortcuts';

// Keyboard Navigation
import {
  useArrowNavigation,
  useEscapeKey,
  useEnterKey,
  useSpaceKey,
  useKeyboardAccessible,
  useListNavigation,
} from '@/hooks/useKeyboardNavigation';

// UI Components (already accessible!)
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
```

---

## CSS Classes

```tsx
// Screen reader only text
<span className="sr-only">Additional context</span>

// Touch target (44x44px minimum)
<button className="touch-target">Button</button>

// Focus rings
<div className="focus-ring-primary">...</div>
<div className="focus-ring-destructive">...</div>
```

---

## Quick Testing

### Keyboard Test (30 seconds)
1. Unplug your mouse
2. Press Tab from page load
3. Navigate through all interactive elements
4. Press Enter/Space to activate
5. Press Escape to close modals

### Screen Reader Test (2 minutes)
**Mac:** Cmd+F5 to toggle VoiceOver
**Windows:** Download [NVDA](https://www.nvaccess.org/) (free)

Navigate with:
- Tab - Next element
- Shift+Tab - Previous element
- H - Next heading
- Arrow keys - Read content

---

## Common Mistakes

### ❌ BAD
```tsx
// Icon button without label
<Button size="icon">
  <X className="h-4 w-4" />
</Button>

// Clickable div without keyboard support
<div onClick={handleClick}>
  Click me
</div>

// Input without label
<Input placeholder="Enter name" />

// Image without alt
<img src="photo.jpg" />
```

### ✅ GOOD
```tsx
// Icon button WITH label
<Button size="icon" aria-label="Close">
  <X className="h-4 w-4" />
</Button>

// Clickable element WITH keyboard support
<AccessibleCard onClick={handleClick} ariaLabel="View details">
  Click me
</AccessibleCard>

// Input WITH label
<Label htmlFor="name">Name</Label>
<Input id="name" />

// Image WITH alt
<img src="photo.jpg" alt="Profile photo" />
```

---

## Before You Push

Run this checklist:

- [ ] All icon buttons have `aria-label`
- [ ] All clickable cards support Enter/Space
- [ ] All form inputs have `<Label>`
- [ ] All images have `alt` text
- [ ] Can navigate entire page with keyboard only
- [ ] Focus indicators visible
- [ ] No keyboard traps

---

## Need Help?

1. **Code examples:** `/src/docs/ACCESSIBILITY_EXAMPLES.tsx`
2. **Full guide:** `/src/docs/ACCESSIBILITY.md`
3. **Implementation summary:** `/ACCESSIBILITY_IMPLEMENTATION.md`

---

**Remember:** Accessibility isn't optional. Test with keyboard and screen readers!
