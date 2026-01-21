/**
 * ACCESSIBILITY EXAMPLES
 *
 * This file demonstrates proper usage of accessibility features
 * implemented in the JUDO app. Use these examples as a reference
 * when building new components.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccessibleCard } from "@/components/AccessibleCard";
import { FocusTrap } from "@/components/FocusTrap";
import {
  useKeyboardShortcut,
  useKeyboardShortcuts,
  useCommonShortcuts,
  formatShortcut,
} from "@/hooks/useKeyboardShortcuts";
import {
  useEscapeKey,
  useEnterKey,
  useKeyboardAccessible,
} from "@/hooks/useKeyboardNavigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Search, Settings, X } from "lucide-react";

// ============================================================================
// EXAMPLE 1: Icon-Only Buttons with ARIA Labels
// ============================================================================

export function IconButtonExample() {
  return (
    <div className="flex gap-2">
      {/* ✅ GOOD: Icon button with aria-label */}
      <Button
        variant="ghost"
        size="icon"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </Button>

      {/* ✅ GOOD: Icon button with descriptive aria-label */}
      <Button
        variant="ghost"
        size="icon"
        aria-label="Open settings menu"
      >
        <Settings className="h-4 w-4" />
      </Button>

      {/* ❌ BAD: Icon button without aria-label */}
      {/* <Button variant="ghost" size="icon">
        <X className="h-4 w-4" />
      </Button> */}
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Form Fields with Proper Labels
// ============================================================================

