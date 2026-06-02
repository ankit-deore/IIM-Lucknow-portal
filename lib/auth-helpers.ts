import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { apiError, ERROR_CODES } from './api-response';
import { NextRequest } from 'next/server';
import { prisma } from './prisma';

export async function getSessionOrThrow(request?: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return apiError(ERROR_CODES.UNAUTHORIZED, 'Not authenticated', 401);
  }
  
  return session;
}

export function requireAdmin(session: any) {
  if (!session?.user?.isAdmin) {
    return apiError(ERROR_CODES.FORBIDDEN, 'Admin access required', 403);
  }
  return true;
}

export function requireActiveStudent(session: any) {
  if (session?.user?.role !== 'STUDENT' || session?.user?.status !== 'ACTIVE') {
    return apiError(ERROR_CODES.FORBIDDEN, 'Active student access required', 403);
  }
  return true;
}

export async function getUserProgramme(userId: string) {
  const profile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { programme: true },
  });
  return profile?.programme ?? null;
}
