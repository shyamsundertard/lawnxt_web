import { baseModel } from '@/app/lib/server/baseModel';
import { getAuth } from 'firebase-admin/auth';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const Firm = baseModel(process.env.FIRM_COLLECTION_ID!);
const FirmMember = baseModel(process.env.USER_COLLECTION_ID!);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const firmId = searchParams.get('firmId');
    
    if (!firmId) {
      return Response.json(
        { error: 'Firm ID is required'},
        { status: 400 }
      );
    }

    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split('Bearer ')[1];

    if (!token) {
      return Response.json(
        { error: 'Unauthorised'},
        { status: 401 }
      );
    }

    const decodedToken = await getAuth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const result = await Firm.findMany();
    const firmRes = (result as unknown as { $id: string; ownerId: string }[]).filter(doc => 
        doc.$id === firmId &&
        doc.ownerId === userId
    );

    if (firmRes.length > 0) {
        return NextResponse.json({
            isMember: true,
            userRole: 'Owner'
        });
    }

    const memberRes = await FirmMember.findMany();
    const filtered = (memberRes as unknown as { firmId: string; userId: string; status: string; role: string }[]).filter(doc => 
        doc.firmId === firmId &&
        doc.userId === userId &&
        doc.status === 'Approved'
    );

    if (filtered.length === 0) {
        return NextResponse.json({
            isMember: false,
            userRole: null,
        });
    }

    const member = filtered[0];
    return Response.json({ 
      isMember: true,
      userRole: member.role
    });
  } catch (error) {
    console.error("Error verifying firm membership:", error);
    return Response.json({ isMember: false });
  }
}