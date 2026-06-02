export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionOrThrow, requireActiveStudent } from '@/lib/auth-helpers';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const sessionOrError = await getSessionOrThrow(req);
    if (sessionOrError instanceof Response) return sessionOrError;
    
    const user = sessionOrError.user!;
    if (!user.isAdmin && (user.userType !== 'STUDENT' || user.status !== 'ACTIVE')) {
      return apiError('FORBIDDEN', 'Access denied', 403);
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') || 'all';
    const type = searchParams.get('type') as any;
    const skip = (page - 1) * limit;

    let programme: string | null = null;
    
    if (!user.isAdmin && user.userType === 'STUDENT') {
      const studentProfile = await prisma.studentProfile.findUnique({
        where: { userId: user.id }
      });

      if (!studentProfile) {
        return apiError('NOT_FOUND', 'Profile not found', 404);
      }
      programme = studentProfile.programme;
    }

    const whereCondition: any = {
      AND: [
        {
          OR: [
            { expiryDate: null },
            { expiryDate: { gt: new Date() } }
          ]
        }
      ]
    };

    if (!user.isAdmin && user.userType === 'STUDENT') {
      whereCondition.AND.push({
        OR: [
          { targetProgrammes: { isEmpty: true } },
          ...(programme ? [{ targetProgrammes: { has: programme } }] : [])
        ]
      });
    }

    if (type && ['GENERAL', 'URGENT', 'EVENT'].includes(type)) {
      whereCondition.type = type;
    }

    const announcements = await prisma.announcement.findMany({
      where: whereCondition,
      include: {
        reads: {
          where: { userId: user.id }
        },
        author: {
          select: { name: true, email: true }
        }
      },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    const mapped = announcements.map(a => ({
      id: a.id,
      title: a.title,
      body: a.body,
      type: a.type,
      targetProgrammes: a.targetProgrammes,
      isPinned: a.isPinned,
      expiryDate: a.expiryDate ? a.expiryDate.toISOString() : null,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
      isRead: a.reads.length > 0,
      author: {
        name: a.author.name,
        email: a.author.email
      }
    }));

    let filtered = mapped;
    if (status === 'unread') {
      filtered = mapped.filter(a => !a.isRead);
    } else if (status === 'read') {
      filtered = mapped.filter(a => a.isRead);
    }

    const unreadCount = mapped.filter(a => !a.isRead).length;

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);
    const totalPages = Math.ceil(total / limit);

    return apiSuccess({
      announcements: paginated,
      unreadCount,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return apiError('INTERNAL_ERROR', 'Internal server error', 500);
  }
}
