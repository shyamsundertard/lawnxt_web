import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split('Bearer ')[1];
    
    if (!token) {
      return NextResponse.json({ isAuthenticated: false }, { status: 401 });
    }

    const decodedToken = await getAuth().verifyIdToken(token);
    const user = {
      $id: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
    };

    return NextResponse.json({ 
      isAuthenticated: true, 
      user 
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }
}