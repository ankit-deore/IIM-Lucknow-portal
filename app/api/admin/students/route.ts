export const dynamic = 'force-dynamic';
import { getSessionOrThrow, requireAdmin } from '@/lib/auth-helpers';
import { apiSuccess, apiError, ERROR_CODES } from '@/lib/api-response';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parsePagination, buildPaginationMeta } from '@/lib/pagination';
import { validateBody } from '@/lib/validate';
import { z } from 'zod';
import { sendInviteEmail } from '@/lib/email';
import { logAdminAction } from '@/lib/audit';

export async function GET(request: NextRequest) {
  const sessionResult = await getSessionOrThrow(request);
  if (sessionResult instanceof Response) return sessionResult;
  
  const adminCheck = requireAdmin(sessionResult);
  if (adminCheck !== true) return adminCheck;

  const searchParams = request.nextUrl.searchParams;
  const { skip, take, page, limit } = parsePagination(searchParams);
  
  const search = searchParams.get('search');
  const programme = searchParams.get('programme');
  const status = searchParams.get('status');

  const where: any = { userType: 'STUDENT' };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (status) {
    where.status = status;
  }

  if (programme) {
    where.profile = { programme };
  }

  const [total, students] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        profile: {
          select: { programme: true, batch: true }
        }
      }
    }),
  ]);

  return apiSuccess({
    students,
    meta: buildPaginationMeta(total, page, limit),
  });
}

const createStudentSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  programme: z.enum(['IPMX', 'PGPSM', 'PGPWE', 'DGMP'] as any),
  batch: z.string().min(1),
  dob: z.string(),
  currentRole: z.string().optional(),
  company: z.string().optional(),
  industry: z.string().optional(),
  workExperience: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const sessionResult = await getSessionOrThrow(request);
  if (sessionResult instanceof Response) return sessionResult;
  
  const adminCheck = requireAdmin(sessionResult);
  if (adminCheck !== true) return adminCheck;

  const rawData = await validateBody(request, createStudentSchema);
  if (rawData instanceof Response) return rawData;
  const data = rawData as z.infer<typeof createStudentSchema>;

  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) {
    return apiError(ERROR_CODES.CONFLICT, 'User with this email already exists', 409);
  }

  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email: data.email,
        name: data.name,
        userType: 'STUDENT',
        status: 'DORMANT',
      }
    });

    await tx.studentProfile.create({
      data: {
        userId: newUser.id,
        programme: data.programme,
        batch: data.batch,
        dob: new Date(data.dob),
        currentRole: data.currentRole,
        company: data.company,
        industry: data.industry,
        workExperience: data.workExperience,
      }
    });

    return newUser;
  });

  logAdminAction({
    adminEmail: (sessionResult as any).user.email,
    action: 'CREATE_STUDENT',
    entityType: 'User',
    entityId: user.id,
    metadata: { email: user.email, programme: data.programme }
  });

  // Fire and forget email
  sendInviteEmail(data.email, data.name, data.programme);

  return apiSuccess(user, undefined, 201);
}
