import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';
import { UserType, UserStatus } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      userType: UserType;
      isAdmin: boolean;
      status: UserStatus;
      profileComplete: boolean;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    userType: UserType;
    isAdmin: boolean;
    status: UserStatus;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    userType: UserType;
    isAdmin: boolean;
    status: UserStatus;
    profileComplete: boolean;
  }
}
