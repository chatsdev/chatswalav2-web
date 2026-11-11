import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authoption } from "../../auth/[...nextauth]/authOption";

export async function GET() {
  try {
    const session = await getServerSession(authoption);
    const token = session?.accessToken as string | undefined;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/google/connect`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ message: data.message || "Failed to fetch public data." }, { status: response.status });
    }

    return NextResponse.json(data, { status: response.status });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}
