# Social Features, Careers & Simple Auth - Implementation Plan

> Making the platform engaging, recruiting the right people, and ensuring 16-year-olds can use it easily

**Created:** January 2026
**Status:** Planning Phase
**Target:** Transform JUDO into a social community platform with recruitment pipeline

---

## 🎯 Core Objectives

1. **Social Engagement:** Keep Judoka engaged between training sessions
2. **Recruitment Pipeline:** Attract senseis and staff to grow platform
3. **Simple Authentication:** One-click sign-in for everyone (including teens)
4. **Teen-Friendly UX:** Clear, intuitive, mobile-first for 16+ year-olds

---

## 📱 PART 1: Social Platform Features

### The Problem
Current platform is transactional (check-in, pay, leave). No community engagement or retention between classes.

### The Solution: Dojo Social Hub

#### 1.1 News Feed / Community Feed
**Purpose:** Keep Judoka engaged and informed

**Features:**
- 📰 **Dojo Announcements** (from senseis/admins)
  - Class cancellations/changes
  - Special events
  - Important updates
  - Can pin important posts to top

- 🏆 **Achievement Highlights** (auto-generated)
  - Belt promotions: "🎉 Sarah promoted to Blue Belt!"
  - Attendance milestones: "⚡ James reached 50 sessions!"
  - Competition results: "🥇 Emma won Gold at Regional Championship"
  - Personal bests

- 💬 **Community Posts** (from Judoka)
  - Share training tips
  - Ask questions
  - Celebrate progress
  - Post training photos/videos
  - Reactions: 👍 🥋 💪 🔥

- 📅 **Upcoming Events**
  - Competitions
  - Seminars/workshops
  - Belt grading dates
  - Social gatherings
  - RSVP functionality

**User Experience (16+ friendly):**
```
┌─────────────────────────────────────┐
│  🏠 Dojo Feed                    🔔 │
├─────────────────────────────────────┤
│                                     │
│  📌 PINNED                          │
│  🚨 Class Update                    │
│  Monday 7pm class moved to Studio B │
│  • Sensei Tanaka • 2h ago          │
│  👍 12  💬 3                        │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  🏆 Achievement Unlocked!           │
│  Sarah earned her BLUE BELT! 🥋    │
│  • 32 sessions completed            │
│  • Ready for intermediate class     │
│  👏 45  🔥 12  💬 8                │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  💬 James O'Brien                   │
│  Just nailed my first proper        │
│  Uchi Mata throw! 💪                │
│  📷 [Training Video]                │
│  👍 23  🥋 15  💬 5                │
│                                     │
└─────────────────────────────────────┘
```

#### 1.2 Leaderboards & Gamification
**Purpose:** Motivate consistent training

**Leaderboard Types:**
- 📊 **Attendance This Month** (top 10)
- 🔥 **Current Streak** (consecutive days)
- ⏱️ **Total Mat Time** (hours trained)
- 🎯 **Technique Mastery** (tracked by sensei)
- 🏅 **Competition Points** (if competing)

**Badges/Achievements:**
- "🔥 10-Day Streak"
- "💯 100 Sessions Club"
- "🌅 Early Bird" (most morning classes)
- "🦉 Night Owl" (most evening classes)
- "📚 Technique Collector" (learned X techniques)
- "🤝 Mentor" (helped other students)

**UX Notes:**
- Show personal progress prominently
- Leaderboards are motivational, NOT shaming
- Option to opt-out of public leaderboards
- Focus on personal improvement

#### 1.3 Training Resources Library
**Purpose:** Learn outside the dojo

**Content Types:**
- 🎥 **Technique Videos** (uploaded by senseis)
  - Basic throws (Nage-waza)
  - Ground techniques (Newaza)
  - Kata demonstrations
  - Competition strategies

- 📖 **Judo Knowledge Base**
  - Belt progression requirements
  - Japanese terminology dictionary
  - Competition rules
  - Dojo etiquette guide
  - Injury prevention tips

- 📝 **Training Plans**
  - Beginner 30-day plan
  - Competition prep programs
  - Strength & conditioning
  - Flexibility routines

