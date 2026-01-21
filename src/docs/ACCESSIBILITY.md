# Accessibility Guide

This document outlines the accessibility features implemented in the JUDO app and provides guidelines for maintaining WCAG 2.1 Level AA compliance.

## Overview

The JUDO app follows WCAG 2.1 Level AA guidelines to ensure accessibility for all users, including those using:
- Keyboard-only navigation
- Screen readers
- High contrast mode
- Reduced motion preferences

## Keyboard Navigation

### Focus Management

All interactive elements have visible focus indicators with:
- 2px minimum outline width (3px for enhanced elements)
- High contrast colors
- 2px outline offset for clarity
- Smooth transitions

### Global Keyboard Shortcuts

Import and use the keyboard shortcuts hooks:

```tsx
import { useKeyboardShortcuts, useKeyboardShortcut } from '@/hooks/useKeyboardShortcuts';

// Single shortcut
useKeyboardShortcut('k', handleSearch, { ctrl: true });

// Multiple shortcuts
useKeyboardShortcuts([
  { key: 'k', ctrl: true, callback: handleSearch },
  { key: 's', ctrl: true, callback: handleSave },
  { key: 'Escape', callback: handleClose },
]);

// Common shortcuts (Cmd+K, Cmd+/, etc.)
useCommonShortcuts({
  onSearch: handleSearch,
  onHelp: handleHelp,
  onSettings: handleSettings,
});
```

### Navigation Hooks

#### Arrow Key Navigation

```tsx
import { useArrowNavigation } from '@/hooks/useKeyboardNavigation';

const { setCurrentIndex } = useArrowNavigation(
  itemCount,
  (newIndex) => {
    // Handle navigation to new index
    focusItem(newIndex);
  },
  true, // enabled
  true  // loop from end to start
);
```

#### Escape Key Handler

```tsx
import { useEscapeKey } from '@/hooks/useKeyboardNavigation';

useEscapeKey(() => {
  closeModal();
}, isOpen);
```

#### Enter Key Handler

```tsx
import { useEnterKey } from '@/hooks/useKeyboardNavigation';

useEnterKey(() => {
  submitForm();
}, true); // enabled
```

#### Keyboard Accessible Elements

```tsx
import { useKeyboardAccessible } from '@/hooks/useKeyboardNavigation';

const props = useKeyboardAccessible(handleClick, {
  role: 'button',
  disabled: false,
});

return <div {...props}>Click me</div>;
```

## Focus Trap

Use the FocusTrap component for modals and dialogs:

```tsx
import { FocusTrap } from '@/components/FocusTrap';

<FocusTrap active={isOpen} restoreFocus={true}>
  <div>Modal content</div>
</FocusTrap>
```

**Note:** The Dialog component from shadcn/ui (Radix UI) already includes focus trapping, so you don't need to wrap it separately.

## Skip Links

Skip links are automatically included in App.tsx and allow keyboard users to jump to:
- Main content (`#main-content`)
- Navigation (`#navigation`)

To use, add IDs to your page structure:

```tsx
<main id="main-content">
  {/* Page content */}
</main>
```

## Accessible Cards

Use the AccessibleCard component for clickable cards:

```tsx
import { AccessibleCard } from '@/components/AccessibleCard';

<AccessibleCard
  onClick={handleClick}
  ariaLabel="View member details"
  className="hover:shadow-lg"
>
  <CardContent>Card content</CardContent>
</AccessibleCard>
```

This automatically adds:
- Keyboard support (Enter and Space keys)
- Proper ARIA attributes
- Focus management
- Disabled state handling

## ARIA Labels

### Icon-Only Buttons

Always add `aria-label` to buttons with only icons:

```tsx
<Button
  variant="ghost"
  size="icon"
  aria-label="Close dialog"
>
  <X className="h-4 w-4" />
</Button>
```

### Form Fields

Use proper labels and descriptions:

```tsx
<Label htmlFor="email">Email Address</Label>
<Input
  id="email"
  type="email"
  aria-describedby="email-description"
/>
<p id="email-description" className="text-sm text-muted-foreground">
  We'll never share your email
</p>
```

### Dynamic Content

Use `aria-live` for dynamic content updates:

```tsx
<div aria-live="polite" aria-atomic="true">
  {successMessage}
</div>
```

The Toaster component (Sonner) already has proper ARIA labels for notifications.

## Color Contrast

All text meets WCAG AA contrast requirements:
- Normal text: 4.5:1 minimum
- Large text (18pt+): 3:1 minimum

Check contrast using browser DevTools or online tools:
- https://webaim.org/resources/contrastchecker/
- Chrome DevTools Accessibility tab

## Touch Targets

All interactive elements meet the 44x44px minimum touch target size.

Use the utility class:

```tsx
<button className="touch-target">
  Button
</button>
```

## Images

Always provide alt text:

```tsx
// Decorative images
<img src="pattern.png" alt="" />

// Informative images
<img src="member.jpg" alt="Profile photo of Alice Chen" />

// Functional images (e.g., buttons)
<button>
  <img src="search-icon.svg" alt="Search" />
</button>
```

## Heading Hierarchy

Maintain proper heading order:

```tsx
<h1>Page Title</h1>
  <h2>Section 1</h2>
    <h3>Subsection 1.1</h3>
    <h3>Subsection 1.2</h3>
  <h2>Section 2</h2>
    <h3>Subsection 2.1</h3>
```

Never skip levels (e.g., h1 → h3).

## Semantic HTML

Use semantic HTML elements:

```tsx
// ✅ Good
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

// ❌ Bad
<div className="nav">
  <div><a href="/">Home</a></div>
</div>
```

## Navigation Landmarks

Add ARIA landmarks:

```tsx
<header role="banner">
  {/* Site header */}
</header>

<nav role="navigation" aria-label="Main navigation">
  {/* Navigation */}
</nav>

<main role="main" id="main-content">
  {/* Main content */}
</main>

<footer role="contentinfo">
  {/* Footer */}
</footer>
```

## Screen Reader Only Content

Use the `.sr-only` class for screen reader only text:

```tsx
<button>
  <X className="h-4 w-4" />
  <span className="sr-only">Close</span>
</button>
```

## Reduced Motion

The app respects `prefers-reduced-motion`:

```tsx
// Framer Motion automatically respects this
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
  Content
</motion.div>
```

Animations will be disabled for users who prefer reduced motion.

## Testing Checklist

### Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical
- [ ] Focus is visible
- [ ] Skip links work
- [ ] No keyboard traps

### Screen Readers
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Dynamic content has aria-live
- [ ] Icon buttons have aria-label
- [ ] Headings are in order

### Visual
- [ ] Color contrast meets WCAG AA
- [ ] Touch targets are 44x44px minimum
- [ ] Focus indicators are visible
- [ ] Text is readable

### Interaction
- [ ] Forms are keyboard accessible
- [ ] Modals trap focus
- [ ] Escape closes modals
- [ ] Error messages are clear
- [ ] Success messages are announced

## Testing Tools

- **Browser DevTools:** Check accessibility tree
- **axe DevTools:** Chrome/Firefox extension
- **NVDA/JAWS:** Screen reader testing (Windows)
- **VoiceOver:** Screen reader testing (Mac)
- **Keyboard only:** Unplug mouse and navigate

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [Radix UI Accessibility](https://www.radix-ui.com/primitives/docs/overview/accessibility)
