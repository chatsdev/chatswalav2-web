import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authoption } from "../../../../auth/[...nextauth]/authOption";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authoption);
    const token = session?.accessToken as string;
    const { id } = await params;

    const response = await fetch(`${BACKEND_API_URL}/subscription/payment/${id}/invoice`, {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return NextResponse.json({ message: data.message || "Failed to download invoice" }, { status: response.status });
    }

    const blob = await response.blob();
    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    headers.set("Content-Disposition", `attachment; filename=invoice-${id}.pdf`);

    return new NextResponse(blob, {
      status: 200,
      headers,
    });
  } catch (error: unknown) {
    console.error("Download Invoice API error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