**Organization:**
- Searchable by belt level
- Filter by category
- Bookmark favorites
- Track "completed" content

#### 1.4 Event Calendar (Enhanced)
**Current:** Basic class schedule
**Enhanced:** Full community calendar

**Event Types:**
- 🥋 Regular classes (existing)
- 🏆 Competitions (local, regional, national)
- 📚 Seminars/workshops (guest senseis)
- 🎓 Belt grading days
- 🍕 Social events (team dinners, BBQs)
- 🎬 Watch parties (Olympic Judo, etc.)

**Features:**
- RSVP with attendance tracking
- Add to personal calendar (Google/Apple)
- Push notifications for upcoming events
- Travel groups for away competitions
- Photo galleries after events

---

## 💼 PART 2: Careers / Recruitment Platform

### The Problem
Clubs need staff but don't have good recruitment pipelines. High-ranked Judoka want teaching opportunities.

### The Solution: Judo Careers Hub

#### 2.1 Job Board Structure

**Job Categories:**
1. **Instruction Roles** (for senseis/high belts)
2. **Operations Roles** (front desk, admin)
3. **Management Roles** (facility, events)
4. **Platform Roles** (for JUDO platform itself)

#### 2.2 Priority Positions for Launch

**TIER 1: High Priority (Current Senseis/Black Belts Can Apply Now)**

1. **Head Sensei / Chief Instructor**
   - Requirements:
     - 3rd Dan (Sandan) or higher
     - 5+ years teaching experience
     - Competition experience (international level preferred)
     - First aid certified
   - Responsibilities:
     - Oversee all classes
     - Design curriculum
     - Conduct belt gradings
     - Mentor assistant instructors
   - Why senseis can do this: Already have the skills
   - Salary Range: £35,000 - £50,000 (full-time)

2. **Assistant Sensei / Instructor**
   - Requirements:
     - 1st Dan (Shodan) or higher
     - 2+ years teaching experience
     - Passionate about education
   - Responsibilities:
     - Lead beginner/intermediate classes
     - Support head sensei
     - Track student progress
     - Assist with gradings
   - Why high belts can do this: Pathway from student to instructor
   - Salary Range: £25,000 - £35,000 (full-time) or £20-40/hour (part-time)

3. **Competition Coach / Performance Coach**
   - Requirements:
     - Black belt (any Dan)
     - Competition experience (national/international)
     - Sports science knowledge (bonus)
   - Responsibilities:
     - Train competitive athletes
     - Develop competition strategies
     - Travel to competitions with team
     - Analyze opponent footage
   - Why senseis can do this: Former competitors make great coaches
   - Salary Range: £30,000 - £45,000 (full-time)

4. **Youth Program Coordinator / Kids' Class Instructor**
   - Requirements:
     - Brown belt or higher
     - Safeguarding certification (DBS check)
     - Patient with children 5-15 years
     - Energetic and creative
   - Responsibilities:
     - Design kids' curriculum (fun-focused)
     - Lead children's classes
     - Communicate with parents
     - Organize youth events
   - Why senseis can do this: Teaching kids requires different skills
   - Salary Range: £22,000 - £32,000 (full-time)

**TIER 2: Medium Priority (Operational Support)**

5. **Front Desk Manager / Member Services**
   - Requirements:
     - Customer service experience
     - Admin skills (scheduling, payments)
     - Knowledge of judo (not required, can learn)
   - Responsibilities:
     - Check-in management
     - Handle inquiries
     - Process payments
     - Membership renewals
     - First point of contact
   - Why it's important: Frees senseis to focus on teaching
   - Salary Range: £20,000 - £28,000 (full-time)

6. **Marketing & Growth Manager**
   - Requirements:
     - Digital marketing experience
     - Social media savvy
     - Content creation skills
   - Responsibilities:
     - Grow membership
     - Run social media
     - Create promotional content
     - Organize open houses
     - Partner with local schools
   - Why it's important: Clubs need visibility
   - Salary Range: £28,000 - £40,000 (full-time)

