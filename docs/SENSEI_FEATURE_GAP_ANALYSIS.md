# Sensei Feature Gap Analysis - What's Missing?

**Date:** January 21, 2026
**Focus:** Making senseis' work EASIER

---

## What Senseis ACTUALLY Need (Based on Research)

Based on analysis of leading judo management software in 2025-2026, here's what senseis need:

### 🔴 CRITICAL - Missing from Current App

1. **📅 Calendar / Schedule Management**
   - Visual calendar view (monthly/weekly)
   - Drag-and-drop class scheduling
   - Recurring class templates
   - Holiday/closure scheduling
   - Class capacity visualization
   - **Status:** ❌ NOT IMPLEMENTED

2. **💬 Parent/Student Communication**
   - Automated reminders (class tomorrow, payment due)
   - Bulk messaging (announcements to all students)
   - Emergency notifications
   - Class cancellation alerts
   - Belt grading results notifications
   - **Status:** ❌ NOT IMPLEMENTED (only announcements table exists)

3. **📱 Mobile App (Native)**
   - Quick attendance check-in on phone
   - View schedule on mobile
   - Send messages from phone
   - View student progress on the go
   - **Status:** ⚠️ PARTIAL (responsive web only, no native app)

4. **📊 Visual Reports & Analytics**
   - Attendance trends graph
   - Revenue charts
   - Student retention metrics
   - Belt progression visualization
   - Class capacity utilization
   - **Status:** ❌ NOT IMPLEMENTED

5. **🎓 Automated Grading Eligibility**
   - Dashboard showing who's ready for next belt
   - Automatic reminders when student hits session requirements
   - Grading certificate generation
   - Email notifications to students
   - **Status:** ⚠️ PARTIAL (backend logic exists, no UI)

6. **💳 Automated Billing & Payment Reminders**
   - Automatic payment collection
   - Failed payment retry
   - Overdue payment alerts
   - Payment plan management
   - **Status:** ❌ NOT IMPLEMENTED (Stripe not integrated)

7. **📝 Digital Waivers & Forms**
   - Online registration forms
   - Medical waiver signing
   - Emergency contact collection
   - Photo/video consent
   - **Status:** ❌ NOT IMPLEMENTED

8. **🏆 Tournament Management**
   - Weight class sorting
   - Bracket generation
   - Registration management
   - Results tracking
   - **Status:** ❌ NOT IMPLEMENTED

### 🟡 MEDIUM PRIORITY - Partially Implemented

9. **✅ Student Progress Tracking**
   - Techniques learned tracking
   - Session notes
   - Belt progression history
   - **Status:** ✅ BACKEND DONE (needs UI)

10. **✅ Attendance Management**
    - QR code check-in
    - Manual attendance
    - Attendance history
    - **Status:** ✅ BACKEND DONE (needs UI updates)

11. **✅ Class Management**
    - Create/edit classes
    - Session types (randori, kata, newaza)
    - Capacity management
    - **Status:** ✅ BACKEND DONE (needs UI)

### 🟢 LOW PRIORITY - Nice to Have

12. **Video Library**
    - Technique demonstrations
    - Training videos
    - Kata tutorials
    - **Status:** ❌ NOT PLANNED

13. **Student Performance Videos**
    - Record and annotate sessions
    - Share feedback videos
    - **Status:** ❌ NOT PLANNED

---

## What We HAVE Built (Current State)

### ✅ Complete Backend
- Multi-tenant database schema
- Belt progression system (Kyu/Dan)
- Role-based access control (6 roles)
- Attendance tracking
- Class management
- Payment tracking structure
- Announcements system

### ⚠️ Missing Critical UI
- No calendar view
- No visual scheduling
- No communication system (email/SMS)
- No automated reminders
- No reports/analytics dashboards
- No Stripe integration
- No digital forms

---

## The BIG Problem

**We built the DATA STRUCTURE but not the SENSEI TOOLS.**

Senseis don't care about multi-tenant architecture. They need:
1. A **CALENDAR** to see the week at a glance
2. **ONE-CLICK MESSAGING** to notify students
3. **VISUAL DASHBOARDS** showing who's ready for grading
4. **AUTOMATED REMINDERS** so they don't manually chase payments
5. **QUICK CHECK-IN** on their phone when students arrive

---

## Priority Fix List (What to Build Next)

### Phase 1: Sensei Essentials (Week 1)
1. **📅 Calendar Component**
   - Weekly/monthly view
   - Show all classes
   - Click to see attendance
   - Visual capacity indicators

2. **💬 Communication System**
   - Integrate email service (Resend/SendGrid)
   - Automated class reminders (24hr before)
   - Bulk messaging to all students
   - Payment reminder emails

3. **📊 Sensei Dashboard**
   - Today's classes at a glance
   - Students ready for grading (visual cards)
   - Recent attendance graph
   - Payment status summary

### Phase 2: Automation (Week 2)
4. **⚡ Automated Workflows**
   - Auto-reminder 24hrs before class
   - Auto-notify students when eligible for grading
   - Auto-email failed payments
   - Auto-welcome email for new students

5. **💳 Stripe Integration**
   - Connect Stripe account
   - Automated subscription billing
   - Payment links for trials
   - Invoice generation

### Phase 3: Mobile & Polish (Week 3)
6. **📱 Mobile Optimization**
   - PWA (installable on phone)
   - Push notifications
   - Mobile check-in flow
   - Mobile attendance view

7. **📝 Digital Forms**
   - Online registration form
   - Medical waiver
   - Emergency contacts
   - Photo consent

---

## Research Sources

Based on analysis of leading judo/martial arts software:
- [8 Best Judo Studio Management Software in 2025](https://wod.guru/blog/judo-studio-management-software/)
- [7 Best Judo Management Software in 2025](https://www.exercise.com/grow/best-judo-management-software/)
- [Martial Arts Software - Club-OS](https://www.club-os.com/solutions/martial-arts-software)
- [Key Features in Judo Instructor Business Software](https://www.wellnessliving.com/blog/judo-instructor-business-software/)
- [Martial Arts Management Software 2026](https://tamarran.co/en/martial-arts-management-software-for-schools-2026/)
- [Managing Scheduling Conflicts](https://sparkmembership.com/managing-scheduling-conflicts-in-your-martial-arts-school/)

**Key Finding:** Modern judo software in 2026 is ALL about automation, visual scheduling, and parent communication. Traditional spreadsheet management is outdated.

---

## Bottom Line

**What We Have:** Solid database foundation with proper judo terminology
**What We're Missing:** The actual tools senseis use DAILY

**Recommendation:**
Focus next on the 3 critical features:
1. 📅 Calendar view
2. 💬 Automated communication
3. 📊 Visual dashboards

These 3 features will make senseis' lives 10x easier than the multi-tenant architecture we just built.
