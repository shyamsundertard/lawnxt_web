import { NextResponse } from "next/server";
import { checkSubscriptionStatus } from "@/app/lib/server/firms";

export async function GET(req:Request) {
    const {searchParams} = new URL(req.url);
    const firmId = searchParams.get("firmId");

    const data = await checkSubscriptionStatus(firmId!);

    return NextResponse.json(data);
}