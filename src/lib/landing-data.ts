// Landing page data for sensei/instructor-focused content

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  club: string;
  rating: number;
  image?: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  benefit: string;
}

export interface PainPoint {
  problem: string;
  solution: string;
  icon: string;
  stat?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface FeatureShowcase {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  icon: string;
}

// Testimonials from senseis/instructors
export const senseiTestimonials: Testimonial[] = [
  {
    quote: "Since switching to Judo Club Manager, I've reclaimed 10 hours per week. No more spreadsheets, no more chasing payments. I can focus on what I love - teaching judo.",
    name: "Sensei Michael Chen",
    role: "Head Coach",
    club: "London Judo Academy",
    rating: 5
  },
  {
    quote: "The QR check-in system transformed our dojo. Members love the simplicity, and I have real-time visibility of who's on the mat. Class management has never been easier.",
    name: "Sensei Sarah Mitchell",
    role: "Dojo Owner & 3rd Dan",
    club: "Birkbeck Judo Club",
    rating: 5
  },
  {
    quote: "Automated payment reminders and Stripe integration mean I actually get paid on time. Member retention is up 40% since we can track engagement and reach out proactively.",
    name: "Sensei James Rodriguez",
    role: "Club Manager",
    club: "East London Judo",
    rating: 5
  },
  {
    quote: "As a coach juggling multiple classes, having everything in one dashboard is incredible. Attendance tracking, member progress, and communication tools all in one place.",
    name: "Coach Emma Thompson",
    role: "Youth Programme Lead",
    club: "Westminster Judo",
    rating: 5
  },
  {
    quote: "The member dashboard keeps students engaged between sessions. They can track their progress toward the next belt, which drives motivation and attendance.",
    name: "Sensei David Park",
    role: "Technical Director",
    club: "Central London Martial Arts",
    rating: 5
  },
  {
    quote: "Setup took 20 minutes. Within a week, my entire club was onboarded. The ROI was immediate - less admin, more teaching time, happier members.",
    name: "Sensei Lisa Yamamoto",
    role: "Founder",
    club: "Yamamoto Judo School",
    rating: 5
  }
];

// Pain points and solutions
export const painPoints: PainPoint[] = [
  {
    problem: "Drowning in spreadsheets and paperwork",
    solution: "Automated attendance tracking with QR check-in. One scan, instant record.",
    icon: "qrcode",
    stat: "95% faster check-in"
  },
  {
    problem: "Chasing late payments every month",
    solution: "Automated Stripe subscriptions with payment reminders. Get paid on time, every time.",
    icon: "credit-card",
    stat: "40% fewer late payments"
  },
  {
    problem: "No visibility into who's attending",
    solution: "Real-time dashboard shows exactly who's on the mat, attendance trends, and engagement patterns.",
    icon: "users",
    stat: "100% attendance visibility"
  },
  {
    problem: "Spending hours on admin instead of teaching",
    solution: "Automated workflows for everything: check-in, payments, communication, and reporting.",
    icon: "clock",
    stat: "10+ hours saved/week"
  },
  {
    problem: "Members dropping off without warning",
    solution: "Track engagement metrics and get alerts when members miss sessions. Re-engage before they quit.",
    icon: "user-x",
    stat: "30% better retention"
  },
  {
    problem: "No way to track student progress",
    solution: "Digital belt progression tracking. Students see their journey, you track readiness for grading.",
    icon: "trophy",
    stat: "Complete progress visibility"
  }
];

// Feature showcase tabs
export const featureShowcases: FeatureShowcase[] = [
  {
    id: "qr-checkin",
    title: "QR Check-in",
    description: "Instant attendance tracking that members and senseis both love",
    benefits: [
      "Each member gets a unique QR code in their profile",
      "Scan at dojo entrance - check-in takes < 2 seconds",
      "Real-time attendance appears in coach dashboard",
      "Historical attendance data for every member",
      "Export reports for insurance or compliance"
    ],
    icon: "qrcode"
  },
  {
    id: "member-management",
    title: "Member Management",
    description: "Everything you need to know about your students in one place",
    benefits: [
      "Complete member profiles with contact info and emergency contacts",
      "Belt rank and progression tracking",
      "Attendance history and engagement metrics",
      "Payment status and subscription details",
      "Communication history and notes"
    ],
    icon: "users"
  },
  {
    id: "payments",
    title: "Payments & Billing",
    description: "Get paid automatically while you focus on teaching",
    benefits: [
      "Secure Stripe integration for subscriptions",
      "Automated payment collection and receipts",
      "Payment reminders for overdue accounts",
      "Multiple membership tiers and pricing",
      "Revenue reporting and analytics"
    ],
    icon: "credit-card"
  },
  {
    id: "communication",
    title: "Communication Tools",
    description: "Keep members informed and engaged",
    benefits: [
      "Send announcements to entire club or specific groups",
      "Schedule reminders for upcoming classes",
      "Direct messaging for one-on-one communication",
      "Automated welcome emails for new members",
      "Class cancellation and schedule change notifications"
    ],
    icon: "message-square"
  }
];

// All features grid
export const allFeatures: Feature[] = [
  {
    id: "qr-checkin",
    title: "QR Check-in",
    description: "Instant attendance with unique QR codes",
    icon: "qrcode",
    benefit: "95% faster than paper sign-in"
  },
  {
    id: "dashboard",
    title: "Coach Dashboard",
    description: "Real-time view of who's training",
    icon: "layout-dashboard",
    benefit: "See everything at a glance"
  },
  {
    id: "payments",
    title: "Automated Payments",
    description: "Stripe subscriptions that just work",
    icon: "credit-card",
    benefit: "Never chase payments again"
  },
  {
    id: "member-profiles",
    title: "Member Profiles",
    description: "Complete student information hub",
    icon: "user",
    benefit: "Everything in one place"
  },
  {
    id: "belt-tracking",
    title: "Belt Progression",
    description: "Track journey from white to black",
    icon: "trophy",
    benefit: "Motivate with visible progress"
  },
  {
    id: "attendance",
    title: "Attendance Analytics",
    description: "Identify trends and engagement",
    icon: "bar-chart",
    benefit: "Data-driven decisions"
  },
  {
    id: "communication",
    title: "Club Communications",
    description: "Announcements and messaging",
    icon: "message-square",
    benefit: "Keep everyone informed"
  },
  {
    id: "schedule",
    title: "Class Schedule",
    description: "Manage classes and sessions",
    icon: "calendar",
    benefit: "Never double-book again"
  },
  {
    id: "mobile",
    title: "Mobile First",
    description: "Works perfectly on any device",
    icon: "smartphone",
    benefit: "Manage from anywhere"
  },
  {
    id: "reporting",
    title: "Reports & Exports",
    description: "Generate reports for compliance",
    icon: "file-text",
    benefit: "Insurance and audits made easy"
  },
  {
    id: "security",
    title: "Bank-Level Security",
    description: "Your data is protected",
    icon: "shield",
    benefit: "GDPR compliant"
  },
  {
    id: "support",
    title: "Dedicated Support",
    description: "We're here to help",
    icon: "headphones",
    benefit: "Response within 24 hours"
  }
];

// FAQ for senseis
export const senseiFAQs: FAQ[] = [
  {
    question: "How quickly can I get my club up and running?",
    answer: "Most senseis complete setup in under 30 minutes. You'll add your club details, upload your member list (or add them manually), and you're ready to go. We provide an onboarding guide and our support team is available if you need help. Many clubs go live the same day they sign up."
  },
  {
    question: "What if my members aren't tech-savvy?",
    answer: "Judo Club Manager is designed to be incredibly simple. Members only need to show their QR code to check in - no app required! The QR code is in their profile, which they can screenshot or print. For members who prefer paper, you can print their QR codes and laminate them. It's actually easier than signing a paper register."
  },
  {
    question: "Can I import my existing member data?",
    answer: "Yes! We support CSV imports from Excel or Google Sheets. Simply map your columns to our fields (name, email, belt rank, etc.) and we'll import everything. We also offer free data migration assistance for clubs with 50+ members."
  },
  {
    question: "How much does it cost?",
    answer: "Pricing starts at £29/month for clubs up to 30 members, then £49/month for up to 100 members, and £99/month for unlimited members. All plans include all features, unlimited check-ins, and free support. We offer a 14-day free trial with no credit card required, so you can try everything risk-free."
  },
  {
    question: "What about payment processing fees?",
    answer: "Stripe (our payment processor) charges 1.5% + 20p per successful transaction, which is standard for online payments in the UK. These fees are separate from our subscription and go directly to Stripe. The good news: automated payment collection typically increases on-time payments by 40%, more than offsetting the processing fees."
  },
  {
    question: "What if I need help or have questions?",
    answer: "Every plan includes email support with responses within 24 hours (usually much faster). We also have extensive documentation, video tutorials, and a knowledge base. For larger clubs, we offer onboarding calls and training sessions. Our goal is to make you successful - we're invested in your success."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, absolutely. There are no long-term contracts. You can cancel anytime from your account settings. If you cancel, you'll have access until the end of your billing period. We'll also provide an export of all your data so you're never locked in."
  },
  {
    question: "Is my club's data secure?",
    answer: "Security is our top priority. All data is encrypted in transit and at rest. We're hosted on enterprise-grade infrastructure with 99.9% uptime. We're fully GDPR compliant and conduct regular security audits. Your payment data is handled by Stripe (used by millions of businesses) and never touches our servers."
  }
];

// Stats for counter animation
export const stats = [
  {
    value: 500,
    suffix: "+",
    label: "Clubs Using Judo Manager",
    duration: 2000
  },
  {
    value: 15000,
    suffix: "+",
    label: "Active Members",
    duration: 2500
  },
  {
    value: 50000,
    suffix: "+",
    label: "Check-ins This Month",
    duration: 3000
  },
  {
    value: 98,
    suffix: "%",
    label: "Sensei Satisfaction",
    duration: 2000
  }
];

// ROI Calculator default values
export const roiDefaults = {
  members: 50,
  avgSessionsPerMonth: 12,
  currentAdminHours: 10,
  hourlyValue: 30,
  membershipFee: 40
};
