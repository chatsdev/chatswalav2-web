/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authoption } from "@/src/app/api/auth/[...nextauth]/authOption";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authoption);
    const token = session?.accessToken as string;
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/appointments/configs/${id}/bookings${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}
