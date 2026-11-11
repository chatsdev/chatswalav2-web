import { getServerSession } from "next-auth/next";
import { authoption } from "../../../auth/[...nextauth]/authOption";
import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_API_URL } from "@/src/constants/route";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authoption);
    const token = session?.accessToken as string | undefined;
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ success: false, error: "Page ID is required" }, { status: 400 });
    }

    const response = await fetch(`${PUBLIC_API_URL}/facebook/pages/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(request.headers.get("x-workspace-id") ? { "x-workspace-id": request.headers.get("x-workspace-id") as string } : {}),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error in DELETE facebook pages proxy:", error);
    return NextResponse.json(
      { success: false, error: "Failed to disconnect Facebook page", details: error.message },
      { status: 500 }
    );
  }
}
