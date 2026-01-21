# Google OAuth Setup Guide

> Simple one-click sign-in for 16+ year-old users

**Status:** Ready to implement
**Time Required:** 30 minutes
**Prerequisites:** Google Cloud account

---

## Why Google OAuth?

✅ **Teens already have Google accounts** (Gmail for school)
✅ **No password to remember** - one-click sign-in
✅ **Auto-fills profile** - name, email, photo
✅ **Familiar UX** - they use it everywhere
✅ **Mobile-friendly** - works perfectly on phones

---

## Step-by-Step Setup

### Phase 1: Google Cloud Console (10 minutes)

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com
   - Sign in with your Google account

2. **Create New Project**
   - Click "Select a project" → "New Project"
   - Name: "JUDO Club Platform"
   - Click "Create"

3. **Enable Google OAuth**
   - Navigate to "APIs & Services" → "OAuth consent screen"
   - Select "External" (for public users)
   - Click "Create"

4. **Configure OAuth Consent Screen**
   ```
   App name: JUDO Club Manager
   User support email: [your email]
   Developer contact: [your email]

   Scopes: Add these scopes:
   - userinfo.email
   - userinfo.profile
   - openid
   ```
   - Click "Save and Continue"

5. **Create OAuth 2.0 Credentials**
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Name: "JUDO Web Client"
   - Authorized JavaScript origins:
     - http://localhost:5173 (dev)
     - https://judo-club-app.vercel.app (prod)
   - Authorized redirect URIs:
     - http://localhost:5173/auth/callback
     - https://judo-club-app.vercel.app/auth/callback
   - Click "Create"

6. **Save Your Credentials**
   ```
   Client ID: [copy this - looks like: 123456789-abc...apps.googleusercontent.com]
   Client Secret: [copy this - looks like: GOCSPX-...]
   ```
   **⚠️ Keep these secret! Never commit to Git.**

---

### Phase 2: Convex Auth Setup (15 minutes)

1. **Install Convex Auth**
   ```bash
   npm install @convex-dev/auth
   ```

2. **Create Convex Auth Config** (`convex/auth.config.ts`)
   ```typescript
   import { convexAuth } from "@convex-dev/auth";
   import Google from "@auth/core/providers/google";

   export const { auth, signIn, signOut, store } = convexAuth({
     providers: [
       Google({
         clientId: process.env.AUTH_GOOGLE_ID!,
         clientSecret: process.env.AUTH_GOOGLE_SECRET!,
       }),
     ],
   });
   ```

3. **Add Environment Variables**

   Create `.env.local`:
   ```bash
   VITE_CONVEX_URL=https://your-convex-url.convex.cloud
   AUTH_GOOGLE_ID=your-google-client-id
   AUTH_GOOGLE_SECRET=your-google-client-secret
   ```

4. **Update Convex Schema** (`convex/schema.ts`)
   ```typescript
   import { authTables } from "@convex-dev/auth/server";
   import { defineSchema, defineTable } from "convex/server";
   import { v } from "convex/values";

   export default defineSchema({
     ...authTables,

     users: defineTable({
       name: v.string(),
       email: v.string(),
       profilePhoto: v.optional(v.string()),
       dateOfBirth: v.string(),
       age: v.number(),
       beltRank: v.string(),
       role: v.union(v.literal("member"), v.literal("coach"), v.literal("admin")),
       emailVerified: v.boolean(),
       onboardingComplete: v.boolean(),
     }).index("by_email", ["email"]),

     // ... rest of your tables
   });
   ```

5. **Deploy to Convex**
   ```bash
   npx convex dev
   # or for production:
   npx convex deploy
   ```

---

### Phase 3: Frontend Integration (5 minutes)

1. **Update Auth Provider** (`src/lib/auth.tsx`)
   ```typescript
   import { useAuthActions } from "@convex-dev/auth/react";
   import { useConvexAuth } from "convex/react";

   export function AuthProvider({ children }: { children: ReactNode }) {
     const { isLoading, isAuthenticated } = useConvexAuth();
     const { signIn, signOut } = useAuthActions();

     const handleGoogleSignIn = () => {
       void signIn("google");
     };

     return (
       <AuthContext.Provider value={{
         isLoading,
         isAuthenticated,
         signIn: handleGoogleSignIn,
         signOut
       }}>
         {children}
       </AuthContext.Provider>
     );
   }
   ```

