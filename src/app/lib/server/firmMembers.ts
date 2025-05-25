'use server';

import type { FirmMember as FirmMemberType, Firm as FirmType } from "@/app/types";
import { baseModel } from "./baseModel";
import { getFirmByUserId } from "./firms";

const FirmMember = baseModel(process.env.USER_COLLECTION_ID as string);
const Firm = baseModel(process.env.FIRM_COLLECTION_ID as string);

export const addFirmMember = async (
  firmId: string,
  userId: string,
  name: string,
  email: string,
  phone: string,
  role: FirmMemberType["role"] = "Viewer",
  status: FirmMemberType["status"] = "Pending"
): Promise<FirmMemberType> => {

    const memberData = {
        firmId,
        userId,
        name,
        email,
        phone,
        role,
        status,
        isBlocked: false
    };

  return (await FirmMember.create(memberData)) as unknown as FirmMemberType;
};

export const approveFirmMember = async (memberId: string): Promise<FirmMemberType> => {
  return (await FirmMember.update(
    memberId,
    { status: "Approved" }
  )) as unknown as FirmMemberType;
};

export const getFirmMembers = async (firmId: string, status?: "Pending" | "Approved"): Promise<FirmMemberType[]> => {
  const result = await FirmMember.findMany();
  const filtered = result.documents.filter(doc => {
    if (doc.firmId !== firmId) return false;
    if (status && doc.status !== status) return false;
    return true;
  });
  
  return filtered as unknown as FirmMemberType[];
};

export const getUserAndFirm = async (userId: string): Promise<{firm: FirmType | null, member: FirmMemberType | null}> => {

  const ownedFirm = await getFirmByUserId(userId);

  if (ownedFirm) {
    return {
      firm: ownedFirm,
      member: {
        $id: ownedFirm.ownerId,
        userId,
        firmId: ownedFirm.$id,
        name: "",
        email: "",
        phone: "",
        role: "Owner",
        status: "Approved",
        isBlocked: false
      } as FirmMemberType
    }
  }

  const result = await FirmMember.findMany();
  
  const filtered = result.documents.filter(doc => 
    doc.userId === userId
  );

  if (filtered.length === 0) {
    console.log("No firm membership found for user:", userId);
    return { firm: null, member: null };
  }

  const member = filtered[0] as unknown as FirmMemberType;
  
  try {
    const firm = await Firm.findOne(member.firmId);
    if (!firm) {
      console.log("No firm found with ID:", member.firmId);
      return { firm: null, member };
    }
    
    return { 
      firm: firm as unknown as FirmType, 
      member 
    };
  } catch (error) {
    console.error("Error fetching firm:", error);
    return { firm: null, member };
  }
};