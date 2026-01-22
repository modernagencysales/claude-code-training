'use client';

import { useState } from 'react';
import { Scaffolding, WalkthroughStep } from '@/lib/curriculum';

interface PracticeModeProps {
  practice: Scaffolding;
  className?: string;
}

type Mode = 'guided' | 'supported' | 'independent';

export default function PracticeMode({
  practice,
  className = '',
}: PracticeModeProps) {
  const [mode, setMode] = useState<Mode>('guided');
  const [currentGuidedStep, setCurrentGuidedStep] = useState(0);
  const [showHints, setShowHints] = useState<number[]>([]);
  const [showSolution, setShowSolution] = useState(false);
  const [independentChecks, setIndependentChecks] = useState<Record<number, boolean>>({});

  const modes: { id: Mode; label: string; description: string }[] = [
    { id: 'guided', label: 'Guided', description: 'Step-by-step instructions' },
    { id: 'supported', label: 'Supported', description: 'Hints available' },
    { id: 'independent', label: 'Independent', description: 'On your own' },
  ];

  const revealHint = (index: number) => {
    if (!showHints.includes(index)) {
      setShowHints([...showHints, index]);
    }
  };

  const toggleIndependentCheck = (index: number) => {
    setIndependentChecks(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className={`bg-card rounded-xl border border-border overflow-hidden ${className}`}>
      {/* Header with mode selector */}
      <div className="bg-muted px-6 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground mb-3">Practice</h3>
        <div className="flex gap-2">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === m.id
                  ? 'bg-foreground text-background'
                  : 'bg-background text-muted-foreground hover:text-foreground'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {modes.find(m => m.id === mode)?.description}
        </p>
      </div>

      {/* Guided Mode */}
      {mode === 'guided' && practice.guided && (
        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-4">
              {practice.guided.steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentGuidedStep(index)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    index < currentGuidedStep
                      ? 'bg-foreground text-background'
                      : index === currentGuidedStep
                      ? 'bg-foreground/80 text-background'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index < currentGuidedStep ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </button>
              ))}
            </div>
          </div>

          <GuidedStep step={practice.guided.steps[currentGuidedStep]} />

          <div className="flex justify-between mt-6 pt-4 border-t border-border">
            <button
              onClick={() => setCurrentGuidedStep(prev => Math.max(0, prev - 1))}
              disabled={currentGuidedStep === 0}
              className="text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>
            {currentGuidedStep < practice.guided.steps.length - 1 ? (
              <button
                onClick={() => setCurrentGuidedStep(prev => prev + 1)}
                className="btn btn-primary px-4 py-2 text-sm"
              >
                Next Step →
              </button>
            ) : (
              <button
                onClick={() => setMode('supported')}
                className="btn btn-primary px-4 py-2 text-sm"
              >
                Try Supported Mode →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Supported Mode */}
      {mode === 'supported' && practice.supported && (
        <div className="p-6">
          <div className="bg-muted/50 rounded-lg px-4 py-3 mb-6">
            <h4 className="font-medium text-foreground mb-1">Your Task</h4>
            <p className="text-muted-foreground">{practice.supported.task}</p>
          </div>

          <div className="space-y-2 mb-6">
            <h4 className="text-sm font-medium text-foreground">Hints (click to reveal)</h4>
            {practice.supported.hints.map((hint, index) => (
              <button
                key={index}
                onClick={() => revealHint(index)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                  showHints.includes(index)
                    ? 'bg-muted/50 border-border'
                    : 'bg-muted/30 border-transparent hover:border-border cursor-pointer'
                }`}
              >
                {showHints.includes(index) ? (
                  <p className="text-sm text-foreground">{hint}</p>
                ) : (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="w-5 h-5 bg-muted rounded-full flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                    Click to reveal hint {index + 1}
                  </p>
                )}
              </button>
            ))}
          </div>

          <div>
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {showSolution ? 'Hide solution' : 'Show solution'}
            </button>
            {showSolution && (
              <div className="mt-3 bg-[#1a1b26] rounded-lg px-4 py-3 font-mono text-sm text-[#a9b1d6]">
                {practice.supported.solution}
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t border-border">
            <button
              onClick={() => setMode('independent')}
              className="btn btn-primary px-4 py-2 text-sm"
            >
              Try Independent Mode →
            </button>
          </div>
        </div>
      )}

      {/* Independent Mode */}
      {mode === 'independent' && practice.independent && (
        <div className="p-6">
          <div className="bg-muted/50 rounded-lg px-4 py-3 mb-6">
            <h4 className="font-medium text-foreground mb-1">Challenge</h4>
            <p className="text-muted-foreground">{practice.independent.challenge}</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Success Criteria</h4>
            {practice.independent.successCriteria.map((criteria, index) => (
              <label
                key={index}
                className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={independentChecks[index] || false}
                  onChange={() => toggleIndependentCheck(index)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${
                    independentChecks[index]
                      ? 'bg-foreground border-foreground'
                      : 'border-muted-foreground/50 group-hover:border-muted-foreground'
                  }`}
                >
                  {independentChecks[index] && (
                    <svg className="w-3 h-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm ${
                  independentChecks[index] ? 'text-muted-foreground line-through' : 'text-foreground'
                }`}>
                  {criteria}
                </span>
              </label>
            ))}
          </div>

          {Object.values(independentChecks).filter(Boolean).length === practice.independent.successCriteria.length && (
            <div className="mt-6 bg-muted/50 rounded-lg px-4 py-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Challenge Complete!</p>
                <p className="text-sm text-muted-foreground">You did it without step-by-step guidance.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Individual guided step display
function GuidedStep({ step }: { step: WalkthroughStep }) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm text-muted-foreground uppercase tracking-wider font-medium mb-2">
          Instruction
        </h4>
        <p className="text-foreground font-medium">{step.instruction}</p>
      </div>

      <div className="bg-muted/30 rounded-lg px-4 py-3 border-l-2 border-foreground/30">
        <p className="text-sm text-muted-foreground">
          <span className="text-foreground font-medium">Why: </span>
          {step.why}
        </p>
      </div>

      <div>
        <h4 className="text-sm text-muted-foreground uppercase tracking-wider font-medium mb-2">
          Expected Output
        </h4>
        <div className="bg-[#1a1b26] rounded-lg px-4 py-3 font-mono text-sm text-[#a9b1d6]">
          {step.expectedOutput}
        </div>
      </div>

      {step.variations && step.variations.length > 0 && (
        <details className="text-sm">
          <summary className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
            See output variations
          </summary>
          <div className="mt-2 space-y-2 pl-4">
            {step.variations.map((v, i) => (
              <div key={i} className="bg-muted/30 rounded px-3 py-2">
                <span className="text-muted-foreground">{v.scenario}: </span>
                <code className="text-foreground">{v.output}</code>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
