export const ENV = {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? '',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
} as const;
