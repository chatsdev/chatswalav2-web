/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authoption } from "@/src/app/api/auth/[...nextauth]/authOption";
import { PUBLIC_API_URL } from "@/src/constants/route";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authoption);
    const token = session?.accessToken as string | undefined;
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();

    const response = await fetch(`${PUBLIC_API_URL}/facebook-ads?${queryString}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error in getFbAdCampaigns proxy:", error);
    return NextResponse.json({ success: false, message: "Internal server error", error: error.message }, { status: 500 });
  }
}

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
      // We need to send the whole body as a stringified field if the backend expects it that way,
      // or flatten it. In this project, the backend typically expects a 'data' field or flattened fields.
      // Looking at the controller, it likely expects flattened fields.
      // However, for nested objects like 'ad_sets', we should stringify them.
      Object.keys(body).forEach(key => {
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

    const response = await fetch(`${PUBLIC_API_URL}/facebook-ads`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error in createFbAdCampaign proxy:", error);
    return NextResponse.json({ success: false, message: "Internal server error", error: error.message }, { status: 500 });
  }
}
