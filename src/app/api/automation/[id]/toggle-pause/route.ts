import { authoption } from "@/src/app/api/auth/[...nextauth]/authOption";
import { PUBLIC_API_URL } from '@/src/constants/route';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

async function getAuthHeaders() {
  const session = await getServerSession(authoption);
  const token = session?.accessToken as string | undefined;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: automationID } = await context.params;
    const body = await request.json().catch(() => ({}));

    const headers = await getAuthHeaders();

    const response = await fetch(`${PUBLIC_API_URL}/automation/${automationID}/toggle-pause`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Error toggling automation pause status:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to toggle automation pause status' },
      { status: 500 }
    );
  }
}
