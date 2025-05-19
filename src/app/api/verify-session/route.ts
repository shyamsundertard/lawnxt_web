// /app/api/verify-session/route.ts
import { NextResponse } from "next/server";
import * as sdk from "node-appwrite";

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  const jwt = cookieHeader?.split("; ").find(c => c.startsWith("app_jwt="))?.split("=")[1];

  if (!jwt) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const client = new sdk.Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_API_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!)
    .setJWT(jwt);

  const account = new sdk.Account(client);

  try {
    const user = await account.get();
    console.log("Verify-session user ", user)
    return NextResponse.json({ authenticated: true, user });
  } catch (e) {
    console.error("JWT invalid", e);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}