import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionOrThrow } from '@/lib/auth-helpers';
import { apiSuccess, apiError } from '@/lib/api-response';
import { parsePagination, buildPaginationMeta } from '@/lib/pagination';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const sessionOrError = await getSessionOrThrow(req);
    if (sessionOrError instanceof Response) return sessionOrError;

    const { searchParams } = new URL(req.url);
    const { skip, take, page, limit } = parsePagination(searchParams);

    const search = searchParams.get('search');
    const programme = searchParams.get('programme');
    const batch = searchParams.get('batch');
    const industry = searchParams.get('industry');

    const where: any = {
      status: 'ACTIVE',
      userType: 'STUDENT',
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { profile: { company: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const profileFilter: any = {};
    let hasProfileFilter = false;

    if (programme && programme !== 'All Programmes') {
      profileFilter.programme = programme;
      hasProfileFilter = true;
    }
    
    if (batch && batch !== 'All Batches') {
      profileFilter.batch = batch;
      hasProfileFilter = true;
    }
    
    if (industry && industry !== 'All Industries') {
      profileFilter.industry = industry;
      hasProfileFilter = true;
    }

    if (hasProfileFilter) {
      where.profile = {
        ...where.profile,
        ...profileFilter
      };
    }

    const [total, users, allActiveProfiles] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take,
        include: { profile: true },
        orderBy: { name: 'asc' },
      }),
      // We need distinct batches from all active students, regardless of current filters
      prisma.studentProfile.findMany({
        where: { user: { status: 'ACTIVE', userType: 'STUDENT' } },
        select: { batch: true },
        distinct: ['batch']
      })
    ]);

    const distinctBatches = allActiveProfiles
      .map(p => p.batch)
      .filter(Boolean)
      .sort();

    const students = users.map(user => ({
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
      } : null
    }));

    const meta = buildPaginationMeta(total, page, limit);

    return apiSuccess({ students, distinctBatches, meta });
  } catch (error) {
    console.error('Error fetching directory:', error);
    return apiError('INTERNAL_ERROR', 'Failed to fetch directory', 500);
  }
}
