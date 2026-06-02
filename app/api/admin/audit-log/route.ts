import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionOrThrow, requireAdmin } from '@/lib/auth-helpers';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const sessionOrError = await getSessionOrThrow(req);
    if (sessionOrError instanceof Response) return sessionOrError;
    const auth = requireAdmin(sessionOrError);
    if (auth instanceof Response) return auth;

    const logs = await prisma.auditLog.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' }
    });

    return apiSuccess({ logs });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return apiError('INTERNAL_ERROR', 'Internal server error', 500);
  }
}
