import { NextResponse } from "next/server";
import { getFirmByInviteCode } from "@/app/lib/server/firms";

export async function GET(request:Request) {
    const {searchParams} = new URL(request.url);
    const inviteCode = searchParams.get("inviteCode");

    if (!inviteCode) {
        return NextResponse.json({ error: "Missing inviteCode" }, { status: 400 });
    }

    try {
        const data = await getFirmByInviteCode(inviteCode);
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: "Failed to fetch user and firm" }, { status: 500 });
    }
}