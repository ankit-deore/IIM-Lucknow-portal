import { redirect } from 'next/navigation';

// Dummy layout to enable error page matching layout if needed.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
