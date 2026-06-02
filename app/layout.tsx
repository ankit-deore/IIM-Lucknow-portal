import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Gurukul | IIML Executive Portal',
  description: 'Gurukul is the official student portal for IIM Lucknow\'s executive programmes — IPMX, PGPSM, PGPWE, and DGMP.',
};

import { Toaster } from 'react-hot-toast';
import { Providers } from './providers';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--color-text-primary)',
                color: 'var(--color-text-inverse)',
                borderRadius: 'var(--radius-md)'
              }
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
