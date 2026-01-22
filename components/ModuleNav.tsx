'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { modules } from '@/lib/curriculum';
import { getProgress, isModuleUnlocked, getModuleProgress } from '@/lib/progress';

interface ModuleNavProps {
  className?: string;
}

export default function ModuleNav({ className = '' }: ModuleNavProps) {
  const pathname = usePathname();
  const [currentModuleNum, setCurrentModuleNum] = useState(0);

  useEffect(() => {
    const progress = getProgress();
    setCurrentModuleNum(progress.currentModule);
  }, []);

  return (
    <nav className={`space-y-1 ${className}`}>
      {modules.map((module) => {
        const isActive = pathname?.includes(`/module/${module.id}`);
        const isUnlocked = isModuleUnlocked(module.id);
        const moduleProgress = getModuleProgress(module.id);
        const isCompleted = moduleProgress?.completed;
        const isCurrent = parseInt(module.id) === currentModuleNum;

        return (
          <Link
            key={module.id}
            href={isUnlocked ? `/module/${module.id}` : '#'}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all
              ${isActive
                ? 'bg-foreground text-background'
                : isUnlocked
                  ? 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  : 'text-muted-foreground/50 cursor-not-allowed'
              }
            `}
            onClick={(e) => !isUnlocked && e.preventDefault()}
          >
            {/* Status indicator */}
            <div
              className={`
                w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium
                ${isCompleted
                  ? 'bg-foreground text-background'
                  : isActive
                    ? 'bg-background text-foreground'
                    : isCurrent
                      ? 'bg-foreground text-background'
                      : isUnlocked
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-muted/50 text-muted-foreground/50'
                }
              `}
            >
              {isCompleted ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : !isUnlocked ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              ) : (
                module.id
              )}
            </div>

            {/* Module info */}
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-medium ${!isUnlocked && 'opacity-50'}`}>
                {module.title}
              </div>
              <div className={`text-xs truncate ${isActive ? 'opacity-80' : 'opacity-60'}`}>
                {module.duration}
              </div>
            </div>

            {/* Current indicator */}
            {isCurrent && !isCompleted && (
              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                Current
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

// Horizontal navigation for module pages
export function ModuleBreadcrumb({
  moduleId,
  exerciseId,
  className = '',
}: {
  moduleId: string;
  exerciseId?: string;
  className?: string;
}) {
  const module = modules.find(m => m.id === moduleId);
  const exercise = exerciseId
    ? module?.exercises.find(e => e.id === exerciseId)
    : null;

  return (
    <nav className={`flex items-center gap-2 text-sm ${className}`}>
      <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
        Home
      </Link>
      <svg className="w-4 h-4 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      <Link
        href={`/module/${moduleId}`}
        className={`${exercise ? 'text-muted-foreground hover:text-foreground' : 'text-foreground'} transition-colors`}
      >
        Module {moduleId}: {module?.title}
      </Link>
      {exercise && (
        <>
          <svg className="w-4 h-4 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-foreground">{exercise.title}</span>
        </>
      )}
    </nav>
  );
}

// Next/Previous module navigation
export function ModulePagination({
  moduleId,
  className = '',
}: {
  moduleId: string;
  className?: string;
}) {
  const currentIndex = modules.findIndex(m => m.id === moduleId);
  const prevModule = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const nextModule = currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;
  const isNextUnlocked = nextModule ? isModuleUnlocked(nextModule.id) : false;

  return (
    <div className={`flex justify-between items-center ${className}`}>
      {prevModule ? (
        <Link
          href={`/module/${prevModule.id}`}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <div>
            <div className="text-xs text-muted-foreground/70">Previous</div>
            <div className="text-sm">{prevModule.title}</div>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {nextModule && (
        <Link
          href={isNextUnlocked ? `/module/${nextModule.id}` : '#'}
          className={`flex items-center gap-2 text-right ${
            isNextUnlocked
              ? 'text-muted-foreground hover:text-foreground'
              : 'text-muted-foreground/50 cursor-not-allowed'
          } transition-colors`}
          onClick={(e) => !isNextUnlocked && e.preventDefault()}
        >
          <div>
            <div className="text-xs text-muted-foreground/70">Next</div>
            <div className="text-sm flex items-center gap-1">
              {nextModule.title}
              {!isNextUnlocked && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
            </div>
          </div>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}
