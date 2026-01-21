# Command Palette System Architecture

## Component Hierarchy

```
App.tsx (Root)
│
├─── ThemeProvider
│    │
│    ├─── BrowserRouter
│    │    └─── Routes (All pages)
│    │
│    ├─── Toaster (Notifications)
│    │
│    └─── CommandPalette ⭐ (Global)
│         │
│         ├─── Command (cmdk)
│         │    ├─── Command.Input
│         │    ├─── Command.List
│         │    │    ├─── Command.Empty
│         │    │    └─── Command.Group (x5)
│         │    │         └─── Command.Item (x20+)
│         │    └─── Footer (shortcuts hint)
│         │
│         ├─── Floating Button (trigger)
│         │
│         └─── KeyboardShortcutsModal ⭐
│              ├─── Header
│              ├─── Shortcuts Grid
│              └─── Platform Info
│
└─── Navigation.tsx
     │
     ├─── Logo
     ├─── GlobalSearch ⭐ (Desktop only)
     │    ├─── Search Input
     │    └─── Dropdown
     │         ├─── Recent Searches
     │         ├─── Trending Suggestions
     │         └─── Open Command Palette Button
     │
     ├─── Nav Links
     ├─── Theme Toggle
     └─── User Menu
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interactions                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Keyboard Events                          │
│  • Cmd+K / Ctrl+K  →  Open Command Palette                  │
│  • ↑ ↓             →  Navigate Commands                     │
│  • Enter           →  Execute Command                        │
│  • Esc             →  Close Palette                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Command Palette State                      │
│  • open: boolean                                             │
│  • search: string                                            │
│  • recentCommands: string[]                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Command Filtering                         │
│  1. Filter by role (permission check)                        │
│  2. Filter by search query (fuzzy match)                     │
│  3. Group by category                                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Command Execution                          │
│  • Navigation  →  navigate(path)                             │
│  • Actions     →  openModal() / dispatch()                   │
│  • Search      →  openSearchPage()                           │
│  • Theme       →  setTheme()                                 │
│  • Help        →  openShortcutsModal()                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Side Effects                              │
│  • Update localStorage (recent commands)                     │
│  • Close command palette                                     │
│  • Navigate to new route                                     │
│  • Show toast notification                                   │
└─────────────────────────────────────────────────────────────┘
```

## State Management

```
┌──────────────────────────────────────────────────────────────┐
│                     Local State (React)                       │
├──────────────────────────────────────────────────────────────┤
│  CommandPalette:                                              │
│    • open: boolean                                            │
│    • search: string                                           │
│    • recentCommands: string[]                                 │
│    • shortcutsModalOpen: boolean                              │
│                                                               │
│  GlobalSearch:                                                │
│    • focused: boolean                                         │
│    • searchValue: string                                      │
│    • recentSearches: string[]                                 │
│                                                               │
│  KeyboardShortcutsModal:                                      │
│    • open: boolean                                            │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                   Context (React Context)                     │
├──────────────────────────────────────────────────────────────┤
│  ThemeContext:                                                │
│    • theme: "light" | "dark" | "system"                       │
│    • setTheme: (theme) => void                                │
│                                                               │
│  AuthContext:                                                 │
│    • user: User | null                                        │
│    • role: UserRole | null                                    │
│    • hasPermission: (perm) => boolean                         │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│               Persistent State (localStorage)                 │
├──────────────────────────────────────────────────────────────┤
│  • judo_recent_commands: string[]                             │
│  • judo_recent_searches: string[]                             │
│  • judo-theme: "light" | "dark" | "system"                    │
└──────────────────────────────────────────────────────────────┘
```

## Command Registration Flow

```
1. Define Command
   ↓
{
  id: "nav-dashboard",
  label: "Go to Dashboard",
  description: "View your training progress",
  icon: LayoutDashboard,
  action: () => navigate("/member"),
  group: "navigation",
  keywords: ["home", "dashboard"],
  requiresRole: ["member", "coach", "admin"]
}
   ↓
2. Filter by Role
   ↓
role === "member" && requiresRole.includes("member")
   ↓
3. Add to Available Commands
   ↓
4. User Searches "dash"
   ↓
5. Fuzzy Match (label + keywords)
   ↓
6. Display in Group
   ↓
7. User Selects & Executes
   ↓
8. Save to Recent Commands
   ↓
9. Execute Action
   ↓
10. Close Palette
```

