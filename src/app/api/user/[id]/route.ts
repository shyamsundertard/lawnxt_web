import { baseModel } from "@/app/lib/server/baseModel";
import { NextRequest, NextResponse } from "next/server";

const User = baseModel(process.env.USER_COLLECTION_ID as string);

export async function GET(req: NextRequest, {params}: {params: {id: string}}) {
        const user = await User.findOne(params.id);
        return NextResponse.json(user);
}

export async function PUT(req: NextRequest, {params}: {params: {id: string}}) {
    const data = await req.json();

    const updated = await User.update(params.id, data);
    return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, {params}: {params: {id: string}}) {
    await User.delete(params.id);
    return NextResponse.json({success: true});
}