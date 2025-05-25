import { baseModel } from "@/app/lib/server/baseModel";
import { NextRequest, NextResponse } from "next/server";

const User = baseModel(process.env.USER_COLLECTION_ID as string);

export async function PUT(req: NextRequest, {params}: {params: {id: string}}) {
    const data = await req.json();

    await User.update(params.id, data);
    return NextResponse.json({
        message: "Details updated successfully"
    },{
        status: 200
    });
}