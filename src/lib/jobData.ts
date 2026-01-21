export interface Job {
  id: string;
  title: string;
  salaryRange: string;
  type: "Full-time" | "Part-time";
  location: string;
  category: "Instruction" | "Operations" | "Platform";
  description: string;
  requirements: {
    required: string[];
    niceToHave: string[];
  };
  benefits: string[];
  featured: boolean;
}

export const jobs: Job[] = [
  {
    id: "head-sensei",
    title: "Head Sensei",
    salaryRange: "£40,000 - £50,000",
    type: "Full-time",
    location: "Birkbeck, London",
    category: "Instruction",
    description: "Lead our dojo as Head Sensei, overseeing all training programs and instructor development. You'll set the technical standard, design curriculum, and ensure every member receives world-class judo instruction. This is a leadership role that combines hands-on teaching with strategic planning.",
    requirements: {
      required: [
        "BJA Black Belt (minimum 1st Dan)",
        "5+ years teaching experience",
        "BJA Coach Level 2 or higher",
        "First Aid & Safeguarding certified",
        "Strong leadership and communication skills"
      ],
      niceToHave: [
        "Competition coaching experience",
        "Experience managing a dojo or club",
        "Additional martial arts qualifications",
        "Japanese language skills"
      ]
    },
    benefits: [
      "Competitive salary with performance bonuses",
      "Professional development budget (£2,000/year)",
      "Free gym membership",
      "30 days holiday + bank holidays",
      "Pension contribution (5% employer match)",
      "Training equipment allowance"
    ],
    featured: true
  },
  {
    id: "assistant-sensei",
    title: "Assistant Sensei",
    salaryRange: "£25,000 - £35,000",
    type: "Full-time",
    location: "Birkbeck, London",
    category: "Instruction",
    description: "Support the Head Sensei in delivering exceptional judo instruction across all age groups and skill levels. You'll lead classes, provide one-on-one coaching, and help create a welcoming, motivating environment for members. Perfect for a passionate judoka looking to build a teaching career.",
    requirements: {
      required: [
        "BJA Brown Belt minimum (Black Belt preferred)",
        "2+ years teaching experience",
        "BJA Coach Level 1 certified",
        "First Aid certified",
        "DBS check clearance"
      ],
      niceToHave: [
        "Experience teaching kids' classes",
        "Competition experience",
        "Sports science or coaching qualification",
        "Social media skills for class promotion"
      ]
    },
    benefits: [
      "Competitive salary",
      "Free training and belt progression support",
      "Professional development opportunities",
      "25 days holiday + bank holidays",
      "Pension contribution",
      "Staff discount on merchandise"
    ],
    featured: false
  },
  {
    id: "competition-coach",
    title: "Competition Coach",
    salaryRange: "£30,000 - £45,000",
    type: "Full-time",
    location: "Birkbeck, London",
    category: "Instruction",
    description: "Prepare our competitive athletes for success at regional, national, and international levels. You'll design training programs, analyze competition footage, travel to tournaments, and work closely with athletes to maximize their competitive potential.",
    requirements: {
      required: [
        "BJA Black Belt with competition history",
        "Proven track record coaching competitive judoka",
        "BJA Coach Level 2 or higher",
        "Available for weekend competitions",
        "First Aid & Safeguarding certified"
      ],
      niceToHave: [
        "International competition experience",
        "Sports psychology knowledge",
        "Video analysis expertise",
        "Strength & conditioning certification"
      ]
    },
    benefits: [
      "Competitive salary + tournament bonuses",
      "Travel expenses covered",
      "Professional development budget",
      "Flexible scheduling around competitions",
      "30 days holiday",
      "Performance bonuses for athlete success"
    ],
    featured: true
  },
  {
    id: "kids-instructor",
    title: "Kids' Instructor",
    salaryRange: "£22,000 - £32,000",
    type: "Part-time",
    location: "Birkbeck, London",
    category: "Instruction",
    description: "Make judo fun and engaging for children aged 5-15. You'll teach fundamental techniques, build confidence, and foster a love of martial arts in a safe, supportive environment. Experience working with children and patience are essential.",
    requirements: {
      required: [
        "BJA Brown Belt minimum",
        "Experience teaching children",
        "Enhanced DBS check",
        "Safeguarding children certification",
        "Patient, energetic personality"
      ],
      niceToHave: [
        "Teaching qualification or PGCE",
        "First Aid trained",
        "BJA Coach Level 1",
        "Previous youth sports coaching experience"
      ]
    },
    benefits: [
      "Flexible part-time hours (evenings/weekends)",
      "Competitive hourly rate",
      "Free training sessions",
      "Professional development support",
      "Fun, rewarding work environment",
      "Pension contribution"
    ],
    featured: false
  },
  {
    id: "front-desk-manager",
    title: "Front Desk Manager",
    salaryRange: "£20,000 - £28,000",
    type: "Full-time",
    location: "Birkbeck, London",
    category: "Operations",
    description: "Be the welcoming face of our dojo. You'll manage member check-ins, handle inquiries, coordinate schedules, and ensure smooth daily operations. Strong organizational skills and customer service excellence are key.",
    requirements: {
      required: [
        "2+ years customer service experience",
        "Excellent communication skills",
        "Proficient with booking/membership software",
        "Organized and detail-oriented",
        "Available for flexible shifts"
      ],
      niceToHave: [
        "Martial arts background or interest",
        "Experience with CRM systems",
        "Basic accounting knowledge",
        "Social media management skills"
      ]
    },
    benefits: [
      "Competitive salary",
      "Free judo membership",
      "25 days holiday",
      "Pension contribution",
      "Training opportunities",
      "Staff discount"
    ],
    featured: false
  },
  {
    id: "marketing-manager",
    title: "Marketing Manager",
    salaryRange: "£28,000 - £40,000",
    type: "Full-time",
    location: "Remote (UK)",
    category: "Operations",
    description: "Drive growth and engagement for the JUDO platform. You'll develop marketing strategies, create content, manage social media, run campaigns, and build partnerships. Perfect for a creative marketer passionate about sports and community building.",
    requirements: {
      required: [
        "3+ years marketing experience",
        "Strong digital marketing skills",
        "Social media expertise",
        "Content creation abilities",
        "Analytics-driven mindset"
      ],
      niceToHave: [
        "Sports or fitness industry experience",
        "Graphic design skills",
        "Video production experience",
        "SEO/SEM expertise",
        "Community building experience"
      ]
    },
    benefits: [
      "Competitive salary",
      "Remote work flexibility",
      "Marketing tools budget",
      "Professional development",
      "30 days holiday",
      "Pension contribution",
      "Free platform membership"
    ],
    featured: true
  },
  {
    id: "event-coordinator",
    title: "Event Coordinator",
    salaryRange: "£24,000 - £35,000",
    type: "Full-time",
    location: "Birkbeck, London",
    category: "Operations",
    description: "Plan and execute memorable events including tournaments, gradings, workshops, and social gatherings. You'll handle logistics, vendor coordination, promotion, and ensure every event runs smoothly and exceeds expectations.",
    requirements: {
      required: [
        "2+ years event planning experience",
        "Strong project management skills",
        "Budget management experience",
        "Excellent communication",
        "Available for evening/weekend events"
      ],
      niceToHave: [
        "Sports event experience",
        "Venue management knowledge",
        "Sponsor relationship experience",
        "First Aid trained",
        "Full UK driving license"
      ]
    },
    benefits: [
      "Competitive salary",
      "Flexible working hours",
      "Event planning budget",
      "25 days holiday",
      "Pension contribution",
      "Networking opportunities",
      "Free membership"
    ],
    featured: false
  },
  {
    id: "dojo-success-manager",
    title: "Dojo Success Manager",
    salaryRange: "£25,000 - £35,000",
    type: "Full-time",
    location: "Remote (UK)",
    category: "Operations",
    description: "Help martial arts clubs succeed on the JUDO platform. You'll onboard new dojos, provide training, troubleshoot issues, gather feedback, and ensure clubs get maximum value from our platform. Customer success experience essential.",
    requirements: {
      required: [
        "2+ years customer success experience",
        "Strong problem-solving skills",
        "Excellent communication",
        "Technical aptitude",
        "Empathetic and patient"
      ],
      niceToHave: [
        "Martial arts background",
        "SaaS experience",
        "Project management skills",
        "Training/teaching experience",
        "Data analysis skills"
      ]
    },
    benefits: [
      "Competitive salary",
      "Remote work flexibility",
      "Professional development",
      "30 days holiday",
      "Pension contribution",
      "Performance bonuses",
      "Free platform access"
    ],
    featured: false
  },
  {
    id: "platform-developer",
    title: "Platform Developer",
    salaryRange: "£40,000 - £70,000",
    type: "Full-time",
    location: "Remote (UK)",
    category: "Platform",
    description: "Build and enhance the JUDO platform. You'll develop new features, optimize performance, fix bugs, and work with modern web technologies. We're looking for a passionate full-stack developer who loves solving real-world problems.",
    requirements: {
      required: [
        "3+ years software development experience",
        "Strong React & TypeScript skills",
        "Experience with real-time databases",
        "API design and integration",
        "Git version control"
      ],
      niceToHave: [
        "Convex or Firebase experience",
        "Payment integration (Stripe) experience",
        "Mobile app development (React Native)",
        "DevOps/CI/CD knowledge",
        "Open source contributions"
      ]
    },
    benefits: [
      "Competitive salary based on experience",
      "Remote-first culture",
      "Latest tech stack",
      "Flexible working hours",
      "30 days holiday",
      "Learning & development budget (£3,000/year)",
      "Top-tier equipment provided"
    ],
    featured: true
  }
];

export const jobCategories = ["All", "Instruction", "Operations", "Platform"] as const;
export const jobTypes = ["All", "Full-time", "Part-time"] as const;
export const jobLocations = ["All", "Birkbeck, London", "Remote (UK)"] as const;
