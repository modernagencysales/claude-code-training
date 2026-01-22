// Curriculum structure and module definitions

export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: 'terminal' | 'code' | 'quiz' | 'project' | 'chat';
  instructions: string[];
  hints?: string[];
  validation?: {
    type: 'command' | 'file-exists' | 'file-contains' | 'custom';
    value: string;
  };
}

export interface Module {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  description: string;
  learningObjectives: string[];
  exercises: Exercise[];
  isSimulated: boolean;
  requiresProject: boolean;
}

export const modules: Module[] = [
  {
    id: '0',
    title: 'Orientation',
    subtitle: 'Discover Your Project',
    duration: '30 min',
    description: 'Learn what Claude Code is, why it matters, and most importantly - identify the perfect first project for YOUR business.',
    learningObjectives: [
      'Understand what Claude Code can help you build',
      'Identify manual processes in your business that could be automated',
      'Scope a realistic first project with AI guidance',
      'Create your personalized Project Brief',
    ],
    exercises: [
      {
        id: '0-1',
        title: 'Brainstorm Session',
        description: 'List 3 manual or annoying processes in your business',
        type: 'project',
        instructions: [
          'Think about your daily/weekly workflow',
          'What tasks do you do repeatedly?',
          'What processes feel inefficient or tedious?',
          'Write down at least 3 ideas',
        ],
      },
      {
        id: '0-2',
        title: 'AI Scoping Session',
        description: 'Work with AI to pick and scope your project',
        type: 'chat',
        instructions: [
          'Share your brainstormed ideas with the AI assistant',
          'Answer questions to help narrow down the best choice',
          'Define what "done" looks like for your project',
          'Generate your Project Brief',
        ],
      },
    ],
    isSimulated: true,
    requiresProject: false,
  },
  {
    id: '1',
    title: 'Terminal Fundamentals',
    subtitle: 'Your Command Center',
    duration: '1-2 hours',
    description: 'The terminal is where Claude Code lives. Learn to navigate it confidently with hands-on practice in a safe, simulated environment.',
    learningObjectives: [
      'Understand what a terminal is and why developers use it',
      'Navigate directories with cd, ls, and pwd',
      'Create and manage files and folders',
      'Read file contents from the command line',
    ],
    exercises: [
      {
        id: '1-1',
        title: 'Navigation Basics',
        description: 'Learn to move around the filesystem',
        type: 'terminal',
        instructions: [
          'Use pwd to see where you are',
          'Use ls to list files in the current directory',
          'Use cd documents to enter the documents folder',
          'Use cd .. to go back up one level',
        ],
        hints: [
          'pwd stands for "print working directory"',
          'ls stands for "list"',
          'cd stands for "change directory"',
        ],
        validation: {
          type: 'command',
          value: 'cd',
        },
      },
      {
        id: '1-2',
        title: 'Creating Structure',
        description: 'Create files and folders',
        type: 'terminal',
        instructions: [
          'Use mkdir my-project to create a new folder',
          'Use cd my-project to enter it',
          'Use touch index.html to create a file',
          'Use ls to verify your file was created',
        ],
        hints: [
          'mkdir stands for "make directory"',
          'touch creates an empty file',
        ],
        validation: {
          type: 'file-exists',
          value: '/home/user/my-project/index.html',
        },
      },
      {
        id: '1-3',
        title: 'Project Structure',
        description: 'Build a real project folder structure',
        type: 'terminal',
        instructions: [
          'Create a folder structure for your project from the Project Brief',
          'Include folders for: src, public, docs',
          'Create at least one file in each folder',
        ],
        validation: {
          type: 'custom',
          value: 'project-structure',
        },
      },
    ],
    isSimulated: true,
    requiresProject: true,
  },
  {
    id: '2',
    title: 'Git & GitHub',
    subtitle: 'Version Control Basics',
    duration: '1-2 hours',
    description: 'Git tracks changes to your code and GitHub stores it online. These tools are essential for working with Claude Code and collaborating on projects.',
    learningObjectives: [
      'Understand what Git is and why version control matters',
      'Learn essential Git commands: init, add, commit, push, pull',
      'Understand what GitHub is and how it relates to Git',
      'Connect a local project to GitHub',
      'Know how Claude Code uses Git in its workflow',
    ],
    exercises: [
      {
        id: '2-1',
        title: 'Git Concepts',
        description: 'Understand the mental model of version control',
        type: 'quiz',
        instructions: [
          'Learn what a "commit" is (a snapshot of your code)',
          'Understand the staging area (preparing changes)',
          'Know the difference between local and remote repositories',
        ],
      },
      {
        id: '2-2',
        title: 'Your First Repository',
        description: 'Create a Git repository and make commits',
        type: 'project',
        instructions: [
          'Install Git if not already installed',
          'Run git init in your project folder',
          'Add files with git add .',
          'Make your first commit with git commit -m "Initial commit"',
        ],
        hints: [
          'git status shows you what\'s changed',
          'git log shows your commit history',
        ],
      },
      {
        id: '2-3',
        title: 'Push to GitHub',
        description: 'Connect your project to GitHub',
        type: 'project',
        instructions: [
          'Create a free GitHub account if needed',
          'Create a new repository on GitHub',
          'Connect your local repo: git remote add origin <url>',
          'Push your code: git push -u origin main',
        ],
        hints: [
          'GitHub will show you the exact commands to run',
          'You may need to set up SSH keys or use HTTPS',
        ],
      },
    ],
    isSimulated: false,
    requiresProject: true,
  },
  {
    id: '3',
    title: 'How the Internet Works',
    subtitle: 'The Big Picture',
    duration: '1 hour',
    description: 'Before building for the web, understand how it works. Visual explanations of clients, servers, APIs, and databases.',
    learningObjectives: [
      'Understand the client/server model',
      'Know what happens when you visit a URL',
      'Understand what APIs are and why they matter',
      'Know when you need a database vs. when you don\'t',
    ],
    exercises: [
      {
        id: '3-1',
        title: 'Map Your Project',
        description: 'Identify the components your project needs',
        type: 'project',
        instructions: [
          'Does your project need a user interface (frontend)?',
          'Does it need to process data (backend)?',
          'Does it need to store data (database)?',
          'Does it need to talk to other services (APIs)?',
        ],
      },
      {
        id: '3-2',
        title: 'Data Flow Diagram',
        description: 'Draw how data moves through your project',
        type: 'project',
        instructions: [
          'Identify where data comes from',
          'Trace how it moves through your system',
          'Note where it gets stored or sent',
        ],
      },
    ],
    isSimulated: true,
    requiresProject: true,
  },
  {
    id: '4',
    title: 'The Art of Scoping',
    subtitle: 'The Most Important Skill',
    duration: '1 hour',
    description: 'Vague prompts lead to vague results. Learn to break big ideas into small, concrete, achievable tasks.',
    learningObjectives: [
      'Understand why scoping matters for AI success',
      'Break large projects into sequential tasks',
      'Write clear, specific task descriptions',
      'Identify dependencies between tasks',
    ],
    exercises: [
      {
        id: '4-1',
        title: 'The 5-Year-Old Test',
        description: 'Practice explaining tasks simply',
        type: 'quiz',
        instructions: [
          'Take each task from your project',
          'Explain it as if to a 5-year-old',
          'If you can\'t, break it down further',
        ],
      },
      {
        id: '4-2',
        title: 'Task Breakdown',
        description: 'Break your project into 5-10 specific tasks',
        type: 'project',
        instructions: [
          'List every step needed to complete your project',
          'Put them in order (what depends on what?)',
          'Make each task concrete and achievable',
          'Submit for AI review',
        ],
      },
      {
        id: '4-3',
        title: 'Scope Review',
        description: 'Get AI feedback on your task breakdown',
        type: 'chat',
        instructions: [
          'Share your task list with the AI',
          'Discuss any tasks that are too vague',
          'Refine based on feedback',
        ],
      },
    ],
    isSimulated: true,
    requiresProject: true,
  },
  {
    id: '5',
    title: 'Prompting Effectively',
    subtitle: 'Speaking Claude\'s Language',
    duration: '1-2 hours',
    description: 'Learn to write prompts that get results. Practice with a simulated Claude Code environment before using the real thing.',
    learningObjectives: [
      'Understand the anatomy of a good prompt',
      'Know what context Claude needs',
      'Balance specificity with flexibility',
      'Learn to iterate and course-correct',
    ],
    exercises: [
      {
        id: '5-1',
        title: 'Fix Bad Prompts',
        description: 'Improve poorly written prompts',
        type: 'quiz',
        instructions: [
          'Review each bad prompt example',
          'Identify what\'s wrong with it',
          'Rewrite it to be more effective',
        ],
      },
      {
        id: '5-2',
        title: 'Prompt Practice',
        description: 'Write prompts for common scenarios',
        type: 'code',
        instructions: [
          'Write a prompt to create a new file',
          'Write a prompt to fix a bug',
          'Write a prompt to add a feature',
        ],
      },
      {
        id: '5-3',
        title: 'Your First Prompt',
        description: 'Write the opening prompt for your project',
        type: 'project',
        instructions: [
          'Take the first task from your task list',
          'Write a detailed prompt for Claude Code',
          'Include all necessary context',
          'Get AI feedback on your prompt',
        ],
      },
    ],
    isSimulated: true,
    requiresProject: true,
  },
  {
    id: '6',
    title: 'Claude Code in Action',
    subtitle: 'Going Live',
    duration: '2 hours',
    description: 'Time to use the real Claude Code. Install it, run your first prompt, and start building your actual project.',
    learningObjectives: [
      'Install Claude Code on your machine',
      'Understand the prompt-review-iterate workflow',
      'Read and understand Claude\'s output',
      'Know when to accept and when to push back',
    ],
    exercises: [
      {
        id: '6-1',
        title: 'Installation',
        description: 'Install Claude Code locally',
        type: 'project',
        instructions: [
          'Follow the installation guide',
          'Verify Claude Code is working',
          'Run your first command',
        ],
      },
      {
        id: '6-2',
        title: 'First Real Task',
        description: 'Complete task #1 from your project',
        type: 'project',
        instructions: [
          'Use the prompt you wrote in Module 5',
          'Review Claude\'s output carefully',
          'Iterate until the task is complete',
        ],
      },
    ],
    isSimulated: false,
    requiresProject: true,
  },
  {
    id: '7',
    title: 'Automation Basics',
    subtitle: 'Making Things Happen Automatically',
    duration: '1-2 hours',
    description: 'Learn what can be automated, common patterns, and tools like n8n, Make, and Zapier.',
    learningObjectives: [
      'Identify automation opportunities',
      'Understand triggers and actions',
      'Know which automation tool to use when',
      'Add automation to your project if relevant',
    ],
    exercises: [
      {
        id: '7-1',
        title: 'Automation Audit',
        description: 'Find automation opportunities in your project',
        type: 'project',
        instructions: [
          'Review your project\'s workflow',
          'Identify repetitive or triggered actions',
          'Note what could run automatically',
        ],
      },
      {
        id: '7-2',
        title: 'Build an Automation',
        description: 'Add automation to your project',
        type: 'project',
        instructions: [
          'Choose one automation to implement',
          'Use n8n, Make, or Zapier',
          'Test that it works reliably',
        ],
      },
    ],
    isSimulated: false,
    requiresProject: true,
  },
  {
    id: '8',
    title: 'Hosting & Deployment',
    subtitle: 'Going Live on the Internet',
    duration: '1-2 hours',
    description: 'Your project shouldn\'t live only on your computer. Learn to deploy it to the internet for real use.',
    learningObjectives: [
      'Understand hosting options and when to use each',
      'Know the basics of domains and DNS',
      'Handle environment variables and secrets safely',
      'Deploy your project to a live URL',
    ],
    exercises: [
      {
        id: '8-1',
        title: 'Choose a Host',
        description: 'Select the right hosting for your project',
        type: 'project',
        instructions: [
          'Review your project\'s requirements',
          'Compare Railway, Vercel, and Render',
          'Choose the best fit',
        ],
      },
      {
        id: '8-2',
        title: 'Deploy',
        description: 'Get your project live on the internet',
        type: 'project',
        instructions: [
          'Set up your hosting account',
          'Configure environment variables',
          'Deploy your project',
          'Test the live URL',
        ],
      },
    ],
    isSimulated: false,
    requiresProject: true,
  },
  {
    id: '9',
    title: 'Graduation Project',
    subtitle: 'Finishing Strong',
    duration: '2+ hours',
    description: 'Complete your project, polish it up, and document what you built. You\'re about to have a real, working tool.',
    learningObjectives: [
      'Complete all remaining project tasks',
      'Debug issues with AI assistance',
      'Document your project',
      'Have a working, deployed tool',
    ],
    exercises: [
      {
        id: '9-1',
        title: 'Complete All Tasks',
        description: 'Finish every task on your list',
        type: 'project',
        instructions: [
          'Work through remaining tasks',
          'Use AI assistance when stuck',
          'Test everything works together',
        ],
      },
      {
        id: '9-2',
        title: 'Documentation',
        description: 'Write a README for your project',
        type: 'project',
        instructions: [
          'Describe what your project does',
          'List how to set it up',
          'Document any configuration needed',
        ],
      },
      {
        id: '9-3',
        title: 'Graduation',
        description: 'Celebrate your completed project!',
        type: 'project',
        instructions: [
          'Review everything you built',
          'Share your project URL',
          'Plan your next project',
        ],
      },
    ],
    isSimulated: false,
    requiresProject: true,
  },
];

export function getModule(id: string): Module | undefined {
  return modules.find(m => m.id === id);
}

export function getExercise(moduleId: string, exerciseId: string): Exercise | undefined {
  const module = getModule(moduleId);
  return module?.exercises.find(e => e.id === exerciseId);
}

export function getNextModule(currentId: string): Module | undefined {
  const currentIndex = modules.findIndex(m => m.id === currentId);
  if (currentIndex === -1 || currentIndex === modules.length - 1) {
    return undefined;
  }
  return modules[currentIndex + 1];
}

export function getPreviousModule(currentId: string): Module | undefined {
  const currentIndex = modules.findIndex(m => m.id === currentId);
  if (currentIndex <= 0) {
    return undefined;
  }
  return modules[currentIndex - 1];
}

export function getTotalExercises(): number {
  return modules.reduce((sum, m) => sum + m.exercises.length, 0);
}
