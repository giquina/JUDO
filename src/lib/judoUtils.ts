/**
 * Judo Utilities
 * Professional judo terminology and belt system helpers
 */

// ============================================================================
// BELT SYSTEM (Kyu/Dan Ranks)
// ============================================================================

export type BeltRank =
  | "6th_kyu" // White (白帯)
  | "5th_kyu" // Yellow (黄帯)
  | "4th_kyu" // Orange (橙帯)
  | "3rd_kyu" // Green (緑帯)
  | "2nd_kyu" // Blue (青帯)
  | "1st_kyu" // Brown (茶帯)
  | "1st_dan" // Black 1st degree (初段)
  | "2nd_dan" // Black 2nd degree (弐段)
  | "3rd_dan" // Black 3rd degree (参段)
  | "4th_dan" // Black 4th degree (四段)
  | "5th_dan" // Black 5th degree (五段)
  | "6th_dan" // Black 6th degree (六段)
  | "7th_dan" // Black 7th degree (七段)
  | "8th_dan" // Black 8th degree (八段)
  | "9th_dan" // Black 9th degree (九段)
  | "10th_dan"; // Black 10th degree (十段)

export interface BeltInfo {
  rank: BeltRank;
  displayName: string;
  japaneseName: string;
  color: string;
  textColor: string;
  category: "kyu" | "dan";
  numericRank: number;
}

export const BELT_INFO: Record<BeltRank, BeltInfo> = {
  "6th_kyu": {
    rank: "6th_kyu",
    displayName: "White Belt (6th Kyu)",
    japaneseName: "白帯 (Rokkyū)",
    color: "#FFFFFF",
    textColor: "#000000",
    category: "kyu",
    numericRank: 6,
  },
  "5th_kyu": {
    rank: "5th_kyu",
    displayName: "Yellow Belt (5th Kyu)",
    japaneseName: "黄帯 (Gokyū)",
    color: "#FFD700",
    textColor: "#000000",
    category: "kyu",
    numericRank: 5,
  },
  "4th_kyu": {
    rank: "4th_kyu",
    displayName: "Orange Belt (4th Kyu)",
    japaneseName: "橙帯 (Yonkyū)",
    color: "#FF8C00",
    textColor: "#FFFFFF",
    category: "kyu",
    numericRank: 4,
  },
  "3rd_kyu": {
    rank: "3rd_kyu",
    displayName: "Green Belt (3rd Kyu)",
    japaneseName: "緑帯 (Sankyū)",
    color: "#228B22",
    textColor: "#FFFFFF",
    category: "kyu",
    numericRank: 3,
  },
  "2nd_kyu": {
    rank: "2nd_kyu",
    displayName: "Blue Belt (2nd Kyu)",
    japaneseName: "青帯 (Nikyū)",
    color: "#1E90FF",
    textColor: "#FFFFFF",
    category: "kyu",
    numericRank: 2,
  },
  "1st_kyu": {
    rank: "1st_kyu",
    displayName: "Brown Belt (1st Kyu)",
    japaneseName: "茶帯 (Ikkyū)",
    color: "#8B4513",
    textColor: "#FFFFFF",
    category: "kyu",
    numericRank: 1,
  },
  "1st_dan": {
    rank: "1st_dan",
    displayName: "Black Belt 1st Dan (Shodan)",
    japaneseName: "初段 (Shodan)",
    color: "#000000",
    textColor: "#FFFFFF",
    category: "dan",
    numericRank: 1,
  },
  "2nd_dan": {
    rank: "2nd_dan",
    displayName: "Black Belt 2nd Dan (Nidan)",
    japaneseName: "弐段 (Nidan)",
    color: "#000000",
    textColor: "#FFFFFF",
    category: "dan",
    numericRank: 2,
  },
  "3rd_dan": {
    rank: "3rd_dan",
    displayName: "Black Belt 3rd Dan (Sandan)",
    japaneseName: "参段 (Sandan)",
    color: "#000000",
    textColor: "#FFFFFF",
    category: "dan",
    numericRank: 3,
  },
  "4th_dan": {
    rank: "4th_dan",
    displayName: "Black Belt 4th Dan (Yondan)",
    japaneseName: "四段 (Yondan)",
    color: "#000000",
    textColor: "#FFFFFF",
    category: "dan",
    numericRank: 4,
  },
  "5th_dan": {
    rank: "5th_dan",
    displayName: "Black Belt 5th Dan (Godan)",
    japaneseName: "五段 (Godan)",
    color: "#000000",
    textColor: "#FFFFFF",
    category: "dan",
    numericRank: 5,
  },
  "6th_dan": {
    rank: "6th_dan",
    displayName: "Black Belt 6th Dan (Rokudan)",
    japaneseName: "六段 (Rokudan)",
    color: "#000000",
    textColor: "#FFFFFF",
    category: "dan",
    numericRank: 6,
  },
  "7th_dan": {
    rank: "7th_dan",
    displayName: "Black Belt 7th Dan (Shichidan)",
    japaneseName: "七段 (Shichidan)",
    color: "#000000",
    textColor: "#FFFFFF",
    category: "dan",
    numericRank: 7,
  },
  "8th_dan": {
    rank: "8th_dan",
    displayName: "Black Belt 8th Dan (Hachidan)",
    japaneseName: "八段 (Hachidan)",
    color: "#000000",
    textColor: "#FFFFFF",
    category: "dan",
    numericRank: 8,
  },
  "9th_dan": {
    rank: "9th_dan",
    displayName: "Black Belt 9th Dan (Kudan)",
    japaneseName: "九段 (Kudan)",
    color: "#000000",
    textColor: "#FFFFFF",
    category: "dan",
    numericRank: 9,
  },
  "10th_dan": {
    rank: "10th_dan",
    displayName: "Black Belt 10th Dan (Judan)",
    japaneseName: "十段 (Judan)",
    color: "#000000",
    textColor: "#FFFFFF",
    category: "dan",
    numericRank: 10,
  },
};

