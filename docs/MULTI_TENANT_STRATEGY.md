# JUDO PLATFORM - Complete Multi-Tenant Strategy & Architecture
> **The Ultimate Luxury Judo Club Management Platform**
>
> **Current State**: 8.8/10 - Beautiful single-club prototype
> **Target**: 10/10 - Industry-leading multi-tenant SaaS platform
> **Vision**: The Shopify of judo clubs worldwide

---

## 🎯 EXECUTIVE DECISIONS (Based on Research)

### Strategic Positioning
**We are building**: A multi-tenant SaaS platform where judo clubs get professional management software for free, and we earn 12% of member subscription revenue.

**Business Model**: B2B2C Marketplace
- **B2B**: Clubs use our platform to manage operations
- **B2C**: Members subscribe to clubs through our platform
- **Revenue**: 12% commission on all member subscriptions

**Market Opportunity**:
- 20,000+ judo clubs worldwide (5,000+ in UK/Europe)
- Average club: 50-200 members at £30-50/month
- Target: 500 clubs in Year 1 → £375,000 monthly transaction volume → £45,000/month platform revenue

---

## 🏗️ ARCHITECTURE DECISIONS

### 1. Multi-Tenancy: Pool Model (Shared Schema)

**Decision**: Single Convex database with `clubId` tenant isolation

**Rationale**:
- Cost-effective for 0-1000 clubs (research shows this is standard)
- Convex's serverless model handles scale automatically
- Simple to build and maintain initially
- Migration path exists if needed later

**Implementation**:
```typescript
// Every table has clubId for isolation
export const membersTable = defineTable({
  clubId: v.id("clubs"),           // Tenant isolation
  userId: v.id("users"),           // Link to auth
  name: v.string(),
  email: v.string(),
  beltRank: v.string(),
  danKyuRank: v.optional(v.string()), // "1st Dan", "3rd Kyu"
  phoneNumber: v.optional(v.string()),
  emergencyContact: v.optional(v.object({
    name: v.string(),
    phone: v.string(),
    relationship: v.string(),
  })),
  dateOfBirth: v.optional(v.number()),
  joinedDate: v.number(),
  subscriptionStatus: v.union(
    v.literal("active"),
    v.literal("paused"),
    v.literal("cancelled"),
    v.literal("trial")
  ),
  subscriptionTier: v.union(
    v.literal("beginner"),    // Shokyu (初級)
    v.literal("intermediate"), // Chuukyuu (中級)
    v.literal("advanced"),     // Koukyuu (高級)
    v.literal("unlimited")
  ),
  stripeCustomerId: v.optional(v.string()),
  totalSessions: v.number(),
  currentStreak: v.number(),
  notes: v.optional(v.string()), // Coach notes
  medicalInfo: v.optional(v.string()),
  profilePhotoUrl: v.optional(v.string()),
})
  .index("by_club", ["clubId"])
  .index("by_club_and_email", ["clubId", "email"])
  .index("by_user", ["userId"]);

// All queries filtered by clubId
export const getMembers = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const clubId = await getClubIdForUser(ctx, identity.subject);

    return await ctx.db
      .query("members")
      .withIndex("by_club", (q) => q.eq("clubId", clubId))
      .collect();
  },
});
```

**Security**: Convex auth ensures users only access their club's data

---

### 2. Payment Model: Stripe Connect Express + 12% Commission

**Decision**: Stripe Connect Express Accounts with application fees

**Revenue Structure**:
```
Member pays £35/month to London Judo Club
├─ Stripe fees: £1.12 (3.2%)
├─ Platform fee: £4.20 (12% of £35)
└─ Club receives: £29.68 (84.8% of £35)

Platform earns £4.20 per member per month
500 clubs × 100 avg members × £4.20 = £210,000/month = £2.52M/year
```

**Why 12%?**
- ClassPass/Mindbody: ~30% (we're cheaper)
- Shopify: 2.9% + $0.30 + subscription fee (similar total)
- Industry standard for managed platforms: 10-15%
- Accounts for support, hosting, features

**Payout Schedule**:
- Standard: Weekly automatic payouts (free)
- Express: Instant payout for 1.5% fee (optional)

**Implementation**:
```typescript
// Stripe Connect onboarding
export const createStripeConnectedAccount = mutation({
  args: { clubId: v.id("clubs") },
  handler: async (ctx, { clubId }) => {
    // Create Express account for club
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'GB',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
    });

    // Save to club record
    await ctx.db.patch(clubId, {
      stripeAccountId: account.id,
      stripeOnboardingComplete: false,
    });

    // Generate onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${SITE_URL}/club/settings/payments`,
      return_url: `${SITE_URL}/club/settings/payments/complete`,
      type: 'account_onboarding',
    });

    return { url: accountLink.url };
  },
});

