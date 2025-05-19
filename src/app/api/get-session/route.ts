// src/app/api/user/route.ts
import { NextResponse } from 'next/server';
import { Client, Account } from 'node-appwrite';

export async function GET(request: Request) {
  // Initialize the Appwrite client with proper permissions
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT as string)
    .setProject(process.env.APPWRITE_PROJECT_ID as string)
    .setKey(process.env.APPWRITE_API_KEY as string); // Make sure this key has account scope
    
  const account = new Account(client);
  
  try {
    // Get the session ID from cookie
    const cookieHeader = request.headers.get('cookie');
    const sessionCookie = cookieHeader?.split(';')
      .find(c => c.trim().startsWith('appwrite_session='));
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const sessionId = sessionCookie.split('=')[1];
    
    // Get the user's session using the session ID
    const session = await account.getSession(sessionId);
    
    // Get the user ID from the session
    const userId = session.userId;
    
    // Now you can get the user's details
    const user = await account.get();
    
    return NextResponse.json({ user, userId});
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to get user data' }, { status: 500 });
  }
}