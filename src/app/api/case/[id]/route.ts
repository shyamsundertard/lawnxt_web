import { baseModel } from "@/app/lib/server/baseModel";
import { NextRequest, NextResponse } from "next/server";

const Case = baseModel(process.env.CASE_COLLECTION_ID as string);

export async function GET(req: NextRequest, {params}: {params: {id: string}}) {
        const user = await Case.findOne(params.id);
        return NextResponse.json(user.documents);
}

export async function PUT(req: NextRequest, {params}: {params: {id: string}}) {
    const data = await req.json();

    await Case.update(params.id, data);
    return NextResponse.json({
        message: "Case updated successfully",
    },{
        status: 200
    });
}

export async function DELETE(req: NextRequest, {params}: {params: {id: string}}) {
    await Case.delete(params.id);
    return NextResponse.json({success: true});
}