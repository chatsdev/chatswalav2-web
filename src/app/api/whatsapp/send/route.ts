import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authoption } from "../../auth/[...nextauth]/authOption";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authoption);
    const token = session?.accessToken as string;
    const contentType = request.headers.get("content-type") || "";

    let response;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      response = await fetch(`${BACKEND_API_URL}/whatsapp/send`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
    } else {
      const body = await request.json();
      response = await fetch(`${BACKEND_API_URL}/whatsapp/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ message: data.error || data.message || "send whatsapp failed" }, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.error("send whatsapp API error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
