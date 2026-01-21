# JUDO APP - Project Instructions

> Judo Club Manager | University of London at Birkbeck | January 2026

---

## Project Links

| Resource | URL |
|----------|-----|
| **Live Site** | https://judo-club-app.vercel.app |
| **GitHub** | https://github.com/giquina/JUDO |
| **Convex Dashboard** | https://dashboard.convex.dev/t/muhammad-giquina/judo/scintillating-clam-299 |

---

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS v4 + Shadcn/UI
- **Animations:** Framer Motion + Sonner (toasts)
- **Backend:** Convex (real-time database)
- **Payments:** Stripe (to be integrated)
- **Hosting:** Vercel

---

## Current Rating: 8.0/10

### Completed
- UI/UX with animations
- Toast notifications
- Loading states
- Error handling
- Dark mode
- QR check-in system
- All dashboards

### Remaining for 10/10
- Convex auth (magic links)
- Real-time data (replace mock)
- Stripe payments
- PWA support
- Push notifications

---

## Core Principles (Always Active)

### 1. Automatic Strategic Upgrade
- Silently optimize every output to highest standard
- Select the strongest approach without explaining
- Deliver best possible version

### 2. Execution-First
- Perform work yourself - never delegate to user
- Produce complete, bundled, ready-to-use outputs
- Stop only when output is review-ready

### 3. Interview-First (For New Work)
- Ask clarifying questions on ambiguous requests
- Confirm what "done" looks like
- Execute directly when task is routine

### 4. Quality Standard
- Professional, structured, clear
- Suitable for external use
- Mark unknowns as "To Confirm"

---

## Quick Reference

### Always Do
- Optimise every output silently
- Execute work yourself
- Produce complete, bundled outputs
- Anticipate next steps proactively
- Interview first when requirements unclear
- Spec before building on new tasks
- Frame web research as factual tasks
- Include sources and URLs for research

### Never Do
- Explain that you're optimising
- Ask user to do work you can do
- Deliver placeholder or incomplete outputs
- Assume requirements when you can clarify
- Use "act as" or role-play in research prompts
- Invent information
- Stop at discussion — aim for approval-ready outputs

---

## Command Reference

| User Says | Claude Does |
|-----------|-------------|
| `/interview` | Enter interview mode, ask clarifying questions |
| `/spec` | Write spec to disk, request approval |
| `approve` / `proceed` | Begin execution from spec |
| `skip spec` | Bypass spec, execute directly |

---

## Recommended Custom Agents

### 1. `judo-ui-polisher`
**Purpose:** Polish UI components with animations, micro-interactions, and visual enhancements
**Tools:** Read, Edit, Write, Glob, Grep
**Use when:** User says "polish", "improve UI", "make it prettier", "add animations"
**Behavior:**
- Add Framer Motion animations
- Improve color gradients and shadows
- Add hover states and transitions
- Implement loading skeletons
- Add confetti/celebration effects

### 2. `judo-convex-sync`
**Purpose:** Sync mock data with real Convex database functions
**Tools:** Read, Edit, Write, Glob, Grep, Bash
**Use when:** User says "connect convex", "real data", "sync database"
**Behavior:**
- Update components to use Convex queries/mutations
- Replace mock data with real Convex calls
- Handle loading and error states
- Implement optimistic updates

### 3. `judo-stripe-payments`
**Purpose:** Handle all Stripe payment integration
**Tools:** Read, Edit, Write, Bash, WebFetch
**Use when:** User says "payments", "stripe", "checkout", "subscription"
**Behavior:**
- Set up Stripe checkout sessions
- Handle webhooks
- Implement subscription management
- Add payment success/failure UI

### 4. `judo-mobile-optimizer`
**Purpose:** Optimize all pages for mobile devices
**Tools:** Read, Edit, Glob, Grep
**Use when:** User says "mobile", "responsive", "phone", "tablet"
**Behavior:**
- Fix responsive breakpoints
- Improve touch targets
- Optimize images
- Add mobile navigation patterns

### 5. `judo-test-runner`
**Purpose:** Run tests and fix any failures
**Tools:** Bash, Read, Edit
**Use when:** User says "test", "run tests", "check tests"
**Behavior:**
- Run `npm test`
- Analyze failures
- Fix test issues
- Add missing tests

### 6. `judo-deployer`
**Purpose:** Build, test, and deploy to Vercel
**Tools:** Bash, Read
**Use when:** User says "deploy", "push", "go live", "ship it"
**Behavior:**
- Run `npm run build`
- Check for TypeScript errors
- Deploy to Vercel
- Verify deployment

