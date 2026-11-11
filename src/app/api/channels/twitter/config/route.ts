import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_API_URL } from "@/src/constants/route";

// Public route — no auth required. Reads Twitter client_id from admin Settings.
export async function GET(_request: NextRequest) {
  try {
    const response = await fetch(`${PUBLIC_API_URL}/channels/twitter/config`, {
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("[twitter/config proxy] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch Twitter config", details: error.message },
      { status: 500 }
    );
  }
}
