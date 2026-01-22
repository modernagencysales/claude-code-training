'use client';

import { useState } from 'react';
import { MentalModel } from '@/lib/curriculum';

interface MentalModelCardProps {
  model: MentalModel;
  className?: string;
}

export default function MentalModelCard({
  model,
  className = '',
}: MentalModelCardProps) {
  const [showConcepts, setShowConcepts] = useState(false);
  const [showMisconceptions, setShowMisconceptions] = useState(false);

  return (
    <div className={`bg-card rounded-xl border border-border overflow-hidden ${className}`}>
      {/* Core insight - always visible */}
      <div className="px-6 py-5 bg-gradient-to-br from-muted/50 to-muted/30">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
              The Key Insight
            </h3>
            <p className="text-lg text-foreground font-medium leading-relaxed">
              {model.coreInsight}
            </p>
          </div>
        </div>
      </div>

      {/* Analogy */}
      <div className="px-6 py-5 border-t border-border">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🎯</span>
          <div>
            <h4 className="text-sm font-medium text-foreground mb-1">Think of it this way</h4>
            <p className="text-muted-foreground leading-relaxed">
              {model.analogy}
            </p>
          </div>
        </div>
      </div>

      {/* Expandable: Key concepts */}
      {model.conceptsExplained && model.conceptsExplained.length > 0 && (
        <div className="border-t border-border">
          <button
            onClick={() => setShowConcepts(!showConcepts)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
          >
            <span className="flex items-center gap-3">
              <span className="text-xl">📚</span>
              <span className="text-sm font-medium text-foreground">
                Key Terms Explained ({model.conceptsExplained.length})
              </span>
            </span>
            <svg
              className={`w-4 h-4 text-muted-foreground transition-transform ${showConcepts ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showConcepts && (
            <div className="px-6 pb-5 space-y-4 animate-fade-in">
              {model.conceptsExplained.map((concept, index) => (
                <div key={index} className="bg-muted/30 rounded-lg px-4 py-3">
                  <div className="flex items-baseline gap-2 mb-1">
                    <code className="text-foreground font-mono font-medium">{concept.term}</code>
                    <span className="text-muted-foreground">—</span>
                    <span className="text-muted-foreground">{concept.meaning}</span>
                  </div>
                  <p className="text-sm text-muted-foreground/80 mt-1">
                    <span className="text-muted-foreground">Example:</span> {concept.example}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Expandable: Common misconceptions */}
      {model.commonMisconceptions && model.commonMisconceptions.length > 0 && (
        <div className="border-t border-border">
          <button
            onClick={() => setShowMisconceptions(!showMisconceptions)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
          >
            <span className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <span className="text-sm font-medium text-foreground">
                Common Misconceptions
              </span>
            </span>
            <svg
              className={`w-4 h-4 text-muted-foreground transition-transform ${showMisconceptions ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showMisconceptions && (
            <div className="px-6 pb-5 space-y-3 animate-fade-in">
              {model.commonMisconceptions.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <div className="shrink-0 mt-1">
                    <div className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground line-through decoration-destructive/50">
                      {item.misconception}
                    </p>
                    <p className="text-sm text-foreground mt-1">
                      <span className="text-foreground/70">Actually: </span>
                      {item.reality}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Compact version for sidebar/summary
export function MentalModelCompact({ model }: { model: MentalModel }) {
  return (
    <div className="bg-muted/50 rounded-lg px-4 py-3 border-l-2 border-foreground/30">
      <p className="text-sm text-foreground font-medium mb-1">Key Insight</p>
      <p className="text-sm text-muted-foreground">{model.coreInsight}</p>
    </div>
  );
}