// Member subscription with application fee
export const createSubscription = mutation({
  args: {
    memberId: v.id("members"),
    tierId: v.string(),
  },
  handler: async (ctx, { memberId, tierId }) => {
    const member = await ctx.db.get(memberId);
    const club = await ctx.db.get(member.clubId);

    // Create subscription on club's connected account
    const subscription = await stripe.subscriptions.create({
      customer: member.stripeCustomerId,
      items: [{ price: TIER_PRICES[tierId] }],
      application_fee_percent: 12, // Platform takes 12%
    }, {
      stripeAccount: club.stripeAccountId, // Charge on club's account
    });

    await ctx.db.patch(memberId, {
      subscriptionStatus: "active",
      stripeSubscriptionId: subscription.id,
    });
  },
});
```

---

### 3. User Hierarchy: 6 Roles with Granular Permissions

**Role Structure**:
```
Platform Level:
└─ Platform Admin (JUDO team)
   ├─ Full access to all clubs (support)
   ├─ Analytics across all clubs
   ├─ Billing and payouts
   └─ Club approval/suspension

Club Level (Multi-tenant):
└─ Club Owner / Shihan (館長 - Kanchō)
   ├─ Full club management
   ├─ Billing and payments
   ├─ Coach management
   └─ Club settings

├─ Head Sensei (師範 - Shihan)
│  ├─ All instructor permissions
│  ├─ Coach management
│  ├─ Curriculum design
│  └─ No billing access

├─ Sensei (先生 - Instructor)
│  ├─ Class management
│  ├─ Attendance tracking
│  ├─ Member progress notes
│  └─ Belt grading recommendations

├─ Sempai (先輩 - Senior Student/Assistant)
│  ├─ Check-in assistance
│  ├─ View class roster
│  └─ Limited attendance marking

└─ Front Desk
   ├─ Check-in only
   ├─ View schedules
   └─ Member lookup

Member Level:
└─ Judoka (柔道家 - Member)
   ├─ Self check-in
   ├─ View progress
   ├─ Manage subscription
   └─ Book classes

└─ Guardian (Parent/Legal Guardian)
   ├─ Manage children's accounts
   ├─ View children's progress
   └─ Handle payments for family
```

**Permission System** (Resource.Action pattern):
```typescript
export const PERMISSIONS = {
  // Member management
  "members.view": ["platform_admin", "club_owner", "head_sensei", "sensei", "sempai", "front_desk"],
  "members.create": ["platform_admin", "club_owner", "head_sensei", "front_desk"],
  "members.edit": ["platform_admin", "club_owner", "head_sensei"],
  "members.delete": ["platform_admin", "club_owner"],
  "members.notes.write": ["club_owner", "head_sensei", "sensei"],

  // Class management
  "classes.view": ["platform_admin", "club_owner", "head_sensei", "sensei", "sempai"],
  "classes.create": ["club_owner", "head_sensei", "sensei"],
  "classes.edit": ["club_owner", "head_sensei", "sensei"],
  "classes.delete": ["club_owner", "head_sensei"],

  // Attendance
  "attendance.mark": ["club_owner", "head_sensei", "sensei", "sempai", "front_desk"],
  "attendance.edit": ["club_owner", "head_sensei", "sensei"],
  "attendance.export": ["club_owner", "head_sensei"],

  // Billing
  "billing.view": ["platform_admin", "club_owner"],
  "billing.manage": ["platform_admin", "club_owner"],
  "payments.process": ["platform_admin", "club_owner"],

  // Grading
  "grading.schedule": ["club_owner", "head_sensei"],
  "grading.evaluate": ["club_owner", "head_sensei", "sensei"],
  "grading.promote": ["club_owner", "head_sensei"],

  // Settings
  "settings.club": ["platform_admin", "club_owner"],
  "settings.branding": ["club_owner"],
  "settings.coaches": ["club_owner", "head_sensei"],
} as const;

// Check permission helper
export const hasPermission = (
  userRole: UserRole,
  permission: keyof typeof PERMISSIONS
): boolean => {
  return PERMISSIONS[permission].includes(userRole);
};
```

---

### 4. Club URLs: Path-Based with Custom Slugs

**Decision**: `judoclub.app/clubs/{slug}` for public pages

**URL Structure**:
```
Public Pages:
- judoclub.app/clubs/london-judo        → Club landing page
- judoclub.app/clubs/london-judo/join   → Join/signup
- judoclub.app/clubs/london-judo/schedule → Public class schedule
- judoclub.app/clubs/london-judo/contact  → Contact form

Dashboards (authenticated):
- judoclub.app/dashboard                → Role-based redirect
- judoclub.app/dashboard/member         → Member dashboard
- judoclub.app/dashboard/sensei         → Sensei dashboard
- judoclub.app/dashboard/owner          → Club owner dashboard
- judoclub.app/dashboard/platform       → Platform admin

Club Management:
- judoclub.app/club/settings            → Club settings
- judoclub.app/club/members             → Member management
- judoclub.app/club/classes             → Class management
- judoclub.app/club/billing             → Billing & payments
```

**Why Path-Based** (not subdomains):
- Simpler SSL/DNS management
- Better SEO (single domain authority)
- Easier development/testing
- Lower cost (no wildcard SSL needed)
- Future: Can offer custom domains as premium feature

---

### 5. Club Discovery: Hybrid Model (Marketplace + Direct Links)

**Decision**: Both marketplace discovery AND direct club links

**Marketplace** (`judoclub.app/find-clubs`):
```typescript
// Search/filter clubs
- Location search (postcode/city)
- Distance radius (5mi, 10mi, 25mi)
- Filter by:
  - Beginner-friendly
  - Competition training
  - Kids classes
  - Adult classes
  - Belt ranks offered
