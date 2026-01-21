/**
 * Component Usage Examples
 *
 * This file demonstrates how to use the newly implemented components:
 * - CopyButton
 * - KeyboardKey
 * - InlineEditText, InlineEditSelect, InlineEditNumber
 * - QuickActions
 * - ContextMenu
 * - KeyboardShortcuts (already integrated in App.tsx)
 */

import { useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { CopyButton } from "../components/CopyButton";
import { KeyboardKey } from "../components/KeyboardKey";
import { InlineEditText, InlineEditSelect, InlineEditNumber } from "../components/inline-edit";
import { QuickActions, type QuickAction } from "../components/QuickActions";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "../components/ContextMenu";
import { Card } from "../components/ui/card";

// ============================================================================
// Example 1: CopyButton Usage
// ============================================================================

export function CopyButtonExample() {
  const memberId = "MBR-2024-001";
  const email = "john.doe@example.com";

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Copy Button Examples</h3>

      {/* Member ID with copy button */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Member ID:</span>
        <span className="font-mono">{memberId}</span>
        <CopyButton value={memberId} successMessage="Member ID copied!" />
      </div>

      {/* Email with copy button */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Email:</span>
        <span>{email}</span>
        <CopyButton value={email} successMessage="Email copied!" />
      </div>

      {/* Different sizes */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Different sizes:</span>
        <CopyButton value="test" size="sm" />
        <CopyButton value="test" size="default" />
        <CopyButton value="test" size="lg" />
      </div>
    </Card>
  );
}

// ============================================================================
// Example 2: KeyboardKey Usage
// ============================================================================

export function KeyboardKeyExample() {
  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Keyboard Key Examples</h3>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span>Open command palette:</span>
          <KeyboardKey>⌘</KeyboardKey>
          <span>+</span>
          <KeyboardKey>K</KeyboardKey>
        </div>

        <div className="flex items-center gap-2">
          <span>Save:</span>
          <KeyboardKey>Ctrl</KeyboardKey>
          <span>+</span>
          <KeyboardKey>S</KeyboardKey>
        </div>

        <div className="flex items-center gap-2">
          <span>Escape:</span>
          <KeyboardKey>Esc</KeyboardKey>
        </div>

        <div className="flex items-center gap-2">
          <span>Navigation:</span>
          <KeyboardKey>G</KeyboardKey>
          <span>then</span>
          <KeyboardKey>M</KeyboardKey>
        </div>
      </div>
    </Card>
  );
}

// ============================================================================
// Example 3: Inline Editing Usage
// ============================================================================

export function InlineEditExample() {
  const [memberName, setMemberName] = useState("John Doe");
  const [beltRank, setBeltRank] = useState("blue");
  const [age, setAge] = useState(25);

  const beltOptions = [
    { value: "white", label: "White Belt" },
    { value: "yellow", label: "Yellow Belt" },
    { value: "orange", label: "Orange Belt" },
    { value: "green", label: "Green Belt" },
    { value: "blue", label: "Blue Belt" },
    { value: "brown", label: "Brown Belt" },
    { value: "black", label: "Black Belt" },
  ];

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Inline Edit Examples</h3>

      {/* Text editing */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground w-24">Name:</span>
        <InlineEditText
          value={memberName}
          onSave={async (value) => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            setMemberName(value);
          }}
          validateFn={(value) => {
            if (value.length < 2) return "Name must be at least 2 characters";
            return null;
          }}
        />
      </div>

      {/* Select editing */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground w-24">Belt Rank:</span>
        <InlineEditSelect
          value={beltRank}
          options={beltOptions}
          onSave={async (value) => {
            await new Promise(resolve => setTimeout(resolve, 500));
            setBeltRank(value);
          }}
          displayValue={(value) => {
            const option = beltOptions.find(opt => opt.value === value);
            return <span className="font-medium">{option?.label}</span>;
          }}
        />
      </div>

      {/* Number editing */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground w-24">Age:</span>
        <InlineEditNumber
          value={age}
          onSave={async (value) => {
            await new Promise(resolve => setTimeout(resolve, 500));
            setAge(value);
          }}
          min={5}
          max={100}
          suffix=" years"
        />
      </div>
    </Card>
  );
}

// ============================================================================
// Example 4: Context Menu Usage
// ============================================================================

export function ContextMenuExample() {
  const memberData = {
    id: "MBR-2024-001",
    name: "John Doe",
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Context Menu Example</h3>

      <ContextMenu>
        <ContextMenuTrigger>
          <div className="border rounded-lg p-4 cursor-pointer hover:bg-accent">
            <p className="font-medium">{memberData.name}</p>
            <p className="text-sm text-muted-foreground">{memberData.id}</p>
            <p className="text-xs text-muted-foreground mt-2">Right-click for options</p>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </ContextMenuItem>
          <ContextMenuItem>
            <Edit className="h-4 w-4 mr-2" />
            Edit Member
          </ContextMenuItem>
          <ContextMenuItem shortcut="⌘C">
            Copy ID
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Member
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </Card>
  );
}

// ============================================================================
// Example 5: Quick Actions (Mobile FAB) Usage
// ============================================================================

export function QuickActionsExample() {
  const actions: QuickAction[] = [
    {
      icon: <span>👤</span>,
      label: "New Member",
      onClick: () => console.log("New Member clicked"),
    },
    {
      icon: <span>✅</span>,
      label: "Check-in",
      onClick: () => console.log("Check-in clicked"),
    },
    {
      icon: <span>📢</span>,
      label: "Announcement",
      onClick: () => console.log("Announcement clicked"),
    },
    {
      icon: <span>📅</span>,
      label: "New Event",
      onClick: () => console.log("New Event clicked"),
    },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Quick Actions FAB</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Only visible on mobile devices (screen width &lt; 768px)
      </p>
      <p className="text-sm text-muted-foreground">
        To test: Resize your browser window to mobile size or use device emulation in DevTools
      </p>

      {/* This would normally be placed at app level, but shown here for demo */}
      <QuickActions actions={actions} />
    </Card>
  );
}

// ============================================================================
// Combined Example Page
// ============================================================================

export default function ComponentUsageExamplesPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Component Usage Examples</h1>
        <p className="text-muted-foreground">
          Demonstrations of all newly implemented components
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CopyButtonExample />
        <KeyboardKeyExample />
      </div>

      <InlineEditExample />
      <ContextMenuExample />
      <QuickActionsExample />

      <Card className="p-6 bg-muted/50">
        <h3 className="text-lg font-semibold mb-2">Keyboard Shortcuts</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Press <KeyboardKey>?</KeyboardKey> anywhere in the app to see all available keyboard shortcuts
        </p>
        <p className="text-sm text-muted-foreground">
          The keyboard shortcuts overlay is already integrated globally in App.tsx
        </p>
      </Card>
    </div>
  );
}
