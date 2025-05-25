export interface Case {
  $id: string;
  caseTitle: string;
  caseType: string;
  caseFilingNumber: string;
  registrationNumber: string;
  petitionerName: string;
  petitionerAdvocateName: string;
  respondentName: string;
  respondentAdvocateName: string;
  cnrNumber: string;
  caseStage: string;
  courtNumberAndJudge: string;
  courtType: string;
  acts: string;
  firmId: string;
  paymentStatus: boolean;
  clientPhoneNumber: string;
  filingDate: string;
  registrationDate: string;
  firstHearingDate: string;
  prevHearingDate: string;
  nextHearingDate: string;
  decisionDate: string;
  caseHistory: string;
}

export interface FirmMember {
  $id: string;
  userId: string;
  firmId: string;
  name: string;
  email: string;
  phone: string;
  role: "Owner" | "Admin" | "Editor" | "Viewer";
  status: "Pending" | "Approved";
  isBlocked: boolean;
}

export interface StoreUser {
  $id: string;
  name: string;
  email: string;
}

export interface Firm {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $collectionId: string;
  $databaseId: string;
  name: string;
  ownerId: string;
  isActive: boolean;
  inviteCode: string;
  subscriptionPlan: "Trial" | "Gold" | "Diamond" | "Platinum";
  subscriptionExpiry: string;
  caseLimit: string;
  memberLimit: string;
}

export interface SubscriptionStatus {
  plan: string,
  active: boolean;
  expires: string;
  caseLimit: string;
  memberLimit: string;
}

export interface SubscriptionPlan {
  $id: string;
  planName: string;
  caseLimit: string | 'Unlimited';
  memberLimit: string | 'Unlimited';
  monthlyPrice: string;
  yearlyPrice: string;
  isActive: boolean;
  trialDays?: string;
}

export interface Membership {
  id: string;
  planName: string;
  caseLimit: string;
  memberLimit: string;
  monthlyPrice: string;
  yearlyPrice: string;
}