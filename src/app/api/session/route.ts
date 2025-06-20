import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.split("Bearer ")[1];

        if (!token) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        await getAuth().verifyIdToken(token);
        return NextResponse.json({ authenticated: true });
    } catch {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }
}