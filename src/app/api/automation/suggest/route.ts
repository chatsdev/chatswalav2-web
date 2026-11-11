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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const headers = await getAuthHeaders();

    const response = await fetch(`${PUBLIC_API_URL}/automation/suggest`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error suggesting automation flow:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to suggest automation flow' },
      { status: 500 }
    );
  }
}