7. **Event Coordinator**
   - Requirements:
     - Event planning experience
     - Organized and detail-oriented
     - Good with logistics
   - Responsibilities:
     - Organize competitions
     - Plan seminars with guest senseis
     - Coordinate social events
     - Manage registrations
     - Handle venue logistics
   - Why it's important: Events build community
   - Salary Range: £24,000 - £35,000 (full-time)

**TIER 3: Platform-Level Roles (For JUDO Platform Growth)**

8. **Dojo Success Manager / Customer Support**
   - Requirements:
     - Understanding of judo (blue belt+)
     - Tech-savvy
     - Problem-solving skills
   - Responsibilities:
     - Help clubs onboard
     - Train senseis on platform
     - Resolve technical issues
     - Gather feedback
   - Why it's needed: As platform scales
   - Salary Range: £25,000 - £35,000 (remote friendly)

9. **Platform Developer / Engineer**
   - Requirements:
     - Full-stack development
     - React, TypeScript, Convex
     - Passion for martial arts (bonus)
   - Responsibilities:
     - Build new features
     - Fix bugs
     - Optimize performance
     - Integrate with Stripe/APIs
   - Why it's needed: Platform needs continuous improvement
   - Salary Range: £40,000 - £70,000 (remote friendly)

#### 2.3 Job Posting Template

```markdown
# [Position Title]

**Location:** [Dojo Name, City] or Remote
**Type:** Full-time / Part-time / Contract
**Salary:** £[range]
**Posted:** [Date]
**Apply By:** [Deadline]

## About the Dojo
[Club description, size, student base, competition success]

## What You'll Do
- [Responsibility 1]
- [Responsibility 2]
- [Responsibility 3]

## What We're Looking For
**Required:**
- [Requirement 1]
- [Requirement 2]

**Nice to Have:**
- [Bonus skill 1]
- [Bonus skill 2]

## Why Join Us?
- 💰 Competitive salary + benefits
- 🥋 Free training and dojo membership
- 📚 Professional development budget
- 🏆 Travel to competitions
- 🤝 Supportive community
- 📈 Career growth opportunities

## How to Apply
1. Click "Apply Now"
2. Upload CV / Resume
3. Write a brief cover letter (why you're passionate about judo/teaching)
4. Optional: Upload teaching demo video

[APPLY NOW] [SAVE FOR LATER]
```

#### 2.4 Application Flow (Simple & Fast)

**Step 1: Job Discovery**
```
┌──────────────────────────────────────┐
│ 💼 Careers at JUDO                   │
├──────────────────────────────────────┤
│                                      │
│ [Search: "instructor, london"]  🔍  │
│                                      │
│ 📍 Filter by:                        │
│ ☑ Location: London                  │
│ ☐ Type: Full-time                   │
│ ☐ Role: Instruction                 │
│                                      │
│ ─────────────────────────────────    │
│                                      │
│ 🥋 Head Sensei - North London Judo  │
│    £40k-50k • Full-time • 3rd Dan+  │
│    📍 London • Posted 2 days ago     │
│    [View Details]                    │
│                                      │
│ 🥋 Assistant Instructor - East Dojo │
│    £25/hr • Part-time • 1st Dan+    │
│    📍 London • Posted 1 week ago     │
│    [View Details]                    │
│                                      │
└──────────────────────────────────────┘
```

**Step 2: Quick Apply (For Logged-in Users)**
```
Auto-fill from profile:
✅ Name, email, phone
✅ Belt rank
✅ Certifications
✅ Teaching experience

User adds:
📄 CV/Resume (upload)
✍️ Cover letter (why you're interested)
🎥 Demo video (optional, 2-min max)

[SUBMIT APPLICATION] - Done in 3 minutes
```

**Step 3: Dojo Reviews & Contacts**
- Notifications to hiring manager
- Applicant tracking system
- Direct messaging for interviews

#### 2.5 "Become an Instructor" Program

**For High Belts (Brown/Black) Who Want to Teach:**

