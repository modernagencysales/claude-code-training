'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Exercise } from '@/lib/curriculum';
import { VirtualFileSystem } from '@/lib/terminal-commands';
import { validateTerminalExercise, ExerciseValidation } from '@/lib/exercises';
import { completeExercise, getModuleProgress } from '@/lib/progress';

interface ExerciseCheckerProps {
  exercise: Exercise;
  moduleId: string;
  filesystem?: VirtualFileSystem;
  onComplete?: () => void;
  className?: string;
}

export default function ExerciseChecker({
  exercise,
  moduleId,
  filesystem,
  onComplete,
  className = '',
}: ExerciseCheckerProps) {
  const [validation, setValidation] = useState<ExerciseValidation | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);

  // Check if exercise was already completed
  useEffect(() => {
    const moduleProgress = getModuleProgress(moduleId);
    if (moduleProgress?.exercisesCompleted.includes(exercise.id)) {
      setIsComplete(true);
      setValidation({
        isComplete: true,
        message: 'Previously completed!',
      });
    }
  }, [moduleId, exercise.id]);

  const checkProgress = () => {
    if (!filesystem || exercise.type !== 'terminal') {
      return;
    }

    const result = validateTerminalExercise(exercise.id, filesystem);
    setValidation(result);

    if (result.isComplete && !isComplete) {
      setIsComplete(true);
      completeExercise(moduleId, exercise.id);
      onComplete?.();
    }
  };

  const markAsComplete = () => {
    if (!isComplete) {
      setIsComplete(true);
      completeExercise(moduleId, exercise.id);
      setValidation({
        isComplete: true,
        message: 'Marked as complete!',
      });
      onComplete?.();
    }
  };

  const showNextHint = () => {
    if (!exercise.hints?.length) return;
    setShowHints(true);
    setCurrentHint(prev => Math.min(prev + 1, exercise.hints!.length - 1));
  };

  return (
    <div className={`bg-card rounded-xl p-5 border border-border ${className}`}>
      {/* Exercise info */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-foreground font-medium">{exercise.title}</h4>
          <p className="text-muted-foreground text-sm">{exercise.description}</p>
        </div>
        {isComplete && (
          <div className="bg-foreground rounded-full p-1.5">
            <svg className="w-4 h-4 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mb-4">
        <h5 className="text-sm font-medium text-muted-foreground mb-2">Instructions:</h5>
        <ol className="text-sm text-muted-foreground space-y-1.5">
          {exercise.instructions.map((instruction, index) => (
            <li key={index} className="flex gap-2">
              <span className="text-muted-foreground/70">{index + 1}.</span>
              <span>{instruction}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Validation status */}
      {validation && (
        <div
          className={`mb-4 p-4 rounded-xl ${
            validation.isComplete
              ? 'bg-muted/50 border border-border'
              : 'bg-muted/30 border border-border'
          }`}
        >
          <div className="flex items-center gap-2">
            {validation.isComplete ? (
              <svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className={validation.isComplete ? 'text-foreground' : 'text-muted-foreground'}>
              {validation.message}
            </span>
          </div>
          {validation.progress !== undefined && !validation.isComplete && (
            <div className="mt-3">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-foreground transition-all"
                  style={{ width: `${validation.progress}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground mt-1.5">{validation.progress}% complete</span>
            </div>
          )}
        </div>
      )}

      {/* Hints section */}
      {exercise.hints && exercise.hints.length > 0 && (
        <div className="mb-4">
          {showHints && currentHint >= 0 ? (
            <div className="bg-muted/50 border border-border rounded-xl p-4">
              <div className="flex items-start gap-2">
                <span className="text-foreground">Hint:</span>
                <div className="flex-1">
                  <p className="text-muted-foreground text-sm">{exercise.hints[currentHint]}</p>
                  {currentHint < exercise.hints.length - 1 && (
                    <button
                      onClick={showNextHint}
                      className="text-muted-foreground text-xs mt-2 hover:text-foreground transition-colors"
                    >
                      Show another hint ({currentHint + 1}/{exercise.hints.length})
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={showNextHint}
              className="text-muted-foreground text-sm hover:text-foreground flex items-center gap-1.5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Need a hint?
            </button>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        {exercise.type === 'terminal' && (
          <button
            onClick={checkProgress}
            disabled={isComplete}
            className="flex-1 btn btn-outline py-2.5 px-4 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Check Progress
          </button>
        )}

        {(exercise.type === 'project' || exercise.type === 'chat' || exercise.type === 'quiz') && (
          <button
            onClick={markAsComplete}
            disabled={isComplete}
            className="flex-1 btn btn-primary py-2.5 px-4 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {isComplete ? 'Completed' : 'Mark as Complete'}
          </button>
        )}
      </div>
    </div>
  );
}

// Simple checkbox version for quick exercises - now links to exercise page
export function ExerciseCheckbox({
  exercise,
  moduleId,
  onChange,
  className = '',
}: {
  exercise: Exercise;
  moduleId: string;
  onChange?: (completed: boolean) => void;
  className?: string;
}) {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const moduleProgress = getModuleProgress(moduleId);
    if (moduleProgress?.exercisesCompleted.includes(exercise.id)) {
      setIsComplete(true);
    }
  }, [moduleId, exercise.id]);

  // Check if this exercise has enhanced content
  const hasEnhancedContent = !!(exercise.mentalModel || exercise.walkthrough || exercise.troubleshooting);

  return (
    <Link
      href={`/module/${moduleId}/exercise/${exercise.id}`}
      className={`flex items-center gap-3 p-4 rounded-xl transition-colors w-full text-left group ${
        isComplete
          ? 'bg-muted/50 border border-border'
          : 'bg-card hover:bg-muted/30 border border-border'
      } ${className}`}
    >
      <div
        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
          isComplete
            ? 'border-foreground bg-foreground'
            : 'border-muted-foreground/50'
        }`}
      >
        {isComplete && (
          <svg className="w-4 h-4 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${isComplete ? 'text-foreground' : 'text-foreground'}`}>
            {exercise.title}
          </span>
          {hasEnhancedContent && (
            <span className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
              Interactive
            </span>
          )}
        </div>
        <div className="text-sm text-muted-foreground truncate">{exercise.description}</div>
      </div>
      <svg
        className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
