import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionOrThrow, requireActiveStudent } from '@/lib/auth-helpers';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    const sessionOrError = await getSessionOrThrow(req);
    if (sessionOrError instanceof Response) return sessionOrError;
    const auth = requireActiveStudent(sessionOrError);
    if (auth instanceof Response) return auth;
    
    const user = sessionOrError.user!;

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: user.id }
    });

    const programme = studentProfile?.programme;

    const whereCondition: any = {
      AND: [
        {
          OR: [
            { expiryDate: null },
            { expiryDate: { gt: new Date() } }
          ]
        },
        {
          OR: [
            { targetProgrammes: { isEmpty: true } },
            ...(programme ? [{ targetProgrammes: { has: programme } }] : [])
          ]
        }
      ]
    };

    const announcements = await prisma.announcement.findMany({
      where: whereCondition,
      select: { id: true }
    });

    const dataToCreate = announcements.map(a => ({
      announcementId: a.id,
      userId: user.id,
    }));

    const result = await prisma.announcementRead.createMany({
      data: dataToCreate,
      skipDuplicates: true
    });

    return apiSuccess({ markedCount: result.count });
  } catch (error) {
    console.error('Error marking all read:', error);
    return apiError('INTERNAL_ERROR', 'Internal server error', 500);
  }
}
