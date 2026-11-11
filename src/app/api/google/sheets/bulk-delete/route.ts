import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PUBLIC_API_URL } from "@/src/constants";
import { authoption } from "../../../auth/[...nextauth]/authOption";

export async function POST(req: Request) {
  const session = await getServerSession(authoption);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const url = `${PUBLIC_API_URL}/google/sheets/bulk-delete`;

  try {
    const response = await fetch(url, {
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
