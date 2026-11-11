import { PUBLIC_API_URL } from "@/src/constants/route";
import { getServerSession } from "next-auth";
import { authoption } from "@/src/app/api/auth/[...nextauth]/authOption";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ platform: string }> }
) {
  try {
    const { platform } = await context.params;
    const session = await getServerSession(authoption);
    const token = session?.accessToken as string | undefined;

    const response = await fetch(`${PUBLIC_API_URL}/social-connections/config/${platform}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error(`Error fetching OAuth config for ${error.message}:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch OAuth config", details: error.message },
      { status: 500 }
    );
  }
}
