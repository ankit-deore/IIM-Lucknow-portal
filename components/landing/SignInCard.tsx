'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { signIn } from 'next-auth/react';

export function SignInCard() {
  const handleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  const scrollToFeatures = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-[var(--color-bg-base)] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 flex justify-center">
        
        {/* The Card */}
        <div className="w-full max-w-[480px] bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] p-8 md:p-12 shadow-[var(--shadow-lg)] flex flex-col items-center text-center">
          
          {/* Logo */}
          <div className="relative w-full h-[48px] mb-8">
            <Image 
              src="/images/iiml-logo.svg" 
              alt="IIM Lucknow Logo" 
              fill 
              className="object-contain"
            />
          </div>

          <h2 className="text-[26px] font-bold text-[var(--color-text-primary)] mb-3">
            Sign in to Gurukul
          </h2>
          
          <p className="text-[15px] text-[var(--color-text-secondary)] mb-8 leading-relaxed px-4">
            Use the Google account associated with your enrolled IIML email address.
          </p>

          <button
            onClick={handleSignIn}
            className={cn(
              'w-full flex items-center justify-center outline-none',
              'h-[52px] bg-white border-[1.5px] border-[var(--color-border)] rounded-sm', // Google button standard is slightly rounded
              'text-[var(--color-text-primary)] font-medium text-[14px]',
              'transition-all duration-150 ease-in-out',
              'hover:bg-[#F5F7FA] hover:shadow-[var(--shadow-sm)]',
              'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)]'
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-[18px] h-[18px] mr-3">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            Sign in with Google
          </button>

          <div className="w-full flex items-center my-8">
            <div className="flex-1 h-[1px] bg-[var(--color-border)]" />
            <span className="px-4 text-[13px] text-[var(--color-text-secondary)] bg-white">or</span>
            <div className="flex-1 h-[1px] bg-[var(--color-border)]" />
          </div>

          <p className="text-[13px] text-[var(--color-text-secondary)] mb-6">
            Not yet registered? Contact your Programme Admin.
          </p>

          <a 
            href="#features"
            onClick={scrollToFeatures}
            className="text-[13px] text-[var(--color-accent)] hover:text-[var(--color-accent-dark)] font-medium transition-colors outline-none focus-visible:underline"
          >
            Learn more about Gurukul &darr;
          </a>

        </div>

      </div>
    </section>
  );
}
