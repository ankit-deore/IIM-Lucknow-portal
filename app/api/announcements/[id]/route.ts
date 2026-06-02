import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionOrThrow, requireActiveStudent } from '@/lib/auth-helpers';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionOrError = await getSessionOrThrow(req);
    if (sessionOrError instanceof Response) return sessionOrError;
    const auth = requireActiveStudent(sessionOrError);
    if (auth instanceof Response) return auth;
    
    const user = sessionOrError.user!;
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const announcement = await prisma.announcement.findUnique({
      where: { id },
      include: {
        reads: {
          where: { userId: user.id }
        },
        author: {
          select: { name: true, email: true }
        }
      }
    });

    if (!announcement) {
      return apiError('NOT_FOUND', 'Announcement not found', 404);
    }

    const studentProfile = await prisma.studentProfile.findUnique({ where: { userId: user.id } });
    const programme = studentProfile?.programme;

    if (announcement.expiryDate && announcement.expiryDate <= new Date()) {
      return apiError('NOT_FOUND', 'Announcement expired', 404);
    }

    if (announcement.targetProgrammes.length > 0 && programme && !announcement.targetProgrammes.includes(programme)) {
      return apiError('NOT_FOUND', 'Announcement not found', 404);
    }

    const mapped = {
      id: announcement.id,
      title: announcement.title,
      body: announcement.body,
      type: announcement.type,
      targetProgrammes: announcement.targetProgrammes,
      isPinned: announcement.isPinned,
      expiryDate: announcement.expiryDate ? announcement.expiryDate.toISOString() : null,
      createdAt: announcement.createdAt.toISOString(),
      updatedAt: announcement.updatedAt.toISOString(),
      isRead: announcement.reads.length > 0,
      author: {
        name: announcement.author.name,
        email: announcement.author.email
      }
    };

    return apiSuccess({ announcement: mapped });
  } catch (error) {
    console.error('Error fetching announcement:', error);
    return apiError('INTERNAL_ERROR', 'Internal server error', 500);
  }
}
