import { NextResponse } from "next/server";
import { getFirmMembers } from "@/app/lib/server/firmMembers";
import { FirmMember } from "@/app/types";

export async function GET(req:Request) {
    const { searchParams } = new URL(req.url);
    const firmId = searchParams.get("firmId");
    const status = searchParams.get("status") as FirmMember["status"];

    const data = await getFirmMembers(firmId!, status)
    
    return NextResponse.json(data);
}