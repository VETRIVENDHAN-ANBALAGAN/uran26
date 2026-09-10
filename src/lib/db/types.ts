export interface TeamMember {
  name: string;
  email?: string;
  phone?: string;
  role?: string;
}

export type PaymentStatus = "PENDING_ON_SPOT" | "PAID_ON_SPOT" | "EXEMPT";
export type CheckInStatus = "NOT_CHECKED_IN" | "CHECKED_IN" | "DISQUALIFIED";
export type PaymentMode = "CASH" | "UPI_ON_SPOT" | "WAIVED";

export interface PaymentReceipt {
  receiptNo: string;
  amountPaid: number;
  paymentMode: PaymentMode;
  collectedBy: string;
  paidAt: string;
  notes?: string;
}

export interface TeamRegistration {
  id: string;
  registrationToken: string; // e.g., URAN26-TEAM-XXXX-YYYY
  teamName: string;
  teamNameNormalized: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  college: string;
  teamSize: number; // 3 to 5
  preferredTrack: string;
  accommodationRequested: boolean;
  hasValidStudentIds: boolean;
  members: TeamMember[];
  ratePerPerson: number; // 250
  totalPayableOnSpot: number; // teamSize * 250
  paymentStatus: PaymentStatus;
  checkInStatus: CheckInStatus;
  paymentReceipt?: PaymentReceipt;
  registeredAtFormatted: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  ipHash?: string;
}

export interface AuditLogRecord {
  id: string;
  action: 
    | "PRE_REGISTRATION_CREATED" 
    | "CHECKIN_VERIFIED" 
    | "PAYMENT_COLLECTED" 
    | "TEAM_UPDATED" 
    | "TEAM_DISQUALIFIED" 
    | "DATA_EXPORTED" 
    | "RATE_LIMIT_BLOCKED" 
    | "UNAUTHORIZED_ADMIN_ATTEMPT";
  actor: string; // Admin username or IP hash
  targetToken?: string;
  details: Record<string, any>;
  timestamp: string;
}

export interface AdminStats {
  totalTeams: number;
  totalParticipants: number;
  checkedInTeams: number;
  checkedInParticipants: number;
  pendingCheckIns: number;
  totalRevenueCollected: number;
  totalRevenueProjected: number;
  accommodationRequestsCount: number;
  trackDistribution: Record<string, number>;
  lastRegistrationAt: string | null;
}

export interface DatabaseSchema {
  version: number;
  lastUpdated: string;
  teams: TeamRegistration[];
  auditLogs: AuditLogRecord[];
}