- Sort by:
  - Distance
  - Price (lowest to highest)
  - Rating/reviews
  - Availability
```

**Direct Links** (for club marketing):
```
Clubs share: judoclub.app/join/london-judo

Benefits:
- Faster conversion (no search step)
- Trackable (attribution)
- Brandable (club can use on flyers, website)
- UTM parameters for analytics
```

---

### 6. Onboarding: 14-Day Free Trial (No Credit Card)

**Decision**: Frictionless trial with gamified activation

**Phase 1: Club Signup** (< 2 minutes)
```
Step 1: Basic Info
- Club name
- Your name (club owner)
- Email
- Password
- Country/timezone

Step 2: Club Details
- Location (address/postcode)
- Phone number
- Website (optional)
- Founded year
- Number of current members (dropdown: 0-10, 10-25, 25-50, 50-100, 100+)

Step 3: Instant Access
- Email verification (but can use app first)
- Trial starts immediately
- 14 days free, no credit card required
```

**Phase 2: Setup Wizard** (Gamified checklist)
```
Progress: 0% complete → Unlock +7 bonus trial days when 100%

□ Add your first class (5% - 2 min)
□ Import or add 3 members (10% - 5 min)
□ Upload club logo (5% - 1 min)
□ Customize club colors (5% - 1 min)
□ Set up class schedule (15% - 10 min)
□ Invite a coach/sensei (10% - 3 min)
□ Connect Stripe for payments (20% - 5 min) *
□ Test check-in with QR code (10% - 2 min)
□ Add club description & photos (10% - 5 min)
□ Set belt progression system (10% - 3 min)

* Can skip until ready to activate

Completion: 14 days → 21 days trial
```

**Phase 3: Email Nurture Sequence**
```
Day 1: Welcome! Here's how to get started (video tour)
Day 2: Success story: How Shogun Judo Club got 50 members in 2 weeks
Day 3: Quick tip: Import your existing members with CSV
Day 5: Feature spotlight: QR check-in makes life easier
Day 7: You're halfway through your trial! Questions?
Day 10: Case study: How clubs use our analytics
Day 12: Your trial ends in 2 days - ready to launch?
Day 14: Last day! Convert now and get 20% off first 3 months
Day 16 (if not converted): Miss us? Come back anytime
Day 30 (if not converted): Final offer: 30-day money-back guarantee
```

**Conversion Targets**:
- 30% complete setup wizard (industry: 25%)
- 25% trial-to-paid conversion (industry: 15-20%)
- 85% annual retention (industry: 80%)

---

### 7. Platform Admin Access: Full Visibility for Support

**Decision**: Platform admin can view/edit any club (with audit log)

**What Platform Admin Can Do**:
✅ View all clubs' dashboards (read-only by default)
✅ See aggregate analytics across all clubs
✅ Access any club for support (with reason + logging)
✅ Suspend/reactivate clubs (for policy violations)
✅ View payment flows and payouts
✅ Approve/reject club applications (if manual review enabled)
✅ Generate platform-wide reports

**What Platform Admin CANNOT Do** (without explicit permission):
❌ Modify individual club data without logging
❌ See member sensitive info (medical, emergency contacts) unless requested
❌ Process refunds without club approval
❌ Delete clubs without confirmation

**Audit Trail**:
```typescript
export const adminAccessLog = defineTable({
  adminUserId: v.id("users"),
  adminName: v.string(),
  clubId: v.id("clubs"),
  clubName: v.string(),
  action: v.string(), // "viewed_dashboard", "edited_member", "suspended_club"
  reason: v.string(),  // "Support ticket #1234", "Payment issue"
  timestamp: v.number(),
  ipAddress: v.optional(v.string()),
  changes: v.optional(v.any()), // What was changed (JSON)
});

