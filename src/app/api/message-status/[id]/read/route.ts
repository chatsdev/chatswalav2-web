/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_API_URL } from "@/src/constants/route";
import { authoption } from "../../../auth/[...nextauth]/authOption";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authoption);
    const token = session?.accessToken as string | undefined;
    const { id } = await params;
     const body = await request.json();
    
    const response = await fetch(`${PUBLIC_API_URL}/message-status/${id}/read`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
   
  } catch (error: any) {
    console.error('Error to Update Message Status status:', error);
    return NextResponse.json(
      { success: false, error: 'to Update Message Status status', message: error?.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
