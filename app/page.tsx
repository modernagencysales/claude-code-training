'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getProgress, UserProgress, getEmail, hasEmail } from '@/lib/progress';
import { modules } from '@/lib/curriculum';
import { ProgressOverview } from '@/components/ProgressBar';
import { ProjectBriefCompact } from '@/components/ProjectBrief';
import EmailGate from '@/components/EmailGate';
import { ResetProgressButton } from '@/components/AccountSettings';

export default function HomePage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setProgress(getProgress());
    setUserEmail(getEmail());
    setIsLoaded(true);
  }, []);

  const hasStarted = !!(progress && progress.currentModule > 0);
  const currentModule = modules[progress?.currentModule || 0];

  // Show email gate for new users
  if (isLoaded && !userEmail) {
    return <EmailGate onEmailSubmit={(email) => setUserEmail(email)}><div /></EmailGate>;
  }

  return <HomeContent progress={progress} hasStarted={hasStarted} currentModule={currentModule} userEmail={userEmail} />;
}

function HomeContent({ progress, hasStarted, currentModule, userEmail }: {
  progress: UserProgress | null;
  hasStarted: boolean;
  currentModule: typeof modules[0] | undefined;
  userEmail: string | null;
}) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 gradient-subtle opacity-50" />

        <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-foreground rounded-lg flex items-center justify-center">
              <span className="text-background font-bold text-sm">CC</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">Claude Code Training</span>
          </div>
          <div className="flex items-center gap-4">
            {userEmail && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground hidden sm:inline">{userEmail}</span>
                <ResetProgressButton />
              </div>
            )}
            {hasStarted && (
              <Link
                href={`/module/${progress?.currentModule || 0}`}
                className="btn btn-primary px-5 py-2.5 text-sm"
              >
                Continue Learning
              </Link>
            )}
          </div>
        </nav>

        <div className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full text-sm text-muted-foreground mb-6">
            <span className="w-2 h-2 bg-foreground rounded-full animate-pulse-subtle" />
            Interactive Learning Platform
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-[1.1]">
            Learn to Build with
            <br />
            <span className="text-muted-foreground">Claude Code</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
            An interactive training platform that teaches you to use AI-powered coding
            by building something actually useful for your business.
          </p>

          <div className="flex items-center justify-center gap-4">
            {hasStarted ? (
              <>
                <Link
                  href={`/module/${progress?.currentModule || 0}`}
                  className="btn btn-primary px-8 py-3.5 text-base"
                >
                  Continue: {currentModule?.title}
                </Link>
                <Link
                  href="/project"
                  className="btn btn-outline px-6 py-3.5"
                >
                  View Project
                </Link>
              </>
            ) : (
              <Link
                href="/onboarding"
                className="btn btn-primary px-10 py-4 text-lg"
              >
                Start Your Journey
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* What You'll Learn Section */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 tracking-tight">What You&apos;ll Learn</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Master the skills you need to build real tools with AI assistance
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card rounded-2xl p-8 border border-border card-hover">
            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Terminal Mastery</h3>
            <p className="text-muted-foreground leading-relaxed">
              Get comfortable with the command line through hands-on practice in a safe,
              simulated environment.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 border border-border card-hover">
            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">The Art of Prompting</h3>
            <p className="text-muted-foreground leading-relaxed">
              Learn to write prompts that get results. Understand why AI fails and how
              to scope your requests effectively.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 border border-border card-hover">
            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Agent Teams</h3>
            <p className="text-muted-foreground leading-relaxed">
              Run multiple Claude Code agents in parallel. Use divide-and-conquer
              workflows to build features 3x faster.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 border border-border card-hover">
            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Real Project</h3>
            <p className="text-muted-foreground leading-relaxed">
              Don&apos;t just learn theory - build something real. Deploy a working
              tool that actually helps your business.
            </p>
          </div>
        </div>
      </section>

      {/* Curriculum Overview */}
      <section className="border-y border-border bg-muted/30 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">The Curriculum</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              11 modules that take you from zero to deploying your own tool.
              Each module builds on the last.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {modules.map((module, index) => (
              <div
                key={module.id}
                className="bg-background rounded-xl p-5 border border-border flex items-start gap-4 card-hover"
              >
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center font-medium text-sm shrink-0
                  ${index === 0 ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}
                `}>
                  {module.id}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground">{module.title}</h3>
                  <p className="text-sm text-muted-foreground">{module.subtitle}</p>
                  <p className="text-xs text-muted-foreground/70 mt-1.5">{module.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Progress Section (if started) */}
      {hasStarted && (
        <section className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Your Progress</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <ProgressOverview />
            <div className="space-y-4">
              <ProjectBriefCompact />
              <Link
                href="/project"
                className="block text-center text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                View full project brief &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold mb-4 tracking-tight">Ready to Build?</h2>
        <p className="text-muted-foreground mb-10">
          Start your journey today. No coding experience required.
        </p>
        <Link
          href={hasStarted ? `/module/${progress?.currentModule || 0}` : '/onboarding'}
          className="btn btn-primary px-10 py-4 text-lg"
        >
          {hasStarted ? 'Continue Learning' : 'Get Started Free'}
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="max-w-6xl mx-auto px-6 text-center text-muted-foreground text-sm">
          <p>Built to teach you how to build with Claude Code</p>
        </div>
      </footer>
    </div>
  );
}
