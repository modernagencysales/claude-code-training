// Exercise definitions and validation logic

import { VirtualFileSystem } from './terminal-commands';

export interface ExerciseValidation {
  isComplete: boolean;
  message: string;
  progress?: number; // 0-100
}

export interface BadPromptExample {
  id: string;
  badPrompt: string;
  issue: string;
  betterPrompt: string;
  explanation: string;
}

export const badPromptExamples: BadPromptExample[] = [
  {
    id: 'bp-1',
    badPrompt: 'Make me a website',
    issue: 'Too vague - no context about what kind of website, what features, or what technology',
    betterPrompt: 'Create a single-page portfolio website with HTML and CSS. It should have: a header with my name "Alex Chen", an about section with a placeholder paragraph, a projects section with 3 cards, and a contact section with my email. Use a modern, minimalist design with a dark color scheme.',
    explanation: 'The improved prompt specifies: the type of site (portfolio), the technologies (HTML/CSS), the exact sections needed, specific content, and design preferences.',
  },
  {
    id: 'bp-2',
    badPrompt: 'Fix the bug',
    issue: 'No information about what the bug is, where it is, or how it manifests',
    betterPrompt: 'Fix the bug in src/utils/formatDate.ts where the function returns "Invalid Date" when passed a Unix timestamp in seconds instead of milliseconds. The function should accept both formats. Here\'s the current behavior: formatDate(1699574400) returns "Invalid Date" but should return "Nov 10, 2023".',
    explanation: 'The improved prompt includes: the file location, what the bug does, the expected vs actual behavior, and a specific example.',
  },
  {
    id: 'bp-3',
    badPrompt: 'Add authentication',
    issue: 'No details about auth type, provider, what should be protected, or user data',
    betterPrompt: 'Add email/password authentication to this Next.js app using NextAuth.js. Users should be able to: sign up with email and password, log in, log out, and see their email on the dashboard. Store user data in the existing PostgreSQL database. Protect the /dashboard route so only logged-in users can access it.',
    explanation: 'The improved prompt specifies: the auth method (email/password), the library (NextAuth.js), the features needed, the database, and what routes to protect.',
  },
  {
    id: 'bp-4',
    badPrompt: 'Make it faster',
    issue: 'No context about what\'s slow, how slow, or what acceptable performance looks like',
    betterPrompt: 'Optimize the ProductList component in src/components/ProductList.tsx. Currently it re-renders all 500+ product cards when any filter changes, causing a 2-3 second lag. Implement React.memo on ProductCard, virtualize the list to only render visible items, and memoize the filter function.',
    explanation: 'The improved prompt identifies: the specific component, the current problem (re-renders), the impact (2-3 second lag), and specific optimization techniques to use.',
  },
  {
    id: 'bp-5',
    badPrompt: 'Add a button',
    issue: 'No information about what the button does, where it goes, or how it looks',
    betterPrompt: 'Add a "Save Draft" button to the blog post editor in src/pages/editor.tsx. It should: appear next to the existing "Publish" button, have a secondary/outline style, call the saveDraft API endpoint when clicked, show a loading spinner while saving, and display a toast notification on success or error.',
    explanation: 'The improved prompt specifies: button text, location, styling, the action it performs, loading state, and feedback to the user.',
  },
];

export interface PromptScenario {
  id: string;
  scenario: string;
  context: string;
  sampleGoodPrompt: string;
  keyElements: string[];
}

