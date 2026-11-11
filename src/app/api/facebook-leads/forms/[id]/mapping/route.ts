import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_API_URL } from "@/src/constants/route";
import { authoption } from "@/src/app/api/auth/[...nextauth]/authOption";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authoption);
    const token = session?.accessToken as string | undefined;
    const { id } = await params;
    const body = await request.json();

    const response = await fetch(`${PUBLIC_API_URL}/facebook-leads/forms/${id}/mapping`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in updateFacebookLeadFormMapping proxy:", error);
    return NextResponse.json({ success: false, message: "Internal server error", error: error.message }, { status: 500 });
  }
}
