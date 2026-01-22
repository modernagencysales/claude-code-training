'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ScopingChat from '@/components/ScopingChat';
import { saveProjectBrief, completeModule, ProjectBrief } from '@/lib/progress';

type OnboardingStep = 'intro' | 'brainstorm' | 'chat' | 'complete';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>('intro');
  const [ideas, setIdeas] = useState<string[]>(['', '', '']);
  const [projectBrief, setProjectBrief] = useState<Partial<ProjectBrief> | null>(null);

  const updateIdea = (index: number, value: string) => {
    const newIdeas = [...ideas];
    newIdeas[index] = value;
    setIdeas(newIdeas);
  };

  const canProceedToBrainstorm = ideas.filter(i => i.trim()).length >= 1;

  const handleProjectBriefGenerated = (brief: Partial<ProjectBrief>) => {
    setProjectBrief(brief);
    if (brief.projectTitle && brief.tasks && brief.tasks.length > 0) {
      setStep('complete');
    }
  };

  const handleComplete = () => {
    if (projectBrief) {
      saveProjectBrief(projectBrief);
    }
    completeModule('0');
    router.push('/module/1');
  };

  const steps = ['intro', 'brainstorm', 'chat', 'complete'];
  const currentStepIndex = steps.indexOf(step);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
              <span className="text-background font-bold text-xs">CC</span>
            </div>
            <span className="font-semibold">Claude Code Training</span>
          </Link>
          <div className="text-sm text-muted-foreground">
            Module 0: Orientation
          </div>
        </div>
      </header>

      {/* Progress indicator - clickable for testing */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center">
              <button
                onClick={() => setStep(s as OnboardingStep)}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors cursor-pointer hover:ring-2 hover:ring-ring ${
                  step === s
                    ? 'bg-foreground text-background'
                    : i < currentStepIndex
                    ? 'bg-foreground text-background'
                    : 'bg-muted text-muted-foreground'
                }`}
                title={`Jump to: ${s}`}
              >
                {i < currentStepIndex ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </button>
              {i < 3 && (
                <div
                  className={`w-12 h-0.5 transition-colors ${
                    i < currentStepIndex
                      ? 'bg-foreground'
                      : 'bg-border'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">Click any step to jump (testing mode)</p>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Step 1: Introduction */}
        {step === 'intro' && (
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold mb-6 tracking-tight">Welcome to Claude Code Training!</h1>

            <div className="prose-content">
              <p>
                You&apos;re about to learn one of the most valuable skills in modern business:
                using AI to build custom tools for your exact needs.
              </p>

              <h2>What is Claude Code?</h2>
              <p>
                Claude Code is an AI-powered coding assistant that can help you build real software.
                It&apos;s not just autocomplete - it understands what you&apos;re trying to build and can
                write entire features, debug problems, and explain code.
              </p>

              <h2>What You&apos;ll Build</h2>
              <p>
                By the end of this course, you won&apos;t just understand Claude Code - you&apos;ll have
                deployed a working tool that solves a real problem in YOUR business.
              </p>

              <blockquote>
                The best way to learn is by doing. That&apos;s why we&apos;ll identify YOUR project first,
                then use it as our case study throughout the entire course.
              </blockquote>
            </div>

            <div className="mt-10">
              <button
                onClick={() => setStep('brainstorm')}
                className="btn btn-primary px-8 py-3.5 text-base"
              >
                Let&apos;s Find Your Project &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Brainstorm */}
        {step === 'brainstorm' && (
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold mb-4 tracking-tight">Brainstorm Your Project</h1>
            <p className="text-muted-foreground mb-8">
              Think about your daily work. What processes are manual, repetitive, or annoying?
              List at least 3 ideas below.
            </p>

            <div className="bg-card rounded-xl p-6 border border-border mb-8">
              <h3 className="font-medium mb-5">Manual or annoying processes in my business:</h3>

              <div className="space-y-4">
                {ideas.map((idea, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <span className="text-muted-foreground mt-3 w-5 text-right">{index + 1}.</span>
                    <textarea
                      value={idea}
                      onChange={(e) => updateIdea(index, e.target.value)}
                      placeholder={
                        index === 0 ? 'e.g., Manually copying data between spreadsheets every week' :
                        index === 1 ? 'e.g., Responding to the same customer questions over and over' :
                        'e.g., Generating reports by hand from multiple sources'
                      }
                      className="flex-1 bg-muted text-foreground rounded-lg px-4 py-3 resize-none focus:ring-2 focus:ring-ring focus:outline-none text-sm"
                      rows={2}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIdeas([...ideas, ''])}
                className="mt-5 text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                + Add another idea
              </button>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep('intro')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                &larr; Back
              </button>
              <button
                onClick={() => setStep('chat')}
                disabled={!canProceedToBrainstorm}
                className="btn btn-primary px-6 py-3"
              >
                Continue to AI Scoping &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Step 3: AI Scoping Chat */}
        {step === 'chat' && (
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold mb-4 tracking-tight">Scope Your Project</h1>
            <p className="text-muted-foreground mb-8">
              Let&apos;s narrow down your ideas into one achievable project.
              Chat with the AI assistant to define exactly what you&apos;ll build.
            </p>

            <ScopingChat
              initialIdeas={ideas.filter(i => i.trim())}
              onProjectBriefGenerated={handleProjectBriefGenerated}
              className="mb-8 h-[500px]"
            />

            <div className="flex justify-between">
              <button
                onClick={() => setStep('brainstorm')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                &larr; Back to Ideas
              </button>
              {projectBrief?.projectTitle && (
                <button
                  onClick={() => setStep('complete')}
                  className="btn btn-primary px-6 py-3"
                >
                  Review Project Brief &rarr;
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Complete */}
        {step === 'complete' && (
          <div className="animate-fade-in">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-foreground rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-3 tracking-tight">Your Project Brief is Ready!</h1>
              <p className="text-muted-foreground">
                This will guide you through the rest of the course.
              </p>
            </div>

            <div className="bg-card rounded-xl overflow-hidden border border-border mb-10">
              <div className="bg-foreground px-6 py-5">
                <h2 className="text-xl font-semibold text-background">
                  {projectBrief?.projectTitle || 'Your Project'}
                </h2>
              </div>
              <div className="p-6 space-y-5">
                {projectBrief?.projectDescription && (
                  <div>
                    <label className="text-sm text-muted-foreground">Description</label>
                    <p className="text-foreground mt-1">{projectBrief.projectDescription}</p>
                  </div>
                )}
                {projectBrief?.problemSolved && (
                  <div>
                    <label className="text-sm text-muted-foreground">Problem Solved</label>
                    <p className="text-foreground mt-1">{projectBrief.problemSolved}</p>
                  </div>
                )}
                {projectBrief?.tasks && projectBrief.tasks.length > 0 && (
                  <div>
                    <label className="text-sm text-muted-foreground">Tasks to Complete</label>
                    <ol className="mt-2 space-y-2">
                      {projectBrief.tasks.map((task, i) => (
                        <li key={i} className="flex gap-3 text-foreground">
                          <span className="text-muted-foreground">{i + 1}.</span>
                          {task}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep('chat')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                &larr; Back to Chat
              </button>
              <button
                onClick={handleComplete}
                className="btn btn-primary px-6 py-3"
              >
                Start Module 1: Terminal Fundamentals &rarr;
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
