'use client';

import { useState } from 'react';
import { TroubleshootingGuide } from '@/lib/curriculum';

interface TroubleshootingPanelProps {
  issues: TroubleshootingGuide[];
  className?: string;
}

export default function TroubleshootingPanel({
  issues,
  className = '',
}: TroubleshootingPanelProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIssues = searchTerm
    ? issues.filter(
        issue =>
          issue.symptom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.meaning.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : issues;

  const toggleExpand = (index: number) => {
    setExpandedIndex(prev => (prev === index ? null : index));
  };

  if (issues.length === 0) {
    return null;
  }

  return (
    <div className={`bg-card rounded-xl border border-border overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-muted px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-destructive/20 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Troubleshooting</h3>
            <p className="text-sm text-muted-foreground">Common issues and how to fix them</p>
          </div>
        </div>
      </div>

      {/* Search */}
      {issues.length > 2 && (
        <div className="px-6 py-3 border-b border-border">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search issues..."
              className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      )}

      {/* Issues list */}
      <div className="divide-y divide-border">
        {filteredIssues.map((issue, index) => (
          <div key={index} className="overflow-hidden">
            {/* Issue header (clickable) */}
            <button
              onClick={() => toggleExpand(index)}
              className="w-full px-6 py-4 flex items-start gap-4 text-left hover:bg-muted/30 transition-colors"
            >
              <div className="mt-0.5">
                <svg
                  className={`w-4 h-4 text-muted-foreground transition-transform ${
                    expandedIndex === index ? 'rotate-90' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="flex-1">
                <code className="text-sm text-destructive font-mono bg-destructive/10 px-2 py-0.5 rounded">
                  {issue.symptom}
                </code>
                <p className="text-sm text-muted-foreground mt-2">{issue.meaning}</p>
              </div>
            </button>

            {/* Expanded content */}
            {expandedIndex === index && (
              <div className="px-6 pb-6 pt-2 ml-8 space-y-4 animate-fade-in">
                {/* Reassurance */}
                <div className="flex items-start gap-3 bg-muted/30 rounded-lg px-4 py-3">
                  <svg className="w-5 h-5 text-foreground shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Don&apos;t worry: </span>
                    {issue.reassurance}
                  </p>
                </div>

                {/* Solution */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Solution
                  </h4>
                  <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-3">
                    {issue.solution}
                  </p>
                </div>

                {/* Verification */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Verify it&apos;s fixed
                  </h4>
                  <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-3">
                    {issue.verification}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredIssues.length === 0 && searchTerm && (
          <div className="px-6 py-8 text-center">
            <p className="text-muted-foreground">No issues match &quot;{searchTerm}&quot;</p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-sm text-foreground hover:underline mt-2"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* Footer help */}
      <div className="px-6 py-4 bg-muted/30 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Still stuck? Ask in the chat or check the hints section above.
        </p>
      </div>
    </div>
  );
}

// Inline troubleshooting hint (for showing in terminal output)
export function TroubleshootingHint({ issue }: { issue: TroubleshootingGuide }) {
  return (
    <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 text-sm">
      <p className="text-destructive font-medium mb-1">{issue.symptom}</p>
      <p className="text-muted-foreground mb-2">{issue.meaning}</p>
      <p className="text-foreground">
        <span className="font-medium">Fix: </span>
        {issue.solution}
      </p>
    </div>
  );
}
