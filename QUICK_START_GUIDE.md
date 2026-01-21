# Quick Start Guide - Command Palette System

Get up and running with the new Command Palette in 5 minutes!

---

## 🚀 Step 1: Start the App

```bash
cd /home/user/JUDO
npm run dev
```

The app will start at `http://localhost:5173`

---

## ⌨️ Step 2: Open Command Palette

Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux)

You should see a beautiful modal appear with a search bar and commands!

---

## 🎯 Step 3: Try Basic Commands

### Navigate to Dashboard
1. Open command palette (`Cmd+K`)
2. Type "dashboard"
3. Press `Enter`
4. You should navigate to the dashboard!

### Toggle Dark Mode
1. Open command palette (`Cmd+K`)
2. Type "theme"
3. Select "Switch to Dark/Light Mode"
4. Press `Enter`
5. Theme should toggle!

### View Keyboard Shortcuts
1. Open command palette (`Cmd+K`)
2. Type "shortcuts"
3. Select "Show Keyboard Shortcuts"
4. Press `Enter`
5. Shortcuts modal opens!

---

## 🔍 Step 4: Try Global Search

Look for the search bar in the top navigation (desktop only):

1. Click on the search bar
2. See recent searches and suggestions
3. Click "Open Command Palette" at the bottom
4. Command palette opens!

---

## 📱 Step 5: Try Floating Button

Scroll to the bottom-right of any page:

1. See the "Quick Actions" button
2. Click it
3. Command palette opens!

---

## ✅ Step 6: Test Recent Commands

1. Open command palette
2. Execute any command (e.g., "Go to Chat")
3. Open palette again
4. See "Recent" section at top
5. Your previous command should be there!

---

## 🎨 Step 7: Verify Different Roles

The DEV_MODE in `/home/user/JUDO/src/lib/auth.tsx` is set to `true`.

To test different roles:
1. Edit `auth.tsx`
2. Change `DEV_USER_ROLE` to different roles:
   - `"member"` - See basic commands
   - `"coach"` - See coaching commands
   - `"treasurer"` - See payment commands
   - `"super_admin"` - See all commands
3. Refresh the app
4. Open command palette
5. See role-specific commands!

---

## 🐛 Troubleshooting

### Command Palette Won't Open
- **Check**: Press `Cmd+K` (not Ctrl on Mac)
- **Check**: Browser console for errors (F12)
- **Try**: Click floating "Quick Actions" button instead

### No Commands Showing
- **Check**: You're logged in
- **Check**: DEV_MODE is `true` in auth.tsx
- **Try**: Clear browser cache and reload

### Styles Look Broken
- **Check**: Tailwind CSS is building
- **Try**: Restart dev server
- **Try**: Clear browser cache

### Recent Commands Not Saving
- **Check**: localStorage is enabled
- **Check**: Not in private/incognito mode
- **Try**: Check browser privacy settings

---

## 📚 Next Steps

### For Users
1. Read `/home/user/JUDO/KEYBOARD_SHORTCUTS_REFERENCE.md`
2. Memorize `Cmd+K` shortcut
3. Explore all commands
4. Use keyboard navigation

### For Developers
1. Read `/home/user/JUDO/src/components/COMMAND_PALETTE_README.md`
2. Add custom commands for new features
3. Integrate with backend search
4. Add command execution feedback

### For Testers
1. Follow `/home/user/JUDO/INTEGRATION_CHECKLIST.md`
2. Test all commands
3. Test different roles
4. Test dark/light mode
5. Test accessibility

---

## 🎓 Learn More

### Key Concepts

**Command Groups**
- Commands are organized by category
- Navigation, Actions, Search, Theme, Help

**Role-Based Access**
- Commands filtered by user role
- Only see what you can do

**Recent Commands**
- Last 5 commands tracked
- Quick access to frequent actions

**Fuzzy Search**
- Type partial words to find commands
- Example: "dash" finds "Dashboard"

**Keyboard-First**
- Full keyboard navigation
- No mouse required

### Keyboard Shortcuts

```
Cmd+K / Ctrl+K  →  Open palette
↑ ↓             →  Navigate
Enter           →  Execute
Esc             →  Close
```

---

## 🎉 You're Ready!

You now have a powerful command palette system!

### What You Can Do
- Navigate with keyboard
- Execute actions quickly
- Search members/classes/payments
- Toggle theme
- View shortcuts reference

### What's Next
- Connect search to backend
- Add more commands
- Customize styling
- Add analytics

---

## 📞 Need Help?

- **Documentation**: See `COMMAND_PALETTE_README.md`
- **Architecture**: See `ARCHITECTURE_DIAGRAM.md`
- **Testing**: See `INTEGRATION_CHECKLIST.md`
- **Reference**: See `KEYBOARD_SHORTCUTS_REFERENCE.md`

---

**Happy Commanding!** 🚀

Press `Cmd+K` and explore!
