import { NextResponse } from "next/server";
import { getUserAndFirm } from "@/app/lib/server/firmMembers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const {firm, member} = await getUserAndFirm(userId);
    return NextResponse.json({firm, member});
  } catch {
    return NextResponse.json({ error: "Failed to fetch user and firm" }, { status: 500 });
  }
}