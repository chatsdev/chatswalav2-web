import { PUBLIC_API_URL } from "@/src/constants/route";
import { getServerSession } from "next-auth";
import { authoption } from "@/src/app/api/auth/[...nextauth]/authOption";
import { NextRequest, NextResponse } from "next/server";

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

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const headers = await getAuthHeaders();

    const response = await fetch(`${PUBLIC_API_URL}/social-connections/${id}`, {
      headers,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error fetching social connection by ID:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch social connection", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const headers = await getAuthHeaders();

    const response = await fetch(`${PUBLIC_API_URL}/social-connections/${id}`, {
      method: "DELETE",
      headers,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error disconnecting social account:", error);
    return NextResponse.json(
      { success: false, error: "Failed to disconnect social account", details: error.message },
      { status: 500 }
    );
  }
}