// ============================================================================
// JUDO TECHNIQUES (Waza)
// ============================================================================

export interface Technique {
  name: string;
  romanji: string;
  kanji: string;
  category: "nage_waza" | "katame_waza" | "atemi_waza";
  type?: string;
  beltLevel: BeltRank[];
}

// Throwing Techniques (投げ技)
export const NAGE_WAZA: Technique[] = [
  // Hand techniques (Te-waza)
  {
    name: "Seoi-nage",
    romanji: "seoi-nage",
    kanji: "背負投",
    category: "nage_waza",
    type: "te-waza",
    beltLevel: ["3rd_kyu", "2nd_kyu", "1st_kyu"],
  },
  {
    name: "Tai-otoshi",
    romanji: "tai-otoshi",
    kanji: "体落",
    category: "nage_waza",
    type: "te-waza",
    beltLevel: ["2nd_kyu", "1st_kyu"],
  },

  // Hip techniques (Koshi-waza)
  {
    name: "O-goshi",
    romanji: "o-goshi",
    kanji: "大腰",
    category: "nage_waza",
    type: "koshi-waza",
    beltLevel: ["6th_kyu", "5th_kyu", "4th_kyu"],
  },
  {
    name: "Harai-goshi",
    romanji: "harai-goshi",
    kanji: "払腰",
    category: "nage_waza",
    type: "koshi-waza",
    beltLevel: ["4th_kyu", "3rd_kyu", "2nd_kyu"],
  },
  {
    name: "Uchi-mata",
    romanji: "uchi-mata",
    kanji: "内股",
    category: "nage_waza",
    type: "koshi-waza",
    beltLevel: ["4th_kyu", "3rd_kyu", "2nd_kyu"],
  },

  // Foot techniques (Ashi-waza)
  {
    name: "De-ashi-barai",
    romanji: "de-ashi-barai",
    kanji: "出足払",
    category: "nage_waza",
    type: "ashi-waza",
    beltLevel: ["5th_kyu", "4th_kyu", "3rd_kyu"],
  },
  {
    name: "Ko-uchi-gari",
    romanji: "ko-uchi-gari",
    kanji: "小内刈",
    category: "nage_waza",
    type: "ashi-waza",
    beltLevel: ["5th_kyu", "4th_kyu", "3rd_kyu"],
  },
  {
    name: "O-uchi-gari",
    romanji: "o-uchi-gari",
    kanji: "大内刈",
    category: "nage_waza",
    type: "ashi-waza",
    beltLevel: ["2nd_kyu", "1st_kyu"],
  },
  {
    name: "Osoto-gari",
    romanji: "osoto-gari",
    kanji: "大外刈",
    category: "nage_waza",
    type: "ashi-waza",
    beltLevel: ["6th_kyu", "5th_kyu", "4th_kyu"],
  },

  // Sacrifice techniques (Sutemi-waza)
  {
    name: "Tomoe-nage",
    romanji: "tomoe-nage",
    kanji: "巴投",
    category: "nage_waza",
    type: "sutemi-waza",
    beltLevel: ["3rd_kyu", "2nd_kyu", "1st_kyu"],
  },
];

// ============================================================================
// TRAINING TERMS
// ============================================================================

