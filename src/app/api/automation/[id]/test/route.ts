import { authoption } from "@/src/app/api/auth/[...nextauth]/authOption";
import { PUBLIC_API_URL } from '@/src/constants/route';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

async function getAuthHeaders(workspaceId?: string | null) {
  const session = await getServerSession(authoption);
  const token = session?.accessToken as string | undefined;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (workspaceId) {
    headers['x-workspace-id'] = workspaceId;
  }

  return headers;
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: automationID } = await context.params;
    const body = await request.json().catch(() => ({}));
    
    const workspaceId = request.headers.get('x-workspace-id') || request.nextUrl.searchParams.get('workspace_id');

    const headers = await getAuthHeaders(workspaceId);

    const response = await fetch(`${PUBLIC_API_URL}/automation/${automationID}/test`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error testing automation flow:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to test automation flow' },
      { status: 500 }
    );
  }
}
