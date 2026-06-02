'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { signIn } from 'next-auth/react';

export function Navbar({ isLoggedIn = false, userInitials = '' }: { isLoggedIn?: boolean; userInitials?: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-150 ease-in-out',
        'bg-[var(--color-primary)]',
        'h-[56px] md:h-[64px]',
        scrolled ? 'shadow-[var(--shadow-md)]' : ''
      )}
    >
      <div className="h-full px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          <Link href={ROUTES.HOME} className="flex items-center focus-visible:ring-2 focus-visible:ring-white rounded-sm outline-none">
            <div className="relative w-[50px] h-[40px] md:w-[60px] md:h-[48px] bg-white rounded-full p-1">
              <Image 
                src="/images/logo-iiml.png" 
                alt="IIM Lucknow Logo" 
                fill 
                className="object-contain p-1 rounded-full"
                priority
              />
            </div>
            
            <div className="w-[1px] h-[24px] bg-[var(--color-accent)] mx-3 md:mx-4" />
            
            <span className="font-bold text-[20px] text-[var(--color-text-inverse)]">
              Gurukul
            </span>
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center">
          {!isLoggedIn ? (
            <button
              onClick={handleSignIn}
              aria-label="Sign in with Google"
              className={cn(
                'flex items-center justify-center rounded-[var(--radius-full)] outline-none',
                'min-h-[44px] min-w-[44px]', // Mobile touch target
                'border border-white bg-transparent',
                'transition-colors duration-150 ease-in-out',
                'hover:bg-white hover:text-[var(--color-primary)] text-white group',
                'focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-primary)]',
                'p-2 md:px-4 md:py-2'
              )}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 md:mr-2">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
              <span className="hidden md:inline font-medium text-[14px]">
                Sign in with Google
              </span>
            </button>
          ) : (
            <Link 
              href="/dashboard"
              aria-label="Go to Dashboard"
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-full bg-white text-[var(--color-primary)]',
                'font-bold text-[16px] shadow-sm',
                'hover:bg-gray-100 hover:scale-105 transition-all outline-none',
                'focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-primary)]'
              )}
            >
              {userInitials}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
