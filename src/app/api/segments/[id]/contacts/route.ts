import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_API_URL } from "@/src/constants/route";
import { authoption } from "../../../auth/[...nextauth]/authOption";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authoption);
    const { id } = await params;
    const token = session?.accessToken as string | undefined;
    const body = await request.json();

    const response = await fetch(`${PUBLIC_API_URL}/segments/${id}/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error adding contacts to segment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add contacts to segment" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authoption);
    const { id } = await params;
    const token = session?.accessToken as string | undefined;
    const { searchParams } = new URL(request.url);

    const response = await fetch(`${PUBLIC_API_URL}/segments/${id}/contacts?${searchParams.toString()}`, {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching segment contacts:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch segment contacts" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authoption);
    const { id } = await params;
    const token = session?.accessToken as string | undefined;
    const body = await request.json();

    const response = await fetch(`${PUBLIC_API_URL}/segments/${id}/contacts`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error removing contacts from segment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to remove contacts from segment" },
      { status: 500 },
    );
  }
}
