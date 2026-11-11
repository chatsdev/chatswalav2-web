import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authoption } from "@/src/app/api/auth/[...nextauth]/authOption";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authoption);
    const token = session?.accessToken as string;
    const contentType = req.headers.get("content-type") || "";
    let bodyData: any;
    const headers: Record<string, string> = {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (contentType.includes("multipart/form-data")) {
      bodyData = await req.formData();
    } else {
      const jsonBody = await req.json();
      bodyData = JSON.stringify(jsonBody);
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${BACKEND_API_URL}/subscription/${id}/change-plan`, {
      method: "POST",
      headers,
      body: bodyData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ message: data.message || "Failed to change subscription plan" }, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.error("Change Plan API error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
