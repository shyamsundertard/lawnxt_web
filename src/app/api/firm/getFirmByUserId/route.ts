import { NextResponse } from "next/server";
import { getFirmByUserId } from "@/app/lib/server/firms";

export async function GET(req:Request) {
    const {searchParams} = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    try {
        const data = await getFirmByUserId(userId);
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: "Failed to fetch firm" }, { status: 500 });
     }
}