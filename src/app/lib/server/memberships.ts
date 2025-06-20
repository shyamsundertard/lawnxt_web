'use server';

import type { Membership } from "@/app/types";
import { baseModel } from "./baseModel";

const Membership = baseModel(process.env.MEMBERSHIP_COLLECTION_ID!);

export const getPlans = async () => {
    const result = await Membership.findMany();
    return result as unknown as Membership[];
}