import { NextResponse } from "next/server";
import { account } from "@/app/lib/client/appwrite";

export async function GET() {
    try {
        await account.getSession("current");

        return NextResponse.json({ authenticated: true });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json({ authenticated: false });
    }
}