import { baseModel } from "@/app/lib/server/baseModel";
import { NextRequest, NextResponse } from "next/server";

const Case = baseModel(process.env.CASE_COLLECTION_ID as string);

export async function GET() {
    const cases = await Case.findMany();
    return NextResponse.json(cases);
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    await Case.create(body);

    return NextResponse.json({
        message: "Case created successfully",
    },{
        status: 201
    });
}