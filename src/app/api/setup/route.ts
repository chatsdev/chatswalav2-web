import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authoption } from "../auth/[...nextauth]/authOption";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  try {
    const session = await getServerSession(authoption);
    const token = session?.accessToken as string;

    const response = await fetch(`${BACKEND_API_URL}/user-settings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || data.error || (response.status === 403 ? "You do not have permission to view settings" : "Failed to fetch setup settings");
      return NextResponse.json({ message: errorMessage }, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.error("Setup API GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authoption);
    const token = session?.accessToken as string;
    const contentType = request.headers.get("content-type") || "";

    let body: ArrayBuffer | string;
    const headers: HeadersInit = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    if (contentType.includes("multipart/form-data")) {
      body = await request.arrayBuffer();
      headers["Content-Type"] = contentType;
    } else {
      body = JSON.stringify(await request.json());
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${BACKEND_API_URL}/user-settings`, {
      method: "PUT",
      headers,
      body,
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || data.error || (response.status === 403 ? "You do not have permission to update settings" : "Setup update failed");
      return NextResponse.json({ message: errorMessage }, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.error("Setup API PUT error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
