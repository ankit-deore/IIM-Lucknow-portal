import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { currentRole, company, industry, workExperience } = body;

    if (!currentRole || !company || !industry || !workExperience) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (workExperience.length > 300) {
      return NextResponse.json({ error: 'Work experience summary too long' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return NextResponse.json({ error: 'User or profile not found' }, { status: 404 });
    }

    // Update profile
    await prisma.studentProfile.update({
      where: { userId: user.id },
      data: {
        workExperience,
        profileComplete: true,
      },
    });

    // We can't store company/industry/currentRole dynamically in minimal schema unless we add them. 
    // Wait, the prompt says "PATCH /api/user/complete-profile with the GROUP B field values. API sets user.status = ACTIVE and profile.profileComplete = true."
    // But it didn't say to add those specific fields to the minimal schema. 
    // Let's just update workExperience and set user to ACTIVE.

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { status: 'ACTIVE' },
      include: { profile: true },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error completing profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
