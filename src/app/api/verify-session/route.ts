// /app/api/verify-session/route.ts
import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, getApps, cert } from "firebase-admin/app";

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split("Bearer ")[1];

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
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