import { baseModel } from '@/app/lib/server/baseModel';
import { cookies } from 'next/headers';
import { serverAccount } from '@/app/lib/server/node-appwrite';
import { NextResponse } from 'next/server';

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

    const cookieStore = cookies();
    const session = cookieStore.get('a_session')?.value;

    if (!session) {
      return Response.json(
        { error: 'Unauthorised'},
        { status: 401 }
      );
    }

    const user = await serverAccount.get();

    const result = await Firm.findMany();

    const firmRes = result.documents.filter(doc => 
        doc.$id === firmId &&
        doc.ownerId === user.$id
    )

    if (firmRes.length > 0) {
        return NextResponse.json({
            isMember: true,
            userRole: 'Owner'
        });
    }

    const memberRes = await FirmMember.findMany();
    const filtered = memberRes.documents.filter(doc => 
        doc.firmId === firmId &&
        doc.userId === user.$id &&
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