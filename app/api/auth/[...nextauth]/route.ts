export const dynamic = 'force-dynamic';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 90 * 24 * 60 * 60, // 90 days
  },
  pages: {
    signIn: '/',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, profile }) {
      if (!user.email) return '/auth/error?reason=google_unavailable';

      if (!user.email.endsWith('@iiml.ac.in')) {
        return '/auth/error?reason=invalid_domain';
      }

      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!dbUser) {
        return '/auth/error?reason=not_registered';
      }

      if (dbUser.status === 'DEACTIVATED') {
        return '/auth/error?reason=deactivated';
      }

      // Capture actual name from Google if available
      const updateData: any = { lastLogin: new Date() };
      
      const googleName = profile?.name || (profile as any)?.given_name;
      if (googleName && dbUser.name !== googleName) {
        updateData.name = googleName;
      }
      
      const googleImage = (profile as any)?.picture;
      if (googleImage && dbUser.image !== googleImage) {
        updateData.image = googleImage;
      }

      // Update last login and potentially name/image
      await prisma.user.update({
        where: { id: dbUser.id },
        data: updateData,
      });

      return true;
    },
    async jwt({ token, user, trigger }) {
      // initial sign in
      if (user) {
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: { profile: true },
        });

        if (dbUser) {
          if (!dbUser.isAdmin) {
            const isAdminEmail = await prisma.adminEmail.findUnique({
              where: { email: dbUser.email },
            });
            if (isAdminEmail) {
              dbUser = await prisma.user.update({
                where: { id: dbUser.id },
                data: { isAdmin: true },
                include: { profile: true },
              });
            }
          }
          
          token.id = dbUser.id;
          token.isAdmin = dbUser.isAdmin;
          token.userType = dbUser.userType;
          token.status = dbUser.status;
          token.profileComplete = dbUser.profile?.profileComplete ?? false;
          // Ensure token has the latest name and image from DB (which we just updated from Google)
          if (dbUser.name) token.name = dbUser.name;
          if (dbUser.image) token.picture = dbUser.image;
        }
      }

      // Allow manual update via session trigger
      if (trigger === 'update') {
        if (token.email) {
          const updatedUser = await prisma.user.findUnique({
            where: { email: token.email },
            include: { profile: true },
          });
          if (updatedUser) {
            token.isAdmin = updatedUser.isAdmin;
            token.userType = updatedUser.userType;
            token.status = updatedUser.status;
            token.profileComplete = updatedUser.profile?.profileComplete ?? false;
          }
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.isAdmin = token.isAdmin;
        session.user.userType = token.userType;
        session.user.status = token.status;
        session.user.profileComplete = token.profileComplete;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
