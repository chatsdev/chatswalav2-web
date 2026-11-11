import { PUBLIC_API_URL } from "@/src/constants/route";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authoption } from "../../../auth/[...nextauth]/authOption";

export async function GET(req: Request) {
  return handleRequest(req);
}

export async function POST(req: Request) {
  return handleRequest(req);
}

async function handleRequest(req: Request) {
  try {
    const session = await getServerSession(authoption);
    const token = session?.accessToken as string | undefined;

    const reqBody = req.method !== "GET" ? await req.json().catch(() => ({})) : undefined;

    const response = await fetch(`${PUBLIC_API_URL}/facebook/linked-accounts/sync`, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(req.headers.get("x-workspace-id") ? { "x-workspace-id": req.headers.get("x-workspace-id") as string } : {}),
      },
      body: reqBody ? JSON.stringify(reqBody) : undefined,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in syncLinkedSocialAccounts proxy:", error);
    return NextResponse.json({ success: false, message: "Internal server error", error: error.message }, { status: 500 });
  }
}
