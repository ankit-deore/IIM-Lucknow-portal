import { getSessionOrThrow, requireAdmin } from '@/lib/auth-helpers';
import { apiSuccess } from '@/lib/api-response';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendInviteEmail } from '@/lib/email';
import { logAdminAction } from '@/lib/audit';

export async function POST(request: NextRequest) {
  const sessionResult = await getSessionOrThrow(request);
  if (sessionResult instanceof Response) return sessionResult;
  
  const adminCheck = requireAdmin(sessionResult);
  if (adminCheck !== true) return adminCheck;

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return Response.json({ success: false, error: { message: 'Invalid JSON' } }, { status: 400 });
  }

  const { students } = body;
  if (!Array.isArray(students)) {
    return Response.json({ success: false, error: { message: 'students array is required' } }, { status: 400 });
  }

  // Pre-check emails
  const emails = students.map(s => s.email);
  const existingUsers = await prisma.user.findMany({
    where: { email: { in: emails } },
    select: { email: true }
  });
  
  const existingEmailsSet = new Set(existingUsers.map(u => u.email));
  
  const toCreate = students.filter(s => !existingEmailsSet.has(s.email));
  const skippedCount = students.length - toCreate.length;
  
  const results = { created: 0, skipped: skippedCount, errors: [] as any[] };

  if (toCreate.length > 0) {
    await prisma.$transaction(async (tx) => {
      for (const student of toCreate) {
        try {
          const newUser = await tx.user.create({
            data: {
              email: student.email,
              name: student.name,
              userType: 'STUDENT',
              status: 'DORMANT',
            }
          });

          await tx.studentProfile.create({
            data: {
              userId: newUser.id,
              programme: student.programme,
              batch: student.batch,
              dob: new Date(student.dob),
              currentRole: student.currentRole || null,
              company: student.company || null,
              industry: student.industry || null,
              workExperience: student.workExperience || null,
            }
          });
          
          results.created++;
          
          // Fire and forget email
          sendInviteEmail(student.email, student.name, student.programme);
          
        } catch (e: any) {
          results.errors.push({ email: student.email, error: e.message });
        }
      }
    });

    logAdminAction({
      adminEmail: (sessionResult as any).user.email,
      action: 'BULK_IMPORT_STUDENTS',
      entityType: 'User',
      entityId: 'multiple',
      metadata: results
    });
  }

  return apiSuccess(results, undefined, 201);
}
