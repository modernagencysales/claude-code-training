'use client';

import { useState } from 'react';
import { WalkthroughStep } from '@/lib/curriculum';

interface ExerciseWalkthroughProps {
  overview: string;
  steps: WalkthroughStep[];
  className?: string;
}

export default function ExerciseWalkthrough({
  overview,
  steps,
  className = '',
}: ExerciseWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showVariations, setShowVariations] = useState<Record<number, boolean>>({});

  const toggleVariations = (index: number) => {
    setShowVariations(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className={`bg-card rounded-xl border border-border overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-muted px-6 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Step-by-Step Walkthrough</h3>
        <p className="text-sm text-muted-foreground mt-1">{overview}</p>
      </div>

      {/* Progress bar */}
      <div className="px-6 py-3 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`flex-1 h-2 rounded-full transition-colors ${
                index < currentStep
                  ? 'bg-foreground'
                  : index === currentStep
                  ? 'bg-foreground/60'
                  : 'bg-border'
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>

      {/* Current step */}
      <div className="p-6">
        <div className="mb-6">
          {/* Step instruction */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center text-background font-medium text-sm shrink-0">
              {currentStep + 1}
            </div>
            <div className="flex-1">
              <p className="text-foreground font-medium leading-relaxed">
                {steps[currentStep].instruction}
              </p>
            </div>
          </div>

          {/* Why we're doing this */}
          <div className="ml-12 mb-4">
            <div className="bg-muted/50 rounded-lg px-4 py-3 border-l-2 border-foreground/30">
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-medium">Why: </span>
                {steps[currentStep].why}
              </p>
            </div>
          </div>

          {/* Expected output */}
          <div className="ml-12">
            <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Expected output
            </label>
            <div className="bg-[#1a1b26] rounded-lg px-4 py-3 mt-1.5 font-mono text-sm text-[#a9b1d6]">
              {steps[currentStep].expectedOutput}
            </div>
          </div>

          {/* Variations */}
          {steps[currentStep].variations && steps[currentStep].variations.length > 0 && (
            <div className="ml-12 mt-4">
              <button
                onClick={() => toggleVariations(currentStep)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${showVariations[currentStep] ? 'rotate-90' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                See output variations
              </button>

              {showVariations[currentStep] && (
                <div className="mt-3 space-y-2">
                  {steps[currentStep].variations!.map((variation, vIndex) => (
                    <div key={vIndex} className="bg-muted/30 rounded-lg px-4 py-3">
                      <p className="text-xs text-muted-foreground mb-1">{variation.scenario}</p>
                      <code className="text-sm text-foreground font-mono">{variation.output}</code>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4 border-t border-border">
          <button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="btn btn-primary px-4 py-2 text-sm flex items-center gap-1"
            >
              Next Step
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-foreground">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Walkthrough complete!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Compact version for quick reference
export function WalkthroughQuickRef({ steps }: { steps: WalkthroughStep[] }) {
  return (
    <div className="space-y-2">
      {steps.map((step, index) => (
        <div key={index} className="flex items-start gap-3 text-sm">
          <span className="w-5 h-5 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground shrink-0">
            {index + 1}
          </span>
          <div>
            <code className="text-foreground">{step.instruction}</code>
            <span className="text-muted-foreground ml-2">→ {step.expectedOutput}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
