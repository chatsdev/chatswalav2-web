import { PUBLIC_API_URL } from "@/src/constants/route";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ platform: string }> }
) {
  try {
    const { platform } = await context.params;
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();

    const response = await fetch(`${PUBLIC_API_URL}/social-connections/callback/${platform}?${queryString}`, {
      headers: {
        "Content-Type": "text/html",
      },
    });

    const html = await response.text();
    return new NextResponse(html, {
      status: response.status,
      headers: { "Content-Type": "text/html" },
    });
  } catch (error: any) {
    console.error(`Error in OAuth callback for ${error.message}:`, error);
    return NextResponse.json(
      { success: false, error: "OAuth callback failed", details: error.message },
      { status: 500 }
    );
  }
}
