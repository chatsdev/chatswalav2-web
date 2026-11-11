import { getServerSession } from "next-auth";
import { authoption } from "../../auth/[...nextauth]/authOption";
import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_API_URL } from "@/src/constants/route";

type Params = { params: Promise<{ id: string }> };

/** GET /api/segments/[id] — get segment with steps */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const session = await getServerSession(authoption);
    const token = session?.accessToken as string | undefined;

    const response = await fetch(`${PUBLIC_API_URL}/segments/${id}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching segment detail:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch segment detail" },
      { status: 500 },
    );
  }
}

/** PUT /api/segments/[id] — update segment */
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const session = await getServerSession(authoption);
    const token = session?.accessToken as string | undefined;

    const body = await request.json();

    const response = await fetch(`${PUBLIC_API_URL}/segments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error updating segment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update segment" },
      { status: 500 },
    );
  }
}

/** DELETE /api/segments/[id] — delete segment */
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const session = await getServerSession(authoption);
    const token = session?.accessToken as string | undefined;

    const response = await fetch(`${PUBLIC_API_URL}/segments/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error deleting segment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete segment" },
      { status: 500 },
    );
  }
}