export function FormFieldExample() {
  return (
    <form className="space-y-4">
      {/* ✅ GOOD: Label associated with input */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          aria-describedby="email-hint"
        />
        <p id="email-hint" className="text-sm text-muted-foreground">
          We'll never share your email with anyone else
        </p>
      </div>

      {/* ✅ GOOD: Required field with aria-required */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          required
          aria-required="true"
          aria-describedby="name-error"
        />
        <p id="name-error" className="text-sm text-destructive" role="alert">
          {/* Error message appears here */}
        </p>
      </div>

      {/* ❌ BAD: Input without label */}
      {/* <Input placeholder="Enter your name" /> */}
    </form>
  );
}

// ============================================================================
// EXAMPLE 3: Accessible Clickable Cards
// ============================================================================

export function ClickableCardExample() {
  const handleClick = () => {
    console.log("Card clicked");
  };

  return (
    <div className="space-y-4">
      {/* ✅ GOOD: Using AccessibleCard component */}
      <AccessibleCard
        onClick={handleClick}
        ariaLabel="View member profile for John Doe"
        className="hover:shadow-lg"
      >
        <CardHeader>
          <CardTitle>John Doe</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Blue Belt</p>
        </CardContent>
      </AccessibleCard>

      {/* ✅ GOOD: Manual keyboard support */}
      <Card
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        aria-label="View class details"
        className="cursor-pointer hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring"
      >
        <CardHeader>
          <CardTitle>Monday Training</CardTitle>
        </CardHeader>
      </Card>

      {/* ❌ BAD: Clickable div without keyboard support */}
      {/* <div onClick={handleClick} className="p-4 border rounded">
        Click me (keyboard users can't access this!)
      </div> */}
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Keyboard Shortcuts
// ============================================================================

export function KeyboardShortcutsExample() {
  // Single shortcut
  useKeyboardShortcut("k", () => console.log("Search opened"), { ctrl: true });

  // Multiple shortcuts
  useKeyboardShortcuts([
    {
      key: "s",
      ctrl: true,
      callback: () => console.log("Save"),
      description: "Save changes",
    },
    {
      key: "Escape",
      callback: () => console.log("Close"),
      description: "Close",
    },
  ]);

  // Common shortcuts (Cmd+K, Cmd+/, etc.)
  useCommonShortcuts({
    onSearch: () => console.log("Search opened"),
    onHelp: () => console.log("Show help"),
    onSettings: () => console.log("Open settings"),
  });

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Press {formatShortcut({ key: "K", ctrl: true })} to search
      </p>
      <p className="text-sm text-muted-foreground">
        Press {formatShortcut({ key: "S", ctrl: true })} to save
      </p>
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Modal with Focus Trap
// ============================================================================

export function ModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  // Escape key handler
  useEscapeKey(() => setIsOpen(false), isOpen);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

      {/* ✅ GOOD: Using shadcn Dialog (has focus trap built-in) */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogTitle>Modal Title</DialogTitle>
          <div className="space-y-4">
            <p>Modal content here</p>
            <div className="flex gap-2">
              <Button onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsOpen(false)}>Confirm</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ✅ GOOD: Custom modal with FocusTrap */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <FocusTrap active={isOpen} restoreFocus>
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Custom Modal</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Press Tab to cycle through focusable elements</p>
                <div className="flex gap-2 mt-4">
                  <Button onClick={() => setIsOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsOpen(false)}>Confirm</Button>
                </div>
              </CardContent>
            </Card>
          </FocusTrap>
        </div>
      )}
    </>
  );
}

// ============================================================================
// EXAMPLE 6: Navigation with Keyboard Support
// ============================================================================

export function KeyboardNavigationExample() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const items = ["Item 1", "Item 2", "Item 3", "Item 4"];

  return (
    <div className="space-y-2" role="listbox" aria-label="Example list">
      {items.map((item, index) => {
        const isSelected = index === selectedIndex;
        const props = useKeyboardAccessible(
          () => setSelectedIndex(index),
          { role: "option" }
        );

        return (
          <div
            key={item}
            {...props}
            aria-selected={isSelected}
            className={`p-3 border rounded cursor-pointer ${
              isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent"
            }`}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// EXAMPLE 7: Images with Alt Text
// ============================================================================

export function ImageExample() {
  return (
    <div className="space-y-4">
      {/* ✅ GOOD: Informative image with alt text */}
      <img
        src="/member-photo.jpg"
        alt="Profile photo of Alice Chen, blue belt"
        className="w-24 h-24 rounded-full"
      />

      {/* ✅ GOOD: Decorative image with empty alt */}
      <img
        src="/pattern.svg"
        alt=""
        className="w-full h-24"
        role="presentation"
      />

      {/* ✅ GOOD: Functional image (icon button) */}
      <button type="button" aria-label="Delete item">
        <img src="/trash-icon.svg" alt="" />
      </button>

      {/* ❌ BAD: Image without alt text */}
      {/* <img src="/photo.jpg" /> */}
    </div>
  );
}

// ============================================================================
// EXAMPLE 8: Heading Hierarchy
// ============================================================================

export function HeadingExample() {
  return (
    <div>
      {/* ✅ GOOD: Proper heading order */}
      <h1>Page Title</h1>
      <p>Introduction text</p>

      <h2>Section 1</h2>
      <p>Section content</p>

      <h3>Subsection 1.1</h3>
      <p>Subsection content</p>

      <h3>Subsection 1.2</h3>
      <p>Subsection content</p>

      <h2>Section 2</h2>
      <p>Section content</p>

      {/* ❌ BAD: Skipping heading levels */}
      {/* <h1>Title</h1>
      <h3>Subsection (should be h2!)</h3> */}
    </div>
  );
}

// ============================================================================
// EXAMPLE 9: Dynamic Content with ARIA Live
// ============================================================================

export function LiveRegionExample() {
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-4">
      <Button
        onClick={() => setMessage("Action completed successfully!")}
      >
        Perform Action
      </Button>

      {/* ✅ GOOD: Polite live region for non-urgent updates */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="text-sm text-muted-foreground"
      >
        {message}
      </div>

      {/* ✅ GOOD: Assertive live region for urgent updates */}
      <div
        role="alert"
        aria-live="assertive"
        className="text-sm text-destructive"
      >
        {/* Error messages go here */}
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 10: Loading States
// ============================================================================

export function LoadingExample() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-4">
      {/* ✅ GOOD: Button with loading state */}
      <Button
        onClick={() => setIsLoading(true)}
        disabled={isLoading}
        isLoading={isLoading}
      >
        {isLoading ? "Loading..." : "Submit"}
      </Button>

      {/* ✅ GOOD: Loading spinner with aria-label */}
      {isLoading && (
        <div
          className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"
          role="status"
          aria-label="Loading"
        >
          <span className="sr-only">Loading...</span>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// COMPLETE EXAMPLE: Accessible Dashboard Card
// ============================================================================

export function DashboardCardExample() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Keyboard support
  useEnterKey(() => setIsExpanded(!isExpanded), true);

  return (
    <AccessibleCard
      onClick={() => setIsExpanded(!isExpanded)}
      ariaLabel="Attendance statistics - Click to expand"
      className="transition-all"
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Attendance</span>
          <Button
            variant="ghost"
            size="icon"
            aria-label={isExpanded ? "Collapse card" : "Expand card"}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            <X className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-45" : ""}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">47</p>
        <p className="text-sm text-muted-foreground">Total sessions this year</p>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t" aria-live="polite">
            <p>Additional details appear here...</p>
          </div>
        )}
      </CardContent>
    </AccessibleCard>
  );
}

// ============================================================================
// EXPORT ALL EXAMPLES
// ============================================================================

export default function AccessibilityExamples() {
  return (
    <div className="container mx-auto p-8 space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-4">Accessibility Examples</h1>
        <p className="text-muted-foreground">
          Interactive examples of accessibility features in the JUDO app
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-4">Icon Buttons</h2>
        <IconButtonExample />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Form Fields</h2>
        <FormFieldExample />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Clickable Cards</h2>
        <ClickableCardExample />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Keyboard Shortcuts</h2>
        <KeyboardShortcutsExample />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Navigation</h2>
        <KeyboardNavigationExample />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Dashboard Card</h2>
        <DashboardCardExample />
      </section>
    </div>
  );
}
