import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authoption } from "@/src/app/api/auth/[...nextauth]/authOption";
import { PUBLIC_API_URL } from "@/src/constants";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authoption);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const response = await fetch(`${PUBLIC_API_URL}/google/sheets/${(await params).id}/values`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
