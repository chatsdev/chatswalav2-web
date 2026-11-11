import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_API_URL } from "@/src/constants/route";

// Public callback route — Twitter redirects here after user authorizes.
// Proxies to the backend which returns the HTML popup bridge page.
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();

    const response = await fetch(
      `${PUBLIC_API_URL}/social/twitter/callback?${queryString}`,
      { headers: { "Content-Type": "text/html" } }
    );

    const html = await response.text();
    return new NextResponse(html, {
      status: response.status,
      headers: { "Content-Type": "text/html" },
    });
  } catch (error: any) {
    console.error("[twitter/callback proxy] Error:", error);
    return new NextResponse(
      "<html><body><h2>Authorization failed. You can close this window.</h2></body></html>",
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
}
