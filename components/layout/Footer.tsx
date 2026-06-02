import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[var(--color-primary-dark)] py-10 border-t-2 border-[var(--color-accent)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
          
          {/* Left Column */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex flex-col items-center md:items-start space-y-2">
              {/* // TODO: replace with official IIM Lucknow logo asset (white version) */}
              <div className="relative w-[120px] h-[36px]">
                <Image 
                  src="/images/iiml-logo.png" 
                  alt="IIM Lucknow Logo" 
                  fill 
                  className="object-contain brightness-0 invert"
                />
              </div>
              <span className="font-bold text-[20px] text-[var(--color-text-inverse)]">
                Gurukul
              </span>
              <p className="text-[13px] text-[var(--color-text-inverse)] opacity-80 mt-1">
                An initiative by IIML Executive Students.
              </p>
            </div>
          </div>

          {/* Centre Column */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <h3 className="sr-only">Footer Links</h3>
            <div className="flex flex-col items-center space-y-2 text-[14px]">
              {/* // TODO: Update hrefs when pages are built */}
              <Link href="#" className="text-[var(--color-text-inverse)] opacity-80 hover:opacity-100 transition-opacity focus-visible:ring-2 focus-visible:ring-white rounded-sm outline-none">
                About
              </Link>
              <Link href="#" className="text-[var(--color-text-inverse)] opacity-80 hover:opacity-100 transition-opacity focus-visible:ring-2 focus-visible:ring-white rounded-sm outline-none">
                Privacy Policy
              </Link>
              <Link href="#" className="text-[var(--color-text-inverse)] opacity-80 hover:opacity-100 transition-opacity focus-visible:ring-2 focus-visible:ring-white rounded-sm outline-none">
                Contact Admin
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col items-center md:items-end justify-end text-center md:text-right mt-4 md:mt-0">
            <p className="text-[12px] text-[var(--color-text-inverse)] opacity-50 max-w-[200px] md:max-w-none">
              &copy; 2026 Gurukul. Built for IIML Executive Programmes.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
