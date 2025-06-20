import { baseModel } from "@/app/lib/server/baseModel";
import { NextResponse } from "next/server";

const Membership = baseModel(process.env.MEMBERSHIP_COLLECTION_ID as string);

export async function GET() {
    const plans = await Membership.findMany();
    return NextResponse.json(plans);
}

// export async function POST(req: NextRequest) {
//     const body = await req.json();
//     const created = await Membership.create(body);

//     return NextResponse.json(created);
// }