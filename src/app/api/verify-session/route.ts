// /app/api/verify-session/route.ts
import { NextResponse } from "next/server";
import { adminAuth } from "@/app/lib/server/firebase-admin";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split("Bearer ")[1];

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const user = {
      $id: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
    };
    
    return NextResponse.json({ authenticated: true, user });
  } catch (e) {
    console.error("Token invalid", e);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}