**What We Offer:**
- 📚 Instructor Training Course (8 weeks, online + in-person)
- 🎓 Teaching Certification
- 🤝 Mentor matching (learn from experienced senseis)
- 💼 Job placement assistance
- 📈 Career development path

**Course Curriculum:**
- Lesson planning
- Teaching progressions (white belt → advanced)
- Student safety & injury prevention
- Class management
- Communication skills
- Business basics (if opening own dojo)

**Investment:** £500 (refundable after 6 months of teaching)

**Why This Matters:**
- Pipeline of qualified instructors
- Quality assurance across platform
- Career path for passionate Judoka
- Grows the sport

---

## 🔐 PART 3: Simple Authentication (16+ Friendly)

### Current State
- Mock auth with magic links
- Dev mode bypass
- Not production-ready

### Target State
**One-Click Social Login + Magic Links**

#### 3.1 Authentication Methods

**Primary (Social Login):**
1. **Google Sign-In** ✅ (Most common)
   - "Continue with Google"
   - Auto-fills: name, email, profile photo
   - No password needed
   - Works on mobile apps

2. **Apple Sign-In** (iOS users)
   - Privacy-focused
   - Required for App Store

3. **Facebook Login** (Optional)
   - Common for older users

**Secondary (Email Magic Link):**
- No password required
- Click link → logged in
- Good for non-social login users

**Why This Works for 16-year-olds:**
- Teens already have Google accounts
- No password to remember/forget
- Familiar (they use this everywhere)
- Fast - 1 click, done

#### 3.2 Sign-Up Flow (New User, Age 16+)

```
SCREEN 1: Welcome
┌────────────────────────────────────┐
│                                    │
│         🥋 JUDO CLUB               │
│    Train. Track. Compete.          │
│                                    │
│  [🔵 Continue with Google]         │
│                                    │
│  [🍎 Continue with Apple]          │
│                                    │
│  ─────── or ───────                │
│                                    │
│  📧 Sign in with Email             │
│                                    │
│  Already have an account? [Log in] │
│                                    │
└────────────────────────────────────┘
```

**User clicks "Continue with Google" → Google popup → Auto-login**

```
SCREEN 2: Complete Your Profile (2-min setup)
┌────────────────────────────────────┐
│  Welcome, Sarah! 👋                │
│  Let's set up your profile         │
│                                    │
│  📷 Profile Photo (from Google ✓)  │
│                                    │
│  🎂 Date of Birth *                │
│     [DD] [MM] [YYYY]               │
│     (You must be 16+ to join)      │
│                                    │
│  🥋 Current Belt Rank *            │
│     [Dropdown: White → Black]      │
│                                    │
│  📍 Find Your Dojo                 │
│     [Search: postcode or name]     │
│     → Shows nearby dojos           │
│                                    │
│  ☑ I agree to Terms & Privacy      │
│                                    │
│  [Complete Sign Up]  [1/2]         │
│                                    │
└────────────────────────────────────┘
```

```
SCREEN 3: Choose Your Membership
┌────────────────────────────────────┐
│  Almost done! Pick a plan          │
│                                    │
│  ┌──────────┐  ┌──────────┐       │
│  │ Student  │  │ Standard │       │
│  │ £15/mo   │  │ £25/mo   │       │
│  │ 8 classes│  │ Unlimited│       │
│  │          │  │          │       │
│  │ [Select] │  │ [Select] │       │
│  └──────────┘  └──────────┘       │
│                                    │
│  💳 Start 7-day FREE trial         │
│     No charge until [Date]         │
│                                    │
│  [Start Training]  [2/2]           │
│                                    │
└────────────────────────────────────┘
```

**Total time: 2-3 minutes**

#### 3.3 Login Flow (Returning User)

```
SCREEN: Login
┌────────────────────────────────────┐
│                                    │
│    Welcome Back! 🥋                │
│                                    │
│  [🔵 Continue with Google]         │
│                                    │
│  [🍎 Continue with Apple]          │
│                                    │
│  ─────── or ───────                │
│                                    │
│  📧 Email: [your@email.com]        │
│  [Send Magic Link]                 │
│                                    │
└────────────────────────────────────┘

After clicking social login:
→ Instant redirect to dashboard (< 2 seconds)
```

