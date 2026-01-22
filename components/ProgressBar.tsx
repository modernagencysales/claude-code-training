'use client';

import { useEffect, useState } from 'react';
import { getProgress, UserProgress } from '@/lib/progress';
import { modules } from '@/lib/curriculum';

interface ProgressBarProps {
  moduleId?: string;
  className?: string;
}

export default function ProgressBar({ moduleId, className = '' }: ProgressBarProps) {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  if (!progress) return null;

  // Calculate overall progress
  const totalModules = modules.length;
  const completedModules = progress.modules.filter(m => m.completed).length;
  const overallPercentage = Math.round((completedModules / totalModules) * 100);

  // If moduleId provided, calculate module-specific progress
  let moduleProgress = 0;
  let moduleLabel = '';

  if (moduleId) {
    const module = modules.find(m => m.id === moduleId);
    const userModuleProgress = progress.modules.find(m => m.moduleId === moduleId);

    if (module && userModuleProgress) {
      const totalExercises = module.exercises.length;
      const completedExercises = userModuleProgress.exercisesCompleted.length;
      moduleProgress = Math.round((completedExercises / totalExercises) * 100);
      moduleLabel = `${completedExercises}/${totalExercises} exercises`;
    }
  }

  return (
    <div className={`${className}`}>
      {moduleId ? (
        // Module-specific progress
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-sm text-muted-foreground">Module Progress</span>
            <span className="text-sm text-muted-foreground">{moduleLabel}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-foreground transition-all duration-500"
              style={{ width: `${moduleProgress}%` }}
            />
          </div>
        </div>
      ) : (
        // Overall course progress
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-sm text-muted-foreground">Course Progress</span>
            <span className="text-sm text-muted-foreground">{completedModules}/{totalModules} modules</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-foreground transition-all duration-500"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Detailed progress overview for the dashboard
export function ProgressOverview({ className = '' }: { className?: string }) {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  if (!progress) return null;

  return (
    <div className={`bg-card rounded-xl p-6 border border-border ${className}`}>
      <h3 className="text-lg font-semibold text-foreground mb-5">Your Progress</h3>

      <div className="space-y-3">
        {modules.map((module, index) => {
          const moduleProgress = progress.modules.find(m => m.moduleId === module.id);
          const isCompleted = moduleProgress?.completed;
          const isCurrent = progress.currentModule === index;
          const isLocked = index > progress.currentModule;
          const completedExercises = moduleProgress?.exercisesCompleted.length || 0;
          const totalExercises = module.exercises.length;

          return (
            <div
              key={module.id}
              className={`flex items-center gap-4 p-3.5 rounded-xl transition-colors ${
                isCompleted
                  ? 'bg-muted/50 border border-border'
                  : isCurrent
                  ? 'bg-muted border border-border'
                  : isLocked
                  ? 'bg-muted/30 opacity-50'
                  : 'bg-muted/30'
              }`}
            >
              {/* Status icon */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isCompleted
                    ? 'bg-foreground text-background'
                    : isCurrent
                    ? 'bg-foreground text-background'
                    : 'bg-muted-foreground/20 text-muted-foreground'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : isLocked ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ) : (
                  <span className="text-sm font-medium">{index}</span>
                )}
              </div>

              {/* Module info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${isLocked ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {module.title}
                  </span>
                  {isCurrent && (
                    <span className="text-xs bg-foreground text-background px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {module.subtitle}
                </div>
              </div>

              {/* Exercise count */}
              {!isLocked && (
                <div className="text-sm text-muted-foreground">
                  {completedExercises}/{totalExercises}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