2. **Update Login Page** (`src/pages/LoginPage.tsx`)
   ```tsx
   import { useAuth } from "@/lib/auth";

   export default function LoginPage() {
     const { signIn } = useAuth();

     return (
       <div>
         <h1>Welcome to JUDO</h1>
         <Button onClick={signIn} size="lg">
           <svg>Google icon</svg>
           Continue with Google
         </Button>
       </div>
     );
   }
   ```

3. **Add Onboarding Flow** (after OAuth success)
   - Collect: Date of Birth (verify 16+), Belt Rank, Dojo selection
   - Auto-filled from Google: Name, Email, Profile Photo
   - Takes 2 minutes total

---

## Age Verification (16+ Check)

```typescript
// convex/auth.ts
export const completeOnboarding = mutation({
  args: {
    dateOfBirth: v.string(),
    beltRank: v.string(),
    dojoId: v.id("dojos"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Calculate age
    const dob = new Date(args.dateOfBirth);
    const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

    if (age < 16) {
      throw new Error("You must be 16 or older to join");
    }

    // Create user profile
    await ctx.db.insert("users", {
      name: identity.name!,
      email: identity.email!,
      profilePhoto: identity.pictureUrl,
      dateOfBirth: args.dateOfBirth,
      age,
      beltRank: args.beltRank,
      role: "member",
      emailVerified: true,
      onboardingComplete: true,
    });
  },
});
```

---

## User Flow

**New User (First Time):**
```
1. Click "Continue with Google"
   ↓
2. Google popup → select account
   ↓
3. Redirect to onboarding (2 min)
   - Date of birth (verify 16+)
   - Belt rank
   - Select dojo
   ↓
4. Choose membership plan
   ↓
5. Redirect to dashboard → Start training!
```

**Returning User:**
```
1. Click "Continue with Google"
   ↓
2. Google popup → select account
   ↓
3. Instant redirect to dashboard (<2 seconds)
```

---

## Security Best Practices

✅ **Never expose secrets in frontend**
✅ **Use HTTPS in production**
✅ **Validate age on backend** (don't trust client)
✅ **Email verification** (Google handles this)
✅ **CSRF protection** (Convex Auth handles this)
✅ **Secure session cookies** (httpOnly, sameSite)

---

## Testing

**Development:**
1. Run: `npm run dev`
2. Visit: `http://localhost:5173/login`
3. Click "Continue with Google"
4. Use test Google account
5. Verify onboarding flow
6. Check user created in Convex dashboard

**Production:**
1. Deploy to Vercel
2. Update authorized origins in Google Console
3. Test with real users (16+)
4. Monitor Convex logs

---

## Troubleshooting

**Error: "Redirect URI mismatch"**
- Solution: Add exact URL to Google Console authorized redirects

**Error: "Access blocked: This app's request is invalid"**
- Solution: Complete OAuth consent screen configuration

**Error: "User under 16"**
- Solution: Show error message, suggest parent/guardian account

**Error: "Already authenticated"**
- Solution: Sign out first, or skip login page if already logged in

---

## Next Steps After OAuth

1. **Remove mock auth** - Delete `DEV_MODE` from auth.tsx
2. **Test thoroughly** - 10+ users, different ages, devices
3. **Add Apple Sign-In** (optional, for iOS users)
4. **Add Facebook Login** (optional, for older users)
5. **Analytics** - Track sign-up conversion rate

---

## Cost

**Google OAuth:** FREE (unlimited users)
**Convex Auth:** FREE tier includes 100k operations/month

---

## Support

- **Convex Auth Docs:** https://docs.convex.dev/auth
- **Google OAuth Docs:** https://developers.google.com/identity/protocols/oauth2
- **Stack Overflow:** Tag `convex` or `google-oauth`

---

**Estimated Time to Go Live:** 30 minutes
**User Sign-Up Time:** 2-3 minutes
**Returning User Login:** <2 seconds

🚀 **Ready to implement!**
