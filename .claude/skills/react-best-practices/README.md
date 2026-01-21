# React Best Practices Skill

> Installed: January 2026
> Version: 1.0.0
> Source: Vercel Engineering

## Overview

This skill provides comprehensive React and Next.js performance optimization guidelines with 40+ rules organized by impact level.

## Files

- **skill.md** - Main skill definition and quick reference
- **references/react-performance-guidelines.md** - Complete guide with detailed examples (1,400+ lines)

## Quick Start

### Use the skill in Claude Code

Simply reference the guidelines when optimizing your React code:

```
"Review this component using react-best-practices guidelines"
"Optimize this code following Vercel's performance best practices"
"Check for waterfalls and bundle size issues"
```

### Priority Order

1. **CRITICAL** - Eliminating Waterfalls & Bundle Size
2. **HIGH** - Server-Side Performance
3. **MEDIUM-HIGH** - Client-Side Data Fetching
4. **MEDIUM** - Re-render & Rendering Performance
5. **LOW** - JavaScript micro-optimizations

## Most Common Optimizations

### 1. Fix Waterfalls
```tsx
// ❌ BAD
const user = await fetchUser()
const posts = await fetchPosts() // Waits unnecessarily

// ✅ GOOD
const [user, posts] = await Promise.all([
  fetchUser(),
  fetchPosts()
])
```

### 2. Avoid Barrel Imports
```tsx
// ❌ BAD - Imports entire library
import { Check } from 'lucide-react'

// ✅ GOOD - Direct import
import Check from 'lucide-react/dist/esm/icons/check'
```

### 3. Dynamic Imports
```tsx
// ✅ GOOD - Lazy load heavy components
const Editor = dynamic(() => import('./heavy-editor'), {
  ssr: false,
  loading: () => <Skeleton />
})
```

## Integration with Your Project

This skill is now available for:
- Code reviews
- Performance audits
- Component optimization
- Architecture decisions

## Resources

- Full guidelines: `.claude/skills/react-best-practices/references/react-performance-guidelines.md`
- Vercel docs: https://vercel.com/blog/how-we-optimized-package-imports-in-next-js

## Next Steps

1. Review current codebase for waterfalls
2. Check bundle size with `npm run build -- --analyze` (if configured)
3. Apply optimizations based on priority
4. Measure impact with React DevTools Profiler

---

**Ready to use!** Reference this skill anytime you need React performance guidance.
