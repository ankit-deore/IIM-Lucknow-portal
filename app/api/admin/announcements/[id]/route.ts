import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionOrThrow, requireAdmin } from '@/lib/auth-helpers';
import { apiSuccess, apiError } from '@/lib/api-response';
import { z } from 'zod';
import { sanitiseHtml } from '@/lib/sanitise';
import { AnnouncementType, MAX_ANNOUNCEMENT_TITLE_LENGTH, MAX_ANNOUNCEMENT_BODY_LENGTH } from '@/constants/announcement';
import { logAdminAction } from '@/lib/audit';

const schema = z.object({
  title: z.string().min(1).max(MAX_ANNOUNCEMENT_TITLE_LENGTH).optional(),
  body: z.string().min(1).max(MAX_ANNOUNCEMENT_BODY_LENGTH).optional(),
  type: z.enum(['GENERAL', 'URGENT', 'EVENT']).optional(),
  targetProgrammes: z.array(z.string()).optional(),
  isPinned: z.boolean().optional(),
  expiryDate: z.string().nullable().optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionOrError = await getSessionOrThrow(req);
    if (sessionOrError instanceof Response) return sessionOrError;
    const auth = requireAdmin(sessionOrError);
    if (auth instanceof Response) return auth;
    
    const user = sessionOrError.user!;
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const announcement = await prisma.announcement.findUnique({
      where: { id },
      include: {
        author: { select: { name: true, email: true } }
      }
    });

    if (!announcement) {
      return apiError('NOT_FOUND', 'Not found', 404);
    }

    return apiSuccess({ announcement });
  } catch (error) {
    return apiError('INTERNAL_ERROR', 'Internal error', 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionOrError = await getSessionOrThrow(req);
    if (sessionOrError instanceof Response) return sessionOrError;
    const auth = requireAdmin(sessionOrError);
    if (auth instanceof Response) return auth;
    
    const user = sessionOrError.user!;
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const existing = await prisma.announcement.findUnique({ where: { id } });
    if (!existing) {
      return apiError('NOT_FOUND', 'Not found', 404);
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return apiError('VALIDATION_ERROR', 'Invalid input', 400);
    }

    const dataToUpdate: any = { ...parsed.data };
    
    if (dataToUpdate.body) {
      dataToUpdate.body = sanitiseHtml(dataToUpdate.body);
      if (!dataToUpdate.body.trim()) {
        return apiError('VALIDATION_ERROR', 'Body cannot be empty', 400);
      }
    }

    if (dataToUpdate.expiryDate !== undefined) {
      dataToUpdate.expiryDate = dataToUpdate.expiryDate ? new Date(dataToUpdate.expiryDate) : null;
    }

    const updated = await prisma.announcement.update({
      where: { id },
      data: dataToUpdate
    });

    logAdminAction({
      adminEmail: user.email!,
      action: 'UPDATE_ANNOUNCEMENT',
      entityType: 'Announcement',
      entityId: id,
    });

    return apiSuccess({ announcement: updated });
  } catch (error) {
    return apiError('INTERNAL_ERROR', 'Internal error', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionOrError = await getSessionOrThrow(req);
    if (sessionOrError instanceof Response) return sessionOrError;
    const auth = requireAdmin(sessionOrError);
    if (auth instanceof Response) return auth;
    
    const user = sessionOrError.user!;
    const resolvedParams = await params;
    const { id } = resolvedParams;

    await prisma.announcement.delete({ where: { id } });

    logAdminAction({
      adminEmail: user.email!,
      action: 'DELETE_ANNOUNCEMENT',
      entityType: 'Announcement',
      entityId: id,
    });

    return apiSuccess({ success: true });
  } catch (error) {
    return apiError('INTERNAL_ERROR', 'Internal error', 500);
  }
}
