export const generateInviteCode = (): string => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };
  
//   export const checkPlanLimits = async (firmId: string, action: "case" | "member"): Promise<boolean> => {
//     const firm = await getFirmById(firmId);
//     const currentDate = new Date();
//     const expiryDate = new Date(firm.subscriptionExpiry);
    
//     // Check if subscription is expired
//     if (currentDate > expiryDate && firm.subscriptionPlan === "trial") {
//       throw new Error("Trial period has ended. Please upgrade your plan.");
//     }
    
//     if (action === "case") {
//       const casesCount = await getCasesCount(firmId);
//       return casesCount < firm.caseLimit;
//     } else {
//       const membersCount = await getApprovedMembersCount(firmId);
//       return membersCount < firm.memberLimit;
//     }
//   };
  
//   const getApprovedMembersCount = async (firmId: string): Promise<number> => {
//     const members = await getFirmMembers(firmId, "approved");
//     return members.length;
//   };
  
//   const getCasesCount = async (firmId: string): Promise<number> => {
//     // Implementation depends on your cases collection
//     // const result = await databases.listDocuments(CASES_COLLECTION_ID, [
//     //   Query.equal("firmId", firmId)
//     // ]);
//     // return result.documents.length;
//     return 0; // Placeholder
//   };