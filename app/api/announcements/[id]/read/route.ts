export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionOrThrow, requireActiveStudent } from '@/lib/auth-helpers';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionOrError = await getSessionOrThrow(req);
    if (sessionOrError instanceof Response) return sessionOrError;
    const auth = requireActiveStudent(sessionOrError);
    if (auth instanceof Response) return auth;
    
    const user = sessionOrError.user!;

    const resolvedParams = await params;
    const { id } = resolvedParams;

    const announcement = await prisma.announcement.findUnique({
      where: { id }
    });

    if (!announcement) {
      return apiError('NOT_FOUND', 'Announcement not found', 404);
    }

    await prisma.announcementRead.upsert({
      where: {
        announcementId_userId: {
          announcementId: id,
          userId: user.id
        }
      },
      update: {},
      create: {
        announcementId: id,
        userId: user.id
      }
    });

    return apiSuccess({ success: true });
  } catch (error) {
    console.error('Error marking announcement as read:', error);
    return apiError('INTERNAL_ERROR', 'Internal server error', 500);
  }
}
