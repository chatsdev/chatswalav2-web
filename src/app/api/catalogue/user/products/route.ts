import { authoption } from "@/src/app/api/auth/[...nextauth]/authOption";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authoption);
    const token = session?.accessToken as string;
    const { searchParams } = new URL(req.url);
    const query = searchParams.toString();

    const response = await fetch(`${BACKEND_API_URL}/ecommerce-catalog/user/products?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(req.headers.get("x-workspace-id") ? { "x-workspace-id": req.headers.get("x-workspace-id") as string } : {}),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ message: data.message || "Failed to fetch user products" }, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.error("User products get API error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
