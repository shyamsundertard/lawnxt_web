import { NextRequest, NextResponse } from "next/server";
import { addFirmMember } from "@/app/lib/server/firmMembers";

export async function POST(req:NextRequest) {
    const body = await req.json();
    const { firmId, userId, name, email, phone, role, status } = body;
    
    await addFirmMember(firmId, userId, name, email, phone, role, status);
    return NextResponse.json("User added successfully");
}