## Integration Points

```
┌─────────────────────────────────────────────────────────────┐
│                      App.tsx                                 │
│  • Wraps entire app                                          │
│  • Provides CommandPalette globally                          │
│  • Always available via Cmd+K                                │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
         ┌──────────────────┐  ┌──────────────────┐
         │  Navigation.tsx  │  │  Any Page/Modal  │
         │  • GlobalSearch  │  │  • Can trigger   │
         │  • Trigger Cmd+K │  │    Cmd+K event   │
         └──────────────────┘  └──────────────────┘
                    │
                    ▼
         ┌──────────────────┐
         │  index.css       │
         │  • cmdk styles   │
         │  • Theming       │
         └──────────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend Only                           │
├─────────────────────────────────────────────────────────────┤
│  UI Framework:       React 18 + TypeScript                   │
│  Routing:            React Router DOM                        │
│  Styling:            Tailwind CSS v4                         │
│  Animations:         Framer Motion                           │
│  Icons:              Lucide React                            │
│  Command Palette:    cmdk                                    │
│  State:              React Context + Hooks                   │
│  Storage:            localStorage                            │
│  Build:              Vite                                    │
└─────────────────────────────────────────────────────────────┘
```

## Performance Optimization

```
1. Lazy Rendering
   • Command palette only renders when open
   • Global search dropdown only when focused
   • Shortcuts modal only when triggered

2. Virtual Scrolling
   • cmdk uses virtual scrolling for large lists
   • Only visible commands are in DOM

3. Debounced Search
   • cmdk handles search debouncing internally
   • No unnecessary re-renders

4. Memoization
   • Recent commands read once, cached
   • Role filtering computed once

5. GPU Acceleration
   • Framer Motion uses transform/opacity
   • Smooth 60fps animations

6. Code Splitting
   • Components can be lazy loaded
   • Minimal bundle impact (~10kb for cmdk)
```

## Accessibility Tree

```
<body>
  ├── [role="application"]
  │   └── CommandPalette
  │       ├── [role="dialog"] (modal)
  │       │   ├── [role="combobox"] (search)
  │       │   └── [role="listbox"] (commands)
  │       │       └── [role="option"] × N (each command)
  │       │
  │       ├── [role="button"] (floating trigger)
  │       │   └── [aria-label="Open command palette"]
  │       │
  │       └── KeyboardShortcutsModal
  │           └── [role="dialog"]
  │               └── [aria-labelledby="shortcuts-title"]
  │
  └── GlobalSearch
      ├── [role="search"]
      │   └── [role="combobox"]
      └── [role="listbox"] (suggestions)
          └── [role="option"] × N
```

## Security Considerations

```
1. Role-Based Access Control
   • Commands filtered by user role
   • No sensitive operations exposed to unauthorized users

2. XSS Prevention
   • All user input sanitized
   • React's built-in XSS protection

3. localStorage Security
   • Only stores non-sensitive data (UI preferences)
   • Recent commands are IDs, not sensitive data

4. No Backend Dependency
   • Pure frontend, no API calls
   • No CSRF/injection risks

5. CSP Compatible
   • No inline scripts
   • No eval() usage
```

## Future Enhancements

```
Phase 1 (Current) ✅
├── Basic command palette
├── Keyboard shortcuts
├── Role-based filtering
└── Documentation

Phase 2 (Next)
├── Connect to backend search
├── Command analytics
├── Custom shortcuts
└── Command history sync

Phase 3 (Future)
├── AI-powered suggestions
├── Voice commands
├── Command macros
└── Plugin system
```

---

**Architecture Version**: 1.0
**Last Updated**: January 2026
**Maintained by**: JUDO Club Development Team
