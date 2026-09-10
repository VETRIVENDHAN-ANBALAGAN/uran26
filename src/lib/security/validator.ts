import { TeamMember } from "../db/types";

export const OFFICIAL_TRACKS = [
  "01 — EdTech & Inclusive Innovation",
  "02 — AgriTech & Rural Innovation",
  "03 — FinTech & Digital Economy",
  "04 — CyberTech & Digital Trust",
  "05 — HealthTech & Well-being",
] as const;

export interface SanitizedPreRegistrationInput {
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  college: string;
  teamSize: number;
  preferredTrack: string;
  accommodationRequested: boolean;
  hasValidStudentIds: boolean;
  members: TeamMember[];
  registeredAtFormatted: string;
}

export interface ValidationResult<T> {
  isValid: boolean;
  errors: Record<string, string>;
  data?: T;
}

// XSS and Tag Sanitizer
export function sanitizeString(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>?/gm, "") // Strip HTML tags
    .replace(/[<>'"`;()&$]/g, (c) => {
      switch (c) {
        case "<": return "&lt;";
        case ">": return "&gt;";
        case "'": return "&#39;";
        case '"': return "&quot;";
        case ";": return "";
        case "$": return "";
        default: return "";
      }
    })
    .trim();
}

// RFC 5322 compliant regex check
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email);
}

// Indian mobile number validation (+91 or 0 prefix optional, 10 digits starting with 6-9)
export function sanitizeAndValidatePhone(phone: unknown): { isValid: boolean; normalized: string } {
  if (!phone || typeof phone !== "string") return { isValid: false, normalized: "" };
  const digits = phone.replace(/\D/g, "");
  
  // Extract last 10 digits
  const last10 = digits.slice(-10);
  const isValid = last10.length === 10 && /^[6-9]\d{9}$/.test(last10);
  
  return {
    isValid,
    normalized: isValid ? `+91 ${last10.slice(0, 5)} ${last10.slice(5)}` : "",
  };
}

export function validatePreRegistrationPayload(rawBody: any): ValidationResult<SanitizedPreRegistrationInput> {
  const errors: Record<string, string> = {};

  if (!rawBody || typeof rawBody !== "object") {
    return { isValid: false, errors: { body: "Request body must be a valid JSON object." } };
  }

  // 1. Team Name
  const teamName = sanitizeString(rawBody.teamName);
  if (!teamName) {
    errors.teamName = "Team name is required.";
  } else if (teamName.length < 2 || teamName.length > 50) {
    errors.teamName = "Team name must be between 2 and 50 characters.";
  }

  // 2. Leader Name
  const leaderName = sanitizeString(rawBody.leaderName);
  if (!leaderName) {
    errors.leaderName = "Team leader name is required.";
  } else if (leaderName.length < 2 || leaderName.length > 60) {
    errors.leaderName = "Leader name must be between 2 and 60 characters.";
  }

  // 3. Leader Email
  const leaderEmail = String(rawBody.leaderEmail || "").trim().toLowerCase();
  if (!leaderEmail) {
    errors.leaderEmail = "Leader email address is required.";
  } else if (!isValidEmail(leaderEmail)) {
    errors.leaderEmail = "Please provide a valid official email address.";
  }

  // 4. Leader Phone
  const phoneCheck = sanitizeAndValidatePhone(rawBody.leaderPhone);
  if (!phoneCheck.isValid) {
    errors.leaderPhone = "Please enter a valid 10-digit Indian mobile number (e.g. 9025116795).";
  }

  // 5. College / Institution
  const college = sanitizeString(rawBody.college) || "Department of Computer Applications, PMIST";
  if (college.length > 100) {
    errors.college = "College name must not exceed 100 characters.";
  }

  // 6. Team Size (Strictly 3 to 5 builders)
  const rawSize = parseInt(String(rawBody.teamSize), 10);
  if (isNaN(rawSize) || rawSize < 3 || rawSize > 5) {
    errors.teamSize = "URAN’26 hackathon team size must be between 3 and 5 builders.";
  }
  const teamSize = isNaN(rawSize) ? 4 : Math.min(Math.max(rawSize, 3), 5);

  // 7. Preferred Track
  let preferredTrack = sanitizeString(rawBody.preferredTrack);
  const matchedTrack = OFFICIAL_TRACKS.find(t => t === preferredTrack || preferredTrack.includes(t.slice(0, 2)));
  if (!matchedTrack) {
    preferredTrack = OFFICIAL_TRACKS[0]; // Fallback to EdTech
  } else {
    preferredTrack = matchedTrack;
  }

  // 8. Accommodation
  const accommodationRequested = Boolean(rawBody.accommodationRequested);

  // 9. Student ID Confirmation
  const hasValidStudentIds = rawBody.hasValidStudentIds !== false;

  // 10. Members array sanitization
  const rawMembers = Array.isArray(rawBody.members) ? rawBody.members : [];
  const sanitizedMembers: TeamMember[] = [];

  // Always include leader as member 1
  sanitizedMembers.push({
    name: leaderName,
    email: leaderEmail,
    phone: phoneCheck.normalized,
    role: "Team Leader",
  });

  for (let i = 0; i < rawMembers.length && sanitizedMembers.length < teamSize; i++) {
    const m = rawMembers[i];
    if (m && typeof m === "object") {
      const name = sanitizeString(m.name);
      if (name && name !== leaderName) {
        sanitizedMembers.push({
          name,
          email: m.email && isValidEmail(String(m.email).trim().toLowerCase()) ? String(m.email).trim().toLowerCase() : undefined,
          phone: m.phone ? sanitizeString(m.phone) : undefined,
          role: m.role ? sanitizeString(m.role) : `Member ${sanitizedMembers.length + 1}`,
        });
      }
    }
  }

  const registeredAtFormatted = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: {},
    data: {
      teamName,
      leaderName,
      leaderEmail,
      leaderPhone: phoneCheck.normalized,
      college,
      teamSize,
      preferredTrack,
      accommodationRequested,
      hasValidStudentIds,
      members: sanitizedMembers,
      registeredAtFormatted,
    },
  };
}

export function validateCheckInPayload(rawBody: any): {
  isValid: boolean;
  errors: Record<string, string>;
  data?: {
    token: string;
    amountPaid: number;
    paymentMode: "CASH" | "UPI_ON_SPOT" | "WAIVED";
    collectedBy: string;
    notes?: string;
  };
} {
  const errors: Record<string, string> = {};

  if (!rawBody || typeof rawBody !== "object") {
    return { isValid: false, errors: { body: "Invalid check-in payload." } };
  }

  const token = sanitizeString(rawBody.token).toUpperCase();
  if (!token) {
    errors.token = "Team Registration Token is required for check-in.";
  }

  const amountPaid = Number(rawBody.amountPaid);
  if (isNaN(amountPaid) || amountPaid < 0) {
    errors.amountPaid = "Amount paid must be a valid non-negative number.";
  }

  const validModes = ["CASH", "UPI_ON_SPOT", "WAIVED"];
  const paymentMode = validModes.includes(rawBody.paymentMode) ? rawBody.paymentMode : "UPI_ON_SPOT";

  const collectedBy = sanitizeString(rawBody.collectedBy) || "PMIST Check-in Desk Staff";
  const notes = rawBody.notes ? sanitizeString(rawBody.notes) : undefined;

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: {},
    data: {
      token,
      amountPaid,
      paymentMode,
      collectedBy,
      notes,
    },
  };
}