export const promptScenarios: PromptScenario[] = [
  {
    id: 'ps-1',
    scenario: 'Create a new file',
    context: 'You need Claude to create a new React component for displaying user profiles',
    sampleGoodPrompt: 'Create a new React component at src/components/UserProfile.tsx that displays a user\'s avatar (circular, 80px), name (h2), bio (paragraph), and join date. Accept a user object prop with types: { id: string, name: string, avatar: string, bio: string, joinedAt: Date }. Use Tailwind for styling.',
    keyElements: ['File path', 'Component purpose', 'Props and types', 'Visual specifications', 'Styling approach'],
  },
  {
    id: 'ps-2',
    scenario: 'Fix a bug',
    context: 'Your form submission is sending data twice - once on click, once on form submit',
    sampleGoodPrompt: 'Fix the double submission bug in src/components/ContactForm.tsx. The form submits twice because the submit button has both onClick and type="submit". Change it to only use form onSubmit, and prevent default to avoid page refresh. The form should only call submitContact() once per submission.',
    keyElements: ['File location', 'Bug description', 'Root cause', 'Desired fix', 'Expected behavior'],
  },
  {
    id: 'ps-3',
    scenario: 'Add a feature',
    context: 'You want to add dark mode toggle to your app',
    sampleGoodPrompt: 'Add dark mode support to this Next.js app. Create a ThemeProvider context in src/contexts/ThemeContext.tsx that: stores theme in localStorage, defaults to system preference, provides a toggle function. Add a toggle button in the header (sun/moon icons). Update tailwind.config.js for dark: variant. Add dark: classes to the existing layout components.',
    keyElements: ['Feature scope', 'Implementation approach', 'Storage mechanism', 'UI location', 'Files to modify'],
  },
];

// Validation functions for terminal exercises
export function validateTerminalExercise(
  exerciseId: string,
  fs: VirtualFileSystem
): ExerciseValidation {
  switch (exerciseId) {
    case '1-1':
      return validateNavigationBasics(fs);
    case '1-2':
      return validateCreatingStructure(fs);
    case '1-3':
      return validateProjectStructure(fs);
    default:
      return { isComplete: false, message: 'Unknown exercise' };
  }
}

function validateNavigationBasics(fs: VirtualFileSystem): ExerciseValidation {
  // Just check if they've navigated anywhere
  const path = fs.getCurrentPathString();
  if (path !== '/home/user') {
    return {
      isComplete: true,
      message: 'You\'ve successfully navigated to a new directory!',
    };
  }
  return {
    isComplete: false,
    message: 'Try using cd to navigate to the documents folder',
    progress: 0,
  };
}

function validateCreatingStructure(fs: VirtualFileSystem): ExerciseValidation {
  const checks = [
    { path: '/home/user/my-project', label: 'my-project folder' },
    { path: '/home/user/my-project/index.html', label: 'index.html file' },
  ];

  let completed = 0;
  const missing: string[] = [];

  for (const check of checks) {
    if (fs.fileExists(check.path)) {
      completed++;
    } else {
      missing.push(check.label);
    }
  }

  if (completed === checks.length) {
    return {
      isComplete: true,
      message: 'Excellent! You\'ve created the project structure!',
    };
  }

  return {
    isComplete: false,
    message: `Still need: ${missing.join(', ')}`,
    progress: Math.round((completed / checks.length) * 100),
  };
}

function validateProjectStructure(fs: VirtualFileSystem): ExerciseValidation {
  // Check for src, public, docs folders with at least one file each
  const basePath = '/home/user';
  const requiredFolders = ['src', 'public', 'docs'];

  let completed = 0;
  const missing: string[] = [];

  // Find any project directory
  const userContents = fs.getDirectoryContents(basePath);
  const projectDirs = userContents.filter(name =>
    !['documents', 'projects', 'desktop'].includes(name)
  );

  if (projectDirs.length === 0) {
    return {
      isComplete: false,
      message: 'Create a new project folder first (hint: mkdir my-project)',
      progress: 0,
    };
  }

  const projectPath = `${basePath}/${projectDirs[0]}`;

  for (const folder of requiredFolders) {
    const folderPath = `${projectPath}/${folder}`;
    if (fs.fileExists(folderPath)) {
      const contents = fs.getDirectoryContents(folderPath);
      if (contents.length > 0) {
        completed++;
      } else {
        missing.push(`${folder}/ (needs at least one file)`);
      }
    } else {
      missing.push(`${folder}/`);
    }
  }

  if (completed === requiredFolders.length) {
    return {
      isComplete: true,
      message: 'Your project structure is complete! Well done!',
    };
  }

  return {
    isComplete: false,
    message: `Still need: ${missing.join(', ')}`,
    progress: Math.round((completed / requiredFolders.length) * 100),
  };
}

