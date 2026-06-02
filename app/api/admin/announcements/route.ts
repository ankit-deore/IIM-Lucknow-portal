export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionOrThrow, requireAdmin } from '@/lib/auth-helpers';
import { apiSuccess, apiError } from '@/lib/api-response';
import { z } from 'zod';
import { sanitiseHtml } from '@/lib/sanitise';
import { AnnouncementType, MAX_ANNOUNCEMENT_TITLE_LENGTH, MAX_ANNOUNCEMENT_BODY_LENGTH } from '@/constants/announcement';
import { logAdminAction } from '@/lib/audit';

const schema = z.object({
  title: z.string().min(1).max(MAX_ANNOUNCEMENT_TITLE_LENGTH),
  body: z.string().min(1).max(MAX_ANNOUNCEMENT_BODY_LENGTH),
  type: z.enum(['GENERAL', 'URGENT', 'EVENT']),
  targetProgrammes: z.array(z.string()),
  isPinned: z.boolean(),
  expiryDate: z.string().nullable(),
});

export async function GET(req: NextRequest) {
  try {
    const sessionOrError = await getSessionOrThrow(req);
    if (sessionOrError instanceof Response) return sessionOrError;
    const auth = requireAdmin(sessionOrError);
    if (auth instanceof Response) return auth;
    
    const user = sessionOrError.user!;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const tab = searchParams.get('tab') || 'published';
    const skip = (page - 1) * limit;

    const where: any = {};
    if (tab === 'published') {
      where.OR = [
        { expiryDate: null },
        { expiryDate: { gt: new Date() } }
      ];
    } else if (tab === 'expired') {
      where.expiryDate = { lte: new Date() };
    }

    const total = await prisma.announcement.count({ where });
    const announcements = await prisma.announcement.findMany({
      where,
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' }
      ],
      skip,
      take: limit,
      include: {
        author: {
          select: { name: true, email: true }
        }
      }
    });

    const now = new Date();
    const mapped = announcements.map(a => ({
      ...a,
      isExpired: a.expiryDate ? a.expiryDate <= now : false
    }));

    return apiSuccess({
      announcements: mapped,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Error fetching admin announcements:', error);
    return apiError('INTERNAL_ERROR', 'Internal server error', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionOrError = await getSessionOrThrow(req);
    if (sessionOrError instanceof Response) return sessionOrError;
    const auth = requireAdmin(sessionOrError);
    if (auth instanceof Response) return auth;
    
    const user = sessionOrError.user!;

    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return apiError('VALIDATION_ERROR', 'Invalid input', 400);
    }

    const { title, body: contentBody, type, targetProgrammes, isPinned, expiryDate } = parsed.data;

    const sanitisedBody = sanitiseHtml(contentBody);
    if (!sanitisedBody.trim()) {
      return apiError('VALIDATION_ERROR', 'Body cannot be empty', 400);
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        body: sanitisedBody,
        type: type as AnnouncementType,
        targetProgrammes,
        isPinned,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        createdBy: user.id,
      }
    });

    logAdminAction({
      adminEmail: user.email!,
      action: 'CREATE_ANNOUNCEMENT',
      entityType: 'Announcement',
      entityId: announcement.id,
      metadata: { title }
    });

    return apiSuccess({ announcement }, undefined, 201);
  } catch (error) {
    console.error('Error creating announcement:', error);
    return apiError('INTERNAL_ERROR', 'Internal server error', 500);
  }
}
