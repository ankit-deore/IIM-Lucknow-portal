import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/landing/Hero';
import { ProgrammesStrip } from '@/components/landing/ProgrammesStrip';
import { FeatureGrid } from '@/components/landing/FeatureGrid';
import { SignInCard } from '@/components/landing/SignInCard';
import { Footer } from '@/components/layout/Footer';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  
  const isLoggedIn = !!session;
  const userInitials = session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U';

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} userInitials={userInitials} />
      <main className="flex-1 flex flex-col pt-[56px] md:pt-[64px]">
        {!isLoggedIn && <Hero />}
        {!isLoggedIn && <ProgrammesStrip />}
        <FeatureGrid />
        {!isLoggedIn && <SignInCard />}
      </main>
      <Footer />
    </>
  );
}
