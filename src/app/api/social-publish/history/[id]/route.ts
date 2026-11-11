/* eslint-disable @typescript-eslint/no-explicit-any */
import { PUBLIC_API_URL } from "@/src/constants/route";
import { getServerSession } from "next-auth";
import { authoption } from "@/src/app/api/auth/[...nextauth]/authOption";
import { NextRequest, NextResponse } from "next/server";

async function getAuthHeaders(request: NextRequest) {
  const session = await getServerSession(authoption);
  const token = session?.accessToken as string | undefined;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(request.headers.get("x-workspace-id") ? { "x-workspace-id": request.headers.get("x-workspace-id") as string } : {}),
  };

  return headers;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const headers = await getAuthHeaders(request);

    const response = await fetch(`${PUBLIC_API_URL}/social-publish/history/${id}`, {
      headers,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error fetching post details:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch post details", details: error.message },
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
    const headers = await getAuthHeaders(request);

    const response = await fetch(`${PUBLIC_API_URL}/social-publish/history/${id}`, {
      method: "DELETE",
      headers,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error deleting post history record:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete post history record", details: error.message },
      { status: 500 }
    );
  }
}
