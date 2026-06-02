import { getSessionOrThrow } from '@/lib/auth-helpers'
import { apiSuccess } from '@/lib/api-response'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const sessionResult = await getSessionOrThrow(request)
  if (sessionResult instanceof Response) return sessionResult

  return apiSuccess({ message: 'Not yet implemented — coming in Step N' })
}
