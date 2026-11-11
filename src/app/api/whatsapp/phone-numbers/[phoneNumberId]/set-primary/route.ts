import { authoption } from "@/src/app/api/auth/[...nextauth]/authOption";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getAuthHeaders() {
  const session = await getServerSession(authoption);
  const token = session?.accessToken as string | undefined;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ phoneNumberId: string }> }
) {
  try {
    const { phoneNumberId } = await context.params;
    const headers = await getAuthHeaders();

    const response = await fetch(`${BACKEND_API_URL}/whatsapp/phone-numbers/${phoneNumberId}/set-primary`, {
      method: "PUT",
      headers,
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error setting primary phone number:", error);
    return NextResponse.json(
      { error: "Failed to set primary phone number" },
      { status: 500 }
    );
  }
}
