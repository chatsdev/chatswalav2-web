import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authoption } from "../../auth/[...nextauth]/authOption";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authoption);
    const token = session?.accessToken as string;
    const body = await request.json();
    const { workspace_id, contact_ids } = body;

    if (!workspace_id || !Array.isArray(contact_ids) || contact_ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid request. workspace_id and contact_ids (array) are required." },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_API_URL}/whatsapp/delete-chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.error || data.message || "Delete chat failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.error("Error in delete-chat API route:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
