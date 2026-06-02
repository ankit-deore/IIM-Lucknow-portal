export const dynamic = 'force-dynamic';
import { getSessionOrThrow } from '@/lib/auth-helpers'
import { apiSuccess } from '@/lib/api-response'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const sessionResult = await getSessionOrThrow(request)
  if (sessionResult instanceof Response) return sessionResult

  return apiSuccess({ message: 'Not yet implemented — coming in Step N' })
}

export async function PATCH(request: NextRequest) {
  const sessionResult = await getSessionOrThrow(request)
  if (sessionResult instanceof Response) return sessionResult

  return apiSuccess({ message: 'Not yet implemented — coming in Step N' })
}
