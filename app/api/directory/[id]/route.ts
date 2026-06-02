import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionOrThrow } from '@/lib/auth-helpers';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionOrError = await getSessionOrThrow(req);
    if (sessionOrError instanceof Response) return sessionOrError;
    const sessionUser = sessionOrError.user!;

    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: { profile: true }
    });

    if (!user || user.status !== 'ACTIVE' || user.userType !== 'STUDENT') {
      return apiError('NOT_FOUND', 'Student not found', 404);
    }

    const isOwnProfile = sessionUser.id === user.id;

    const studentData = {
      id: user.id,
      name: user.name,
      image: user.image,
      profile: user.profile ? {
        programme: user.profile.programme,
        batch: user.profile.batch,
        currentRole: user.profile.currentRole,
        company: user.profile.company,
        industry: user.profile.industry,
        photoUrl: user.profile.photoUrl,
        profileComplete: user.profile.profileComplete,
        workExperience: user.profile.workExperience,
        academicBackground: user.profile.academicBackground,
        // Only include DOB if viewer is looking at their own profile
        dob: isOwnProfile && user.profile.dob ? user.profile.dob.toISOString() : undefined,
      } : null
    };

    return apiSuccess({ student: studentData });
  } catch (error) {
    console.error('Error fetching student profile:', error);
    return apiError('INTERNAL_ERROR', 'Failed to fetch student profile', 500);
  }
}
