"use client";
import { useEffect } from "react";
import { useCaseStore, useFirmStore, useUserStore, useSubscriptionStore } from "@/store/useStore";
import { handleFirebaseError } from "../../utils/handleError";
import { fetchDocuments } from "@/app/lib/database";
import { Case } from "../types";

export default function InitializeData() {
  const { setCases } = useCaseStore();
  const { currentFirm, loadingFirmData, firmMembers } = useFirmStore();
  const { user } = useUserStore();
  const { fetchPlans } = useSubscriptionStore();

  useEffect(() => {
    const initializeData = async () => {
      if (!user?.$id) return;

      console.log("Initializing data", firmMembers);
      
      try {
        await loadingFirmData(user.$id);
      } catch (error) {
        handleFirebaseError(error, "Error loading firm data:");
      }
    };

    initializeData();
  }, [user?.$id, loadingFirmData, firmMembers]);

  useEffect(() => {
    const fetchCases = async () => {
      if (!currentFirm?.$id) return;
      
      try {
        const cases = await fetchDocuments("cases", [`firmId == ${currentFirm.$id}`]) as Case[];
        setCases(cases);
      } catch (error) {
        handleFirebaseError(error, "Error fetching cases:");
      }
    };

    if (currentFirm?.$id) {
      fetchCases();
      fetchPlans();
    }
  }, [currentFirm?.$id, setCases, fetchPlans]);

  return null;
}
