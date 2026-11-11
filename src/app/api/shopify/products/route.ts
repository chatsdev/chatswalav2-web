/* eslint-disable @typescript-eslint/no-explicit-any */
import { PUBLIC_API_URL } from "@/src/constants/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authoption } from "../../auth/[...nextauth]/authOption";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authoption);
    const token = session?.accessToken as string | undefined;

    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const apiUrl = `${PUBLIC_API_URL}/shopify/products${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(request.headers.get("x-workspace-id") ? { "x-workspace-id": request.headers.get("x-workspace-id") as string } : {}),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to get Shopify products", details: error.message },
      { status: 500 }
    );
  }
}
