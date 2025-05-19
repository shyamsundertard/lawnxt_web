import { baseModel } from "@/app/lib/server/baseModel";
import { NextRequest, NextResponse } from "next/server";

const Subscription = baseModel(process.env.SUBSCRIPTION_COLLECTION_ID as string);

export async function GET() {
    const users = await Subscription.findMany();

    return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const created = await Subscription.create(body);

    return NextResponse.json(created);
}