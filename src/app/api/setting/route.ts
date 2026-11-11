import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authoption } from "../auth/[...nextauth]/authOption";
import { headers } from "next/headers";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  try {
    const session = await getServerSession(authoption);
    const token = session?.accessToken as string;

    const reqHeaders = await headers();
    const clientIp = reqHeaders.get("x-forwarded-for") || reqHeaders.get("x-real-ip");

    const response = await fetch(`${BACKEND_API_URL}/settings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(clientIp ? { "X-Forwarded-For": clientIp } : {}),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ message: data.message || "Settings update failed" }, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.error("Settings API error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