// Before platform admin accesses club
export const requestClubAccess = mutation({
  args: {
    clubId: v.id("clubs"),
    reason: v.string(),
  },
  handler: async (ctx, { clubId, reason }) => {
    const admin = await requirePlatformAdmin(ctx);

    // Log the access
    await ctx.db.insert("adminAccessLog", {
      adminUserId: admin._id,
      adminName: admin.name,
      clubId,
      clubName: (await ctx.db.get(clubId)).name,
      action: "accessed_club_dashboard",
      reason,
      timestamp: Date.now(),
    });

    // Optionally notify club owner
    if (reason.includes("investigation")) {
      await sendEmailToClubOwner(clubId, "Platform support accessed your account", reason);
    }
  },
});
```

---

### 8. Branding: Basic Customization (MVP)

**Decision**: Limited branding initially, expand in future

**What Clubs CAN Customize** (MVP):
```typescript
export const clubBranding = {
  // Visual
  logoUrl: string,              // Square logo (min 512x512px)
  coverPhotoUrl: string,        // Banner (min 1920x400px)
  primaryColor: string,         // Hex color for buttons/links

  // Content
  clubName: string,
  tagline: string,              // One-line pitch
  description: string,          // Rich text, max 500 words
  aboutSensei: string,          // Instructor bios

  // Contact
  address: string,
  city: string,
  postcode: string,
  phoneNumber: string,
  email: string,
  websiteUrl: string,
  socialMedia: {
    facebook: string,
    instagram: string,
    twitter: string,
  },

  // Operations
  openingHours: WeeklySchedule,
  facilities: string[],         // ["Tatami mats", "Changing rooms", "Parking"]
  suitableFor: string[],        // ["Beginners", "Kids", "Competition"]
};
```

**What Clubs CANNOT Customize** (MVP):
❌ Custom CSS/themes (security risk)
❌ Custom domains (complexity)
❌ Layout/structure of pages
❌ Email templates
❌ Font choices

**Future Premium Features**:
- Custom subdomain (`london-judo.judoclub.app`)
- Custom domain (`www.london-judo.com`)
- Advanced theme editor
- Custom email templates
- White-label branding (remove "Powered by JUDO")

---

## 🥋 PROPER JUDO TERMINOLOGY

### Instructor Titles (Hierarchy)

```typescript
export type InstructorTitle =
  | "shihan"    // 師範 - Master (4th+ Dan, head of dojo)
  | "sensei"    // 先生 - Teacher (1st-3rd Dan typically)
  | "sempai"    // 先輩 - Senior student (assists, Brown+)
  | "kohai";    // 後輩 - Junior student

export const INSTRUCTOR_ROLES = {
  shihan: {
    title: "Shihan",
    japanese: "師範",
    description: "Master Instructor (4th Dan or higher)",
    permissions: ["club_owner", "head_sensei"],
  },
  sensei: {
    title: "Sensei",
    japanese: "先生",
    description: "Instructor (1st-3rd Dan)",
    permissions: ["sensei"],
  },
  sempai: {
    title: "Sempai",
    japanese: "先輩",
    description: "Senior Student Assistant",
    permissions: ["sempai"],
  },
};
```

### Belt System (Kyu/Dan)

```typescript
export type BeltColor =
  | "white" | "yellow" | "orange"
  | "green" | "blue" | "brown" | "black";

export type KyuRank = "6th_kyu" | "5th_kyu" | "4th_kyu" | "3rd_kyu" | "2nd_kyu" | "1st_kyu";
export type DanRank = "1st_dan" | "2nd_dan" | "3rd_dan" | "4th_dan" | "5th_dan" |
                      "6th_dan" | "7th_dan" | "8th_dan" | "9th_dan" | "10th_dan";

export const BELT_SYSTEM = {
  // Kyu grades (colored belts, descending)
  white: { kyuRank: "6th_kyu", japanese: "六級", color: "#FFFFFF" },
  yellow: { kyuRank: "5th_kyu", japanese: "五級", color: "#FFD700" },
  orange: { kyuRank: "4th_kyu", japanese: "四級", color: "#FFA500" },
  green: { kyuRank: "3rd_kyu", japanese: "三級", color: "#228B22" },
  blue: { kyuRank: "2nd_kyu", japanese: "二級", color: "#1E40AF" },
  brown: { kyuRank: "1st_kyu", japanese: "一級", color: "#8B4513" },

  // Dan grades (black belt, ascending)
  black_1st: { danRank: "1st_dan", japanese: "初段", title: "Shodan" },
  black_2nd: { danRank: "2nd_dan", japanese: "二段", title: "Nidan" },
  black_3rd: { danRank: "3rd_dan", japanese: "三段", title: "Sandan" },
  black_4th: { danRank: "4th_dan", japanese: "四段", title: "Yondan" },
  black_5th: { danRank: "5th_dan", japanese: "五段", title: "Godan" },
  black_6th: { danRank: "6th_dan", japanese: "六段", title: "Rokudan" },
  black_7th: { danRank: "7th_dan", japanese: "七段", title: "Shichidan" },
  black_8th: { danRank: "8th_dan", japanese: "八段", title: "Hachidan" },
  black_9th: { danRank: "9th_dan", japanese: "九段", title: "Kudan" },
  black_10th: { danRank: "10th_dan", japanese: "十段", title: "Judan" },
};

