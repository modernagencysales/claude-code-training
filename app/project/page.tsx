'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getProgress, UserProgress } from '@/lib/progress';
import { modules } from '@/lib/curriculum';
import ProjectBrief from '@/components/ProjectBrief';
import ProgressBar from '@/components/ProgressBar';
import ModuleNav from '@/components/ModuleNav';
import AccountSettings from '@/components/AccountSettings';

export default function ProjectPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const completedModules = progress?.modules.filter(m => m.completed).length || 0;
  const totalExercisesCompleted = progress?.modules.reduce(
    (sum, m) => sum + m.exercisesCompleted.length,
    0
  ) || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
              <span className="text-background text-sm font-bold">C</span>
            </div>
            <span className="font-semibold text-foreground">Claude Code Training</span>
          </Link>
          <Link
            href={`/module/${progress?.currentModule || 0}`}
            className="btn btn-primary px-4 py-2"
          >
            Continue Learning
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-8 space-y-6">
            <ProgressBar className="bg-card rounded-xl p-4 border border-border" />
            <ModuleNav />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Project</h1>
          <p className="text-muted-foreground mb-8">
            This is the project you&apos;re building throughout the course. Update it as you learn and progress.
          </p>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-card rounded-xl p-5 border border-border">
              <div className="text-3xl font-bold text-foreground">{completedModules}</div>
              <div className="text-sm text-muted-foreground">Modules Completed</div>
            </div>
            <div className="bg-card rounded-xl p-5 border border-border">
              <div className="text-3xl font-bold text-foreground">{totalExercisesCompleted}</div>
              <div className="text-sm text-muted-foreground">Exercises Completed</div>
            </div>
            <div className="bg-card rounded-xl p-5 border border-border">
              <div className="text-3xl font-bold text-foreground">
                {progress?.projectBrief?.tasks?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Project Tasks</div>
            </div>
          </div>

          {/* Project Brief */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Project Brief</h2>
            <ProjectBrief editable={true} />
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href={`/module/${progress?.currentModule || 0}`}
              className="bg-card rounded-xl p-6 border border-border hover:border-muted-foreground transition-colors group"
            >
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-muted-foreground transition-colors">
                Continue Learning
              </h3>
              <p className="text-sm text-muted-foreground">
                Module {progress?.currentModule || 0}: {modules[progress?.currentModule || 0]?.title}
              </p>
            </Link>

            {progress?.projectBrief?.projectTitle && (
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-2">Next Steps</h3>
                <p className="text-sm text-muted-foreground">
                  {completedModules < 4
                    ? 'Complete modules 1-4 to prepare for building'
                    : completedModules < 7
                    ? 'Build your project using Claude Code'
                    : 'Deploy and document your project'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Task Checklist */}
          {progress?.projectBrief?.tasks && progress.projectBrief.tasks.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">Task Checklist</h2>
              <div className="bg-card rounded-xl border border-border divide-y divide-border">
                {progress.projectBrief.tasks.map((task, index) => (
                  <div
                    key={index}
                    className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-md border-2 border-muted-foreground/50 flex items-center justify-center">
                      {/* TODO: Track task completion */}
                    </div>
                    <span className="text-foreground">{task}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Project Brief */}
          {!progress?.projectBrief?.projectTitle && (
            <div className="bg-muted/50 border border-border rounded-xl p-8 text-center mt-8">
              <h3 className="text-xl font-semibold text-foreground mb-2">No Project Brief Yet</h3>
              <p className="text-muted-foreground mb-4">
                Complete the Orientation module to create your personalized project brief.
              </p>
              <Link
                href="/onboarding"
                className="btn btn-primary px-6 py-2.5 inline-block"
              >
                Start Orientation
              </Link>
            </div>
          )}

          {/* Account Settings */}
          <div className="mt-12">
            <AccountSettings />
          </div>
        </main>
      </div>
    </div>
  );
}
