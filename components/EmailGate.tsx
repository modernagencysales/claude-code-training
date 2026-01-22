'use client';

import { useState, useEffect } from 'react';
import { getEmail, setEmail, hasEmail } from '@/lib/progress';

interface EmailGateProps {
  children: React.ReactNode;
  onEmailSubmit?: (email: string) => void;
}

export default function EmailGate({ children, onEmailSubmit }: EmailGateProps) {
  const [email, setEmailValue] = useState('');
  const [hasStoredEmail, setHasStoredEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if email already exists
    const storedEmail = getEmail();
    if (storedEmail) {
      setHasStoredEmail(true);
    }
    setIsLoading(false);
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setEmail(email);
    setHasStoredEmail(true);
    onEmailSubmit?.(email);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (hasStoredEmail) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-foreground rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-background font-bold text-2xl">CC</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-3">
            Welcome to Claude Code Training
          </h1>
          <p className="text-muted-foreground">
            Enter your email to save your progress. We&apos;ll remember where you left off.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmailValue(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-muted text-foreground rounded-xl px-4 py-3.5 text-base border border-border focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              autoFocus
            />
            {error && (
              <p className="text-destructive text-sm mt-2">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full btn btn-primary py-3.5 text-base font-medium"
          >
            Start Learning
          </button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-6">
          We&apos;ll occasionally send helpful tips and updates about Claude Code.
        </p>
      </div>
    </div>
  );
}

// Compact email prompt for inline use
export function EmailPrompt({ onSubmit }: { onSubmit: (email: string) => void }) {
  const [email, setEmailValue] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }
    setEmail(email);
    onSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => { setEmailValue(e.target.value); setError(''); }}
        placeholder="Enter your email to save progress"
        className="flex-1 bg-muted text-foreground rounded-lg px-4 py-2.5 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <button type="submit" className="btn btn-primary px-4 py-2.5 text-sm">
        Save
      </button>
      {error && <span className="text-destructive text-xs self-center">{error}</span>}
    </form>
  );
}
