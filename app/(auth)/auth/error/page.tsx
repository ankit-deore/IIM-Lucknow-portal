import Link from 'next/link';
import { ShieldX, ShieldOff, WifiOff } from 'lucide-react';

export default async function AuthErrorPage(props: { searchParams: Promise<{ reason?: string, error?: string }> }) {
  const searchParams = await props.searchParams;
  const reason = searchParams.reason;
  const errorParam = searchParams.error;
  
  let icon = <WifiOff className="text-[var(--color-text-secondary)]" size={48} />;
  let heading = "Sign-in Unavailable";
  let body = "We were unable to complete sign-in. This may be a temporary issue. Please try again in a few minutes.";

  if (reason === 'not_registered') {
    icon = <ShieldX className="text-[var(--color-error)]" size={48} />;
    heading = "Access Not Found";
    body = "Your Google account is not registered on Gurukul. Please ensure you are signing in with the Google account associated with your enrolled IIML email address, or contact your Programme Admin.";
  } else if (reason === 'deactivated') {
    icon = <ShieldOff className="text-[var(--color-error)]" size={48} />;
    heading = "Account Deactivated";
    body = "Your Gurukul account has been deactivated. Please contact your Programme Admin to restore access.";
  } else if (reason === 'invalid_domain') {
    icon = <ShieldX className="text-[var(--color-error)]" size={48} />;
    heading = "Invalid Domain";
    body = "Only @iiml.ac.in email addresses are permitted to sign in to Gurukul.";
  } else if (errorParam) {
    body = `Authentication error: ${errorParam}. Please try again or contact support.`;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-base)] p-4">
      <div className="w-full max-w-[480px] rounded-2xl border border-[var(--color-border)] bg-white p-8 shadow-sm text-center flex flex-col items-center">
        <div className="mb-6 flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[var(--color-primary)]" />
          <span className="text-lg font-bold text-[var(--color-primary)]">IIM Lucknow</span>
        </div>
        
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-bg-subtle)]">
          {icon}
        </div>
        
        <h1 className="mb-2 text-2xl font-bold text-[var(--color-text)]">{heading}</h1>
        <p className="mb-8 text-[var(--color-text-secondary)]">{body}</p>
        
        <div className="flex w-full flex-col gap-4">
          <Link
            href="/"
            className="flex h-[52px] w-full items-center justify-center rounded-full bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            Try Again
          </Link>
          <a
            href="mailto:admin@gurukul.iiml.ac.in"
            className="flex h-[52px] w-full items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text)] font-medium hover:bg-[var(--color-bg-subtle)] transition-colors"
          >
            Contact Support
          </a>
        </div>
        
        <div className="mt-8 text-sm font-semibold text-[var(--color-text-tertiary)]">
          GURUKUL
        </div>
      </div>
    </div>
  );
}
