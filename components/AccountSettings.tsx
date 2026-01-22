'use client';

import { useState } from 'react';
import { resetProgress, getEmail } from '@/lib/progress';
import { useRouter } from 'next/navigation';

interface AccountSettingsProps {
  className?: string;
}

export default function AccountSettings({ className = '' }: AccountSettingsProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const router = useRouter();
  const email = getEmail();

  const handleReset = () => {
    setIsResetting(true);
    resetProgress();
    // Small delay to show the action, then redirect
    setTimeout(() => {
      router.push('/');
      router.refresh();
      // Force a full page reload to clear all state
      window.location.href = '/';
    }, 500);
  };

  return (
    <div className={`bg-card rounded-xl border border-border p-6 ${className}`}>
      <h3 className="font-semibold text-foreground mb-4">Account Settings</h3>

      {email && (
        <div className="mb-6">
          <label className="text-sm text-muted-foreground">Signed in as</label>
          <p className="text-foreground">{email}</p>
        </div>
      )}

      <div className="border-t border-border pt-4">
        <h4 className="text-sm font-medium text-foreground mb-2">Reset Progress</h4>
        <p className="text-sm text-muted-foreground mb-4">
          This will clear all your progress, project brief, and start fresh. This cannot be undone.
        </p>

        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="text-destructive hover:text-destructive/80 text-sm font-medium transition-colors"
          >
            Reset all progress
          </button>
        ) : (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
            <p className="text-sm text-foreground mb-3">
              Are you sure? This will delete:
            </p>
            <ul className="text-sm text-muted-foreground mb-4 space-y-1">
              <li>• All module progress</li>
              <li>• Your project brief</li>
              <li>• Your email</li>
              <li>• API key (if saved)</li>
            </ul>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                disabled={isResetting}
                className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-destructive/90 disabled:opacity-50"
              >
                {isResetting ? 'Resetting...' : 'Yes, reset everything'}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isResetting}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Compact reset button for header/nav
export function ResetProgressButton() {
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleReset = () => {
    resetProgress();
    window.location.href = '/';
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Reset all?</span>
        <button
          onClick={handleReset}
          className="text-xs text-destructive hover:text-destructive/80"
        >
          Yes
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      Reset progress
    </button>
  );
}