// Display format
export const formatBeltRank = (beltColor: BeltColor, kyuDan?: string) => {
  if (beltColor === "black" && kyuDan) {
    return `Black Belt ${kyuDan.replace("_", " ").replace("dan", "Dan")}`; // "Black Belt 1st Dan"
  }
  const kyu = BELT_SYSTEM[beltColor]?.kyuRank.replace("_kyu", " Kyu");
  return `${beltColor.charAt(0).toUpperCase()}${beltColor.slice(1)} Belt (${kyu})`;
};
```

### Training Terms

```typescript
export const JUDO_TERMINOLOGY = {
  // Facility
  dojo: "道場",           // Training hall
  tatami: "畳",           // Mat

  // Equipment
  gi: "着",               // Training uniform (judogi)
  obi: "帯",              // Belt

  // Members
  judoka: "柔道家",       // Judo practitioner
  uke: "受け",            // Person receiving technique
  tori: "取り",           // Person performing technique

  // Training methods
  kata: "型",             // Forms/patterns
  randori: "乱取り",      // Free practice/sparring
  uchikomi: "打ち込み",   // Repetition drills
  nagekomi: "投げ込み",   // Throwing practice
  newaza: "寝技",         // Groundwork
  tachiwaza: "立ち技",    // Standing techniques

  // Competition
  shiai: "試合",          // Competition/tournament

  // Grading
  shinsa: "審査",         // Grading examination

  // Etiquette
  rei: "礼",              // Bow
  hajime: "始め",         // Begin
  matte: "待て",          // Wait/stop
  soremade: "それまで",   // That's all (end of match)

  // Skill levels
  shokyu: "初級",         // Beginner
  chukyuu: "中級",        // Intermediate
  kokyu: "高級",          // Advanced
};
```

---

## 📱 DATABASE SCHEMA (Complete Convex)

### Core Tables

```typescript
// ===== CLUBS TABLE =====
export const clubs = defineTable({
  // Identity
  slug: v.string(),                    // URL slug: "london-judo"
  name: v.string(),                    // "London Judo Club"
  tagline: v.optional(v.string()),     // "Traditional Kodokan Judo in Central London"
  description: v.optional(v.string()), // Rich text

  // Branding
  logoUrl: v.optional(v.string()),
  coverPhotoUrl: v.optional(v.string()),
  primaryColor: v.string(),            // Hex color

  // Contact
  email: v.string(),
  phoneNumber: v.optional(v.string()),
  websiteUrl: v.optional(v.string()),
  address: v.string(),
  city: v.string(),
  postcode: v.string(),
  country: v.string(),
  coordinates: v.optional(v.object({
    lat: v.number(),
    lng: v.number(),
  })),
  socialMedia: v.optional(v.object({
    facebook: v.optional(v.string()),
    instagram: v.optional(v.string()),
    twitter: v.optional(v.string()),
  })),

  // Settings
  timezone: v.string(),                // "Europe/London"
  currency: v.string(),                // "GBP"
  locale: v.string(),                  // "en-GB"

  // Stripe
  stripeAccountId: v.optional(v.string()),
  stripeOnboardingComplete: v.boolean(),

  // Status
  status: v.union(
    v.literal("trial"),              // 14-day trial
    v.literal("active"),             // Paying/active
    v.literal("paused"),             // Voluntarily paused
    v.literal("suspended"),          // Admin suspended
    v.literal("cancelled")           // Closed
  ),
  trialEndsAt: v.optional(v.number()),
  activatedAt: v.optional(v.number()),

  // Metrics
  totalMembers: v.number(),
  activeMembers: v.number(),
  totalRevenue: v.number(),            // All-time
  monthlyRevenue: v.number(),          // Current month

  // Meta
  createdAt: v.number(),
  updatedAt: v.number(),
  createdBy: v.id("users"),            // Club owner
})
  .index("by_slug", ["slug"])
  .index("by_status", ["status"])
  .index("by_city", ["city", "country"]);

// ===== USERS TABLE (Platform-wide) =====
export const users = defineTable({
  // Auth (Convex Auth)
  clerkId: v.string(),                 // Clerk user ID
  email: v.string(),
  name: v.string(),
  profilePhotoUrl: v.optional(v.string()),

  // Default club (if member/staff of multiple clubs)
  defaultClubId: v.optional(v.id("clubs")),

  // Platform role
  platformRole: v.union(
    v.literal("platform_admin"),
    v.literal("user")
  ),

  // Meta
  createdAt: v.number(),
  lastLoginAt: v.number(),
})
  .index("by_clerk_id", ["clerkId"])
  .index("by_email", ["email"]);

