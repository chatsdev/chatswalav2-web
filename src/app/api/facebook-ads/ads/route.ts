/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authoption } from "@/src/app/api/auth/[...nextauth]/authOption";
import { PUBLIC_API_URL } from "@/src/constants/route";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authoption);
    const token = session?.accessToken as string | undefined;

    const contentType = request.headers.get("content-type") || "";
    let formData: FormData;

    if (contentType.includes("multipart/form-data")) {
      formData = await request.formData();
    } else if (contentType.includes("application/json")) {
      const body = await request.json();
      formData = new FormData();
      Object.keys(body).forEach((key) => {
        const value = body[key];
        if (typeof value === "object" && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
    } else {
      return NextResponse.json({ success: false, message: "Unsupported Content-Type" }, { status: 400 });
    }

    const response = await fetch(`${PUBLIC_API_URL}/facebook-ads/ads`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error in createFbAd proxy:", error);
    return NextResponse.json({ success: false, message: "Internal server error", error: error.message }, { status: 500 });
  }
}