export const JUDO_TERMS = {
  // General Terms
  judoka: "柔道家 (Judōka) - Judo practitioner",
  dojo: "道場 (Dōjō) - Training hall",
  tatami: "畳 (Tatami) - Training mat",
  gi: "着 (Gi/Judogi) - Judo uniform",
  obi: "帯 (Obi) - Belt",
  sensei: "先生 (Sensei) - Teacher/Instructor",
  shihan: "師範 (Shihan) - Master instructor",
  sempai: "先輩 (Sempai) - Senior student",
  kohai: "後輩 (Kōhai) - Junior student",

  // Training Types
  randori: "乱取り (Randori) - Free practice/sparring",
  kata: "型 (Kata) - Forms/techniques demonstration",
  newaza: "寝技 (Ne-waza) - Ground techniques",
  tachiwaza: "立ち技 (Tachi-waza) - Standing techniques",
  uchikomi: "打ち込み (Uchi-komi) - Repetition training",
  yakusoku_geiko: "約束稽古 (Yakusoku-geiko) - Prearranged practice",

  // Grading
  kyu: "級 (Kyū) - Colored belt ranks (6th to 1st)",
  dan: "段 (Dan) - Black belt ranks (1st to 10th)",
  shiken: "試験 (Shiken) - Examination/grading",

  // Commands
  rei: "礼 (Rei) - Bow",
  hajime: "始め (Hajime) - Begin",
  matte: "待て (Matte) - Wait/stop",
  sore_made: "それまで (Sore-made) - That's all/finish",
  ippon: "一本 (Ippon) - Full point",
  waza_ari: "技あり (Waza-ari) - Half point",
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get belt information
 */
export function getBeltInfo(rank: BeltRank): BeltInfo {
  return BELT_INFO[rank];
}

/**
 * Get belt display name (e.g., "White Belt (6th Kyu)")
 */
export function getBeltDisplayName(rank: BeltRank): string {
  return BELT_INFO[rank].displayName;
}

/**
 * Get belt color
 */
export function getBeltColor(rank: BeltRank): string {
  return BELT_INFO[rank].color;
}

/**
 * Get next belt rank
 */
export function getNextBelt(currentBelt: BeltRank): BeltRank | null {
  const beltOrder: BeltRank[] = [
    "6th_kyu",
    "5th_kyu",
    "4th_kyu",
    "3rd_kyu",
    "2nd_kyu",
    "1st_kyu",
    "1st_dan",
    "2nd_dan",
    "3rd_dan",
    "4th_dan",
    "5th_dan",
    "6th_dan",
    "7th_dan",
    "8th_dan",
    "9th_dan",
    "10th_dan",
  ];

  const currentIndex = beltOrder.indexOf(currentBelt);
  if (currentIndex === -1 || currentIndex === beltOrder.length - 1) {
    return null; // Already at highest rank
  }

  return beltOrder[currentIndex + 1];
}

/**
 * Check if a belt is higher than another
 */
export function isBeltHigher(belt1: BeltRank, belt2: BeltRank): boolean {
  const info1 = BELT_INFO[belt1];
  const info2 = BELT_INFO[belt2];

  // Dan ranks are always higher than Kyu ranks
  if (info1.category === "dan" && info2.category === "kyu") return true;
  if (info1.category === "kyu" && info2.category === "dan") return false;

  // Within same category, compare numeric ranks
  if (info1.category === "kyu") {
    return info1.numericRank < info2.numericRank; // Lower kyu number = higher rank
  } else {
    return info1.numericRank > info2.numericRank; // Higher dan number = higher rank
  }
}

/**
 * Get techniques for a belt level
 */
export function getTechniquesForBelt(belt: BeltRank): Technique[] {
  return NAGE_WAZA.filter((tech) => tech.beltLevel.includes(belt));
}

/**
 * Format session count with judo context
 */
export function formatSessionCount(count: number): string {
  return `${count} ${count === 1 ? "session" : "sessions"} on the tatami`;
}

/**
 * Get months until next grading eligibility
 */
export function getMonthsUntilGrading(lastGradingDate: number): number {
  const now = Date.now();
  const monthsSince = (now - lastGradingDate) / (1000 * 60 * 60 * 24 * 30);
  const minMonths = 3; // Minimum 3 months between gradings
  return Math.max(0, minMonths - monthsSince);
}

/**
 * Check if eligible for grading
 */
export function isEligibleForGrading(
  totalSessions: number,
  lastGradingDate: number | undefined,
  nextGradingEligible: number | undefined
): boolean {
  const minSessions = 30; // Minimum sessions required
  const now = Date.now();

  // Check session requirement
  if (totalSessions < minSessions) return false;

  // Check eligibility date
  if (nextGradingEligible && nextGradingEligible > now) return false;

  // Check minimum time since last grading
  if (lastGradingDate) {
    const monthsSince = (now - lastGradingDate) / (1000 * 60 * 60 * 24 * 30);
    if (monthsSince < 3) return false;
  }

  return true;
}
