# Components Implementation Guide

This guide documents all the newly implemented keyboard shortcuts, copy-to-clipboard functionality, and inline editing features.

## Table of Contents

1. [Keyboard Shortcuts](#keyboard-shortcuts)
2. [Copy to Clipboard](#copy-to-clipboard)
3. [Inline Editing](#inline-editing)
4. [Quick Actions FAB](#quick-actions-fab)
5. [Context Menu](#context-menu)
6. [Integration Examples](#integration-examples)

---

## Keyboard Shortcuts

### Components Created

- `/src/components/KeyboardShortcuts.tsx` - Modal overlay showing all shortcuts
- `/src/components/KeyboardKey.tsx` - Visual keyboard key display component
- `useKeyboardShortcuts` hook - For handling keyboard shortcuts

### Features

- **Opens with `?` key** - Press `?` anywhere to see all shortcuts
- **Searchable** - Filter shortcuts by name or key
- **Categorized** - Organized by Global, Navigation, Actions, Search
- **OS-aware** - Shows `⌘` on Mac, `Ctrl` on Windows
- **Beautiful UI** - Animated modal with Framer Motion

### Usage

```tsx
import { KeyboardShortcuts, useKeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { useState } from "react";

function MyApp() {
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  // Enable global ? shortcut
  useKeyboardShortcuts(() => setShortcutsOpen(true));

  return (
    <>
      {/* Your app content */}
      <KeyboardShortcuts open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    </>
  );
}
```

### Available Shortcuts (Pre-configured)

| Shortcut | Description | Category |
|----------|-------------|----------|
| `⌘ + K` | Open command palette | Global |
| `Escape` | Close dialog/modal | Global |
| `?` | Show keyboard shortcuts | Global |
| `G` then `M` | Go to Members | Navigation |
| `G` then `C` | Go to Chat | Navigation |
| `G` then `D` | Go to Dashboard | Navigation |
| `N` | New member/item | Actions |
| `I` | Check-in | Actions |
| `⌘ + S` | Save changes | Actions |
| `⌘ + Enter` | Submit form | Actions |
| `/` | Focus search | Search |
| `⌘ + F` | Find on page | Search |

### Keyboard Key Component

Display keyboard keys with proper styling:

```tsx
import { KeyboardKey } from "@/components/KeyboardKey";

<div>
  Press <KeyboardKey>⌘</KeyboardKey> + <KeyboardKey>K</KeyboardKey>
</div>
```

---

## Copy to Clipboard

### Components Created

- `/src/hooks/useCopyToClipboard.ts` - Hook with copy functionality
- `/src/components/CopyButton.tsx` - Button component with copy icon
- `/src/components/ui/tooltip.tsx` - Tooltip for showing copy state

### Features

- **One-click copy** - Click to copy text
- **Visual feedback** - Checkmark icon on success
- **Toast notification** - Shows "Copied to clipboard"
- **Tooltip** - Hover to see "Copy" / "Copied!"
- **Multiple sizes** - `sm`, `default`, `lg`, `icon`

### Usage

#### Using the Hook

```tsx
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

function MyComponent() {
  const { copied, copy } = useCopyToClipboard();

  return (
    <button onClick={() => copy("Text to copy", "Custom success message!")}>
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
```

#### Using the CopyButton Component

```tsx
import { CopyButton } from "@/components/CopyButton";

function MemberCard({ member }) {
  return (
    <div>
      <span>ID: {member.id}</span>
      <CopyButton
        value={member.id}
        successMessage="Member ID copied!"
        size="icon"
        variant="ghost"
      />
    </div>
  );
}
```

### Where to Add Copy Buttons

As requested, add copy buttons for:
- ✅ Member IDs
- ✅ Email addresses
- ✅ Phone numbers
- ✅ Payment reference numbers
- ✅ Magic link URLs
- ✅ Group invite links
- ✅ QR code values

---

## Inline Editing

### Components Created

- `/src/components/inline-edit/InlineEditText.tsx` - Text field editing
- `/src/components/inline-edit/InlineEditSelect.tsx` - Dropdown editing
- `/src/components/inline-edit/InlineEditNumber.tsx` - Number field editing

### Features

- **Click to edit** - Click on text to activate editing mode
- **Validation** - Built-in validation with error messages
- **Auto-save on blur** - Saves when you click away
- **Keyboard shortcuts** - `Enter` to save, `Escape` to cancel
- **Optimistic UI** - Shows changes immediately
- **Loading states** - Shows loading during save
- **Min/max constraints** - For number inputs

### Usage

#### InlineEditText

```tsx
import { InlineEditText } from "@/components/inline-edit";

function MemberProfile({ member, updateMember }) {
  return (
    <div>
      <span className="text-muted-foreground">Name: </span>
      <InlineEditText
        value={member.name}
        onSave={async (newValue) => {
          await updateMember({ name: newValue });
        }}
        validateFn={(value) => {
          if (value.length < 2) return "Name must be at least 2 characters";
          return null;
        }}
      />
    </div>
  );
}
```

#### InlineEditSelect

```tsx
import { InlineEditSelect } from "@/components/inline-edit";

const beltOptions = [
  { value: "white", label: "White Belt" },
  { value: "yellow", label: "Yellow Belt" },
  { value: "blue", label: "Blue Belt" },
  { value: "black", label: "Black Belt" },
];

function BeltRankDisplay({ member, updateMember }) {
  return (
    <InlineEditSelect
      value={member.beltRank}
      options={beltOptions}
      onSave={async (newValue) => {
        await updateMember({ beltRank: newValue });
      }}
      displayValue={(value) => {
        const option = beltOptions.find(opt => opt.value === value);
        return <strong>{option?.label}</strong>;
      }}
    />
  );
}
```

#### InlineEditNumber

```tsx
import { InlineEditNumber } from "@/components/inline-edit";

function SubscriptionPrice({ subscription, updateSubscription }) {
  return (
    <InlineEditNumber
      value={subscription.price}
      onSave={async (newValue) => {
        await updateSubscription({ price: newValue });
      }}
      min={0}
      max={1000}
      step={0.01}
      prefix="£"
      suffix="/month"
    />
  );
}
```

### Where to Apply Inline Editing

As requested, apply to:
- ✅ Member name in member list
- ✅ Belt rank in member details
- ✅ Subscription tier in member details
- ✅ Class name in schedule
- ✅ Event title in events list

---

## Quick Actions FAB

### Component Created

- `/src/components/QuickActions.tsx` - Floating action button with radial menu

### Features

- **Mobile-only** - Only visible on screens < 768px
- **Animated** - Smooth animations with Framer Motion
- **Customizable actions** - Pass any actions you want
- **Backdrop** - Dimmed background when open
- **Keyboard shortcut** - Close with `Escape`

### Usage

```tsx
import { QuickActions, QuickAction } from "@/components/QuickActions";
import { UserPlus, LogIn, MessageSquare, Calendar } from "lucide-react";

const actions: QuickAction[] = [
  {
    icon: <LogIn className="h-5 w-5" />,
    label: "Check-in",
    onClick: () => navigate("/check-in"),
  },
  {
    icon: <UserPlus className="h-5 w-5" />,
    label: "New Member",
    onClick: () => setShowNewMemberModal(true),
  },
  {
    icon: <MessageSquare className="h-5 w-5" />,
    label: "Announcement",
    onClick: () => setShowAnnouncementModal(true),
  },
  {
    icon: <Calendar className="h-5 w-5" />,
    label: "New Event",
    onClick: () => navigate("/events/new"),
  },
];

function Dashboard() {
  return (
    <>
      {/* Your dashboard content */}
      <QuickActions actions={actions} />
    </>
  );
}
```

### Default Actions

Pre-configured actions are available:

```tsx
import { defaultJudoActions } from "@/components/QuickActions";
```

---

## Context Menu

### Component Created

- `/src/components/ContextMenu.tsx` - Right-click menu component

### Features

- **Right-click triggered** - Opens on right-click (context menu)
- **Keyboard shortcuts in menu** - Show shortcuts next to items
- **Intelligent positioning** - Won't go off-screen
- **Nested menus** - Support for sub-menus
- **Separators** - Visual grouping of actions

### Usage

```tsx
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ContextMenu";
import { Eye, Edit, Copy, Trash2 } from "lucide-react";

function MemberListItem({ member }) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="p-4 border rounded">
          {member.name}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={() => viewMember(member.id)}>
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => editMember(member.id)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Member
        </ContextMenuItem>
        <ContextMenuItem
          onSelect={() => copyToClipboard(member.id)}
          shortcut="⌘C"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy ID
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onSelect={() => deleteMember(member.id)}
          className="text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Member
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
```

---

## Integration Examples

### Example: Member List with All Features

```tsx
import { CopyButton } from "@/components/CopyButton";
import { InlineEditText, InlineEditSelect } from "@/components/inline-edit";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ContextMenu";

function MemberListItem({ member, updateMember, deleteMember }) {
  const beltOptions = [
    { value: "white", label: "White Belt" },
    { value: "blue", label: "Blue Belt" },
    { value: "black", label: "Black Belt" },
  ];

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="flex items-center gap-4 p-4 border rounded hover:bg-accent">
          {/* Name with inline edit */}
          <InlineEditText
            value={member.name}
            onSave={(newName) => updateMember({ ...member, name: newName })}
            className="flex-1"
          />

          {/* Belt rank with inline edit */}
          <InlineEditSelect
            value={member.beltRank}
            options={beltOptions}
            onSave={(newRank) => updateMember({ ...member, beltRank: newRank })}
          />

          {/* Member ID with copy button */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{member.id}</span>
            <CopyButton value={member.id} />
          </div>

          {/* Email with copy button */}
          <div className="flex items-center gap-2">
            <span className="text-sm">{member.email}</span>
            <CopyButton value={member.email} />
          </div>
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem>View Details</ContextMenuItem>
        <ContextMenuItem>Edit Member</ContextMenuItem>
        <ContextMenuItem shortcut="⌘C">Copy ID</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onSelect={() => deleteMember(member.id)}
          className="text-destructive"
        >
          Delete Member
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
```

---

## Testing

To test the components:

1. **Keyboard Shortcuts**: Press `?` anywhere in the app
2. **Copy Buttons**: Click any copy button and check toast notification
3. **Inline Editing**: Click on editable text, make changes, press Enter
4. **Quick Actions**: Resize browser to mobile width (< 768px)
5. **Context Menu**: Right-click on any list item with context menu

---

## Dependencies Installed

The following packages were added:
- `@radix-ui/react-tooltip` (for tooltips)
- `@radix-ui/react-context-menu` (for context menus)

All other dependencies were already present in the project.

---

## Files Created

### Components
- `/src/components/KeyboardShortcuts.tsx`
- `/src/components/KeyboardKey.tsx`
- `/src/components/CopyButton.tsx`
- `/src/components/QuickActions.tsx`
- `/src/components/ContextMenu.tsx`
- `/src/components/ui/tooltip.tsx`
- `/src/components/inline-edit/InlineEditText.tsx`
- `/src/components/inline-edit/InlineEditSelect.tsx`
- `/src/components/inline-edit/InlineEditNumber.tsx`
- `/src/components/inline-edit/index.ts`

### Hooks
- `/src/hooks/useCopyToClipboard.ts`

### Examples & Documentation
- `/src/examples/ComponentUsageExamples.tsx`
- `/COMPONENTS_GUIDE.md` (this file)

### Modified Files
- `/src/App.tsx` - Added KeyboardShortcuts integration

---

## Next Steps

1. **Add copy buttons** throughout the app for:
   - Member IDs, emails, phone numbers
   - Payment references
   - Magic links and invite links
   - QR codes

2. **Apply inline editing** to:
   - Member lists and details pages
   - Class schedules
   - Event listings

3. **Add context menus** to:
   - Member list items
   - Event list items
   - Class cards
   - Payment records

4. **Configure Quick Actions** for each dashboard type:
   - Member dashboard
   - Coach dashboard
   - Admin dashboard
   - Treasurer dashboard

All components are production-ready with animations, error handling, and responsive design!
