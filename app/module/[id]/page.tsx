'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getModule, modules } from '@/lib/curriculum';
import { isModuleUnlocked, completeModule, getModuleProgress } from '@/lib/progress';
import ModuleNav, { ModuleBreadcrumb, ModulePagination } from '@/components/ModuleNav';
import ProgressBar from '@/components/ProgressBar';
import { ProjectBriefCompact } from '@/components/ProjectBrief';
import { ExerciseCheckbox } from '@/components/ExerciseChecker';
import dynamic from 'next/dynamic';

// Dynamically import components to avoid SSR issues
const Terminal = dynamic(() => import('@/components/Terminal'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-card rounded-xl flex items-center justify-center border border-border">
      <div className="text-muted-foreground">Loading terminal...</div>
    </div>
  ),
});

const ClientServerDiagram = dynamic(
  () => import('@/components/InteractiveDiagram').then(mod => ({ default: mod.ClientServerDiagram })),
  { ssr: false }
);
const URLJourneyDiagram = dynamic(
  () => import('@/components/InteractiveDiagram').then(mod => ({ default: mod.URLJourneyDiagram })),
  { ssr: false }
);
const APIDiagram = dynamic(
  () => import('@/components/InteractiveDiagram').then(mod => ({ default: mod.APIDiagram })),
  { ssr: false }
);
const DatabaseDiagram = dynamic(
  () => import('@/components/InteractiveDiagram').then(mod => ({ default: mod.DatabaseDiagram })),
  { ssr: false }
);

