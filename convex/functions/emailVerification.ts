/**
 * Email Verification Functions
 *
 * Validates university email domains to determine student discount eligibility.
 * Students with verified university emails get access to £25 student tier.
 * Non-students can still sign up but pay £40 standard or £60 premium.
 */

// Valid UK university email domains
export const VALID_UNIVERSITY_DOMAINS = [
  // University of London (Birkbeck)
  "@mail.bbk.ac.uk",
  "@bbk.ac.uk",

  // Major London Universities
  "@ucl.ac.uk",
  "@imperial.ac.uk",
  "@kcl.ac.uk",
  "@qmul.ac.uk",
  "@soas.ac.uk",
  "@lse.ac.uk",
  "@city.ac.uk",
  "@royalholloway.ac.uk",
  "@gold.ac.uk",
  "@brunel.ac.uk",
  "@westminster.ac.uk",
  "@kingston.ac.uk",
  "@roehampton.ac.uk",

  // Other Major UK Universities
  "@ox.ac.uk",
  "@cam.ac.uk",
  "@manchester.ac.uk",
  "@ed.ac.uk",
  "@gla.ac.uk",
  "@bham.ac.uk",
  "@leeds.ac.uk",
  "@bristol.ac.uk",
  "@warwick.ac.uk",
  "@nottingham.ac.uk",
  "@sheffield.ac.uk",
  "@durham.ac.uk",
  "@soton.ac.uk",
  "@york.ac.uk",
  "@exeter.ac.uk",
  "@bath.ac.uk",
  "@liverpool.ac.uk",
  "@ncl.ac.uk",
  "@sussex.ac.uk",
  "@reading.ac.uk",
  "@surrey.ac.uk",
  "@lancs.ac.uk",
  "@cardiff.ac.uk",
  "@qub.ac.uk",
  "@st-andrews.ac.uk",

  // Student email patterns (many UK universities use these)
  "@student.manchester.ac.uk",
  "@student.bham.ac.uk",
  "@student.leeds.ac.uk",
  "@students.plymouth.ac.uk",
];

/**
 * Validates if an email belongs to a recognized UK university
 * @param email - The email address to validate
 * @returns true if the email is from a valid university domain
 */
export function isUniversityEmail(email: string): boolean {
  if (!email || typeof email !== "string") {
    return false;
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Check if email ends with any of the valid university domains
  return VALID_UNIVERSITY_DOMAINS.some(domain =>
    normalizedEmail.endsWith(domain)
  );
}

/**
 * Extracts the domain from an email address
 * @param email - The email address
 * @returns The domain part (including @) or null if invalid
 */
export function extractEmailDomain(email: string): string | null {
  if (!email || typeof email !== "string") {
    return null;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const atIndex = normalizedEmail.indexOf("@");

  if (atIndex === -1 || atIndex === normalizedEmail.length - 1) {
    return null;
  }

  return normalizedEmail.substring(atIndex);
}

/**
 * Determines which subscription tiers a user is eligible for based on their email
 * @param email - The user's email address
 * @returns An object indicating eligible tiers
 */
export function getEligibleTiers(email: string): {
  isStudent: boolean;
  eligibleTiers: Array<"student" | "standard" | "premium">;
  verifiedDomain: string | null;
} {
  const isStudent = isUniversityEmail(email);
  const domain = extractEmailDomain(email);

  if (isStudent) {
    return {
      isStudent: true,
      eligibleTiers: ["student", "standard", "premium"],
      verifiedDomain: domain,
    };
  }

  return {
    isStudent: false,
    eligibleTiers: ["standard", "premium"],
    verifiedDomain: null,
  };
}

/**
 * Gets a friendly university name from the email domain
 * @param email - The email address
 * @returns A human-readable university name or null
 */
export function getUniversityName(email: string): string | null {
  if (!isUniversityEmail(email)) {
    return null;
  }

  const domain = extractEmailDomain(email);
  if (!domain) {
    return null;
  }

  // Map domains to university names
  const universityMap: Record<string, string> = {
    "@mail.bbk.ac.uk": "Birkbeck, University of London",
    "@bbk.ac.uk": "Birkbeck, University of London",
    "@ucl.ac.uk": "University College London",
    "@imperial.ac.uk": "Imperial College London",
    "@kcl.ac.uk": "King's College London",
    "@qmul.ac.uk": "Queen Mary University of London",
    "@soas.ac.uk": "SOAS University of London",
    "@lse.ac.uk": "London School of Economics",
    "@city.ac.uk": "City, University of London",
    "@royalholloway.ac.uk": "Royal Holloway, University of London",
    "@gold.ac.uk": "Goldsmiths, University of London",
    "@brunel.ac.uk": "Brunel University London",
    "@westminster.ac.uk": "University of Westminster",
    "@kingston.ac.uk": "Kingston University",
    "@roehampton.ac.uk": "University of Roehampton",
    "@ox.ac.uk": "University of Oxford",
    "@cam.ac.uk": "University of Cambridge",
    "@manchester.ac.uk": "University of Manchester",
    "@student.manchester.ac.uk": "University of Manchester",
    "@ed.ac.uk": "University of Edinburgh",
    "@gla.ac.uk": "University of Glasgow",
    "@bham.ac.uk": "University of Birmingham",
    "@student.bham.ac.uk": "University of Birmingham",
    "@leeds.ac.uk": "University of Leeds",
    "@student.leeds.ac.uk": "University of Leeds",
    "@bristol.ac.uk": "University of Bristol",
    "@warwick.ac.uk": "University of Warwick",
    "@nottingham.ac.uk": "University of Nottingham",
    "@sheffield.ac.uk": "University of Sheffield",
    "@durham.ac.uk": "Durham University",
    "@soton.ac.uk": "University of Southampton",
    "@york.ac.uk": "University of York",
    "@exeter.ac.uk": "University of Exeter",
    "@bath.ac.uk": "University of Bath",
    "@liverpool.ac.uk": "University of Liverpool",
    "@ncl.ac.uk": "Newcastle University",
    "@sussex.ac.uk": "University of Sussex",
    "@reading.ac.uk": "University of Reading",
    "@surrey.ac.uk": "University of Surrey",
    "@lancs.ac.uk": "Lancaster University",
    "@cardiff.ac.uk": "Cardiff University",
    "@qub.ac.uk": "Queen's University Belfast",
    "@st-andrews.ac.uk": "University of St Andrews",
    "@students.plymouth.ac.uk": "University of Plymouth",
  };

  return universityMap[domain] || "UK University";
}

/**
 * Validates student eligibility for a specific tier
 * @param email - The user's email address
 * @param requestedTier - The tier the user wants to sign up for
 * @returns An object indicating if the tier is allowed and why
 */
export function validateTierEligibility(
  email: string,
  requestedTier: "student" | "standard" | "premium"
): { allowed: boolean; reason?: string } {
  const eligibility = getEligibleTiers(email);

  if (requestedTier === "student" && !eligibility.isStudent) {
    return {
      allowed: false,
      reason: "Student tier requires a valid university email address",
    };
  }

  if (eligibility.eligibleTiers.includes(requestedTier)) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: "You are not eligible for this tier",
  };
}
