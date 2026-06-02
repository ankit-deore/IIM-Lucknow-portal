export const dynamic = 'force-dynamic';
import { getSessionOrThrow, requireAdmin } from '@/lib/auth-helpers';
import { apiSuccess, apiError, ERROR_CODES } from '@/lib/api-response';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendInviteEmail } from '@/lib/email';
import { logAdminAction } from '@/lib/audit';
import { z } from 'zod';
import { validateBody } from '@/lib/validate';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const sessionResult = await getSessionOrThrow(request);
  if (sessionResult instanceof Response) return sessionResult;
  
  const adminCheck = requireAdmin(sessionResult);
  if (adminCheck !== true) return adminCheck;

  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: { profile: true }
  });

  if (!user) {
    return apiError(ERROR_CODES.NOT_FOUND, 'Student not found', 404);
  }

  return apiSuccess(user);
}

const updateStudentSchema = z.object({
  action: z.enum(['update', 'resend_invite', 'deactivate', 'reactivate']),
  data: z.object({
    name: z.string().min(1),
    programme: z.string(),
    batch: z.string(),
    dob: z.string(),
    currentRole: z.string().optional(),
    company: z.string().optional(),
    industry: z.string().optional(),
    workExperience: z.string().optional(),
  }).optional()
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const sessionResult = await getSessionOrThrow(request);
  if (sessionResult instanceof Response) return sessionResult;
  
  const adminCheck = requireAdmin(sessionResult);
  if (adminCheck !== true) return adminCheck;

  const { id } = await params;
  const rawBody = await validateBody(request, updateStudentSchema);
  if (rawBody instanceof Response) return rawBody;
  const body = rawBody as z.infer<typeof updateStudentSchema>;

  const user = await prisma.user.findUnique({
    where: { id },
    include: { profile: true }
  });

  if (!user || user.userType !== 'STUDENT') {
    return apiError(ERROR_CODES.NOT_FOUND, 'Student not found', 404);
  }

  const adminEmail = (sessionResult as any).user.email;

  if (body.action === 'update' && body.data) {
    try {
      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id },
          data: { name: body.data!.name }
        });

        const profileData = {
          programme: body.data!.programme,
          batch: body.data!.batch,
          dob: new Date(body.data!.dob),
          currentRole: body.data!.currentRole || null,
          company: body.data!.company || null,
          industry: body.data!.industry || null,
          workExperience: body.data!.workExperience || null,
        };

        await tx.studentProfile.upsert({
          where: { userId: id },
          update: profileData,
          create: {
            userId: id,
            ...profileData
          }
        });
      });

      await logAdminAction({
        adminEmail,
        action: 'UPDATE_STUDENT',
        entityType: 'User',
        entityId: user.id
      });

      return apiSuccess({ message: 'Student updated successfully' });
    } catch (error) {
      console.error('Error updating student:', error);
      return apiError(ERROR_CODES.INTERNAL_ERROR, 'Failed to update student', 500);
    }
  }

  if (body.action === 'resend_invite') {
    if (user.status !== 'DORMANT') {
      return apiError(ERROR_CODES.CONFLICT, 'Can only resend invite to DORMANT accounts', 409);
    }
    
    await sendInviteEmail(user.email, user.name || '', user.profile?.programme || 'IPMX');
    
    await logAdminAction({
      adminEmail,
      action: 'RESEND_INVITE',
      entityType: 'User',
      entityId: user.id
    });

    return apiSuccess({ message: 'Invite resent successfully' });
  }

  if (body.action === 'deactivate') {
    await prisma.user.update({
      where: { id: user.id },
      data: { status: 'DEACTIVATED' }
    });

    await logAdminAction({
      adminEmail,
      action: 'DEACTIVATE_STUDENT',
      entityType: 'User',
      entityId: user.id
    });

    return apiSuccess({ message: 'Account deactivated' });
  }

  if (body.action === 'reactivate') {
    const newStatus = user.profile?.profileComplete ? 'ACTIVE' : 'DORMANT';
    
    await prisma.user.update({
      where: { id: user.id },
      data: { status: newStatus }
    });

    await logAdminAction({
      adminEmail,
      action: 'REACTIVATE_STUDENT',
      entityType: 'User',
      entityId: user.id,
      metadata: { newStatus }
    });

    return apiSuccess({ message: 'Account reactivated', status: newStatus });
  }

  return apiError(ERROR_CODES.VALIDATION_ERROR, 'Invalid action', 400);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const sessionResult = await getSessionOrThrow(request);
  if (sessionResult instanceof Response) return sessionResult;
  
  const adminCheck = requireAdmin(sessionResult);
  if (adminCheck !== true) return adminCheck;

  const { id } = await params;
  if (process.env.NODE_ENV === 'production') {
    return apiError(ERROR_CODES.FORBIDDEN, 'Hard delete is disabled in production. Use deactivate.', 403);
  }

  await prisma.user.delete({
    where: { id }
  });

  await logAdminAction({
    adminEmail: (sessionResult as any).user.email,
    action: 'DELETE_STUDENT',
    entityType: 'User',
    entityId: id
  });

  return apiSuccess({ message: 'Student hard deleted' });
}
