/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authoption } from "@/src/app/api/auth/[...nextauth]/authOption";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authoption);
    const token = session?.accessToken as string;
    const body = await req.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/bookings/bulk-delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}