### 7. `judo-feature-builder`
**Purpose:** Build new features end-to-end
**Tools:** Read, Edit, Write, Glob, Grep, Bash
**Use when:** User describes a new feature to build
**Behavior:**
- Create Convex schema updates
- Build React components
- Add routing if needed
- Implement full feature

---

## Recommended Slash Commands

### `/judo-polish`
Quick UI polish on current file/component
```
Analyze the current component and add:
- Framer Motion entrance animations
- Hover/active states
- Better color gradients
- Micro-interactions
- Loading states
```

### `/judo-convex`
Generate Convex function for a feature
```
Create Convex query/mutation for: [feature description]
Include:
- TypeScript types
- Input validation
- Error handling
- Optimistic updates in React
```

### `/judo-component`
Generate new Shadcn-style component
```
Create a new component following project patterns:
- TypeScript with proper types
- Tailwind CSS styling
- Framer Motion animations
- Accessible (a11y compliant)
```

### `/judo-deploy`
Quick deploy sequence
```
1. npm run build
2. Check for errors
3. git add -A && git commit -m "[message]"
4. git push
5. Verify Vercel deployment
```

### `/judo-fix`
Fix TypeScript/lint errors
```
1. Run npm run build
2. Identify all TypeScript errors
3. Fix each error
4. Verify build passes
```

### `/judo-test-role`
Switch DEV_MODE role for testing
```
Update src/lib/auth.tsx DEV_USER_ROLE to: [member|coach|admin]
```

---

## Recommended Hooks

### Pre-commit Hook
`.claude/hooks/pre-commit.sh`:
```bash
#!/bin/bash
# Run before any git commit
npm run build 2>&1 | head -50
if [ $? -ne 0 ]; then
  echo "Build failed. Fix TypeScript errors before committing."
  exit 1
fi
```

### Post-edit Hook
`.claude/hooks/post-edit.sh`:
```bash
#!/bin/bash
# Auto-format after Claude edits files
if command -v npx &> /dev/null; then
  npx prettier --write "$1" 2>/dev/null
fi
```

### Build Hook
`.claude/hooks/build.sh`:
```bash
#!/bin/bash
# Standard build verification
echo "Building project..."
npm run build
if [ $? -eq 0 ]; then
  echo "Build successful!"
else
  echo "Build failed. Check errors above."
  exit 1
fi
```

---

## Development Modes

### DEV_MODE Authentication
Located in `src/lib/auth.tsx`:
```typescript
const DEV_MODE = true;  // Set to false for production
const DEV_USER_ROLE: "member" | "coach" | "admin" = "admin";
```

Test accounts:
- `a.chen@bbk.ac.uk` - Member
- `coach@bbk.ac.uk` - Coach
- `admin@bbk.ac.uk` - Admin

---

## Project Structure

```
src/
├── components/         # Reusable components
│   ├── ui/            # Shadcn UI components
│   ├── Navigation.tsx # App navigation
│   └── ...
├── pages/             # Page components
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── MemberDashboard.tsx
│   ├── CoachDashboard.tsx
│   └── AdminDashboard.tsx
├── lib/               # Utilities
│   └── auth.tsx       # Auth provider
├── types/             # TypeScript types
└── App.tsx            # Main router
convex/                # Convex functions
├── schema.ts          # Database schema
├── members.ts         # Member queries/mutations
├── classes.ts         # Class functions
└── ...
```

---

## Common Tasks

### Add a new page
1. Create `src/pages/[Name]Page.tsx`
2. Add route in `src/App.tsx`
3. Wrap with `<ProtectedRoute>` if needed
4. Add to navigation

### Add Convex function
1. Define in `convex/[domain].ts`
2. Add to schema if new table
3. Use `useQuery`/`useMutation` in React
4. Handle loading/error states

### Fix TypeScript errors
```bash
npm run build 2>&1 | grep "error TS"
```

### Switch test user role
Edit `src/lib/auth.tsx`:
```typescript
const DEV_USER_ROLE = "member" | "coach" | "admin"
```

### Deploy to production
```bash
npm run build && git add -A && git commit -m "Deploy" && git push
```

---

## Quick Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npx convex dev` | Start Convex |
| `npx convex deploy` | Deploy Convex |

| URL | Description |
|-----|-------------|
| `localhost:5173` | Dev server |
| `/` | Landing/Home |
| `/login` | Login page |
| `/member` | Member dashboard |
| `/coach` | Coach dashboard |
| `/admin` | Admin dashboard |

---

**Version:** 1.0
**Updated:** January 2026
