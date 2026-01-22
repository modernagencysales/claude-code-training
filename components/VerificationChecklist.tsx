'use client';

import { useState } from 'react';
import { VerificationProtocol } from '@/lib/curriculum';

interface VerificationChecklistProps {
  protocol: VerificationProtocol;
  onComplete?: () => void;
  className?: string;
}

export default function VerificationChecklist({
  protocol,
  onComplete,
  className = '',
}: VerificationChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [showFalsePositives, setShowFalsePositives] = useState(false);

  const allChecked = protocol.checkpoints.every((_, index) => checkedItems[index]);

  const toggleCheck = (index: number) => {
    const newChecked = {
      ...checkedItems,
      [index]: !checkedItems[index],
    };
    setCheckedItems(newChecked);

    // Check if all items are now checked
    if (protocol.checkpoints.every((_, i) => newChecked[i])) {
      onComplete?.();
    }
  };

  return (
    <div className={`bg-card rounded-xl border border-border overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-muted px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              allChecked ? 'bg-foreground' : 'bg-muted'
            }`}>
              {allChecked ? (
                <svg className="w-4 h-4 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Verification Checklist</h3>
              <p className="text-sm text-muted-foreground">
                {Object.values(checkedItems).filter(Boolean).length} of {protocol.checkpoints.length} complete
              </p>
            </div>
          </div>
          {allChecked && (
            <span className="text-sm text-foreground flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              All verified!
            </span>
          )}
        </div>
      </div>

      {/* Checkpoints */}
      <div className="divide-y divide-border">
        {protocol.checkpoints.map((checkpoint, index) => (
          <div key={index} className="px-6 py-4">
            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="mt-0.5">
                <input
                  type="checkbox"
                  checked={checkedItems[index] || false}
                  onChange={() => toggleCheck(index)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    checkedItems[index]
                      ? 'bg-foreground border-foreground'
                      : 'border-muted-foreground/50 group-hover:border-muted-foreground'
                  }`}
                >
                  {checkedItems[index] && (
                    <svg className="w-3 h-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <p className={`font-medium transition-colors ${
                  checkedItems[index] ? 'text-muted-foreground line-through' : 'text-foreground'
                }`}>
                  {checkpoint.description}
                </p>

                {checkpoint.command && (
                  <div className="mt-2 bg-[#1a1b26] rounded-lg px-3 py-2 font-mono text-sm text-[#a9b1d6] inline-block">
                    $ {checkpoint.command}
                  </div>
                )}

                <div className="mt-2 text-sm">
                  <p className="text-muted-foreground">
                    <span className="text-foreground/80">Expected: </span>
                    {checkpoint.expectedResult}
                  </p>
                  {checkpoint.ifDifferent && (
                    <p className="text-muted-foreground mt-1">
                      <span className="text-foreground/80">If different: </span>
                      {checkpoint.ifDifferent}
                    </p>
                  )}
                </div>
              </div>
            </label>
          </div>
        ))}
      </div>

      {/* False positives section */}
      {protocol.falsePositives && protocol.falsePositives.length > 0 && (
        <div className="border-t border-border">
          <button
            onClick={() => setShowFalsePositives(!showFalsePositives)}
            className="w-full px-6 py-3 flex items-center justify-between text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Things that look wrong but aren&apos;t
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${showFalsePositives ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showFalsePositives && (
            <div className="px-6 pb-4 space-y-3 animate-fade-in">
              {protocol.falsePositives.map((fp, index) => (
                <div key={index} className="bg-muted/30 rounded-lg px-4 py-3">
                  <p className="text-sm text-foreground font-medium mb-1">
                    &quot;{fp.appearance}&quot;
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {fp.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Progress message */}
      {allChecked && (
        <div className="px-6 py-4 bg-muted/50 border-t border-border">
          <p className="text-sm text-foreground flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            You&apos;ve verified everything works correctly!
          </p>
        </div>
      )}
    </div>
  );
}

// Compact inline verification
export function VerificationInline({
  checkpoints,
}: {
  checkpoints: { description: string; command?: string; expectedResult: string }[];
}) {
  return (
    <div className="space-y-2 text-sm">
      {checkpoints.map((cp, index) => (
        <div key={index} className="flex items-start gap-2">
          <span className="text-muted-foreground">•</span>
          <div>
            <span className="text-foreground">{cp.description}</span>
            {cp.command && (
              <code className="ml-2 text-muted-foreground">({cp.command})</code>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