#### 3.4 Technical Implementation

**Stack:**
- **Convex Auth** (supports social login)
- **OAuth Providers:**
  - Google OAuth 2.0
  - Apple Sign-In
  - Facebook Login (optional)
- **Magic Links:** Resend (email service)

**User Table Schema:**
```typescript
users: {
  _id: string,
  name: string,
  email: string,
  profilePhoto: string?, // from social login
  dateOfBirth: string,
  age: number, // calculated, must be 16+
  beltRank: string,
  authProvider: "google" | "apple" | "email",
  emailVerified: boolean,
  createdAt: timestamp,
  lastLogin: timestamp,
  onboardingComplete: boolean,
}
```

**Age Verification:**
- Must be 16+ to create account
- Under 18 → "Guardian Consent" email sent
- Validates DOB on sign-up

---

## 🎨 PART 4: Teen-Friendly UX (16+ Years Old)

### Design Principles for Young Users

#### 4.1 Clear, Not Cluttered
**Problem:** Adults tolerate complexity, teens bounce
**Solution:**
- One main action per screen
- Big, tappable buttons
- Hide advanced features in settings
- Progressive disclosure (show more as needed)

**Example:**
```
❌ BAD: Member Dashboard (Too much info)
┌────────────────────────────────────┐
│ Welcome, Sarah Chen                │
│ Blue Belt (3 Kyu) | Member since... │
│ Last login: ... | Subscription: ... │
│ ────────────────────────────────   │
│ [Stats] [Classes] [Payments] [...] │
│ ────────────────────────────────   │
│ Upcoming Classes (12)              │
│ - Monday 7pm Fundamentals [...]    │
│ - Wednesday 8pm Advanced [...]     │
│ ...                                │
└────────────────────────────────────┘

✅ GOOD: Member Dashboard (Clean & Action-Focused)
┌────────────────────────────────────┐
│                                    │
│  Hey Sarah! 👋                     │
│  Your next class is in 2 hours     │
│                                    │
│  ╔════════════════════════════╗   │
│  ║  Monday Fundamentals       ║   │
│  ║  7:00 PM • Main Dojo       ║   │
│  ║                            ║   │
│  ║  [📍 Get Directions]       ║   │
│  ║  [✅ I'm Attending]        ║   │
│  ╚════════════════════════════╝   │
│                                    │
│  🔥 6-day training streak!         │
│  ⚡ 47 sessions this year           │
│                                    │
│  [View All Classes]                │
│  [Check Training Feed]             │
│                                    │
└────────────────────────────────────┘
```

#### 4.2 Visual > Text
**Problem:** Teens skim, don't read
**Solution:**
- Icons everywhere
- Visual progress (bars, charts)
- Photos > paragraphs
- Video tutorials > written guides

**Example: Belt Progress**
```
❌ BAD: Text-heavy
"You have completed 32 of 40 required sessions
for your next belt grading. You need 8 more
sessions to be eligible. Your next grading
opportunity is in 6 weeks."

✅ GOOD: Visual progress
┌────────────────────────────────────┐
│  🥋 Progress to Orange Belt        │
│                                    │
│  ████████████░░░░  32/40 sessions  │
│                                    │
│  8 more to go! 💪                  │
│  Next grading: Feb 15              │
│                                    │
└────────────────────────────────────┘
```

#### 4.3 Instant Feedback
**Problem:** Teens expect immediate response
**Solution:**
- Animations on every action
- Toast notifications
- Loading states (never "frozen" screens)
- Haptic feedback on mobile

**Examples:**
- Tap "Check In" → ✅ animation + sound
- Achieve milestone → 🎉 confetti animation
- Message sent → ✓ Read receipts
- Error → Clear message + retry button

#### 4.4 Mobile-First, Always
**Stats:** 95% of 16-year-olds use phones primarily

**Design Rules:**
- Thumb-friendly navigation (bottom tabs)
- Swipe gestures (natural)
- Large tap targets (44×44px minimum)
- Works offline (show cached data)
- Fast loading (< 2 seconds)