export default function ModulePage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.id as string;
  const module = getModule(moduleId);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [allExercisesComplete, setAllExercisesComplete] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const unlocked = isModuleUnlocked(moduleId);
    setIsUnlocked(unlocked);

    if (!unlocked && moduleId !== '0') {
      router.push('/');
    }

    const progress = getModuleProgress(moduleId);
    const completed = progress?.exercisesCompleted.length || 0;
    setCompletedCount(completed);
    setAllExercisesComplete(module ? completed >= module.exercises.length : false);
  }, [moduleId, module, router]);

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Module not found</h1>
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  if (!isUnlocked && moduleId !== '0') {
    return null;
  }

  const handleMarkComplete = () => {
    completeModule(moduleId);
    const nextModule = modules[parseInt(moduleId) + 1];
    if (nextModule) {
      router.push(`/module/${nextModule.id}`);
    } else {
      router.push('/project');
    }
  };

  const updateExerciseCount = () => {
    const progress = getModuleProgress(moduleId);
    const completed = progress?.exercisesCompleted.length || 0;
    setCompletedCount(completed);
    setAllExercisesComplete(completed >= module.exercises.length);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/90 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <ModuleBreadcrumb moduleId={moduleId} />
            <ProgressBar moduleId={moduleId} className="w-48" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <ProjectBriefCompact />
            <ModuleNav />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Module header */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center text-background text-xl font-bold">
                {module.id}
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{module.title}</h1>
                <p className="text-muted-foreground">{module.subtitle}</p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-3xl leading-relaxed">{module.description}</p>
          </div>

          {/* Learning Objectives */}
          <div className="bg-card rounded-xl p-6 border border-border mb-10">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Learning Objectives
            </h2>
            <ul className="space-y-2.5">
              {module.learningObjectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                  <span className="text-foreground mt-1">•</span>
                  {objective}
                </li>
              ))}
            </ul>
          </div>

          {/* Terminal for Module 1 */}
          {moduleId === '1' && (
            <div className="mb-10">
              <h2 className="text-lg font-semibold mb-4">Practice Terminal</h2>
              <Terminal className="h-[400px]" />
            </div>
          )}

          {/* Module Content based on ID */}
          <div className="prose-content mb-10">
            {moduleId === '0' && (
              <div>
                <p>
                  This orientation module will help you understand what Claude Code is and why
                  it matters for your business. Most importantly, you&apos;ll identify and scope
                  your first project.
                </p>
                <Link href="/onboarding" className="btn btn-primary px-6 py-3 mt-4 inline-block">
                  Start Orientation &rarr;
                </Link>
              </div>
            )}

            {moduleId === '1' && (
              <div>
                <h2>What is a Terminal?</h2>
                <p>
                  The terminal (also called command line or shell) is a text-based way to interact
                  with your computer. Instead of clicking on icons, you type commands.
                </p>
                <p>
                  This might seem old-fashioned, but it&apos;s incredibly powerful. Developers and
                  system administrators use terminals because they can automate tasks, work faster,
                  and do things that aren&apos;t possible with a graphical interface.
                </p>

                <h2>Why Do You Need Terminal Skills?</h2>
                <p>
                  Claude Code runs in a terminal. To use it effectively, you need to be comfortable
                  with basic commands like navigating folders and creating files.
                </p>
                <p>
                  Don&apos;t worry - the simulated terminal above is a safe place to practice.
                  You can&apos;t break anything!
                </p>

                <h2>Essential Commands</h2>
                <ul>
                  <li><code>pwd</code> - Print Working Directory (where am I?)</li>
                  <li><code>ls</code> - List files in current directory</li>
                  <li><code>cd &lt;folder&gt;</code> - Change Directory</li>
                  <li><code>mkdir &lt;name&gt;</code> - Make Directory (create folder)</li>
                  <li><code>touch &lt;file&gt;</code> - Create empty file</li>
                  <li><code>cat &lt;file&gt;</code> - Display file contents</li>
                  <li><code>rm &lt;file&gt;</code> - Remove file</li>
                </ul>
              </div>
            )}

            {moduleId === '2' && (
              <div>
                <h2>What is Git?</h2>
                <p>
                  Git is a <strong>version control system</strong>. It tracks changes to your files over time,
                  letting you save &quot;snapshots&quot; of your code at any point. If something breaks, you can
                  go back to a working version.
                </p>
                <p>
                  Think of it like &quot;Track Changes&quot; in Word, but much more powerful. Every developer
                  uses Git - it&apos;s not optional, it&apos;s essential.
                </p>

                <h2>Why Git Matters for Claude Code</h2>
                <p>
                  Claude Code creates and modifies files. Git lets you:
                </p>
                <ul>
                  <li>See exactly what Claude changed</li>
                  <li>Undo changes if something goes wrong</li>
                  <li>Keep a history of your entire project</li>
                  <li>Back up your code to the cloud (GitHub)</li>
                </ul>

                <h2>Essential Git Commands</h2>
                <ul>
                  <li><code>git init</code> - Start tracking a folder with Git</li>
                  <li><code>git status</code> - See what&apos;s changed</li>
                  <li><code>git add .</code> - Stage all changes for commit</li>
                  <li><code>git commit -m &quot;message&quot;</code> - Save a snapshot with a description</li>
                  <li><code>git log</code> - See history of commits</li>
                  <li><code>git push</code> - Upload commits to GitHub</li>
                  <li><code>git pull</code> - Download changes from GitHub</li>
                </ul>

                <h2>What is GitHub?</h2>
                <p>
                  GitHub is a website that hosts Git repositories online. It&apos;s where your code lives
                  on the internet. Benefits:
                </p>
                <ul>
                  <li><strong>Backup</strong> - Your code is safe even if your computer dies</li>
                  <li><strong>Sharing</strong> - Others can see and contribute to your code</li>
                  <li><strong>Deployment</strong> - Many hosting services deploy directly from GitHub</li>
                </ul>

                <h2>The Basic Workflow</h2>
                <ol>
                  <li>Make changes to your code</li>
                  <li><code>git add .</code> - Stage the changes</li>
                  <li><code>git commit -m &quot;What I changed&quot;</code> - Save the snapshot</li>
                  <li><code>git push</code> - Upload to GitHub</li>
                </ol>
              </div>
            )}

            {moduleId === '3' && (
              <div className="space-y-10">
                <div>
                  <h2>The Client-Server Model</h2>
                  <p>
                    When you visit a website, your browser (the <strong>client</strong>) sends a request
                    to a computer somewhere in the world (the <strong>server</strong>). The server processes
                    your request and sends back a response.
                  </p>
                </div>

                <ClientServerDiagram className="my-8" />

                <div>
                  <h2>What Happens When You Visit a URL?</h2>
                  <p>
                    When you type a URL and hit enter, a fascinating chain of events happens in milliseconds.
                    Let&apos;s break it down step by step.
                  </p>
                </div>

                <URLJourneyDiagram className="my-8" />

                <div>
                  <h2>What is an API?</h2>
                  <p>
                    API stands for Application Programming Interface. It&apos;s a way for programs to talk
                    to each other. Think of it like a waiter at a restaurant - you tell the waiter what
                    you want (request), they communicate with the kitchen (server), and bring back your
                    food (response).
                  </p>
                  <p>
                    APIs use standard &quot;verbs&quot; to describe actions: <strong>GET</strong> (retrieve data),
                    <strong> POST</strong> (create new data), <strong>PUT</strong> (update existing data),
                    and <strong>DELETE</strong> (remove data).
                  </p>
                </div>

                <APIDiagram className="my-8" />

                <div>
                  <h2>When Do You Need a Database?</h2>
                  <p>
                    A database stores information that needs to persist. If your application needs to
                    remember things (user accounts, posts, settings), you need a database. Simple static
                    websites don&apos;t need one.
                  </p>
                </div>

                <DatabaseDiagram className="my-8" />

                <div className="bg-muted/50 border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Key Takeaways</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong className="text-foreground">Client-Server:</strong> Your browser requests, servers respond</li>
                    <li>• <strong className="text-foreground">URLs:</strong> Human-readable addresses that get translated to IP addresses</li>
                    <li>• <strong className="text-foreground">APIs:</strong> Structured ways for programs to exchange data</li>
                    <li>• <strong className="text-foreground">Databases:</strong> Persistent storage for data that needs to survive between sessions</li>
                  </ul>
                </div>
              </div>
            )}

            {moduleId === '4' && (
              <div>
                <h2>Why Scoping Matters</h2>
                <p>
                  The #1 reason AI coding projects fail: <strong>vague requirements</strong>. When you
                  tell AI something vague like &quot;build me an app,&quot; it has to guess what you mean.
                  And it will guess wrong.
                </p>

                <h2>The 5-Year-Old Test</h2>
                <p>
                  If you can&apos;t explain a task in simple terms, it&apos;s too complex. Break it down until
                  each piece passes the &quot;could I explain this to a 5-year-old?&quot; test.
                </p>

                <h2>Good vs. Bad Scoping</h2>
                <p><strong>Bad:</strong> &quot;Build me a dashboard&quot;</p>
                <p><strong>Good:</strong> &quot;Create a page that shows three numbers: total sales this month,
                number of new customers, and average order value. Pull data from the Shopify API.&quot;</p>
              </div>
            )}

            {moduleId === '5' && (
              <div>
                <h2>Anatomy of a Good Prompt</h2>
                <p>Great prompts include:</p>
                <ul>
                  <li><strong>Context:</strong> What exists already?</li>
                  <li><strong>Goal:</strong> What do you want to create/change?</li>
                  <li><strong>Specifics:</strong> File names, function names, expected behavior</li>
                  <li><strong>Constraints:</strong> Technologies, patterns, or approaches to use/avoid</li>
                </ul>

                <h2>Being Specific vs. Prescriptive</h2>
                <p>
                  Be specific about WHAT you want, but don&apos;t over-specify HOW unless you have a
                  reason. Give Claude Code room to use its expertise.
                </p>

                <h2>Iterating</h2>
                <p>
                  You won&apos;t always get it right the first time. That&apos;s normal. Review what Claude
                  produces, give feedback, and iterate. The conversation is part of the process.
                </p>
              </div>
            )}

            {moduleId === '6' && (
              <div>
                <h2>Installing Claude Code</h2>
                <p>Time to install the real thing! Follow these steps:</p>
                <ol>
                  <li>Open your computer&apos;s terminal</li>
                  <li>Run: <code>npm install -g @anthropic-ai/claude-code</code></li>
                  <li>Configure your API key (we&apos;ll walk through this)</li>
                </ol>

                <h2>The Claude Code Workflow</h2>
                <ol>
                  <li><strong>Prompt:</strong> Describe what you want</li>
                  <li><strong>Review:</strong> Read what Claude produces</li>
                  <li><strong>Iterate:</strong> Give feedback and refine</li>
                </ol>

                <h2>When to Push Back</h2>
                <p>
                  Don&apos;t accept code you don&apos;t understand. Ask Claude to explain. Ask for
                  alternatives. This is a collaboration, not delegation.
                </p>

                <h2>Turbo Mode: --dangerously-skip-permissions</h2>
                <p>
                  By default, Claude Code asks for permission before creating files or running commands.
                  Once you&apos;re comfortable, you can skip these prompts for faster workflows:
                </p>
                <pre><code>claude --dangerously-skip-permissions</code></pre>
                <p>
                  This lets Claude execute actions immediately without confirmation. Use it when:
                </p>
                <ul>
                  <li>You trust the task and know what Claude will do</li>
                  <li>You&apos;re iterating quickly on a project</li>
                  <li>You have git set up as a safety net (so you can undo)</li>
                </ul>
                <p>
                  <strong>Pro tip:</strong> Always have <code>git init</code> run before using turbo mode,
                  so you can <code>git checkout .</code> to undo any unwanted changes.
                </p>
              </div>
            )}

            {moduleId === '7' && (
              <div>
                <h2>What Can Be Automated?</h2>
                <p>Good candidates for automation:</p>
                <ul>
                  <li>Repetitive tasks that happen on a schedule</li>
                  <li>Tasks triggered by events (new email, form submission, etc.)</li>
                  <li>Data transformation and moving between systems</li>
                  <li>Notifications and alerts</li>
                </ul>

                <h2>Choosing an Automation Tool</h2>
                <ul>
                  <li><strong>n8n:</strong> Self-hosted, powerful, free tier available</li>
                  <li><strong>Make:</strong> Visual builder, good free tier</li>
                  <li><strong>Zapier:</strong> Easy to use, most integrations, paid</li>
                </ul>
              </div>
            )}

            {moduleId === '8' && (
              <div>
                <h2>Hosting Options</h2>
                <ul>
                  <li><strong>Railway:</strong> Great for backends, databases, and full-stack apps</li>
                  <li><strong>Vercel:</strong> Perfect for frontend and Next.js apps</li>
                  <li><strong>Render:</strong> Good all-around, generous free tier</li>
                </ul>

                <h2>Environment Variables</h2>
                <p>
                  Never put secrets (API keys, passwords) in your code. Use environment variables -
                  secret values that are set in your hosting provider, not in your files.
                </p>

                <h2>Domains</h2>
                <p>
                  You&apos;ll get a free URL from your hosting provider (like yourapp.vercel.app).
                  You can later connect a custom domain if you want.
                </p>
              </div>
            )}

            {moduleId === '9' && (
              <div>
                <h2>Finish Strong!</h2>
                <p>
                  You&apos;ve learned the fundamentals. Now it&apos;s time to complete your project.
                  Work through your remaining tasks, using Claude Code and everything you&apos;ve learned.
                </p>

                <h2>When You Get Stuck</h2>
                <p>
                  Getting stuck is normal. Use the debugging skills from earlier modules. Break
                  the problem down. Ask Claude for help explaining errors.
                </p>

                <h2>Documentation</h2>
                <p>
                  Write a README for your project. Future you will thank present you.
                  Include: what it does, how to set it up, any configuration needed.
                </p>
              </div>
            )}
          </div>

          {/* Exercises */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">
              Exercises ({completedCount}/{module.exercises.length})
            </h2>
            <div className="space-y-3">
              {module.exercises.map((exercise) => (
                <ExerciseCheckbox
                  key={exercise.id}
                  exercise={exercise}
                  moduleId={moduleId}
                  onChange={updateExerciseCount}
                />
              ))}
            </div>
          </div>

          {/* Complete Module Button */}
          {allExercisesComplete && (
            <div className="bg-muted/50 border border-border rounded-xl p-6 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-foreground rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">Module Complete!</h3>
                  <p className="text-muted-foreground">You&apos;ve finished all exercises in this module.</p>
                </div>
                <button
                  onClick={handleMarkComplete}
                  className="btn btn-primary px-6 py-3"
                >
                  Continue to Next Module &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <ModulePagination moduleId={moduleId} className="pt-8 border-t border-border" />
        </main>
      </div>
    </div>
  );
}
