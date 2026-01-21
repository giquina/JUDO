# React Performance Guidelines

> Comprehensive guide with 40+ performance optimization rules for React and Next.js applications
>
> **Source**: Vercel Engineering Best Practices
> **Last Updated**: January 2026

---

## Table of Contents

1. [Eliminating Waterfalls (CRITICAL)](#1-eliminating-waterfalls-critical)
2. [Bundle Size Optimization (CRITICAL)](#2-bundle-size-optimization-critical)
3. [Server-Side Performance (HIGH)](#3-server-side-performance-high)
4. [Client-Side Data Fetching (MEDIUM-HIGH)](#4-client-side-data-fetching-medium-high)
5. [Re-render Optimization (MEDIUM)](#5-re-render-optimization-medium)
6. [Rendering Performance (MEDIUM)](#6-rendering-performance-medium)
7. [JavaScript Performance (LOW-MEDIUM)](#7-javascript-performance-low-medium)
8. [Advanced Patterns (LOW)](#8-advanced-patterns-low)

---

## 1. Eliminating Waterfalls (CRITICAL)

### Impact: Highest Priority
Waterfalls are the #1 performance killer. Each sequential `await` adds full network latency (50-500ms per request).

### 1.1 Defer await until needed

**Impact**: 🔴 CRITICAL - Can save 100-500ms per avoided waterfall

**Problem**: Awaiting promises before they're needed creates unnecessary sequential operations.

```tsx
// ❌ BAD: Creates waterfall
async function UserProfile({ userId, showPosts }) {
  const user = await fetchUser(userId)

  if (!showPosts) {
    return <Profile user={user} />
  }

  const posts = await fetchPosts(userId) // Waits for user first
  return <ProfileWithPosts user={user} posts={posts} />
}
```

```tsx
// ✅ GOOD: Parallel fetching
async function UserProfile({ userId, showPosts }) {
  const userPromise = fetchUser(userId)
  const postsPromise = showPosts ? fetchPosts(userId) : null

  const user = await userPromise

  if (!showPosts) {
    return <Profile user={user} />
  }

  const posts = await postsPromise // Fetched in parallel
  return <ProfileWithPosts user={user} posts={posts} />
}
```

**When to use**: Always defer `await` until you need the value.

---

### 1.2 Use Promise.all() for independent operations

**Impact**: 🔴 CRITICAL - Reduces load time by ~60% for parallel operations

```tsx
// ❌ BAD: Sequential (600ms total if each takes 200ms)
const user = await fetchUser()
const posts = await fetchPosts()
const comments = await fetchComments()
```

```tsx
// ✅ GOOD: Parallel (200ms total)
const [user, posts, comments] = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments()
])
```

**When to use**: When operations don't depend on each other.

---

### 1.3 Dependency-based parallelization

**Impact**: 🔴 CRITICAL - Optimal parallelization for dependent operations

```tsx
// ❌ BAD: Fully sequential
async function Dashboard() {
  const user = await fetchUser()
  const team = await fetchTeam(user.teamId)
  const projects = await fetchProjects(team.id)
  return <Dashboard user={user} team={team} projects={projects} />
}
```

```tsx
// ✅ GOOD: Parallel where possible
async function Dashboard() {
  const user = await fetchUser()

  // These can run in parallel after we have the user
  const [team, userProjects] = await Promise.all([
    fetchTeam(user.teamId),
    fetchUserProjects(user.id)
  ])

  const teamProjects = await fetchProjects(team.id)

  return <Dashboard
    user={user}
    team={team}
    projects={[...userProjects, ...teamProjects]}
  />
}
```

**When to use**: When some operations depend on others, but can still be parallelized.

---

### 1.4 Prevent waterfall chains in API routes

**Impact**: 🔴 CRITICAL - Can eliminate seconds of cumulative delay

```tsx
// ❌ BAD: API route creates waterfall
export async function GET(request: Request) {
  const user = await db.users.find(userId)
  const posts = await db.posts.findMany({ userId: user.id })
  const comments = await db.comments.findMany({
    postId: { in: posts.map(p => p.id) }
  })

  return Response.json({ user, posts, comments })
}
```

```tsx
// ✅ GOOD: Parallel database queries
export async function GET(request: Request) {
  const userPromise = db.users.find(userId)
  const postsPromise = db.posts.findMany({ userId })

  const [user, posts] = await Promise.all([userPromise, postsPromise])

  const comments = await db.comments.findMany({
    postId: { in: posts.map(p => p.id) }
  })

  return Response.json({ user, posts, comments })
}
```

**When to use**: In all API routes with multiple data operations.

---

### 1.5 Strategic Suspense boundaries

**Impact**: 🟠 HIGH - Improves perceived performance by streaming content

```tsx
// ❌ BAD: Everything waits for slowest component
export default async function Page() {
  const [header, sidebar, content, footer] = await Promise.all([
    fetchHeader(),
    fetchSidebar(),
    fetchSlowContent(), // Takes 2 seconds
    fetchFooter()
  ])

  return (
    <div>
      <Header data={header} />
      <Sidebar data={sidebar} />
      <Content data={content} />
      <Footer data={footer} />
    </div>
  )
}
```

```tsx
// ✅ GOOD: Fast content renders immediately
export default async function Page() {
  return (
    <div>
      <Suspense fallback={<HeaderSkeleton />}>
        <AsyncHeader />
      </Suspense>

      <Suspense fallback={<SidebarSkeleton />}>
        <AsyncSidebar />
      </Suspense>

      {/* Slow content doesn't block fast content */}
      <Suspense fallback={<ContentSkeleton />}>
        <AsyncSlowContent />
      </Suspense>

      <Suspense fallback={<FooterSkeleton />}>
        <AsyncFooter />
      </Suspense>
    </div>
  )
}
```

**When to use**: When different parts of your page load at different speeds.

---

## 2. Bundle Size Optimization (CRITICAL)

### Impact: Directly affects TTI and LCP
Every 100KB of JavaScript adds ~200-500ms to TTI on mobile.

### 2.1 Avoid barrel file imports

**Impact**: 🔴 CRITICAL - Can reduce bundle by 50-80% for large libraries

```tsx
// ❌ BAD: Imports entire library (200KB+)
import { Check } from 'lucide-react'
import { Button } from '@/components/ui'
```

```tsx
// ✅ GOOD: Direct imports (5KB)
import Check from 'lucide-react/dist/esm/icons/check'
import { Button } from '@/components/ui/button'
```

**Why**: Barrel files (`index.ts` that re-export everything) prevent tree-shaking.

**When to use**: Always, especially with icon libraries and UI component libraries.

---

### 2.2 Dynamic imports for heavy components

**Impact**: 🔴 CRITICAL - Reduces initial bundle by deferring heavy dependencies

```tsx
// ❌ BAD: Loads Monaco editor for everyone (2MB+)
import MonacoEditor from '@monaco-editor/react'

export function CodeEditor() {
  return <MonacoEditor defaultLanguage="javascript" />
}
```

```tsx
// ✅ GOOD: Loads only when needed
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  {
    ssr: false,
    loading: () => <EditorSkeleton />
  }
)

export function CodeEditor() {
  return <MonacoEditor defaultLanguage="javascript" />
}
```

**When to use**: For components that are:
- Large (>50KB)
- Not immediately visible
- Only used in certain routes/conditions

---

### 2.3 Conditional module loading

**Impact**: 🟠 HIGH - Only loads code when actually needed

```tsx
// ❌ BAD: Imports PDF library even if never used
import { generatePDF } from 'pdf-lib'

export function ExportButton({ data, format }) {
  const handleExport = async () => {
    if (format === 'pdf') {
      await generatePDF(data)
    } else {
      exportAsCSV(data)
    }
  }

  return <button onClick={handleExport}>Export</button>
}
```

```tsx
// ✅ GOOD: Loads PDF library only when exporting as PDF
export function ExportButton({ data, format }) {
  const handleExport = async () => {
    if (format === 'pdf') {
      const { generatePDF } = await import('pdf-lib')
      await generatePDF(data)
    } else {
      exportAsCSV(data)
    }
  }

  return <button onClick={handleExport}>Export</button>
}
```

**When to use**: For features that are optional or rarely used.

---

### 2.4 Defer non-critical third-party libraries

**Impact**: 🟠 HIGH - Improves initial load time

```tsx
// ❌ BAD: Analytics blocks initial render
import analytics from '@/lib/analytics'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    analytics.page()
  }, [])

  return <Component {...pageProps} />
}
```

```tsx
// ✅ GOOD: Load analytics after page is interactive
export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Defer until after paint
    setTimeout(async () => {
      const { default: analytics } = await import('@/lib/analytics')
      analytics.page()
    }, 0)
  }, [])

  return <Component {...pageProps} />
}
```

**When to use**: For analytics, chat widgets, and other non-critical third-party code.

---

### 2.5 Preload based on user intent

**Impact**: 🟡 MEDIUM - Improves perceived performance for likely interactions

```tsx
// ✅ GOOD: Preload on hover
import { prefetch } from 'next/link'

export function DashboardLink() {
  const handleMouseEnter = () => {
    // Start loading dashboard code before click
    prefetch('/dashboard')
  }

  return (
    <a
      href="/dashboard"
      onMouseEnter={handleMouseEnter}
    >
      Go to Dashboard
    </a>
  )
}
```

**When to use**: For likely user interactions (hover, scroll into view).

---

## 3. Server-Side Performance (HIGH)

### 3.1 Cross-request LRU caching

**Impact**: 🟠 HIGH - Can reduce database load by 80%+

```tsx
// ❌ BAD: Fetches from DB on every request
export async function getUser(id: string) {
  return await db.users.findUnique({ where: { id } })
}
```

```tsx
// ✅ GOOD: LRU cache across requests
import { LRUCache } from 'lru-cache'

const userCache = new LRUCache<string, User>({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes
})

export async function getUser(id: string) {
  const cached = userCache.get(id)
  if (cached) return cached

  const user = await db.users.findUnique({ where: { id } })
  userCache.set(id, user)
  return user
}
```

**When to use**: For data that:
- Is read frequently
- Changes infrequently
- Is expensive to compute/fetch

---

### 3.2 Minimize serialization at RSC boundaries

**Impact**: 🟠 HIGH - Large objects slow down server response

```tsx
// ❌ BAD: Serializes entire heavy object
export default async function UserPage({ userId }) {
  const fullUser = await fetchUserWithAllData(userId)
  // Serializes 500KB of data including unused fields
  return <UserProfile user={fullUser} />
}
```

```tsx
// ✅ GOOD: Only serialize what you need
export default async function UserPage({ userId }) {
  const user = await fetchUser(userId, {
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      // Only fields needed for rendering
    }
  })

  return <UserProfile user={user} />
}
```

**When to use**: Always select only necessary fields at RSC boundaries.

---

### 3.3 Per-request deduplication with React.cache()

**Impact**: 🟠 HIGH - Prevents duplicate fetches in component tree

```tsx
// ❌ BAD: Multiple components fetch same data
export default async function Page() {
  return (
    <>
      <Header /> {/* Calls fetchUser() */}
      <Sidebar /> {/* Calls fetchUser() again */}
      <Content /> {/* Calls fetchUser() again */}
    </>
  )
}
```

```tsx
// ✅ GOOD: React.cache() deduplicates per request
import { cache } from 'react'

export const getUser = cache(async (id: string) => {
  return await db.users.findUnique({ where: { id } })
})

// Now all components share the same fetch
export default async function Page() {
  return (
    <>
      <Header /> {/* Calls getUser() */}
      <Sidebar /> {/* Reuses same promise */}
      <Content /> {/* Reuses same promise */}
    </>
  )
}
```

**When to use**: For all data fetching functions in Server Components.

---

### 3.4 Parallel data fetching with component composition

**Impact**: 🟠 HIGH - Eliminates component-level waterfalls

```tsx
// ❌ BAD: Sequential fetching
export default async function Page() {
  const user = await fetchUser()
  return (
    <div>
      <UserHeader user={user} />
      <UserPosts userId={user.id} /> {/* Waits for UserHeader */}
    </div>
  )
}

async function UserPosts({ userId }) {
  const posts = await fetchPosts(userId) // Waterfall!
  return <PostList posts={posts} />
}
```

```tsx
// ✅ GOOD: Parallel composition
export default async function Page() {
  const userPromise = fetchUser()
  const postsPromise = fetchPosts(userId) // Starts immediately

  return (
    <div>
      <Suspense fallback={<HeaderSkeleton />}>
        <UserHeader userPromise={userPromise} />
      </Suspense>

      <Suspense fallback={<PostsSkeleton />}>
        <UserPosts postsPromise={postsPromise} />
      </Suspense>
    </div>
  )
}

async function UserPosts({ postsPromise }) {
  const posts = await postsPromise // Already fetching
  return <PostList posts={posts} />
}
```

**When to use**: When child components need data that can be fetched in parallel.

---

## 4. Client-Side Data Fetching (MEDIUM-HIGH)

### 4.1 Use SWR for automatic deduplication

**Impact**: 🟡 MEDIUM-HIGH - Prevents duplicate network requests

```tsx
// ❌ BAD: Multiple components make duplicate requests
function Header() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchUser().then(setUser)
  }, [])

  return <div>{user?.name}</div>
}

function Sidebar() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchUser().then(setUser) // Duplicate request!
  }, [])

  return <div>{user?.email}</div>
}
```

```tsx
// ✅ GOOD: SWR deduplicates automatically
import useSWR from 'swr'

function Header() {
  const { data: user } = useSWR('/api/user', fetcher)
  return <div>{user?.name}</div>
}

function Sidebar() {
  const { data: user } = useSWR('/api/user', fetcher) // Reuses request
  return <div>{user?.email}</div>
}
```

**When to use**: For all client-side data fetching.

---

### 4.2 Deduplicate global event listeners

**Impact**: 🟡 MEDIUM - Reduces memory usage and event processing

```tsx
// ❌ BAD: Each component adds listener
function ScrollTracker() {
  useEffect(() => {
    const handler = () => trackScroll()
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])
}

// With 10 instances = 10 listeners!
```

```tsx
// ✅ GOOD: Single global listener
const scrollListeners = new Set()

export function useScrollTracking(callback) {
  useEffect(() => {
    scrollListeners.add(callback)

    // Only one global listener
    if (scrollListeners.size === 1) {
      window.addEventListener('scroll', notifyListeners)
    }

    return () => {
      scrollListeners.delete(callback)
      if (scrollListeners.size === 0) {
        window.removeEventListener('scroll', notifyListeners)
      }
    }
  }, [callback])
}

function notifyListeners() {
  scrollListeners.forEach(cb => cb())
}
```

**When to use**: For global events (scroll, resize, visibility change).

---

## 5. Re-render Optimization (MEDIUM)

### 5.1 Defer state reads to usage point

**Impact**: 🟡 MEDIUM - Reduces re-render scope

```tsx
// ❌ BAD: Parent re-renders on every keystroke
function App() {
  const [search, setSearch] = useState('')

  return (
    <div>
      <Header />
      <Sidebar />
      <SearchInput value={search} onChange={setSearch} />
      <Results search={search} />
      <Footer />
    </div>
  )
}
```

```tsx
// ✅ GOOD: State scoped to where it's used
function App() {
  return (
    <div>
      <Header />
      <Sidebar />
      <SearchSection /> {/* State lives here */}
      <Footer />
    </div>
  )
}

function SearchSection() {
  const [search, setSearch] = useState('')

  return (
    <>
      <SearchInput value={search} onChange={setSearch} />
      <Results search={search} />
    </>
  )
}
```

**When to use**: Always push state down to the lowest common ancestor.

---

### 5.2 Extract to memoized components

**Impact**: 🟡 MEDIUM - Prevents expensive re-renders

```tsx
// ❌ BAD: Entire table re-renders on filter change
function DataTable({ data }) {
  const [filter, setFilter] = useState('')

  const filteredData = data.filter(row =>
    row.name.includes(filter)
  )

  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      {filteredData.map(row => (
        <ExpensiveRow key={row.id} data={row} />
      ))}
    </div>
  )
}
```

```tsx
// ✅ GOOD: Memoized table doesn't re-render on filter change
function DataTable({ data }) {
  const [filter, setFilter] = useState('')

  const filteredData = useMemo(
    () => data.filter(row => row.name.includes(filter)),
    [data, filter]
  )

  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      <MemoizedTable data={filteredData} />
    </div>
  )
}

const MemoizedTable = memo(function Table({ data }) {
  return data.map(row => (
    <ExpensiveRow key={row.id} data={row} />
  ))
})
```

**When to use**: For expensive components that receive the same props frequently.

---

### 5.3 Use transitions for non-urgent updates

**Impact**: 🟡 MEDIUM - Keeps UI responsive during heavy updates

```tsx
// ❌ BAD: UI freezes during filtering
function DataGrid({ data }) {
  const [filter, setFilter] = useState('')
  const filtered = data.filter(item => item.name.includes(filter))

  return (
    <>
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      <Grid data={filtered} />
    </>
  )
}
```

```tsx
// ✅ GOOD: Input stays responsive
import { useTransition, useState } from 'react'

function DataGrid({ data }) {
  const [filter, setFilter] = useState('')
  const [isPending, startTransition] = useTransition()
  const [filtered, setFiltered] = useState(data)

  const handleChange = (e) => {
    const value = e.target.value
    setFilter(value)

    startTransition(() => {
      setFiltered(data.filter(item => item.name.includes(value)))
    })
  }

  return (
    <>
      <input value={filter} onChange={handleChange} />
      <Grid data={filtered} isPending={isPending} />
    </>
  )
}
```

**When to use**: For heavy computations triggered by user input.

---

### 5.4 Narrow effect dependencies

**Impact**: 🟡 MEDIUM - Reduces unnecessary effect runs

```tsx
// ❌ BAD: Effect runs when any user prop changes
function UserProfile({ user }) {
  useEffect(() => {
    trackPageView(user.id)
  }, [user]) // Reruns if user.name, user.email, etc. change
}
```

```tsx
// ✅ GOOD: Only runs when ID changes
function UserProfile({ user }) {
  useEffect(() => {
    trackPageView(user.id)
  }, [user.id]) // Only reruns when ID actually changes
}
```

**When to use**: Always narrow dependencies to only what the effect uses.

---

### 5.5 Use lazy state initialization

**Impact**: 🟡 MEDIUM - Avoids expensive computation on every render

```tsx
// ❌ BAD: Runs expensive function on every render
function Component() {
  const [data, setData] = useState(expensiveComputation())
  // expensiveComputation() runs even when data !== undefined
}
```

```tsx
// ✅ GOOD: Only runs once
function Component() {
  const [data, setData] = useState(() => expensiveComputation())
  // expensiveComputation() only runs on mount
}
```

**When to use**: When initial state requires expensive computation.

---

## 6. Rendering Performance (MEDIUM)

### 6.1 CSS content-visibility for long lists

**Impact**: 🟡 MEDIUM - Can improve render time by 50%+ for long lists

```tsx
// ❌ BAD: Browser renders all 10,000 items
function LongList({ items }) {
  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <ExpensiveComponent data={item} />
        </div>
      ))}
    </div>
  )
}
```

```tsx
// ✅ GOOD: Browser only renders visible items
function LongList({ items }) {
  return (
    <div>
      {items.map(item => (
        <div
          key={item.id}
          style={{ contentVisibility: 'auto' }}
        >
          <ExpensiveComponent data={item} />
        </div>
      ))}
    </div>
  )
}
```

**When to use**: For lists with >100 items or expensive items.

---

### 6.2 Hoist static JSX elements

**Impact**: 🟡 MEDIUM - Reduces object allocations

```tsx
// ❌ BAD: Creates new JSX object every render
function Page({ data }) {
  return (
    <div>
      <header>
        <h1>My App</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
        </nav>
      </header>
      <main>{data}</main>
    </div>
  )
}
```

```tsx
// ✅ GOOD: Static JSX hoisted outside
const HEADER_JSX = (
  <header>
    <h1>My App</h1>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
  </header>
)

function Page({ data }) {
  return (
    <div>
      {HEADER_JSX}
      <main>{data}</main>
    </div>
  )
}
```

**When to use**: For static JSX that never changes.

---

### 6.3 Use explicit conditional rendering

**Impact**: 🟡 MEDIUM - More efficient than CSS display: none

```tsx
// ❌ BAD: Renders hidden component (still in DOM)
function Panel({ isOpen, children }) {
  return (
    <div style={{ display: isOpen ? 'block' : 'none' }}>
      {children}
    </div>
  )
}
```

```tsx
// ✅ GOOD: Doesn't render when closed
function Panel({ isOpen, children }) {
  if (!isOpen) return null

  return <div>{children}</div>
}
```

**When to use**: When component doesn't need to maintain state when hidden.

---

### 6.4 Prevent hydration mismatch without flickering

**Impact**: 🟡 MEDIUM - Avoids flash of incorrect content

```tsx
// ❌ BAD: Causes hydration mismatch
function ThemeToggle() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'light')
  }, [])

  return <div>Theme: {theme}</div>
}
```

```tsx
// ✅ GOOD: Use suppressHydrationWarning for client-only values
function ThemeToggle() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'light')
  }, [])

  return (
    <div suppressHydrationWarning>
      Theme: {theme}
    </div>
  )
}
```

**When to use**: For client-only values that differ from server.

---

## 7. JavaScript Performance (LOW-MEDIUM)

### 7.1 Use toSorted() instead of sort()

**Impact**: 🟢 LOW-MEDIUM - Prevents accidental mutations

```tsx
// ❌ BAD: Mutates original array, can cause subtle bugs
function SortedList({ items }) {
  const sorted = items.sort((a, b) => a.name.localeCompare(b.name))
  return <List items={sorted} />
}
```

```tsx
// ✅ GOOD: Creates new array, safe and more optimizable
function SortedList({ items }) {
  const sorted = items.toSorted((a, b) => a.name.localeCompare(b.name))
  return <List items={sorted} />
}
```

**When to use**: Always use immutable array methods in React.

---

### 7.2 Use Set/Map for O(1) lookups

**Impact**: 🟢 LOW-MEDIUM - Can improve from O(n) to O(1)

```tsx
// ❌ BAD: O(n) lookup for each item
function HighlightedList({ items, selectedIds }) {
  return items.map(item => (
    <Item
      key={item.id}
      isSelected={selectedIds.includes(item.id)} // O(n)
    />
  ))
}
```

```tsx
// ✅ GOOD: O(1) lookup for each item
function HighlightedList({ items, selectedIds }) {
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds])

  return items.map(item => (
    <Item
      key={item.id}
      isSelected={selectedSet.has(item.id)} // O(1)
    />
  ))
}
```

**When to use**: For repeated lookups in collections.

---

### 7.3 Cache property access in loops

**Impact**: 🟢 LOW - Micro-optimization for hot paths

```tsx
// ❌ BAD: Accesses .length on every iteration
function processItems(items) {
  for (let i = 0; i < items.length; i++) {
    process(items[i])
  }
}
```

```tsx
// ✅ GOOD: Caches length
function processItems(items) {
  const len = items.length
  for (let i = 0; i < len; i++) {
    process(items[i])
  }
}
```

**When to use**: In performance-critical loops (>1000 iterations).

---

### 7.4 Hoist RegExp creation

**Impact**: 🟢 LOW - Avoids repeated object creation

```tsx
// ❌ BAD: Creates new RegExp on every call
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
```

```tsx
// ✅ GOOD: Reuses RegExp instance
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateEmail(email) {
  return EMAIL_REGEX.test(email)
}
```

**When to use**: For RegExp used multiple times.

---

### 7.5 Early return from functions

**Impact**: 🟢 LOW - Avoids unnecessary computation

```tsx
// ❌ BAD: Always computes everything
function processData(data) {
  const cleaned = cleanData(data)
  const validated = validateData(cleaned)
  const transformed = transformData(validated)

  if (!transformed.length) {
    return null
  }

  return transformed
}
```

```tsx
// ✅ GOOD: Early exits save computation
function processData(data) {
  if (!data?.length) return null

  const cleaned = cleanData(data)
  if (!cleaned.length) return null

  const validated = validateData(cleaned)
  if (!validated.length) return null

  return transformData(validated)
}
```

**When to use**: Always check exit conditions early.

---

### 7.6 Combine multiple array iterations

**Impact**: 🟢 LOW-MEDIUM - Reduces iterations from O(3n) to O(n)

```tsx
// ❌ BAD: Three passes over array
function processUsers(users) {
  const active = users.filter(u => u.active)
  const sorted = active.sort((a, b) => a.name.localeCompare(b.name))
  const names = sorted.map(u => u.name)
  return names
}
```

```tsx
// ✅ GOOD: Single pass
function processUsers(users) {
  return users
    .filter(u => u.active)
    .toSorted((a, b) => a.name.localeCompare(b.name))
    .map(u => u.name)
}
```

**When to use**: When working with large arrays (>1000 items).

---

### 7.7 Build index maps for repeated lookups

**Impact**: 🟢 LOW-MEDIUM - Improves from O(n²) to O(n)

```tsx
// ❌ BAD: O(n²) complexity
function enrichPosts(posts, users) {
  return posts.map(post => ({
    ...post,
    author: users.find(u => u.id === post.authorId)
  }))
}
```

```tsx
// ✅ GOOD: O(n) complexity
function enrichPosts(posts, users) {
  const userMap = new Map(users.map(u => [u.id, u]))

  return posts.map(post => ({
    ...post,
    author: userMap.get(post.authorId)
  }))
}
```

**When to use**: For lookups in nested loops.

---

### 7.8 Cache repeated function calls

**Impact**: 🟢 LOW-MEDIUM - Memoization for pure functions

```tsx
// ❌ BAD: Computes same result multiple times
function Component() {
  const config = getComplexConfig()
  const otherConfig = getComplexConfig() // Duplicate computation
}
```

```tsx
// ✅ GOOD: Memoizes expensive computation
import memoize from 'lodash/memoize'

const getComplexConfig = memoize(() => {
  // Expensive computation
  return computeConfig()
})
```

**When to use**: For expensive pure functions called frequently.

---

## 8. Advanced Patterns (LOW)

### 8.1 Store event handlers in refs

**Impact**: 🟢 LOW - Prevents effect re-runs

```tsx
// ❌ BAD: Effect reruns when handler changes
function Component({ onUpdate }) {
  useEffect(() => {
    const interval = setInterval(onUpdate, 1000)
    return () => clearInterval(interval)
  }, [onUpdate]) // Dependency causes frequent re-runs
}
```

```tsx
// ✅ GOOD: Effect runs once, always uses latest handler
function Component({ onUpdate }) {
  const handlerRef = useRef(onUpdate)

  useEffect(() => {
    handlerRef.current = onUpdate
  })

  useEffect(() => {
    const interval = setInterval(() => handlerRef.current(), 1000)
    return () => clearInterval(interval)
  }, []) // No dependencies
}
```

**When to use**: When you need the latest callback without effect re-runs.

---

### 8.2 useLatest for stable callback refs

**Impact**: 🟢 LOW - Cleaner alternative to manual refs

```tsx
// ✅ GOOD: Custom hook for stable refs
function useLatest<T>(value: T) {
  const ref = useRef(value)

  useEffect(() => {
    ref.current = value
  })

  return ref
}

// Usage
function Component({ onUpdate }) {
  const latestOnUpdate = useLatest(onUpdate)

  useEffect(() => {
    const interval = setInterval(() => {
      latestOnUpdate.current()
    }, 1000)

    return () => clearInterval(interval)
  }, [])
}
```

**When to use**: For callbacks in long-running effects.

---

## Performance Checklist

Use this checklist when optimizing a React application:

### Critical (Do First)
- [ ] Eliminate sequential awaits (use Promise.all())
- [ ] Remove barrel file imports
- [ ] Add dynamic imports for heavy components
- [ ] Implement strategic Suspense boundaries
- [ ] Parallelize independent data fetching

### High Priority
- [ ] Add LRU caching for frequently accessed data
- [ ] Use React.cache() for server component deduplication
- [ ] Minimize serialization at RSC boundaries
- [ ] Optimize database queries (select only needed fields)

### Medium Priority
- [ ] Use SWR for client-side fetching
- [ ] Push state down to usage point
- [ ] Memoize expensive components
- [ ] Use transitions for non-urgent updates
- [ ] Add content-visibility for long lists

### Low Priority (Measure First)
- [ ] Use toSorted() instead of sort()
- [ ] Convert arrays to Sets for lookups
- [ ] Hoist static JSX and RegExp
- [ ] Build index maps for nested lookups
- [ ] Combine multiple array iterations

---

## Measuring Impact

Always measure before and after optimizations:

```tsx
// Use React DevTools Profiler
import { Profiler } from 'react'

function App() {
  return (
    <Profiler
      id="App"
      onRender={(id, phase, actualDuration) => {
        console.log(`${id} (${phase}) took ${actualDuration}ms`)
      }}
    >
      <YourComponents />
    </Profiler>
  )
}
```

**Key metrics:**
- **LCP**: Should be < 2.5s
- **FID**: Should be < 100ms
- **CLS**: Should be < 0.1
- **TTI**: Should be < 3.8s on mobile
- **Bundle size**: Aim for < 200KB initial JS

---

## Resources

- [React DevTools Profiler](https://react.dev/learn/react-developer-tools)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [Web Vitals](https://web.dev/vitals/)
- [Vercel Analytics](https://vercel.com/analytics)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

---

**Last Updated**: January 2026
**Version**: 1.0.0
**Source**: Vercel Engineering Best Practices
