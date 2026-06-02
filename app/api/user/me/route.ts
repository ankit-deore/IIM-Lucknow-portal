export const dynamic = 'force-dynamic';
import { getSessionOrThrow } from '@/lib/auth-helpers';
import { apiSuccess, apiError, ERROR_CODES } from '@/lib/api-response';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const sessionResult = await getSessionOrThrow(request);
  if (sessionResult instanceof Response) return sessionResult;
  const session = sessionResult as any;

  if (!session?.user?.email) {
    return apiError(ERROR_CODES.UNAUTHORIZED, 'Not authenticated', 401);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { profile: true },
  });

  if (!user) {
    return apiError(ERROR_CODES.NOT_FOUND, 'User not found', 404);
  }

  // Check if admin
  const isAdmin = await prisma.adminEmail.findUnique({
    where: { email: user.email },
  });

  if (isAdmin && !user.isAdmin) {
    await prisma.user.update({
      where: { id: user.id },
      data: { isAdmin: true },
    });
    user.isAdmin = true;
  }

  return apiSuccess({
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    userType: user.userType,
    isAdmin: user.isAdmin,
    status: user.status,
    profile: user.profile ? {
      programme: user.profile.programme,
      batch: user.profile.batch,
      dob: user.profile.dob,
      currentRole: user.profile.currentRole,
      company: user.profile.company,
      industry: user.profile.industry,
      workExperience: user.profile.workExperience,
      academicBackground: user.profile.academicBackground,
      photoUrl: user.profile.photoUrl,
      profileComplete: user.profile.profileComplete,
      showInterviewStats: user.profile.showInterviewStats,
    } : null
  });
}