**Navigation Pattern:**
```
Bottom Tab Bar (Always Visible):
┌────────────────────────────────────┐
│                                    │
│     [Main Content Area]            │
│                                    │
│                                    │
└────────────────────────────────────┘
┌─────┬─────┬─────┬─────┬─────┐
│ 🏠  │ 📅  │  +  │ 💬  │ 👤  │
│Home │Class│Check│Feed │ Me  │
│     │     │ In  │     │     │
└─────┴─────┴─────┴─────┴─────┘
```

#### 4.5 Social Proof & FOMO
**Psychology:** Teens are influenced by peers

**Features:**
- "23 friends are going to this event"
- "Emma and 12 others earned a badge today"
- "Only 3 spots left in Saturday's class!"
- "Trending in your dojo: #osotogari"

#### 4.6 Personalization
**Make it feel like THEIR app:**
- Custom profile themes
- Achievement badges on profile
- Personal training stats
- "Your Journey" timeline
- Custom training goals

#### 4.7 Helpful Onboarding
**First 24 hours are critical:**

**Day 1: Guided Tour**
```
┌────────────────────────────────────┐
│  👋 Welcome to JUDO!               │
│                                    │
│  Let me show you around (1 min)    │
│                                    │
│  → This is your home feed          │
│  → Tap here to check in            │
│  → View your class schedule        │
│  → Track your progress             │
│                                    │
│  [Take Tour] [Skip for Now]        │
│                                    │
└────────────────────────────────────┘
```

**In-App Tips:**
- Tooltip on first visit: "👈 Tap here to check in!"
- Progressive hints (not all at once)
- Help center with video FAQs
- Live chat support

#### 4.8 Language & Tone
**Speak their language:**

❌ Formal/Corporate:
- "Please verify your attendance at the scheduled session"
- "Your membership subscription renewal is pending"

✅ Casual/Friendly:
- "Ready to train? Tap to check in! 💪"
- "Heads up: Your membership renews in 3 days"

**Judo Terms:**
- Always include translation: "Randori (free sparring)"
- Tooltips for Japanese words
- Optional: English mode vs. Traditional mode

---

## 📊 Implementation Priority & Timeline

### Phase 1: Simple Auth (Week 1-2)
**Goal:** Get rid of mock auth, enable Google sign-in

- [ ] Set up Google OAuth with Convex Auth
- [ ] Create onboarding flow (3 screens)
- [ ] Age verification (16+ check)
- [ ] Profile completion
- [ ] Test with real users

**Success Metric:** Users can sign up in < 3 minutes

### Phase 2: Social Feed (Week 3-4)
**Goal:** Build community engagement

- [ ] News feed component
- [ ] Post types: announcements, achievements, community
- [ ] Reactions and comments
- [ ] Image/video uploads
- [ ] Push notifications for mentions

**Success Metric:** 30% of users check feed daily

### Phase 3: Careers Page (Week 5)
**Goal:** Launch recruitment pipeline

- [ ] Job board structure
- [ ] Create 9 initial job posting templates
- [ ] Application flow
- [ ] Admin review dashboard
- [ ] Email notifications for new applications

**Success Metric:** 10 senseis apply in first month

### Phase 4: Enhanced Social Features (Week 6-7)
**Goal:** Increase engagement

- [ ] Leaderboards
- [ ] Achievement badges
- [ ] Training resources library
- [ ] Enhanced event calendar

**Success Metric:** 40% of users engage with social features weekly

### Phase 5: UX Polish for Teens (Week 8)
**Goal:** Optimize for 16+ users

- [ ] Onboarding tour
- [ ] Interactive tooltips
- [ ] Simplify navigation
- [ ] Add animations and micro-interactions
- [ ] User testing with 16-18 year-olds

**Success Metric:** 80% complete onboarding, < 10% bounce rate

---

## 🎯 Key Success Metrics

