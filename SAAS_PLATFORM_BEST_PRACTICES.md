# Multi-Tenant SaaS Platform Best Practices
## Research Report for JUDO Club Platform

**Date:** January 2026
**Project:** JUDO Club Manager
**Current Rating:** 8.0/10
**Target:** Multi-tenant SaaS platform for martial arts clubs

---

## Table of Contents

1. [Multi-Tenancy Architecture](#1-multi-tenancy-architecture)
2. [Payment Models & Stripe Connect](#2-payment-models--stripe-connect)
3. [SaaS Platform Examples](#3-saas-platform-examples)
4. [User Hierarchy & RBAC](#4-user-hierarchy--rbac)
5. [Onboarding Flows](#5-onboarding-flows)
6. [Recommendations for JUDO Platform](#6-recommendations-for-judo-platform)

---

## 1. Multi-Tenancy Architecture

### 1.1 Database Design Patterns

There are three primary multi-tenant database patterns, each offering different trade-offs:

#### **Pattern A: Shared Database, Shared Schema (Pool Model)**
- **Description:** All tenants share the same database and tables with a `tenant_id` column
- **Pros:**
  - Most cost-efficient approach
  - Simple to implement and maintain
  - Easy to deploy updates across all tenants
- **Cons:**
  - Limited tenant isolation
  - "Noisy neighbor" problem (one tenant's heavy usage affects others)
  - Cannot customize schema per tenant
- **Use Case:** Best for startups and early-stage products with uniform requirements

#### **Pattern B: Shared Database, Separate Schemas (Bridge Model)**
- **Description:** One database with multiple schemas, each tenant gets dedicated schema
- **Pros:**
  - Better isolation than Pool Model
  - Moderate cost efficiency
  - Easier tenant-specific backups
- **Cons:**
  - Many experts recommend avoiding this approach
  - Complexity comparable to Database per Tenant
  - Insufficient isolation for stringent regulatory compliance
- **Use Case:** Rarely recommended; neither fish nor fowl

#### **Pattern C: Database per Tenant (Silo Model)**
- **Description:** Each tenant receives a dedicated database
- **Pros:**
  - Strongest tenant isolation
  - Easy to customize per tenant
  - Simplified backups and migrations per tenant
  - Best for regulatory compliance
- **Cons:**
  - Highest infrastructure costs
  - Complex database management at scale
  - More difficult to deploy updates
- **Use Case:** Enterprise customers with strict compliance requirements

### 1.2 Current Best Practices (2026)

**Recommended Approach:**
> "Adopt the Shared Database, Shared Schema approach whenever possible, and only transition to Database per Tenant if compliance, scalability, or customization requirements necessitate it."

**Key Principle:**
- Start with **Pool Model** (Shared Schema with `tenant_id`)
- Only move to **Silo Model** (Database per Tenant) if business demands strict regulatory compliance from day 1

**Hybrid Architectures:**
- Many successful SaaS platforms use hybrid approaches
- Offer service tiers that map to different isolation models:
  - **Standard Tier:** Shared schema (cost-effective)
  - **Premium Tier:** Shared schema with guaranteed resources
  - **Enterprise Tier:** Dedicated database (maximum isolation)

### 1.3 Data Isolation Strategies

#### **Row-Level Security (RLS)**

For Pool Model implementations, Row-Level Security is the recommended approach:

**PostgreSQL RLS:**
- Centralizes isolation policies at the database level
- Enforces filtering even if application code has bugs
- Applications set session variables (e.g., `rls.org_id`) when connecting
- All queries automatically filtered by current tenant

**Convex Approach:**
- Convex doesn't use traditional RLS (not PostgreSQL-based)
- Authorization implemented at server function layer
- Uses `rowLevelSecurity` from `convex-helpers` library
- Validates user authorization in TypeScript before database operations
- MIT-licensed Convex Component for RLS available as open-source

**Implementation Pattern:**
```javascript
// Convex example
export const getClubMembers = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const clubId = identity.clubId; // Tenant identifier

    // All queries automatically filtered by clubId
    return await ctx.db
      .query("members")
      .filter(q => q.eq(q.field("clubId"), clubId))
      .collect();
  }
});
```

### 1.4 Performance Considerations

**Challenge: Noisy Neighbor Problem**
- One tenant's heavy usage can degrade performance for others
- Requires careful resource allocation and monitoring

**Solutions:**
1. **Resource Quotas:** Set limits per tenant on API calls, storage, bandwidth
2. **Rate Limiting:** Throttle requests from high-usage tenants
3. **Monitoring:** Track per-tenant resource consumption
4. **Pod Architecture:** Isolate large tenants (see Shopify example below)
5. **Caching:** Implement per-tenant caching strategies

### 1.5 Security Best Practices

**Data Leakage Prevention:**
1. **Defense in Depth:** Never rely on application code alone
2. **Database-Level Enforcement:** Use RLS or equivalent
3. **Authentication:** Integrate with Auth0, Okta, or Convex Auth
4. **API Security:** Validate tenant context on every request
5. **Audit Logging:** Track all cross-tenant access attempts

**Testing:**
- Implement automated tests that attempt cross-tenant access
- Regularly audit query patterns for missing tenant filters
- Penetration testing focused on tenant isolation

---

## 2. Payment Models & Stripe Connect

### 2.1 Stripe Connect Account Types

#### **Standard Accounts**
- **Control:** Connected account owns customer relationship
- **Branding:** Stripe branding in checkout
- **Best For:** Simple marketplaces where vendors manage their own payments
- **Onboarding:** Less complex, Stripe handles most compliance

#### **Express Accounts**
- **Control:** Platform maintains more control
- **Branding:** Platform branding with Stripe in background
- **Best For:** Platforms wanting balance of control and simplicity
- **Onboarding:** Streamlined, Stripe handles compliance

#### **Custom Accounts**
- **Control:** Full platform control
- **Branding:** Complete white-label experience
- **Best For:** Large platforms with custom payment flows
- **Onboarding:** Most complex, platform handles compliance

### 2.2 Revenue Models

#### **Application Fee Model** (Recommended for Marketplaces)

**How It Works:**
- Platform pays Stripe fees upfront
- Platform collects application fees from each transaction
- Application fee covers Stripe costs + platform margin

**Stripe Pricing:**
- Standard processing: 2.9% + $0.30 per transaction
- Additional Connect fee: 0.25% (capped at $25)
- **Total:** ~3.15% + $0.30 per transaction

**Example Transaction:**
```
Student pays: $100 for judo class
Stripe fees: $3.20 (3.2%)
Platform fee: $10 (10%)
Club receives: $86.80

Revenue breakdown:
- Club: $86.80
- Platform (JUDO): $10.00
- Stripe: $3.20
```

#### **Industry Standard Commission Rates (2026)**

Based on marketplace research:
- **Low Range:** 10-15% (competitive, high volume)
- **Standard Range:** 15-25% (most marketplaces)
- **High Range:** 25-30% (premium services, high value-add)

**Specific Examples:**
- Amazon: 15-30% depending on category
- Etsy: 6.5% transaction fee + 3% payment processing
- Uber: 25% of ride fare
- Airbnb: 14-16% from guests, 3% from hosts
- ClassPass: ~30% commission to studios
- **Atlassian Marketplace (2026):** 20-25% for Connect apps

**Recommendation for JUDO:**
- **Launch:** 10% commission (competitive entry)
- **Standard Tier:** 15% commission (sustainable)
- **Value-Add Services:** 20% commission (with premium features)

### 2.3 Payout Schedules

**Options Available:**
- **Daily:** Fastest, potentially higher fees
- **Weekly:** Balanced approach (recommended)
- **Monthly:** Most economical, but clubs wait longer
- **Instant:** Available for premium fee, settles in 30 minutes

**Best Practices:**
1. **Flexibility:** Offer multiple payout options
2. **Default:** Weekly payouts (good balance)
3. **Premium:** Instant payouts for additional fee
4. **Communication:** Be transparent about payout policies
5. **Account-Specific:** Allow clubs to customize their schedule

**Recommendation for JUDO:**
```
Standard: Weekly payouts (every Friday)
Premium: Daily or Instant payouts (+ 1% fee)
Delay: 2-day rolling reserve for fraud protection
```

### 2.4 Platform Pricing Tools

Stripe offers platform pricing tools to:
- Automatically set application fee logic
- Test different pricing rules
- Apply different rates based on:
  - Connected account country
  - Transaction volume
  - Account tier
  - Product category

---

## 3. SaaS Platform Examples

### 3.1 Shopify (E-Commerce Platform)

**Multi-Tenant Architecture:**
- **Model:** Hybrid (Pod-Based Architecture)
- **Database:** Multi-database approach, partitioned by shop ID
- **Isolation:** Every web/job worker connects to all databases, switches based on shop

**Key Insights:**
- Started as single-database Rails app
- Evolved to multi-database, multi-datacenter setup
- Uses "pods" to distribute load and isolate workloads
- Extra-large merchants get dedicated pods
- Smaller merchants share multi-tenant pods with resource management

**Handling Flash Sales:**
- Systems prevent large merchants from monopolizing capacity
- Co-located smaller merchants guaranteed access
- Dynamic resource allocation during high-traffic events (BFCM)

**Lessons for JUDO:**
- Start simple (shared schema), evolve as needed
- Plan for scaling from day 1
- Isolate "whale" customers when necessary
- Monitor and balance resource allocation

### 3.2 Calendly (Scheduling Platform)

**Architecture:**
- **Infrastructure:** Google Cloud Platform (GCP)
- **Evolution:** Transitioned from monolithic to service-oriented architecture
- **Security:** Continuous monitoring, layered security, encryption at rest/transit

**Key Insights:**
- Design-first API approach
- Quality engineering teams integrated throughout development
- Strong focus on compliance and security

**Lessons for JUDO:**
- Modern monolith → microservices migration path is common
- Start with monolith, extract services as needed
- Invest in API design early
- Security and compliance are table stakes

### 3.3 Mindbody + ClassPass (Fitness/Martial Arts)

**Business Model:**
- Mindbody acquired ClassPass (2021), now under "Playlist" brand
- Mindbody: B2B platform for studio management
- ClassPass: B2C subscription for consumers
- Scale: Tens of thousands of studios, millions of subscribers

**Key Features:**
- **SmartTools:** Dynamic pricing to fill empty class spots
- **Integration:** Prevent double-booking across platforms
- **Payment Processing:** Built-in payment/billing systems
- **Scheduling:** Real-time availability and booking

**Pricing Model:**
- Studios pay monthly subscription for Mindbody software
- ClassPass takes commission on bookings (marketplace model)
- Dynamic pricing adjusts based on demand

**Lessons for JUDO:**
1. **Direct Parallel:** Mindbody is closest comp to your vision
2. **Dual Revenue:** SaaS subscription + marketplace commission
3. **Dynamic Pricing:** AI-driven pricing fills empty spots
4. **Integration:** Real-time sync prevents conflicts
5. **Vertical Focus:** Deep domain expertise in fitness/martial arts

### 3.4 Architecture Patterns Summary

| Platform | Multi-Tenancy Model | Database Strategy | Key Innovation |
|----------|-------------------|-------------------|----------------|
| **Shopify** | Hybrid (Pods) | Multi-DB partitioned by shop | Pod isolation for large merchants |
| **Calendly** | Service-oriented | GCP-managed | API-first design |
| **Mindbody** | SaaS + Marketplace | Proprietary | Dynamic pricing algorithms |
| **ClassPass** | Marketplace | Integrated with Mindbody | Consumer subscription model |

---

## 4. User Hierarchy & RBAC

### 4.1 Role-Based Access Control Best Practices (2026)

**Core Principles:**

1. **Least Privilege:** Each user gets minimum permissions needed
2. **Role-Based:** Assign permissions to roles, not individuals
3. **Automation:** Automate role assignment and reviews
4. **Regular Audits:** Quarterly access reviews
5. **Just-In-Time:** Grant elevated access temporarily when needed

### 4.2 Recommended Role Structure for JUDO

#### **Platform Level (Super Admin)**
```
Platform Owner (JUDO Team)
├── Full system access
├── View all clubs
├── Manage billing & subscriptions
├── Support & troubleshooting
└── Analytics & reporting
```

#### **Club Level (Tenant)**
```
Club Owner
├── Full club management
├── Billing & subscription
├── Instructor management
├── Settings & branding
└── Export data

Head Instructor / Manager
├── Member management
├── Class scheduling
├── Attendance tracking
├── Basic reporting
└── Cannot modify billing

Instructor
├── View assigned classes
├── Mark attendance
├── View member profiles
├── Cannot add/remove members
└── Read-only reporting

Front Desk / Assistant
├── Check-in members
├── View schedules
├── Basic member lookup
└── Cannot modify data
```

#### **Student/Member Level**
```
Member (Adult)
├── View own profile
├── Book classes
├── View attendance history
├── Manage payment methods
└── Update personal info

Guardian (Parent)
├── Manage child profiles
├── Book classes for children
├── View child attendance
├── Manage family billing
└── Update family info

Child Member
├── View own schedule
├── Limited profile access
└── Cannot manage billing
```

### 4.3 Permission System Architecture

**Hierarchical Model:**
```typescript
// Permission hierarchy
type Permission =
  | "clubs.view"
  | "clubs.create"
  | "clubs.edit"
  | "clubs.delete"
  | "members.view"
  | "members.create"
  | "members.edit"
  | "members.delete"
  | "classes.view"
  | "classes.schedule"
  | "classes.cancel"
  | "attendance.view"
  | "attendance.mark"
  | "billing.view"
  | "billing.manage"
  | "reports.view"
  | "reports.export";

type Role = {
  id: string;
  name: string;
  clubId: string; // Tenant context
  permissions: Permission[];
  isCustom: boolean; // Allow clubs to create custom roles
};

// Example: Instructor role
const instructorRole: Role = {
  id: "instructor",
  name: "Instructor",
  clubId: "club_123",
  permissions: [
    "classes.view",
    "members.view",
    "attendance.view",
    "attendance.mark",
    "reports.view"
  ],
  isCustom: false
};
```

### 4.4 RBAC Implementation Guidelines

**1. Define Permissions Granularly**
- Create permission for each distinct operation
- Use resource.action naming convention
- Avoid overly broad permissions

**2. Create Common Roles**
- Ship with 5-7 predefined roles
- Cover 80% of use cases
- Allow customization for remaining 20%

**3. Resource Groups**
- Restrict roles to specific areas (e.g., "Youth Program" vs "Adult Classes")
- Enable delegation without full access

**4. Custom Roles**
- Allow club owners to create custom roles
- Provide role templates to start from
- Warn when creating overly permissive roles

**5. Identity Provider Integration**
- Map IdP attributes to roles (for SSO)
- Support SAML/OAuth for enterprise clubs
- Auto-provision based on email domain

### 4.5 Access Review Process

**Quarterly Reviews:**
- Automated reports of role assignments
- Flag inactive users with elevated permissions
- Prompt managers to review team access
- Track permission usage rates

**Automation:**
- Auto-revoke access after N days of inactivity
- Temporary elevated access with auto-expiry
- Approval workflows for role changes

---

## 5. Onboarding Flows

### 5.1 Best Practices (2026)

**Key Principles:**
1. **Reduce Friction:** Don't require email confirmation at signup
2. **Progressive Disclosure:** Show features gradually, not all at once
3. **Segmentation:** Different flows for different user types
4. **Gamification:** Reward onboarding task completion
5. **Time to Value:** Get users to "aha moment" quickly

### 5.2 Trial Period Strategies

#### **Credit Card vs No Credit Card**

**Requiring Credit Card:**
- **Pros:** Reduces unqualified trials, easier conversion
- **Cons:** Creates friction, deters qualified signups
- **Data:** One company saw 71% increase in trials after removing CC requirement

**No Credit Card (Recommended for JUDO):**
- **Pros:** Frictionless signup, more trials
- **Cons:** More unqualified users, lower conversion rate
- **Strategy:** Optimize for volume, convert with value

#### **Trial Duration**

**Industry Standards:**
- **7 days:** Short, creates urgency (for simple products)
- **14 days:** Most common, balanced
- **30 days:** Longer evaluation (for complex B2B products)

**Recommendation for JUDO:**
- **Clubs:** 14-day free trial (sufficient to test features)
- **Extension:** Offer extra trial days for completing onboarding (gamification)

### 5.3 Club Onboarding Flow

#### **Phase 1: Initial Signup (< 2 minutes)**

**Goal:** Collect minimum info to create account

```
Step 1: Basic Info
- Club name
- Your name
- Email
- Password
- Country (for Stripe)

Step 2: Club Type
○ Judo
○ Jiu-Jitsu
○ Karate
○ Mixed Martial Arts
○ Other: _______

Step 3: Club Size
○ 1-25 members
○ 26-100 members
○ 101-500 members
○ 500+ members

[Create Account] → Immediate access (no email confirmation)
```

**Post-Signup:**
- Show small banner: "Please confirm your email to unlock all features"
- Allow full access during trial
- Nudge email confirmation periodically

#### **Phase 2: Setup Wizard (< 5 minutes)**

**Goal:** Configure essentials to start using the platform

```
Welcome to JUDO! Let's get your club set up.

1. Add Your First Class
   - Class name (e.g., "Beginner Judo - Adults")
   - Day & time
   - Instructor
   - Capacity
   [Skip for now] [Add Class]

2. Import or Add Members
   ○ Import CSV
   ○ Add manually
   ○ Skip (do later)

3. Customize Branding
   - Upload club logo
   - Choose color scheme
   [Use defaults] [Customize]

4. Set Up Payments (Optional)
   - Connect Stripe
   - Set membership fees
   [Skip for now] [Connect Stripe]

[Start Using JUDO]
```

**Progress Tracking:**
- Show % completion: "Your club is 60% set up!"
- Highlight next recommended step
- Allow skipping and returning later

#### **Phase 3: Feature Discovery (First 7 days)**

**Goal:** Drive activation by showcasing key features

**Onboarding Checklist (In-App):**
```
✅ Account created
✅ First class added
□ First member added
□ Test QR check-in
□ Generate first report
□ Invite instructors
□ Complete payment setup

Progress: 3/7 complete
Complete 2 more to unlock a bonus: +7 days trial!
```

**Email Sequence:**
- Day 1: Welcome + getting started guide
- Day 3: "See how easy check-in is" (QR feature)
- Day 5: "Track attendance automatically" (reporting)
- Day 7: "You're halfway through your trial"
- Day 10: "3 things you might have missed"
- Day 12: "Your trial ends in 2 days"
- Day 14: "Upgrade to keep your data"

**In-App Guidance:**
- Contextual tooltips for key features
- Video tutorials (< 90 seconds each)
- "Help" button with search and chat support

### 5.4 Member Onboarding Flow

#### **Invited by Club (Recommended)**

```
1. Email Invitation
   "You've been invited to join [Club Name] on JUDO"
   [Accept Invitation]

2. Create Account
   - Name (pre-filled)
   - Email (pre-filled)
   - Password
   - Date of birth
   - Emergency contact
   [Complete Profile]

3. Payment Setup
   - Choose membership tier
   - Add payment method
   - Review & confirm
   [Start Training]

4. Download App (Optional)
   [Download iOS] [Download Android] [Skip]
```

#### **Self-Signup (Marketplace Model)**

```
1. Discover Club
   - Search by location
   - Browse martial arts type
   - View club profile

2. Choose Trial/Membership
   ○ Free trial class
   ○ Drop-in (single class)
   ○ Monthly membership

3. Create Account
   - Basic info
   - Payment method
   [Book Now]

4. Confirmation
   - Class details
   - What to bring
   - Directions
   [Add to Calendar]
```

### 5.5 Verification Requirements

**Club Verification (For Payment Processing):**

Required by Stripe Connect:
- Business name and type
- Tax ID (EIN or SSN)
- Bank account information
- Business representative details
- Ownership information (if applicable)

**Timing:**
- **Express Accounts:** Simplified verification, can start immediately
- **Custom Accounts:** More extensive verification required

**Recommendation:**
1. Allow clubs to use platform immediately during trial
2. Require verification before first payout
3. Use Stripe Express for simplicity
4. Provide clear guidance on required documents

**Member Verification:**
- Email confirmation (encouraged but not required initially)
- Payment method (required for paid memberships)
- Age verification (for minors - require DOB)
- Liability waiver (digital signature)

### 5.6 Success Metrics

**Key Onboarding Metrics:**

1. **Signup Completion Rate:** % who complete registration
   - Target: > 85%

2. **Time to First Value:** Minutes to complete core action
   - Target: < 5 minutes to add first class or member

3. **Onboarding Completion Rate:** % who finish setup wizard
   - Target: > 60%

4. **Feature Activation:** % who use key features
   - QR check-in: > 70%
   - Reporting: > 50%
   - Payment setup: > 40%

5. **Trial-to-Paid Conversion:** % who convert after trial
   - Industry average: 20-30%
   - Target: > 25%

6. **Day 1 Retention:** % who return next day
   - Target: > 50%

7. **Day 7 Retention:** % who return in first week
   - Target: > 40%

---

## 6. Recommendations for JUDO Platform

### 6.1 Architecture Decisions

#### **Multi-Tenancy Model: Pool Model with Hybrid Path**

**Phase 1: Launch (Current - 100 clubs)**
- **Model:** Shared Database, Shared Schema
- **Implementation:** Add `clubId` to all relevant tables
- **Isolation:** Convex server functions with automatic filtering
- **Cost:** Most economical for early stage

```typescript
// Convex schema
export default defineSchema({
  clubs: defineTable({
    name: v.string(),
    ownerId: v.string(),
    stripeAccountId: v.optional(v.string()),
    plan: v.union(v.literal("free"), v.literal("starter"), v.literal("pro")),
    // ... other fields
  }),

  members: defineTable({
    clubId: v.id("clubs"), // Tenant isolation
    name: v.string(),
    email: v.string(),
    // ... other fields
  }).index("by_club", ["clubId"]),

  classes: defineTable({
    clubId: v.id("clubs"), // Tenant isolation
    name: v.string(),
    instructorId: v.id("members"),
    // ... other fields
  }).index("by_club", ["clubId"]),

  attendance: defineTable({
    clubId: v.id("clubs"), // Tenant isolation
    memberId: v.id("members"),
    classId: v.id("classes"),
    checkedInAt: v.number(),
    // ... other fields
  }).index("by_club_and_date", ["clubId", "checkedInAt"]),
});

// All queries automatically filtered
export const getClubMembers = query({
  args: { clubId: v.id("clubs") },
  handler: async (ctx, { clubId }) => {
    // Verify user has access to this club
    const identity = await ctx.auth.getUserIdentity();
    await verifyClubAccess(ctx, identity, clubId);

    // Query with automatic filtering
    return await ctx.db
      .query("members")
      .withIndex("by_club", q => q.eq("clubId", clubId))
      .collect();
  }
});
```

**Phase 2: Growth (100-1000 clubs)**
- **Monitor:** Per-club resource usage
- **Optimize:** Caching strategy per tenant
- **Introduce:** Premium tier with guaranteed resources

**Phase 3: Scale (1000+ clubs)**
- **Hybrid:** Keep most clubs in shared model
- **Isolate:** Move "whale" clubs (>1000 members) to dedicated instances
- **Tier:** Enterprise tier with dedicated database option

#### **Why Pool Model for JUDO:**

1. **Cost-Effective:** Convex pricing based on database size, shared is cheaper
2. **Simple Operations:** Single schema, easy to update
3. **Rapid Iteration:** Deploy features to all clubs instantly
4. **Sufficient for MVP:** Judo clubs unlikely to have "noisy neighbor" issues
5. **Convex-Native:** Leverages Convex's server function architecture

### 6.2 Payment Architecture

#### **Stripe Connect: Express Accounts**

**Rationale:**
- Simplified onboarding for clubs
- Stripe handles compliance
- Platform maintains reasonable control
- Faster time to first payout

**Revenue Model:**
```
Application Fee Structure:
- Starter Tier: 10% commission (competitive entry)
- Pro Tier: 15% commission (full features)
- Enterprise Tier: Custom pricing (volume discount)

Transaction Flow:
1. Student pays $100 for membership
2. Stripe processes: -$3.20 (3.2%)
3. Platform fee: -$10-15 (10-15%)
4. Club receives: $81.80 - $86.80
5. Payout: Weekly (default)
```

**Implementation:**
```typescript
// Create connected account for club
export const createClubStripeAccount = mutation({
  args: {
    clubId: v.id("clubs"),
    businessType: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Create Stripe Express account
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'GB', // Or detect from club
      email: args.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: args.businessType,
    });

    // Save to database
    await ctx.db.patch(args.clubId, {
      stripeAccountId: account.id,
      stripeOnboardingComplete: false,
    });

    // Create onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `https://judo-club-app.vercel.app/club/stripe/refresh`,
      return_url: `https://judo-club-app.vercel.app/club/stripe/success`,
      type: 'account_onboarding',
    });

    return accountLink.url;
  }
});

// Process payment with application fee
export const processPayment = mutation({
  args: {
    clubId: v.id("clubs"),
    amount: v.number(),
    customerId: v.string(),
  },
  handler: async (ctx, args) => {
    const club = await ctx.db.get(args.clubId);

    // Calculate platform fee based on tier
    const platformFeePercent = club.plan === "pro" ? 0.15 : 0.10;
    const platformFee = Math.round(args.amount * platformFeePercent);

    // Create payment intent with application fee
    const paymentIntent = await stripe.paymentIntents.create({
      amount: args.amount,
      currency: 'gbp',
      customer: args.customerId,
      application_fee_amount: platformFee,
      transfer_data: {
        destination: club.stripeAccountId,
      },
    });

    return paymentIntent;
  }
});
```

### 6.3 User Hierarchy Implementation

**Role Structure:**
```typescript
// Define roles
export const roles = {
  // Platform level
  PLATFORM_ADMIN: {
    level: "platform",
    permissions: ["*"], // All permissions
  },

  // Club level
  CLUB_OWNER: {
    level: "club",
    permissions: [
      "club.manage",
      "members.*",
      "classes.*",
      "instructors.*",
      "billing.*",
      "reports.*",
    ],
  },

  HEAD_INSTRUCTOR: {
    level: "club",
    permissions: [
      "club.view",
      "members.view",
      "members.create",
      "members.edit",
      "classes.*",
      "attendance.*",
      "reports.view",
    ],
  },

  INSTRUCTOR: {
    level: "club",
    permissions: [
      "club.view",
      "members.view",
      "classes.view",
      "attendance.view",
      "attendance.mark",
      "reports.view",
    ],
  },

  FRONT_DESK: {
    level: "club",
    permissions: [
      "members.view",
      "classes.view",
      "attendance.mark",
    ],
  },

  // Member level
  MEMBER: {
    level: "member",
    permissions: [
      "profile.view.own",
      "profile.edit.own",
      "classes.view",
      "classes.book",
      "attendance.view.own",
    ],
  },

  GUARDIAN: {
    level: "member",
    permissions: [
      "profile.view.family",
      "profile.edit.family",
      "classes.view",
      "classes.book.family",
      "attendance.view.family",
      "billing.view.family",
      "billing.manage.family",
    ],
  },
};

// Permission checking function
export const hasPermission = (
  userRole: string,
  permission: string,
  context: { clubId?: string; userId?: string }
): boolean => {
  const role = roles[userRole];
  if (!role) return false;

  // Check if user has permission
  return role.permissions.some(p => {
    if (p === "*") return true;
    if (p === permission) return true;
    if (p.endsWith(".*") && permission.startsWith(p.slice(0, -2))) return true;
    return false;
  });
};

// Usage in Convex function
export const updateMember = mutation({
  args: {
    memberId: v.id("members"),
    updates: v.object({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const member = await ctx.db.get(args.memberId);

    // Check permission
    const canEdit = hasPermission(
      identity.role,
      "members.edit",
      { clubId: member.clubId, userId: identity.userId }
    );

    if (!canEdit) {
      throw new Error("Permission denied");
    }

    await ctx.db.patch(args.memberId, args.updates);
  }
});
```

### 6.4 Onboarding Implementation

#### **Club Onboarding Flow**

**Step 1: Minimal Signup**
```typescript
// Quick signup form
<SignupForm>
  <Input name="clubName" placeholder="Your Club Name" />
  <Input name="fullName" placeholder="Your Full Name" />
  <Input name="email" placeholder="Email" type="email" />
  <Input name="password" placeholder="Password" type="password" />

  <Select name="clubType">
    <option>Judo</option>
    <option>Jiu-Jitsu</option>
    <option>Karate</option>
    <option>MMA</option>
    <option>Other</option>
  </Select>

  <Button>Create Account - Free 14 Days</Button>
  <Text size="sm" color="muted">
    No credit card required. Start training immediately.
  </Text>
</SignupForm>

// Immediate access after signup
onSuccess={() => {
  router.push("/dashboard?onboarding=true");
}}
```

**Step 2: Setup Wizard**
```typescript
// Multi-step wizard
const OnboardingWizard = () => {
  const [step, setStep] = useState(1);

  return (
    <Wizard currentStep={step} totalSteps={4}>
      {step === 1 && (
        <AddFirstClass
          onComplete={() => setStep(2)}
          onSkip={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <ImportMembers
          onComplete={() => setStep(3)}
          onSkip={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <CustomizeBranding
          onComplete={() => setStep(4)}
          onSkip={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <ConnectPayments
          onComplete={() => router.push("/dashboard")}
          onSkip={() => router.push("/dashboard")}
        />
      )}
    </Wizard>
  );
};
```

**Step 3: Activation Checklist**
```typescript
// In-app checklist component
const ActivationChecklist = () => {
  const checklist = [
    { id: "class", label: "Add your first class", completed: true },
    { id: "member", label: "Add your first member", completed: false },
    { id: "checkin", label: "Test QR check-in", completed: false },
    { id: "report", label: "Generate your first report", completed: false },
    { id: "invite", label: "Invite instructors", completed: false },
    { id: "payment", label: "Connect Stripe", completed: false },
  ];

  const completed = checklist.filter(item => item.completed).length;
  const total = checklist.length;
  const progress = (completed / total) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Get Started with JUDO</CardTitle>
        <CardDescription>
          Complete {2 more} tasks to unlock +7 bonus trial days!
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Progress value={progress} className="mb-4" />
        <Text>{completed}/{total} complete</Text>

        <ChecklistItems items={checklist} />
      </CardContent>
    </Card>
  );
};
```

#### **Email Onboarding Sequence**

**Implementation with Resend or SendGrid:**
```typescript
// Automated email sequence
export const sendOnboardingEmail = (
  dayNumber: 1 | 3 | 5 | 7 | 10 | 12 | 14,
  clubOwner: { name: string; email: string; clubName: string }
) => {
  const emails = {
    1: {
      subject: `Welcome to JUDO, ${clubOwner.name}!`,
      body: welcomeEmailTemplate,
    },
    3: {
      subject: "See how easy check-in is with QR codes",
      body: qrCheckInEmailTemplate,
    },
    5: {
      subject: "Track attendance automatically",
      body: reportingEmailTemplate,
    },
    7: {
      subject: "You're halfway through your trial",
      body: midTrialEmailTemplate,
    },
    10: {
      subject: "3 things you might have missed",
      body: tipsEmailTemplate,
    },
    12: {
      subject: "Your trial ends in 2 days",
      body: trialEndingEmailTemplate,
    },
    14: {
      subject: "Upgrade to keep your data",
      body: upgradeEmailTemplate,
    },
  };

  const email = emails[dayNumber];
  // Send via email provider
  sendEmail({
    to: clubOwner.email,
    subject: email.subject,
    html: email.body,
  });
};
```

### 6.5 Security & Compliance

**Data Isolation Checklist:**
- [ ] Every database query includes `clubId` filter
- [ ] Authentication checks on every API endpoint
- [ ] Authorization checks before data access
- [ ] Audit logging for cross-tenant access attempts
- [ ] Automated tests for tenant isolation
- [ ] Rate limiting per tenant
- [ ] Resource quotas per tenant

**Compliance Requirements:**
- [ ] GDPR compliance (data export, deletion)
- [ ] Data encryption at rest (Convex default)
- [ ] Data encryption in transit (HTTPS)
- [ ] PCI compliance (Stripe handles)
- [ ] Terms of Service for clubs
- [ ] Privacy Policy for members
- [ ] Liability waivers for martial arts training

### 6.6 Pricing Tiers

**Recommended Structure:**

```
FREE TIER (14-day trial)
- Up to 25 members
- Unlimited classes
- QR check-in
- Basic reporting
- Email support

STARTER TIER - £29/month
- Up to 100 members
- Unlimited classes
- QR check-in
- Advanced reporting
- Payment processing (10% commission)
- Email support
- Mobile app access

PRO TIER - £79/month
- Up to 500 members
- Unlimited classes
- QR check-in
- Advanced reporting + analytics
- Payment processing (15% commission)
- Custom branding
- Priority support
- API access
- Multiple locations (up to 3)

ENTERPRISE TIER - Custom
- Unlimited members
- Everything in Pro
- Payment processing (custom rate)
- Dedicated account manager
- SSO / SAML
- Dedicated database (optional)
- Custom integrations
- SLA guarantee
```

**Revenue Projection Example:**
```
100 clubs on Starter: £2,900/month
50 clubs on Pro: £3,950/month
5 clubs on Enterprise: £2,500/month (avg £500/club)
= £9,350/month base revenue

Plus transaction commissions:
Avg £5,000/month per club in payments
10-15% commission = £500-750/month per club
150 clubs = £75,000-112,500/month

Total potential: £84,350-121,850/month
```

### 6.7 Migration Path from Current State

**Current (8.0/10):**
- Mock data
- UI/UX complete
- No authentication
- No real payments

**Phase 1: Multi-Tenant Foundation (8.0 → 8.5)**
- [ ] Add `clubId` to all Convex schema tables
- [ ] Implement Convex Auth with magic links
- [ ] Add user roles table
- [ ] Implement permission checking functions
- [ ] Replace mock data with real Convex queries
- [ ] Add club creation flow

**Phase 2: Onboarding & Authentication (8.5 → 9.0)**
- [ ] Build signup flow with wizard
- [ ] Implement email verification
- [ ] Create onboarding checklist
- [ ] Set up email sequences
- [ ] Add trial period tracking
- [ ] Build upgrade flow

**Phase 3: Payments (9.0 → 9.5)**
- [ ] Integrate Stripe Connect Express
- [ ] Build club Stripe onboarding flow
- [ ] Implement payment processing with application fees
- [ ] Add payout schedule management
- [ ] Create billing dashboard for clubs
- [ ] Set up webhook handlers

**Phase 4: Polish & Scale (9.5 → 10.0)**
- [ ] PWA support (offline access)
- [ ] Push notifications
- [ ] Advanced analytics
- [ ] Performance optimization
- [ ] Security audit
- [ ] Load testing
- [ ] Documentation

**Timeline Estimate:**
- Phase 1: 2 weeks
- Phase 2: 2 weeks
- Phase 3: 3 weeks
- Phase 4: 3 weeks
- **Total: ~10 weeks to 10/10**

---

## Sources

### Multi-Tenancy Architecture
- [Multitenant SaaS Patterns - Azure SQL Database | Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-sql/database/saas-tenancy-app-design-patterns?view=azuresql)
- [What is multi-tenant architecture? A complete guide for 2026](https://www.future-processing.com/blog/multi-tenant-architecture/)
- [Multi-Tenant Database Architecture Patterns Explained](https://www.bytebase.com/blog/multi-tenant-database-architecture-patterns-explained/)
- [Multi-Tenant Database Design Patterns 2024](https://daily.dev/blog/multi-tenant-database-design-patterns-2024)
- [Guidance for Multi-Tenant Architectures on AWS](https://aws.amazon.com/solutions/guidance/multi-tenant-architectures-on-aws/)
- [Architecting Secure Multi-Tenant Data Isolation | by Justin Hamade | Medium](https://medium.com/@justhamade/architecting-secure-multi-tenant-data-isolation-d8f36cb0d25e)
- [Multi-Tenant Architecture: A Complete Guide (Basic to Advanced) - DEV Community](https://dev.to/tak089/multi-tenant-architecture-a-complete-guide-basic-to-advanced-119o)

### Stripe Connect & Payment Models
- [Platform pricing tool | Stripe Documentation](https://docs.stripe.com/connect/platform-pricing-tools)
- [Pricing information | Stripe Connect](https://stripe.com/connect/pricing)
- [Collect application fees | Stripe Documentation](https://docs.stripe.com/connect/marketplace/tasks/app-fees)
- [Build a marketplace | Stripe Documentation](https://docs.stripe.com/connect/marketplace)
- [Introduction to SaaS platforms and marketplaces with Connect | Stripe Documentation](https://docs.stripe.com/connect/saas-platforms-and-marketplaces)
- [What is Stripe Connect 2026 Guide to Marketplace Payments](https://jeecart.com/what-is-stripe-connect/)
- [Stripe Connect revenue share: how does it work, and are there better alternatives? - Fiska](https://fiska.com/blog/stripe-connect-revenue-share/)

### Role-Based Access Control
- [Role-Based Access Control: A Comprehensive Guide |2026 | Zluri](https://www.zluri.com/blog/role-based-access-control)
- [Enterprise Ready SaaS App Guide to Role Based Access Control (RBAC)](https://www.enterpriseready.io/features/role-based-access-control/)
- [Role-Based Access Control - Auth0 Docs](https://auth0.com/docs/manage-users/access-control/rbac)
- [A Guide to Role-Based Access Control in SaaS Applications | Suridata](https://www.suridata.ai/blog/guide-to-role-based-access-control-in-saas-applications/)
- [Role-Based Access Control Best Practices for 2026](https://www.techprescient.com/blogs/role-based-access-control-best-practices/)
- [Role Based Access Control Best Practices | Frontegg](https://frontegg.com/guides/role-based-access-control-best-practices)

### SaaS Platform Examples
- [Scaling Shopify's Multi-Tenant Architecture across Multiple Datacenters | USENIX](https://www.usenix.org/conference/srecon16europe/program/presentation/weingarten)
- [Inside Shopify's multi-tenant platform during BFCM](https://www.educative.io/newsletter/system-design/inside-shopifys-multi-tenant-platform-during-bfcm)
- [Powering Multiple Stores: Shopify's Multi-Tenant Solution](https://www.pipiads.com/blog/shopify-multi-tenant/)
- [Shopify's Architecture to Handle the World's Biggest Flash Sales - InfoQ](https://www.infoq.com/presentations/shopify-architecture-flash-sale/)
- [Leading Wellness Experience Platform Mindbody to Acquire ClassPass](https://co.mindbodyonline.com/press/mindbody-to-acquire-classpass)
- [What is the difference between Mindbody and ClassPass? | Exercise.com](https://www.exercise.com/grow/what-is-the-difference-between-mindbody-and-classpass/)

### Revenue Share & Marketplace Pricing
- [Updates to Marketplace Revenue Share: 2026 - Work Life by Atlassian](https://www.atlassian.com/blog/developer/updates-to-marketplace-revenue-share-2026)
- [Top Marketplace Revenue Models to Boost Growth in 2026](https://www.yo-kart.com/blog/top-marketplace-revenue-models/)
- [Sample revenue share calculations for Google Cloud Marketplace](https://docs.cloud.google.com/marketplace/docs/partners/revenue-share-scenarios)

### SaaS Onboarding Best Practices
- [SaaS Onboarding Best Practices: Turn Trial Users Into Customers](https://www.sybill.ai/blogs/saas-onboarding-best-practices)
- [SaaS Customer Onboarding Guide: Best Practices & Templates](https://www.dock.us/library/customer-onboarding)
- [B2B SaaS Onboarding - The Complete Product Manager's Guide](https://productfruits.com/blog/b2b-saas-onboarding)
- [Guide for SaaS onboarding. Best practices for 2025 + Checklist](https://www.insaim.design/blog/saas-onboarding-best-practices-for-2025-examples)
- [15 B2B Saas Free Trial Best Practices To Boost Conversion Rates](https://userpilot.com/blog/saas-free-trial-best-practices/)
- [11 Best Practices for SaaS Onboarding that Converts Users to Customers](https://encharge.io/saas-onboarding-best-practices/)
- [User Onboarding Strategies in a B2B SaaS Application](https://auth0.com/blog/user-onboarding-strategies-b2b-saas/)

### Fitness/Martial Arts Pricing Models
- [Martial Arts Membership Rates in 2024: Averages and Variations](https://www.groundstandard.com/navigating-martial-arts-membership-rates-in-2024-an-overview-of-averages-and-variations)
- [Top 6 Fitness Pricing Models For Fitness Businesses](https://upperhand.com/top-6-fitness-pricing-models-and-strategies/)
- [How to Price Your Martial Arts Programs for the Lifestyle You Want | Gymdesk](https://gymdesk.com/blog/how-to-price-your-martial-arts-programs-for-the-lifestyle-you-want)
- [Best Martial Arts Billing Software | FitGymSoftware®](https://fitgymsoftware.com/martial-arts-studio-software.html)

### Row-Level Security
- [Multi-tenant data isolation with PostgreSQL Row Level Security | Amazon Web Services](https://aws.amazon.com/blogs/database/multi-tenant-data-isolation-with-postgresql-row-level-security/)
- [Multi-tenancy implementation with PostgreSQL: Learn through a simple real-world example · Logto blog](https://blog.logto.io/implement-multi-tenancy)
- [Mastering PostgreSQL Row-Level Security (RLS) for Rock-Solid Multi-Tenancy](https://ricofritzsche.me/mastering-postgresql-row-level-security-rls-for-rock-solid-multi-tenancy/)
- [Row Level Security for Tenants in Postgres | Crunchy Data Blog](https://www.crunchydata.com/blog/row-level-security-for-tenants-in-postgres)
- [Postgres RLS Implementation Guide - Best Practices, and Common Pitfalls](https://www.permit.io/blog/postgres-rls-implementation-guide)
- [Row Level Security | Convex Stack](https://stack.convex.dev/row-level-security)
- [Authorization Best Practices and Implementation Guide | Convex Stack](https://stack.convex.dev/authorization)

### Payout Schedules
- [Manage payout schedule | Stripe Documentation](https://docs.stripe.com/connect/manage-payout-schedule)
- [How to set up automated payouts | Stripe](https://stripe.com/resources/more/how-to-set-up-automated-payouts-what-businesses-need-to-know)
- [Pay out to connected accounts | Stripe Documentation](https://docs.stripe.com/connect/marketplace/tasks/payout)
- [Instant Payouts for Stripe Dashboard users | Stripe Documentation](https://docs.stripe.com/payouts/instant-payouts)
- [Stripe Connect Payouts: Schedule & Best Practices](https://dev-clg.lendarius.com/blog/stripe-connect-payouts-schedule-and-best-practices-1764797090)

---

**End of Report**

*This document should be treated as a living guide and updated as the platform evolves and new best practices emerge.*