// ===== CLUB_MEMBERS TABLE (User's role in a club) =====
export const clubMembers = defineTable({
  clubId: v.id("clubs"),
  userId: v.id("users"),

  // Role in THIS club
  role: v.union(
    v.literal("club_owner"),
    v.literal("head_sensei"),
    v.literal("sensei"),
    v.literal("sempai"),
    v.literal("front_desk"),
    v.literal("member")
  ),

  // Member details
  beltColor: v.union(
    v.literal("white"), v.literal("yellow"), v.literal("orange"),
    v.literal("green"), v.literal("blue"), v.literal("brown"), v.literal("black")
  ),
  kyuDanRank: v.optional(v.string()),  // "3rd_kyu", "1st_dan"
  instructorTitle: v.optional(v.union(
    v.literal("shihan"),
    v.literal("sensei"),
    v.literal("sempai")
  )),

  // Contact
  phoneNumber: v.optional(v.string()),
  emergencyContact: v.optional(v.object({
    name: v.string(),
    phone: v.string(),
    relationship: v.string(),
  })),

  // Personal
  dateOfBirth: v.optional(v.number()),
  medicalInfo: v.optional(v.string()),

  // Membership
  subscriptionStatus: v.union(
    v.literal("trial"),
    v.literal("active"),
    v.literal("paused"),
    v.literal("cancelled")
  ),
  subscriptionTier: v.union(
    v.literal("beginner"),         // Shokyu
    v.literal("intermediate"),     // Chukyuu
    v.literal("advanced"),         // Kokyu
    v.literal("unlimited")
  ),
  stripeCustomerId: v.optional(v.string()),
  stripeSubscriptionId: v.optional(v.string()),

  // Activity
  joinedDate: v.number(),
  totalSessions: v.number(),
  currentStreak: v.number(),          // Consecutive weeks attended
  lastAttendedDate: v.optional(v.number()),

  // Notes (sensei can add)
  notes: v.optional(v.string()),

  // Status
  isActive: v.boolean(),

  // Meta
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_club", ["clubId"])
  .index("by_user", ["userId"])
  .index("by_club_and_user", ["clubId", "userId"])
  .index("by_club_and_role", ["clubId", "role"])
  .index("by_club_and_belt", ["clubId", "beltColor"]);

// ===== CLASSES TABLE =====
export const classes = defineTable({
  clubId: v.id("clubs"),

  // Class details
  name: v.string(),                    // "Monday Evening Fundamentals"
  description: v.optional(v.string()),
  skillLevel: v.union(
    v.literal("beginner"),           // Shokyu (初級)
    v.literal("intermediate"),       // Chukyuu (中級)
    v.literal("advanced"),           // Kokyu (高級)
    v.literal("all_levels")
  ),

  // Schedule
  dayOfWeek: v.union(
    v.literal("monday"),
    v.literal("tuesday"),
    v.literal("wednesday"),
    v.literal("thursday"),
    v.literal("friday"),
    v.literal("saturday"),
    v.literal("sunday")
  ),
  startTime: v.string(),               // "19:00"
  endTime: v.string(),                 // "20:30"
  timezone: v.string(),                // Inherit from club

  // Recurring
  isRecurring: v.boolean(),
  recurrenceRule: v.optional(v.string()), // iCal RRULE format

  // Instructors
  primarySenseiId: v.id("clubMembers"),
  assistantSenseiIds: v.optional(v.array(v.id("clubMembers"))),

  // Capacity
  maxCapacity: v.number(),
  currentEnrollment: v.number(),
  waitlistEnabled: v.boolean(),

  // Training focus
  trainingType: v.optional(v.union(
    v.literal("kata"),               // Forms
    v.literal("randori"),            // Free practice
    v.literal("newaza"),             // Groundwork
    v.literal("tachiwaza"),          // Standing
    v.literal("competition_prep"),
    v.literal("general")
  )),

  // Location
  location: v.optional(v.string()),    // Room/area in dojo

  // Status
  isActive: v.boolean(),

  // Meta
  createdAt: v.number(),
  updatedAt: v.number(),
  createdBy: v.id("users"),
})
  .index("by_club", ["clubId"])
  .index("by_club_and_day", ["clubId", "dayOfWeek"])
  .index("by_sensei", ["primarySenseiId"]);

// ===== ATTENDANCE TABLE =====
export const attendance = defineTable({
  clubId: v.id("clubs"),
  classId: v.id("classes"),
  memberId: v.id("clubMembers"),

  // Attendance
  status: v.union(
    v.literal("present"),
    v.literal("absent"),
    v.literal("late"),
    v.literal("excused")
  ),
  checkedInAt: v.optional(v.number()),
  checkedInBy: v.optional(v.id("users")), // Sensei or self
  checkInMethod: v.optional(v.union(
    v.literal("qr_code"),
    v.literal("manual"),
    v.literal("self")
  )),

  // Session details
  classDate: v.number(),               // Timestamp for this session
  duration: v.optional(v.number()),    // Minutes attended

  // Notes
  senseiNotes: v.optional(v.string()), // Progress notes
  techniques: v.optional(v.array(v.string())), // Techniques practiced

  // Meta
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_club", ["clubId"])
  .index("by_class", ["classId"])
  .index("by_member", ["memberId"])
  .index("by_club_and_date", ["clubId", "classDate"])
  .index("by_member_and_date", ["memberId", "classDate"]);

// ===== BELT_PROGRESSIONS TABLE =====
export const beltProgressions = defineTable({
  clubId: v.id("clubs"),
  memberId: v.id("clubMembers"),

  // From -> To
  fromBelt: v.string(),                // "blue"
  fromKyuDan: v.optional(v.string()),  // "2nd_kyu"
  toBelt: v.string(),                  // "brown"
  toKyuDan: v.optional(v.string()),    // "1st_kyu"

  // Grading
  gradingDate: v.number(),
  examinerIds: v.array(v.id("clubMembers")), // Sensei who graded
  result: v.union(
    v.literal("passed"),
    v.literal("failed"),
    v.literal("deferred")
  ),

  // Requirements
  requiredSessions: v.number(),
  completedSessions: v.number(),
  techniquesRequired: v.optional(v.array(v.string())),
  techniquesCompleted: v.optional(v.array(v.string())),

  // Feedback
  notes: v.optional(v.string()),
  strengths: v.optional(v.array(v.string())),
  areasToImprove: v.optional(v.array(v.string())),

  // Meta
  createdAt: v.number(),
})
  .index("by_club", ["clubId"])
  .index("by_member", ["memberId"])
  .index("by_club_and_date", ["clubId", "gradingDate"]);

// ===== PAYMENTS TABLE =====
export const payments = defineTable({
  clubId: v.id("clubs"),
  memberId: v.id("clubMembers"),

  // Stripe
  stripePaymentIntentId: v.string(),
  stripeChargeId: v.string(),

  // Amount
  amount: v.number(),                  // Pence
  currency: v.string(),                // "GBP"
  platformFee: v.number(),             // Platform's 12%
  stripeFee: v.number(),               // Stripe's fee
  clubReceived: v.number(),            // Net to club

  // Payment
  status: v.union(
    v.literal("pending"),
    v.literal("succeeded"),
    v.literal("failed"),
    v.literal("refunded")
  ),
  paymentMethod: v.union(
    v.literal("card"),
    v.literal("direct_debit"),
    v.literal("bank_transfer")
  ),

  // Subscription
  subscriptionTier: v.string(),
  billingPeriod: v.union(
    v.literal("monthly"),
    v.literal("quarterly"),
    v.literal("annual")
  ),

  // Dates
  paidAt: v.optional(v.number()),
  refundedAt: v.optional(v.number()),

  // Meta
  createdAt: v.number(),
})
  .index("by_club", ["clubId"])
  .index("by_member", ["memberId"])
  .index("by_club_and_date", ["clubId", "createdAt"])
  .index("by_stripe_payment_intent", ["stripePaymentIntentId"]);

// ===== ANNOUNCEMENTS TABLE =====
export const announcements = defineTable({
  clubId: v.id("clubs"),

  // Content
  title: v.string(),
  content: v.string(),                 // Rich text/markdown

  // Targeting
  audienceType: v.union(
    v.literal("all"),                // All members
    v.literal("members_only"),       // Exclude staff
    v.literal("sensei"),             // Instructors only
    v.literal("specific_belt"),      // By belt color
    v.literal("specific_class")      // By class enrollment
  ),
  audienceFilter: v.optional(v.any()), // JSON filter criteria

  // Priority
  priority: v.union(
    v.literal("low"),
    v.literal("normal"),
    v.literal("high"),
    v.literal("urgent")
  ),

  // Delivery
  sendEmail: v.boolean(),
  sendPush: v.boolean(),
  pinToDashboard: v.boolean(),

  // Status
  publishedAt: v.optional(v.number()),
  expiresAt: v.optional(v.number()),

  // Meta
  createdAt: v.number(),
  createdBy: v.id("users"),
})
  .index("by_club", ["clubId"])
  .index("by_club_and_published", ["clubId", "publishedAt"]);
```

---

## 🚀 10-WEEK IMPLEMENTATION ROADMAP

### WEEK 1-2: Multi-Tenant Foundation → 8.8/10 → 9.0/10

**Goal**: Transform single-club app to multi-tenant platform

**Tasks**:
1. Add `clubId` to all tables
2. Update all queries to filter by `clubId`
3. Implement Convex Auth (Clerk integration)
4. Create `clubs`, `users`, `clubMembers` tables
5. Build club context provider
6. Add role-based access control
7. Update navigation to show current club
8. Test data isolation (critical!)

**Deliverables**:
- ✅ Multi-tenant database schema
- ✅ User can belong to multiple clubs
- ✅ Data completely isolated per club
- ✅ Roles enforced in queries

---

### WEEK 3-4: Club Onboarding & Public Pages → 9.0/10 → 9.3/10

**Goal**: Clubs can sign up and have public pages

**Tasks**:
1. Build club signup flow
2. Create setup wizard (gamified checklist)
3. Build club public landing page (`/clubs/{slug}`)
4. Add club customization (logo, colors, description)
5. Build marketplace (`/find-clubs`)
6. Implement club search/filter
7. Add trial tracking (14 days)
8. Email nurture sequence

**Deliverables**:
- ✅ Clubs can self-signup
- ✅ Public club pages live
- ✅ Marketplace for discovery
- ✅ 14-day trial with email sequence

---

### WEEK 5-7: Stripe Connect & Payments → 9.3/10 → 9.6/10

**Goal**: Money flows through platform

**Tasks**:
1. Integrate Stripe Connect Express
2. Build club Stripe onboarding flow
3. Implement member subscription flow
4. Add application fees (12%)
5. Build webhook handlers
6. Create billing dashboard for clubs
7. Add payment history
8. Implement refund workflow
9. Build platform admin payout dashboard
10. Test payment flows thoroughly

**Deliverables**:
- ✅ Clubs connect Stripe accounts
- ✅ Members can subscribe to clubs
- ✅ Platform earns 12% commission
- ✅ Weekly automatic payouts
- ✅ Billing dashboards working

---

### WEEK 8-9: Sensei Features & Judo Terminology → 9.6/10 → 9.8/10

**Goal**: Make it feel authentic to judo practitioners

**Tasks**:
1. Implement full Kyu/Dan belt system
2. Add instructor titles (Shihan, Sensei, Sempai)
3. Build member profile detail view
4. Add sensei notes on members
5. Implement class management (CRUD)
6. Build attendance reason codes
7. Add training type tracking (Kata, Randori, etc.)
8. Create belt grading workflow
9. Add technique tracking
10. Build member progress timeline
11. Replace all "member" → "judoka"
12. Add judo terminology glossary

**Deliverables**:
- ✅ Proper judo terminology throughout
- ✅ Sensei can manage classes
- ✅ Member progress tracking
- ✅ Belt grading system
- ✅ Training session notes

---

### WEEK 10: Polish & Launch → 9.8/10 → 10.0/10 🏆

**Goal**: Production-ready luxury product

**Tasks**:
1. PWA setup (offline, install)
2. Push notifications
3. Performance optimization (React best practices)
4. Accessibility audit
5. Mobile UX refinement
6. Error handling polish
7. Loading states everywhere
8. Empty states for all pages
9. Onboarding tour
10. Analytics integration
11. Security audit
12. Load testing
13. Documentation
14. Launch checklist

**Deliverables**:
- ✅ PWA installable
- ✅ Push notifications working
- ✅ 95+ Lighthouse score
- ✅ WCAG AA compliant
- ✅ Handles 1000+ concurrent users
- ✅ Full documentation

---

## 📊 SUCCESS METRICS

### Platform Metrics (Year 1)
```
Month 1-3:
- 10 beta clubs (manual outreach)
- 500 members across all clubs
- £15,000 monthly transaction volume
- £1,800/month platform revenue (12%)

Month 4-6:
- 50 clubs (word of mouth + marketing)
- 3,000 members
- £90,000 monthly transaction volume
- £10,800/month platform revenue

Month 7-12:
- 200 clubs (scaling up)
- 15,000 members
- £450,000 monthly transaction volume
- £54,000/month platform revenue

Year 1 Total: £648,000 platform revenue
```

### Club Metrics (Average per club)
```
Members: 75 (50 active subscribers)
Monthly Revenue: £1,875 (50 × £37.50)
Club Receives: £1,650 (88% after fees)
Platform Earns: £225 (12%)

ROI for Club:
Cost: £0 (free platform)
Revenue: £19,800/year
Saved: £3,000/year (vs custom software)
Time Saved: 10 hrs/week (automation)
```

### User Satisfaction Targets
```
Club Satisfaction:
- NPS Score: 50+ (industry: 30-40)
- Annual Retention: 85%+ (industry: 70-80%)
- Trial Conversion: 25%+ (industry: 15-20%)

Member Satisfaction:
- App Rating: 4.5+ stars
- Check-in Usage: 80%+ (vs manual)
- Churn Rate: <5%/month
```

---

## 🎯 LAUNCH STRATEGY

### Beta Phase (Month 1-2)
```
Target: 10 beta clubs (hand-picked)

Selection Criteria:
- 50-150 members (right size)
- Currently using spreadsheets (easy win)
- Engaged leadership (will give feedback)
- UK-based (easier support)
- Mix of beginner/advanced clubs

Offer:
- Free for 6 months (vs 14 days)
- Direct support (Slack/WhatsApp)
- Feature requests prioritized
- Beta tester badge
- Lifetime 25% discount

Goal: Learn, iterate, refine
```

### Public Launch (Month 3)
```
Marketing:
- Case studies from beta clubs
- "How [Club Name] doubled members in 60 days"
- Launch on Product Hunt
- Reddit: r/judo, r/martialarts
- Facebook groups: UK Judo coaches
- BJA (British Judo Association) partnership

Pricing:
- 14-day free trial (no credit card)
- 12% commission (vs 15% competitors)
- First 100 clubs: 10% commission for life

Press:
- Local newspapers (beta clubs)
- MartialArts.com feature
- British Judo magazine
```

---

## 💡 COMPETITIVE ADVANTAGES

### Why Clubs Choose JUDO over competitors:

**vs. Mindbody** (£119/month + fees):
✅ £0 upfront cost
✅ Lower commission (12% vs ~30%)
✅ Judo-specific (not generic fitness)
✅ Modern UX (they're dated)

**vs. Spreadsheets** (current solution for 70%):
✅ Automated billing
✅ QR check-in (no paper)
✅ Real-time analytics
✅ Member self-service
✅ Professional appearance

**vs. Custom Software** (£5,000+ build):
✅ £0 upfront cost
✅ Immediate setup
✅ Always updated
✅ No maintenance

**Our Unique Selling Points**:
1. **Free to start** - No barrier to entry
2. **Judo-authentic** - Proper terminology, belt system
3. **Beautiful UX** - Members love it
4. **QR check-in** - Modern, fast
5. **Fair pricing** - 12% vs 30% competitors
6. **Multi-club support** - Members train at multiple dojos

---

**THIS IS THE COMPLETE STRATEGY. Ready to build?** 🥋🚀