// Quiz questions for various modules
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const quizQuestions: Record<string, QuizQuestion[]> = {
  '2': [ // Module 2: Git & GitHub
    {
      id: '2-q1',
      question: 'What is Git?',
      options: [
        'A website for sharing code',
        'A version control system that tracks changes to files',
        'A programming language',
        'A code editor',
      ],
      correctIndex: 1,
      explanation: 'Git is a version control system that tracks changes to your files over time. It lets you save snapshots (commits) and go back to previous versions if needed.',
    },
    {
      id: '2-q2',
      question: 'What is a "commit" in Git?',
      options: [
        'Deleting files from your project',
        'A snapshot of your code at a specific point in time',
        'Uploading code to the internet',
        'A type of error message',
      ],
      correctIndex: 1,
      explanation: 'A commit is like a save point or snapshot. It records what all your files look like at that moment, with a message describing what changed.',
    },
    {
      id: '2-q3',
      question: 'What is the difference between Git and GitHub?',
      options: [
        'They are the same thing',
        'Git is for Windows, GitHub is for Mac',
        'Git is the tool that tracks changes locally, GitHub is a website that hosts Git repositories online',
        'GitHub is newer and replaces Git',
      ],
      correctIndex: 2,
      explanation: 'Git runs on your computer and tracks changes. GitHub is a website where you can store your Git repositories online, share them, and collaborate with others.',
    },
    {
      id: '2-q4',
      question: 'What does "git push" do?',
      options: [
        'Downloads code from GitHub',
        'Deletes your local changes',
        'Uploads your commits to a remote repository like GitHub',
        'Creates a new branch',
      ],
      correctIndex: 2,
      explanation: 'git push uploads your local commits to a remote repository (like GitHub). This is how you back up your code and share it with others.',
    },
  ],
  '3': [ // Module 3: How the Internet Works
    {
      id: '3-q1',
      question: 'What role does the "client" play in the client-server model?',
      options: [
        'It stores all the data',
        'It makes requests and displays responses',
        'It processes business logic',
        'It manages the database',
      ],
      correctIndex: 1,
      explanation: 'The client (like your web browser) makes requests to servers and displays the responses to users. It\'s the "front-end" that users interact with directly.',
    },
    {
      id: '3-q2',
      question: 'What is an API?',
      options: [
        'A type of database',
        'A programming language',
        'A way for programs to communicate with each other',
        'A hosting service',
      ],
      correctIndex: 2,
      explanation: 'API (Application Programming Interface) is a set of rules that allows different software programs to communicate. It\'s like a waiter taking your order to the kitchen and bringing back your food.',
    },
    {
      id: '3-q3',
      question: 'When do you need a database?',
      options: [
        'For every web project',
        'Only when using Python',
        'When you need to store and retrieve data that persists',
        'Only for large companies',
      ],
      correctIndex: 2,
      explanation: 'You need a database when your application needs to remember data between sessions - like user accounts, posts, or settings. Simple static websites don\'t need one.',
    },
  ],
  '4': [ // Module 4: The Art of Scoping
    {
      id: '4-q1',
      question: 'Why is scoping important when working with AI?',
      options: [
        'AI only understands short prompts',
        'Vague requests lead to vague results',
        'AI charges by the word',
        'It\'s not important, AI figures it out',
      ],
      correctIndex: 1,
      explanation: 'When you give AI a vague request like "make me an app", it has to guess what you want. Specific, well-scoped requests get specific, useful results.',
    },
    {
      id: '4-q2',
      question: 'What is the "5-year-old test" for scoping?',
      options: [
        'The task should take 5 years to complete',
        'Only children should use AI',
        'If you can\'t explain it simply, break it down further',
        'Tasks should have exactly 5 steps',
      ],
      correctIndex: 2,
      explanation: 'If you can\'t explain a task in simple terms (like to a 5-year-old), it\'s probably too complex and needs to be broken into smaller pieces.',
    },
    {
      id: '4-q3',
      question: 'What should you do first when scoping a large project?',
      options: [
        'Start coding immediately',
        'Hire more developers',
        'Break it into sequential, dependent tasks',
        'Ask AI to do everything at once',
      ],
      correctIndex: 2,
      explanation: 'Breaking a large project into smaller tasks helps you understand dependencies (what needs to happen first) and makes each piece achievable.',
    },
  ],
  '7': [ // Module 7: Opus 4.6 Power Features
    {
      id: '7-q1',
      question: 'What is the most important rule when running agent teams (multiple Claude Code instances in parallel)?',
      options: [
        'Each agent must use a different programming language',
        'Each agent must work on independent tasks with no shared files',
        'You must start all agents at exactly the same time',
        'You need a special license for multiple agents',
      ],
      correctIndex: 1,
      explanation: 'Agent teams work by having each agent handle independent files. If two agents try to edit the same file, they\'ll create conflicts. The golden rule: no shared files between parallel agents.',
    },
    {
      id: '7-q2',
      question: 'What determines whether a task goes in Phase 1 vs. Phase 2 of a divide-and-conquer workflow?',
      options: [
        'How difficult the task is',
        'How long the task takes',
        'Whether the task depends on output from other tasks',
        'How many files the task creates',
      ],
      correctIndex: 2,
      explanation: 'Phases are about dependencies, not difficulty. Phase 1 contains tasks with no dependencies. Phase 2 contains tasks that need Phase 1\'s output. A simple task can be in Phase 2 if it depends on a Phase 1 result.',
    },
    {
      id: '7-q3',
      question: 'When should you use the Constraint-First prompt pattern?',
      options: [
        'When creating a brand new project from scratch',
        'When you need to protect existing code while making changes',
        'When writing documentation',
        'When deploying to production',
      ],
      correctIndex: 1,
      explanation: 'Constraint-First (telling Claude what NOT to change before what TO change) is ideal when modifying existing code. It prevents Claude from accidentally refactoring or breaking things that should stay the same.',
    },
    {
      id: '7-q4',
      question: 'Which task would benefit MOST from high effort?',
      options: [
        'Adding an environment variable to the config',
        'Renaming a function across three files',
        'Building a complex pipeline with retry logic and failure handling',
        'Updating the README with a new section',
      ],
      correctIndex: 2,
      explanation: 'Complex pipelines with retry logic and failure handling have many edge cases and require careful error handling. High effort produces more thorough, well-tested code for these scenarios. Simple tasks like env vars and README updates work fine with low effort.',
    },
  ],
  '5': [ // Module 5: Prompting
    {
      id: '5-q1',
      question: 'What is the most important thing to include in a prompt?',
      options: [
        'Polite language',
        'Specific context and desired outcome',
        'Technical jargon',
        'Multiple requests',
      ],
      correctIndex: 1,
      explanation: 'Claude needs to understand what you have (context) and what you want (outcome). Specificity prevents misunderstandings and gets better results.',
    },
    {
      id: '5-q2',
      question: 'When should you iterate on Claude\'s response?',
      options: [
        'Never - always accept the first response',
        'Only if there are errors',
        'Whenever the result isn\'t quite what you wanted',
        'Only for complex tasks',
      ],
      correctIndex: 2,
      explanation: 'Iteration is normal and expected. If the result isn\'t what you wanted, give feedback and ask for changes. This is how you get the best results.',
    },
    {
      id: '5-q3',
      question: 'What\'s wrong with the prompt "Add error handling"?',
      options: [
        'Nothing, it\'s perfect',
        'Too specific',
        'Missing location, types of errors, and handling strategy',
        'Too long',
      ],
      correctIndex: 2,
      explanation: 'This prompt doesn\'t say where to add error handling, what errors to handle, or how to handle them (show message? retry? log?). Be specific!',
    },
    {
      id: '5-q4',
      question: 'What is the Constraint-First prompt pattern?',
      options: [
        'Writing the shortest possible prompt',
        'Telling Claude what NOT to do before telling it what TO do',
        'Only using Claude for small tasks',
        'Adding constraints to your project\'s database',
      ],
      correctIndex: 1,
      explanation: 'The Constraint-First pattern means you tell Claude what to leave alone (e.g., "Do NOT modify the existing API routes") before telling it what to change. This prevents Claude from accidentally breaking existing code while making changes.',
    },
  ],
};

export function checkQuizAnswer(moduleId: string, questionId: string, selectedIndex: number): {
  correct: boolean;
  explanation: string;
} {
  const questions = quizQuestions[moduleId];
  if (!questions) {
    return { correct: false, explanation: 'Question not found' };
  }

  const question = questions.find(q => q.id === questionId);
  if (!question) {
    return { correct: false, explanation: 'Question not found' };
  }

  return {
    correct: selectedIndex === question.correctIndex,
    explanation: question.explanation,
  };
}
