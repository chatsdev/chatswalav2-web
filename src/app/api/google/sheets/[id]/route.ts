import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PUBLIC_API_URL } from "@/src/constants";
import { authoption } from "../../../auth/[...nextauth]/authOption";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authoption);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") || "A1:Z100";
  const url = `${PUBLIC_API_URL}/google/sheets/${(await params).id}?range=${encodeURIComponent(range)}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });
    const data = await response.json();
    return NextResponse.json(data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