### Social Platform
- **Daily Active Users (DAU):** Target 40% of members
- **Feed Engagement Rate:** 30% interact with feed daily
- **Post Frequency:** 5+ posts per week per dojo
- **Retention:** 70% return after 30 days

### Recruitment
- **Applications per Job:** 15+ qualified applicants
- **Time to Hire:** < 30 days
- **Instructor Pipeline:** 50 in training program within 6 months
- **Quality:** 80% hired instructors retained after 1 year

### Authentication & Onboarding
- **Sign-up Completion:** 85%+
- **Time to First Value:** < 5 minutes (check-in or book class)
- **Login Success Rate:** 95%+
- **Teen User Growth:** 30% of new users aged 16-25

---

## 🚀 Quick Wins (Can Implement NOW)

### Week 1 Quick Wins:
1. **Google OAuth** (1-2 days)
   - High impact: Makes signup 10x easier
   - Technical: Convex Auth + Google OAuth setup

2. **Basic News Feed** (2-3 days)
   - Start with announcements only (senseis can post)
   - Add reactions (👍 🥋 💪)
   - Foundation for full social platform

3. **Careers Landing Page** (1 day)
   - Static page listing 9 job roles
   - Simple "Email to Apply" forms
   - Can upgrade to full job board later

### Low-Hanging Fruit:
- Add "Share Achievement" button when belt promoted
- Auto-generate achievement posts (milestone sessions)
- Simple leaderboard (top 10 attendance this month)
- "Tip of the Day" on dashboard

---

## 🎨 Design Mockups (To Create)

### Priority Screens to Design:
1. Social Feed (mobile + desktop)
2. Job Board (careers page)
3. Job Detail + Application Flow
4. Onboarding (3 screens)
5. Google Sign-In flow
6. Achievement Modal (when unlocking badge)
7. Leaderboard View
8. Event Detail with RSVP

---

## 💡 Innovation Ideas (Future Phases)

### Viral Growth Features:
- **Refer a Friend:** Both get 1 free month
- **Instagram Integration:** Auto-post belt promotions
- **TikTok Challenges:** Weekly technique challenges
- **Strava for Judo:** Track training like runners track miles

### Advanced Social:
- **Study Groups:** Form groups to prepare for grading together
- **Mentor Matching:** Pair beginners with experienced Judoka
- **Technique Challenges:** "Master Uchi Mata this month"
- **Competition Brackets:** In-app tournament tracking

### For Senseis:
- **Revenue Dashboard:** See income, projections
- **Student Insights:** Who's at risk of dropping out
- **Curriculum Builder:** Drag-drop lesson planner
- **Video Analysis Tools:** Annotate technique videos

---

## ✅ Definition of Done

### Social Platform ✓ When:
- [ ] Users can view feed on mobile/desktop
- [ ] Senseis can post announcements
- [ ] Achievement posts auto-generate
- [ ] Users can react and comment
- [ ] Push notifications work
- [ ] Feed loads < 1 second

### Careers Hub ✓ When:
- [ ] Job board displays all 9 roles
- [ ] Senseis can apply in < 5 minutes
- [ ] Applications routed to hiring managers
- [ ] Email confirmations sent
- [ ] Admin can review/shortlist candidates

### Simple Auth ✓ When:
- [ ] Google OAuth works (prod)
- [ ] Users can sign up in < 3 min
- [ ] Age verification (16+) enforced
- [ ] Profile auto-filled from Google
- [ ] No mock/dev data in prod

### Teen UX ✓ When:
- [ ] Onboarding tour available
- [ ] Navigation is thumb-friendly (mobile)
- [ ] All actions have feedback (animations)
- [ ] Help tooltips on key features
- [ ] 5 teens (16-18) test and approve

---

## 🔥 Next Steps

1. **Review this plan** - Confirm priorities
2. **Design mockups** - Social feed + careers page
3. **Set up Google OAuth** - Kill mock auth
4. **Build MVP news feed** - Start with announcements
5. **Create careers page** - Static first, then dynamic
6. **User testing** - 10 senseis + 10 teens (16-18)

---

**Ready to build?** Let me know which phase to start with! 🚀
