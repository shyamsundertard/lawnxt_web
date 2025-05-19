import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Client, Account } from 'node-appwrite';

export async function GET() {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(`a_session_${process.env.NEXT_PUBLIC_PROJECT_ID!}`);
    
    if (!sessionCookie) {
      return NextResponse.json({ isAuthenticated: false }, { status: 401 });
    }

    // Initialize Appwrite client
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_API_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!)
      .setKey(process.env.APPWRITE_API_KEY!);

    // Use the session cookie as JWT
    client.setJWT(sessionCookie.value);

    const account = new Account(client);
    const user = await account.get();

    return NextResponse.json({ 
      isAuthenticated: true, 
      user 
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }
}