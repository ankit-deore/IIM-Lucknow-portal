'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { cn } from '@/lib/utils';

export function Hero() {
  const handleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <section className="relative w-full min-h-[calc(100vh-64px)] flex flex-col justify-center items-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] z-0" />
      
      {/* Subtle Dot Pattern Overlay using inline SVG */}
      <div 
        className="absolute inset-0 z-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full max-w-[720px] px-6 flex flex-col items-center text-center mt-[-40px]">
        
        {/* Eyebrow */}
        <span className="text-[var(--color-accent)] text-[13px] tracking-[0.1em] uppercase font-semibold mb-6">
          IPMX &middot; PGPSM &middot; PGPWE &middot; DGMP
        </span>

        {/* H1 */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[var(--color-text-inverse)] mb-6 drop-shadow-sm">
          Gurukul
        </h1>

        {/* Body text */}
        <p className="text-[16px] md:text-[18px] text-[var(--color-text-inverse)] opacity-70 max-w-[560px] mb-12 text-balance leading-relaxed">
          One authenticated platform for your batch, timetable, mock interviews, and programme resources &mdash; built for IIML&apos;s executive students.
        </p>

        {/* Primary CTA */}
        <button
          onClick={handleSignIn}
          className={cn(
            'flex items-center justify-center rounded-[var(--radius-full)] outline-none',
            'h-[52px] px-8',
            'bg-[var(--color-accent)] text-[var(--color-primary-dark)] font-bold',
            'shadow-[var(--shadow-md)] transition-all duration-150 ease-in-out hover:-translate-y-[2px]',
            'hover:bg-[var(--color-accent-dark)]',
            'focus-visible:ring-4 focus-visible:ring-[var(--color-accent)] focus-visible:ring-opacity-50'
          )}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-6 h-6 mr-3 bg-white rounded-full p-1">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          Sign in with Google
        </button>

        {/* Micro-copy */}
        <p className="text-[13px] text-[var(--color-text-inverse)] opacity-50 mt-6 max-w-[400px]">
          Access is restricted to enrolled students. Contact your programme admin if you face issues.
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center">
        <ChevronDown className="text-[var(--color-accent)] w-8 h-8 opacity-80" aria-hidden="true" />
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-bounce { animation: none; }
        }
      `}} />
    </section>
  );
}
