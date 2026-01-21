# Command Palette & Global Search System

A complete keyboard-first command palette system inspired by Linear and Raycast, built with `cmdk` library.

## Features

### Command Palette (`CommandPalette.tsx`)
- **Keyboard Shortcut**: Open with `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux)
- **Beautiful Modal**: Backdrop blur, smooth animations with Framer Motion
- **Grouped Commands**: Navigation, Actions, Search, Theme, Help
- **Keyboard Navigation**: Arrow keys, Enter to select, ESC to close
- **Recent Commands**: Automatically tracks last 5 commands
- **Fuzzy Search**: Built-in search with keyword matching
- **Role-Based Access**: Commands filtered by user role permissions
- **Floating Action Button**: Optional quick access button (bottom-right)

### Global Search (`GlobalSearch.tsx`)
- **Header Integration**: Can be placed in navigation bar
- **Recent Searches**: Stores last 5 searches in localStorage
- **Trending Suggestions**: Shows popular search queries
- **Command Palette Integration**: Quick link to open full command palette
- **Auto-focus Behavior**: Optional direct command palette opening

## Installation

Already installed! The system is integrated into:
- `/home/user/JUDO/src/App.tsx` - CommandPalette at root level
- `/home/user/JUDO/src/components/Navigation.tsx` - GlobalSearch in header

## Usage

### Opening the Command Palette

1. **Keyboard Shortcut**: Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux)
2. **Floating Button**: Click the "Quick Actions" button (bottom-right)
3. **From Global Search**: Click "Open Command Palette" in search dropdown

### Available Commands

#### Navigation
- Go to Dashboard
- Go to Chat
- Go to Coach Dashboard (coaches/admins only)
- Go to Treasurer Dashboard (treasurer/admins only)
- Go to Content Manager (content managers/admins only)
- Go to Admin Panel (super admins only)

#### Quick Actions
- Add New Member (treasurer/admins only)
- Check In Member (coaches/admins only)
- Send Announcement (content managers/admins only)
- Create Event (content managers/admins only)
- Upload Media (content managers/admins only)

#### Search
- Search Members
- Search Classes
- Search Payments (treasurer/admins only)

#### Appearance
- Toggle Dark/Light Mode

#### Help
- Show Keyboard Shortcuts

## Customization

### Adding New Commands

Edit `/home/user/JUDO/src/components/CommandPalette.tsx`:

```typescript
const commands: CommandItem[] = [
  // ... existing commands
  {
    id: "your-command-id",
    label: "Your Command Label",
    description: "What this command does",
    icon: YourIcon, // from lucide-react
    action: () => {
      // Your action here
      navigate("/your-route");
      // or open a modal
      // or dispatch an action
    },
    group: "actions", // navigation | actions | search | theme | help
    keywords: ["search", "terms"],
    requiresRole: ["coach", "super_admin"], // optional
  },
];
```

### Styling

The command palette uses your existing design system:
- Tailwind CSS classes
- CSS variables from `index.css`
- Dark mode support via `ThemeProvider`
- Custom cmdk styles in `index.css`

### Recent Commands

Recent commands are automatically tracked and stored in localStorage:
- Key: `judo_recent_commands`
- Max: 5 commands
- Cleared when user logs out (optional)

### Global Search Configuration

Edit `/home/user/JUDO/src/components/GlobalSearch.tsx`:

```typescript
// Add trending searches
const TRENDING_SEARCHES = [
  "Your trending search",
  "Another popular query",
];

// Adjust max recent searches
const MAX_RECENT_SEARCHES = 5; // Change as needed
```

## Design Decisions

### Why cmdk?
- Battle-tested by Linear, Vercel, and others
- Excellent keyboard navigation
- Built-in fuzzy search
- Accessible by default
- Lightweight (~10kb)

### Role-Based Filtering
Commands are filtered based on user role to prevent showing actions users can't perform:
```typescript
const availableCommands = commands.filter((cmd) => {
  if (!cmd.requiresRole) return true;
  return role && cmd.requiresRole.includes(role);
});
```

### Recent Commands vs Recent Searches
- **Recent Commands**: Actions taken via command palette
- **Recent Searches**: Search queries in global search bar
- Both stored separately in localStorage

## Accessibility

- Full keyboard navigation
- ARIA labels and descriptions
- Focus management (returns focus after closing)
- Screen reader friendly
- Escape key closes modal
- Click outside to close

## Performance

- Command palette only renders when open
- Global search dropdown only renders when focused
- LocalStorage reads are memoized
- Framer Motion animations are GPU-accelerated
- cmdk uses virtual scrolling for large lists

## Future Enhancements

- [ ] Connect search to actual backend queries
- [ ] Add command history persistence across sessions
- [ ] Add command execution confirmation for destructive actions
- [ ] Add command palette analytics
- [ ] Add custom command shortcuts (beyond Cmd+K)
- [ ] Add command categories expansion/collapse
- [ ] Add command icons customization
- [ ] Add command execution feedback (success/error toasts)

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile: Command palette works but optimized for desktop

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+K` / `Ctrl+K` | Open command palette |
| `↑` / `↓` | Navigate commands |
| `Enter` | Execute selected command |
| `Esc` | Close command palette |

## File Structure

```
src/
├── components/
│   ├── CommandPalette.tsx       # Main command palette component
│   ├── GlobalSearch.tsx          # Global search bar component
│   └── Navigation.tsx            # Integrated with global search
├── App.tsx                       # CommandPalette integrated here
└── index.css                     # cmdk custom styles
```

## Dependencies

- `cmdk` - Command palette library
- `framer-motion` - Animations
- `lucide-react` - Icons
- `react-router-dom` - Navigation

## Credits

Inspired by:
- [Linear](https://linear.app) - Command palette UX
- [Raycast](https://raycast.com) - Keyboard-first design
- [Vercel](https://vercel.com) - cmdk library

Built with care for the JUDO Club Management System.
