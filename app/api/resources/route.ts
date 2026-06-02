import { getSessionOrThrow } from '@/lib/auth-helpers';
import { apiSuccess, apiError, ERROR_CODES } from '@/lib/api-response';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const sessionResult = await getSessionOrThrow(request);
  if (sessionResult instanceof Response) return sessionResult;
  
  const session = sessionResult as any;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { profile: true }
  });

  if (!user?.profile?.programme) {
    return apiSuccess({ resource: null });
  }

  const resource = await prisma.programmeResource.findUnique({
    where: { programme: user.profile.programme }
  });

  return apiSuccess({ resource });
}
