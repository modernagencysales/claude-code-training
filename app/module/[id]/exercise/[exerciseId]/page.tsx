'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { getModule, getExercise } from '@/lib/curriculum';
import { isModuleUnlocked, completeExercise, getModuleProgress } from '@/lib/progress';
import { ModuleBreadcrumb } from '@/components/ModuleNav';
import { VirtualFileSystem } from '@/lib/terminal-commands';
import { validateTerminalExercise, badPromptExamples, promptScenarios, quizQuestions, checkQuizAnswer } from '@/lib/exercises';
import dynamic from 'next/dynamic';
import ScopingChat from '@/components/ScopingChat';

const Terminal = dynamic(() => import('@/components/Terminal'), { ssr: false });
const CodeEditor = dynamic(() => import('@/components/CodeEditor'), { ssr: false });

export default function ExercisePage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.id as string;
  const exerciseId = params.exerciseId as string;

  const module = getModule(moduleId);
  const exercise = getExercise(moduleId, exerciseId);

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const filesystemRef = useRef(new VirtualFileSystem());
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizResults, setQuizResults] = useState<Record<string, { correct: boolean; explanation: string }>>({});

  // Bad prompt exercise state
  const [currentBadPrompt, setCurrentBadPrompt] = useState(0);
  const [userRewrite, setUserRewrite] = useState('');
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    const unlocked = isModuleUnlocked(moduleId);
    setIsUnlocked(unlocked);

    if (!unlocked) {
      router.push('/');
      return;
    }

    const progress = getModuleProgress(moduleId);
    if (progress?.exercisesCompleted.includes(exerciseId)) {
      setIsComplete(true);
    }
  }, [moduleId, exerciseId, router]);

  if (!module || !exercise) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Exercise not found</h1>
          <Link href={`/module/${moduleId}`} className="text-muted-foreground hover:text-foreground transition-colors">
            Go back to module
          </Link>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return null;
  }

  const handleCheckTerminal = () => {
    const result = validateTerminalExercise(exerciseId, filesystemRef.current);
    setValidationMessage(result.message);
    if (result.isComplete && !isComplete) {
      setIsComplete(true);
      completeExercise(moduleId, exerciseId);
    }
  };

  const handleMarkComplete = () => {
    if (!isComplete) {
      setIsComplete(true);
      completeExercise(moduleId, exerciseId);
    }
  };

  const handleQuizSubmit = (questionId: string) => {
    const selectedIndex = selectedAnswers[questionId];
    if (selectedIndex === undefined) return;

    const result = checkQuizAnswer(moduleId, questionId, selectedIndex);
    setQuizResults(prev => ({ ...prev, [questionId]: result }));
  };

  const currentExerciseIndex = module.exercises.findIndex(e => e.id === exerciseId);
  const nextExercise = module.exercises[currentExerciseIndex + 1];
  const prevExercise = module.exercises[currentExerciseIndex - 1];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/90 backdrop-blur-sm z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <ModuleBreadcrumb moduleId={moduleId} exerciseId={exerciseId} />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Exercise Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isComplete ? 'bg-foreground' : 'bg-muted'}`}>
              {isComplete ? (
                <svg className="w-5 h-5 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-muted-foreground font-medium">{currentExerciseIndex + 1}</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{exercise.title}</h1>
              <p className="text-muted-foreground">{exercise.description}</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-card rounded-xl p-6 border border-border mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Instructions</h2>
          <ol className="space-y-2">
            {exercise.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-3 text-muted-foreground">
                <span className="text-muted-foreground/70 w-6 text-right">{index + 1}.</span>
                <span>{instruction}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Exercise Content based on type */}
        {exercise.type === 'terminal' && (
          <div className="mb-8">
            <Terminal
              filesystem={filesystemRef.current}
              className="h-[400px] mb-4"
            />
            <div className="flex items-center gap-4">
              <button
                onClick={handleCheckTerminal}
                className="btn btn-primary px-6 py-2.5"
              >
                Check Progress
              </button>
              {validationMessage && (
                <span className={isComplete ? 'text-foreground' : 'text-muted-foreground'}>
                  {validationMessage}
                </span>
              )}
            </div>
          </div>
        )}

        {exercise.type === 'chat' && (
          <div className="mb-8">
            <ScopingChat
              chatType={moduleId === '3' ? 'scopeReview' : moduleId === '4' ? 'promptCoach' : 'scoping'}
              className="h-[500px]"
            />
            <button
              onClick={handleMarkComplete}
              disabled={isComplete}
              className="mt-4 btn btn-primary px-6 py-2.5 disabled:opacity-50"
            >
              {isComplete ? 'Completed' : 'Mark as Complete'}
            </button>
          </div>
        )}

        {exercise.type === 'quiz' && exerciseId === '4-1' && (
          <div className="mb-8 space-y-8">
            <h2 className="text-lg font-semibold text-foreground">Fix These Prompts</h2>

            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">
                  Prompt {currentBadPrompt + 1} of {badPromptExamples.length}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setCurrentBadPrompt(prev => Math.max(0, prev - 1)); setShowSolution(false); setUserRewrite(''); }}
                    disabled={currentBadPrompt === 0}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => { setCurrentBadPrompt(prev => Math.min(badPromptExamples.length - 1, prev + 1)); setShowSolution(false); setUserRewrite(''); }}
                    disabled={currentBadPrompt === badPromptExamples.length - 1}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
                  >
                    Next →
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm text-muted-foreground block mb-2">Bad Prompt:</label>
                <div className="bg-destructive/20 border border-destructive rounded-xl p-4 text-foreground">
                  &quot;{badPromptExamples[currentBadPrompt].badPrompt}&quot;
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm text-muted-foreground block mb-2">Issue:</label>
                <p className="text-muted-foreground">{badPromptExamples[currentBadPrompt].issue}</p>
              </div>

              <div className="mb-4">
                <label className="text-sm text-muted-foreground block mb-2">Your Improved Version:</label>
                <textarea
                  value={userRewrite}
                  onChange={(e) => setUserRewrite(e.target.value)}
                  className="w-full bg-muted text-foreground rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={4}
                  placeholder="Write a better version of this prompt..."
                />
              </div>

              <button
                onClick={() => setShowSolution(!showSolution)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {showSolution ? 'Hide' : 'Show'} Example Solution
              </button>

              {showSolution && (
                <div className="mt-4">
                  <div className="bg-muted/50 border border-border rounded-xl p-4 mb-2">
                    <p className="text-foreground">&quot;{badPromptExamples[currentBadPrompt].betterPrompt}&quot;</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{badPromptExamples[currentBadPrompt].explanation}</p>
                </div>
              )}
            </div>

            <button
              onClick={handleMarkComplete}
              disabled={isComplete}
              className="btn btn-primary px-6 py-2.5 disabled:opacity-50"
            >
              {isComplete ? 'Completed' : 'Mark as Complete'}
            </button>
          </div>
        )}

        {exercise.type === 'quiz' && quizQuestions[moduleId] && exerciseId !== '4-1' && (
          <div className="mb-8 space-y-6">
            {quizQuestions[moduleId].map((question) => (
              <div key={question.id} className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-medium text-foreground mb-4">{question.question}</h3>
                <div className="space-y-2">
                  {question.options.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                        selectedAnswers[question.id] === index
                          ? 'bg-muted border border-foreground'
                          : 'bg-muted/50 hover:bg-muted border border-transparent'
                      } ${
                        quizResults[question.id] && index === question.correctIndex
                          ? 'bg-muted border-foreground'
                          : ''
                      } ${
                        quizResults[question.id] && selectedAnswers[question.id] === index && !quizResults[question.id].correct
                          ? 'bg-destructive/20 border-destructive'
                          : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        checked={selectedAnswers[question.id] === index}
                        onChange={() => setSelectedAnswers(prev => ({ ...prev, [question.id]: index }))}
                        disabled={!!quizResults[question.id]}
                        className="hidden"
                      />
                      <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswers[question.id] === index
                          ? 'border-foreground bg-foreground'
                          : 'border-muted-foreground/50'
                      }`}>
                        {selectedAnswers[question.id] === index && (
                          <div className="w-2 h-2 rounded-full bg-background" />
                        )}
                      </span>
                      <span className="text-foreground">{option}</span>
                    </label>
                  ))}
                </div>

                {!quizResults[question.id] ? (
                  <button
                    onClick={() => handleQuizSubmit(question.id)}
                    disabled={selectedAnswers[question.id] === undefined}
                    className="mt-4 btn btn-outline px-4 py-2 disabled:opacity-50"
                  >
                    Check Answer
                  </button>
                ) : (
                  <div className={`mt-4 p-4 rounded-xl ${quizResults[question.id].correct ? 'bg-muted/50 border border-border' : 'bg-muted/30 border border-border'}`}>
                    <p className={quizResults[question.id].correct ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                      {quizResults[question.id].correct ? 'Correct!' : 'Not quite.'}
                    </p>
                    <p className="text-muted-foreground text-sm mt-1">{quizResults[question.id].explanation}</p>
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={handleMarkComplete}
              disabled={isComplete}
              className="btn btn-primary px-6 py-2.5 disabled:opacity-50"
            >
              {isComplete ? 'Completed' : 'Mark as Complete'}
            </button>
          </div>
        )}

        {exercise.type === 'code' && (
          <div className="mb-8">
            <CodeEditor
              value="// Write your code here"
              language="typescript"
              height="300px"
            />
            <button
              onClick={handleMarkComplete}
              disabled={isComplete}
              className="mt-4 btn btn-primary px-6 py-2.5 disabled:opacity-50"
            >
              {isComplete ? 'Completed' : 'Mark as Complete'}
            </button>
          </div>
        )}

        {exercise.type === 'project' && (
          <div className="mb-8">
            <div className="bg-card rounded-xl p-6 border border-border mb-4">
              <p className="text-muted-foreground">
                This is a hands-on exercise. Follow the instructions above using your own
                project and tools. Mark as complete when done.
              </p>
            </div>
            <button
              onClick={handleMarkComplete}
              disabled={isComplete}
              className="btn btn-primary px-6 py-2.5 disabled:opacity-50"
            >
              {isComplete ? 'Completed' : 'Mark as Complete'}
            </button>
          </div>
        )}

        {/* Hints */}
        {exercise.hints && exercise.hints.length > 0 && (
          <details className="mb-8">
            <summary className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              Need hints?
            </summary>
            <div className="mt-4 bg-muted/50 border border-border rounded-xl p-4">
              <ul className="space-y-2">
                {exercise.hints.map((hint, index) => (
                  <li key={index} className="flex gap-2 text-muted-foreground">
                    <span className="text-foreground">•</span>
                    {hint}
                  </li>
                ))}
              </ul>
            </div>
          </details>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-border">
          {prevExercise ? (
            <Link
              href={`/module/${moduleId}/exercise/${prevExercise.id}`}
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {prevExercise.title}
            </Link>
          ) : (
            <Link
              href={`/module/${moduleId}`}
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Module
            </Link>
          )}

          {nextExercise ? (
            <Link
              href={`/module/${moduleId}/exercise/${nextExercise.id}`}
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              {nextExercise.title}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <Link
              href={`/module/${moduleId}`}
              className="btn btn-primary px-4 py-2 flex items-center gap-2"
            >
              Finish Module
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
