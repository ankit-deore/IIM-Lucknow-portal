import { NextResponse } from 'next/server';

export type ApiSuccess<T> = {
  success: true
  data: T
  meta?: Record<string, unknown>
}

export type ApiError = {
  success: false
  error: {
    code: string
    message: string
  }
}

export function apiSuccess<T>(data: T, meta?: Record<string, unknown>, status = 200) {
  return NextResponse.json({
    success: true,
    data,
    meta,
  }, { status });
}

export function apiError(code: string, message: string, status = 400) {
  return NextResponse.json({
    success: false,
    error: {
      code,
      message,
    }
  }, { status });
}

export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  CONFLICT: 'CONFLICT',
} as const;
