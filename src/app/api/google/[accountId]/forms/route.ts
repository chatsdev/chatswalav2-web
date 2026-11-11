import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authoption } from "../../../auth/[...nextauth]/authOption";

type Props = {
  params: Promise<{ accountId: string }>;
};

export async function GET(req: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(authoption);

    if (!session || !session.accessToken) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { accountId } = await params;
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/google/${accountId}/forms?search=${encodeURIComponent(search)}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}
