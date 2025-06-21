'use server';

import type { Firm as FirmType, SubscriptionStatus } from "@/app/types";
import { baseModel } from "./baseModel";
import { generateInviteCode } from "@/utils/helper";
import { getPlans } from "./memberships";

const Firm = baseModel(process.env.FIRM_COLLECTION_ID!);

export const createFirm = async (name: string, ownerId: string): Promise<FirmType> => {
  const inviteCode = generateInviteCode();
  
  const caseLimit = '10';
  const memberLimit = '3';
  const subscriptionExpiry = new Date();
  subscriptionExpiry.setDate(subscriptionExpiry.getDate() + 7);

  const firmData = {
    name,
    ownerId,
    isActive: true,
    inviteCode,
    subscriptionPlan: "Trial",
    subscriptionExpiry: subscriptionExpiry.toISOString(),
    caseLimit,
    memberLimit
  };
  
  return (await Firm.create(firmData)) as unknown as FirmType;
};

export const getFirmByUserId = async (userId: string): Promise<FirmType | null> => {
    const result = await Firm.findMany();
    const firms = (result as unknown as FirmType[]).filter(doc => doc.ownerId === userId);
    return firms.length > 0 ? firms[0] : null;
};

export const getFirmByInviteCode = async (inviteCode: string): Promise<FirmType> => {
    const res = await Firm.findMany();
    const firm = (res as unknown as FirmType[]).filter(doc => doc.inviteCode === inviteCode);
  
    if (firm.length === 0) {
        throw new Error("Firm not found");
    }
  
    return firm[0];
};

export const checkSubscriptionStatus = async (firmId: string): Promise<SubscriptionStatus> => {
    try {
        const firm = await Firm.findOne(firmId) as unknown as FirmType;

        if (!firm.subscriptionExpiry) {
            throw new Error("Missing subscriptionExpiry on firm.");
          }

        const PLANS = await getPlans();

        const currentPlan = firm.subscriptionPlan;
        const planDetails = PLANS.filter(doc =>doc.planName == currentPlan);

        if (planDetails.length === 0) {
            throw new Error("Plan details not found");
        }

        const expiryDate = new Date(firm.subscriptionExpiry);
        const currentDate = new Date();

        const isActive = currentDate <= expiryDate;

        return {
            active: isActive,
            plan: planDetails[0].planName,
            expires: expiryDate.toISOString(),
            caseLimit: planDetails[0].caseLimit,
            memberLimit: planDetails[0].memberLimit
        };
    } catch (error) {
        console.error('Error checking subscription status: ', error);

        return {
            active: false,
            plan: 'Invalid',
            expires: new Date().toISOString(),
            caseLimit: '0',
            memberLimit: '0'
        };
    }
};

export const checkFirmLimits = async (
    firmId: string,
    resourceType: 'case' | 'member'
): Promise<{ canAdd: boolean; limit: string; current: string}> => {
    const status = await checkSubscriptionStatus(firmId);

    if (!status.active) {
        return { canAdd: false, limit: '0', current: '0' };
    }

    const collectionId = resourceType === 'case'
        ? process.env.CASE_COLLECTION_ID!
        : process.env.USER_COLLECTION_ID!;

    const Fetch = baseModel(collectionId);

    const result = await Fetch.findMany();
    
    const filteredResults = (result as unknown as { firmId: string; status?: string }[]).filter(doc => {
        if (doc.firmId !== firmId) return false;
        if (resourceType === 'member' && doc.status !== 'Approved') return false;
        return true;
    });

    const currentCount = filteredResults.length.toString();
    const limit = resourceType === 'case' ? status.caseLimit : status.memberLimit;
    const canAdd = parseInt(currentCount) < parseInt(limit);

    return {
        canAdd,
        limit,
        current: currentCount
    };
}