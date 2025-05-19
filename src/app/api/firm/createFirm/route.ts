import { NextRequest, NextResponse } from "next/server";
import { createFirm } from "@/app/lib/server/firms";

export async function POST(req:NextRequest) {
    const body = await req.json();
    const {name, userId} = body;

    const result = await createFirm(name, userId);

    return NextResponse.json(result);
}