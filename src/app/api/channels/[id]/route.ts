import { getServerSession } from "next-auth";
import { authoption } from "../../auth/[...nextauth]/authOption";
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
      return NextResponse.json({ success: false, error: "Connection ID is required" }, { status: 400 });
    }

    const response = await fetch(`${PUBLIC_API_URL}/channels/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error in DELETE channels proxy:", error);
    return NextResponse.json(
      { success: false, error: "Failed to disconnect channel", details: error.message },
      { status: 500 }
    );
  }
}
