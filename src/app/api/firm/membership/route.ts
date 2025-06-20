import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getUserAndFirm } from '@/app/lib/server/firmMembers';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split('Bearer ')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decodedToken = await getAuth().verifyIdToken(token);
    const { firm, member } = await getUserAndFirm(decodedToken.uid);

    return NextResponse.json({ firm, member });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch firm membership' },
      { status: 500 }
    );
  }
}