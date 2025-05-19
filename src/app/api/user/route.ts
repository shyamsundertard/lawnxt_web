import { baseModel } from "@/app/lib/server/baseModel";
import { NextRequest, NextResponse } from "next/server";

const User = baseModel(process.env.USER_COLLECTION_ID as string);

export async function GET() {
    const users = await User.findMany();

    return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        console.log("Received Body:", body); // Add this

        const created = await User.create(body);

        return NextResponse.json(created);
    } catch (err) {
        console.error('Error in /api/user route:', err);
        return NextResponse.json({ message: 'Failed to create user' }, { status: 500 });
    }
}