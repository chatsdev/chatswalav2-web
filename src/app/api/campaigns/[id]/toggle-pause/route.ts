import { authoption } from "@/src/app/api/auth/[...nextauth]/authOption";
import { PUBLIC_API_URL } from "@/src/constants/route";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authoption);
    const token = session?.accessToken as string | undefined;
    const { id } = await context.params;

    const response = await fetch(
      `${PUBLIC_API_URL}/campaigns/${id}/toggle-pause`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(request.headers.get("x-workspace-id")
            ? {
                "x-workspace-id": request.headers.get(
                  "x-workspace-id",
                ) as string,
              }
            : {}),
        },
      },
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    
    return NextResponse.json(
      { success: false, error: "Failed to toggle campaign pause status" },
      { status: 500 },
    );
  }
}
