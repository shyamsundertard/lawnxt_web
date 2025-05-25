import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { serverAccount } from '@/app/lib/server/node-appwrite';
import { getUserAndFirm } from '@/app/lib/server/firmMembers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const session = cookieStore.get('a_session')?.value;

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await serverAccount.get();
    const { firm, member } = await getUserAndFirm(user.$id);

    return NextResponse.json({ firm, member });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch firm membership' },
      { status: 500 }
    );
  }
}