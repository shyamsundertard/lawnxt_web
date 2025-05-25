import { create } from "zustand";
import { type StoreUser, type Case, Firm, FirmMember, SubscriptionStatus, SubscriptionPlan } from "@/app/types";
import axiosInstance from "@/app/lib/axiosInstance";

interface CaseState {
  cases: Case[];
  setCases: (cases: Case[]) => void;
  addCase: (caseToAdd: Case) => void;
  removeCase: (caseToRemove: string | number) => void;
}

interface UserState {
  user: StoreUser | null;
  isLoggedOut: boolean;
  setUser: (user: StoreUser | null) => void;
  setIsLoggedOut: (value: boolean) => void;
  fetchUser: () => Promise<void>;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
}

interface FirmState {
  currentFirm: Firm | null;
  firmMembers: FirmMember[];
  pendingMembers: FirmMember[];
  userRole: "Owner" | "Admin" | "Editor" | "Viewer" | null;
  subscriptionStatus: {
    plan: string;
    active: boolean;
    expires: string;
    caseLimit: string;
    memberLimit: string;
  } | null;
  setCurrentFirm: (firm: Firm | null) => void;
  setFirmMembers: (members: FirmMember[]) => void;
  setPendingMembers: (members: FirmMember[]) => void;
  setUserRole: (role: FirmState['userRole']) => void;
  setSubscriptionStatus: (status: FirmState['subscriptionStatus']) => void;
  loadingFirmData: (userId: string) => Promise<void>;
  clearFirmData: () => void;
}

export interface SubscriptionState {
  plans: SubscriptionPlan[];
  isLoading: boolean;
  error: string | null;
  fetchPlans: () => Promise<void>;
}

const useCaseStore = create<CaseState>((set) => ({
  cases: [],
  setCases: (cases: Case[]) => set({ cases }),
  addCase: (caseToAdd: Case) =>
    set((state) => ({ cases: [...state.cases, caseToAdd] })),
  removeCase: (caseId: number | string) =>
    set((state) => ({
      cases: state.cases.filter((c: Case) => c.$id !== caseId),
    })),
}));

const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoggedOut: false,
  setUser: (user) => set({ user }),
  setIsLoggedOut: (value) => set({ isLoggedOut: value }),
  fetchUser: async () => {
    try {
      const res = await fetch('/api/auth/verify');
      const { isAuthenticated, user, role } = await res.json();

      if (isAuthenticated && user) {
        set({ user: { ...user, role} });
      } else {
        set({ user: null });
      }
    } catch (error) {
      console.error({error: error});
      set({ user: null });
    }
  }
}));

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setIsLoading: (value) => set({ isLoading: value }),
}));

const useFirmStore = create<FirmState>((set) => ({
  currentFirm: null,
  firmMembers: [],
  pendingMembers: [],
  userRole: null,
  subscriptionStatus: null,
  setCurrentFirm: (firm) => set({ currentFirm: firm }),
  setFirmMembers: (members) => set({ firmMembers: members}),
  setPendingMembers: (members) => set({ pendingMembers: members }),
  setUserRole: (role) => set({ userRole: role}),
  setSubscriptionStatus: (status) => set({ subscriptionStatus: status }),
  loadingFirmData: async (userId) => {
    try {
      const response = await fetch(`/api/getUserAndFirm?userId=${userId}`);
      const { firm, member } = await response.json();

      if (!firm || !member) {
        console.log("Firm or Member not found")
        set({
          currentFirm: null,
          firmMembers: [],
          pendingMembers: [],
          userRole: null,
          subscriptionStatus: null
        });
        return;
      }

      const firmResponse = await axiosInstance.get(`/api/firm/getFirmByUserId?userId=${userId}`);
      const firmDetails = firmResponse.data as Firm;

      if (firm.$id) {
        const res = await fetch(`/api/membership/checkSubscriptionStatus?firmId=${firm.$id}`);
        const subStatus = await res.json();
        
        const subsStatus: SubscriptionStatus = {
          plan: firmDetails?.subscriptionPlan || 'Trial',
          active: subStatus?.active || false,
          expires: subStatus?.expires || new Date().toISOString(),
          caseLimit: subStatus?.caseLimit || '0',
          memberLimit: subStatus?.memberLimit || '0'
        }


        set({
          currentFirm: firmDetails,
          userRole: member.role,
          subscriptionStatus: subsStatus
        });
      } else {
        const subsStatus: SubscriptionStatus = {
          plan: firmDetails?.subscriptionPlan || 'Trial',
          active: false,
          expires: new Date().toISOString(),
          caseLimit: '0',
          memberLimit: '0'
        }
        
        console.log("SubStatus (default): ", subsStatus)

        set({
          currentFirm: firmDetails,
          userRole: member.role,
          subscriptionStatus: subsStatus
        });
      }

    } catch (error) {
      console.error("Error loading firm data:", error);
      set({
        currentFirm: null,
        userRole: null,
        subscriptionStatus: {
          plan: 'Trial',
          active: false,
          expires: new Date().toISOString(),
          caseLimit: '0',
          memberLimit: '0'
        }
      });
    }
  },
  clearFirmData: () => set({
    currentFirm: null,
    firmMembers: [],
    pendingMembers: [],
    userRole: null,
    subscriptionStatus: null
  })
}));

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  plans: [],
  isLoading: false,
  error: null,

  fetchPlans: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/api/membership');
      const responseData = response.data as SubscriptionPlan[];
      const plans: SubscriptionPlan[] = responseData.map((plan) => ({
        $id: plan.$id,
        planName: plan.planName,
        caseLimit: plan.planName === 'Platinum' ? 'Unlimited' : plan.caseLimit,
        memberLimit: plan.planName === 'Platinum' ? 'Unlimited' : plan.memberLimit,
        monthlyPrice: plan.monthlyPrice,
        yearlyPrice: plan.yearlyPrice,
        isActive: plan.isActive,
        trialDays: plan.planName === 'Trial' ? "7" : undefined
      }));
      set({ plans, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch plans',
        isLoading: false 
      });
    }
  }
}));

export { useCaseStore, useUserStore, useAuthStore, useFirmStore };