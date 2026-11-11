import { PUBLIC_API_URL } from "@/src/constants/route";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(`${PUBLIC_API_URL}/auth-page-setup`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching auth page setup:", error);
    return NextResponse.json({ error: "Failed to fetch auth page setup" }, { status: 500 });
  }
}
