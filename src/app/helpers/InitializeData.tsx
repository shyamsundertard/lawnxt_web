"use client";
import { useEffect } from "react";
import { useCaseStore, useFirmStore, useUserStore, useSubscriptionStore } from "@/store/useStore";
import { handleAppwriteError } from "../../utils/handleError";

import { Case } from "../types";

const InitializeData = () => {
  const { setCases } = useCaseStore();
  const { setCurrentFirm, setUserRole, loadingFirmData, setFirmMembers } = useFirmStore(); 
  const { user } = useUserStore();
  const {fetchPlans}  = useSubscriptionStore();

  useEffect(() => {
    const loadFirmData = async () => {
      if (!user) return;

      try {
        if (user.$id) {
          const response = await fetch(`/api/getUserAndFirm?userId=${user.$id}`);
          const { firm, member } = await response.json();

          if (firm && member) {
            const res = await fetch(`/api/firmMember?firmId=${firm.$id}&status=Approved`);
    
            const membs = await res.json();
            console.log("Initialized Members: ", membs)
            
            setCurrentFirm(firm);
            setUserRole(member?.role || null);
    
            fetchCases(firm.$id);
            loadingFirmData(user?.$id);
            setFirmMembers(membs);
          }
          fetchPlans();
  
        }

      } catch (error) {
        console.error("Failed to fetch firm data: ", error);
      }
    };

    if (user) {
      loadFirmData();
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, setCurrentFirm, setUserRole, setUserRole]);

  const fetchCases = async (firmId: string) => {
    try {
      const response = await fetch('/api/case');
      const allCases = await response.json() as Case[]
      const cases = allCases.filter(doc => {
        return doc.firmId === firmId;
      });
      
      setCases(cases);
    } catch (error) {
      handleAppwriteError(error, "Error fetching cases:");
    }
  };

  return null;
};

export default InitializeData;
