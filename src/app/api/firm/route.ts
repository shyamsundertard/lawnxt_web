import { baseModel } from "@/app/lib/server/baseModel";
import { NextRequest, NextResponse } from "next/server";

const Firm = baseModel(process.env.FIRM_COLLECTION_ID as string);

export async function GET() {
    const users = await Firm.findMany();

    return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const created = await Firm.create(body);

    return NextResponse.json(created);
}