// src/app/api/user/route.ts
import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split('Bearer ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const decodedToken = await getAuth().verifyIdToken(token);
    const user = {
      $id: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
    };
    
    return NextResponse.json({ user, userId: decodedToken.uid });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to get user data' }, { status: 500 });
  }
}