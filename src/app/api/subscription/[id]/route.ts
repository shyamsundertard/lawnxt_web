import { baseModel } from "@/app/lib/server/baseModel";
import { NextRequest, NextResponse } from "next/server";

const Subscription = baseModel(process.env.SUBSCRIPTION_COLLECTION_ID as string);

export async function GET(req: NextRequest, {params}: {params: {id: string}}) {
        const user = await Subscription.findOne(params.id);
        return NextResponse.json(user);
}

export async function PUT(req: NextRequest, {params}: {params: {id: string}}) {
    const data = await req.json();

    const updated = await Subscription.update(params.id, data);
    return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, {params}: {params: {id: string}}) {
    await Subscription.delete(params.id);
    return NextResponse.json({success: true});
}