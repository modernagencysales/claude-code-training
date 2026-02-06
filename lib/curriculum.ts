// Curriculum structure and module definitions

// ============================================
// Enhanced Exercise Framework Types
// ============================================

export interface MentalModel {
  coreInsight: string;           // The "aha" moment in one sentence
  analogy: string;               // Real-world comparison
  conceptsExplained: {           // Technical terms broken down
    term: string;
    meaning: string;
    example: string;
  }[];
  commonMisconceptions: {        // What people often get wrong
    misconception: string;
    reality: string;
  }[];
}

export interface WalkthroughStep {
  instruction: string;           // What to do
  why: string;                   // Why we're doing it
  expectedOutput: string;        // What you should see
  screenshot?: string;           // Optional visual
  variations?: {                 // Common variations
    scenario: string;
    output: string;
  }[];
}

export interface TroubleshootingGuide {
  symptom: string;               // What went wrong
  meaning: string;               // What it actually means
  reassurance: string;           // "This is normal because..."
  solution: string;              // How to fix it
  verification: string;          // How to confirm it's fixed
}

export interface VerificationCheckpoint {
  description: string;
  command?: string;
  expectedResult: string;
  ifDifferent: string;
}

export interface VerificationProtocol {
  checkpoints: VerificationCheckpoint[];
  falsePositives: {              // Things that look wrong but aren't
    appearance: string;
    explanation: string;
  }[];
}

export interface Scaffolding {
  guided: {                      // Step-by-step hand-holding
    steps: WalkthroughStep[];
  };
  supported: {                   // Hints available
    task: string;
    hints: string[];
    solution: string;
  };
  independent: {                 // On your own
    challenge: string;
    successCriteria: string[];
  };
}

export interface ConceptBridge {
  skillAcquired: string;
  connectionToNext: string;
  futureApplication: string;
}

export interface EnhancedExercise {
  id: string;
  title: string;
  description: string;
  type: 'terminal' | 'code' | 'quiz' | 'project' | 'chat';
  duration: {
    beginner: string;
    intermediate: string;
    review: string;
  };

  mentalModel: MentalModel;
  walkthrough: {
    overview: string;
    steps: WalkthroughStep[];
    videoDemo?: string;
  };
  troubleshooting: TroubleshootingGuide[];
  verification: VerificationProtocol;
  conceptBridge: ConceptBridge;
  practice: Scaffolding;

  validation?: {
    type: string;
    check: string;
    successMessage: string;
    failureHint: string;
  };
  difficultyLevel: 1 | 2 | 3;
}

// ============================================
// Legacy Exercise Type (for backwards compatibility)
// ============================================

export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: 'terminal' | 'code' | 'quiz' | 'project' | 'chat';
  context?: string; // Why this matters / background info
  instructions: string[];
  expectedOutcome?: string; // What "done" looks like
  successCriteria?: string[]; // Checklist to verify completion
  exampleOutput?: string; // Show what success looks like
  hints?: string[];
  validation?: {
    type: 'command' | 'file-exists' | 'file-contains' | 'custom';
    value: string;
  };

  // Enhanced fields (optional for gradual migration)
  mentalModel?: MentalModel;
  walkthrough?: {
    overview: string;
    steps: WalkthroughStep[];
  };
  troubleshooting?: TroubleshootingGuide[];
  verificationProtocol?: VerificationProtocol;
  conceptBridge?: ConceptBridge;
  practice?: Scaffolding;
  duration?: {
    beginner: string;
    intermediate: string;
    review: string;
  };
  difficultyLevel?: 1 | 2 | 3;
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
        context: 'The best coding projects solve real problems YOU actually have. Before we can build anything, we need to identify what\'s worth building. This exercise helps you mine your daily work for automation opportunities.',
        instructions: [
          'Set a 5-minute timer and brainstorm without filtering',
          'Think about tasks you do EVERY day or week that feel repetitive',
          'Consider: What do you copy-paste between apps? What reports do you create manually? What questions do you answer repeatedly?',
          'Write down at least 3 specific processes (the more specific, the better)',
        ],
        expectedOutcome: 'You should have 3+ concrete ideas written down. Each should describe a specific task, not a vague goal.',
        successCriteria: [
          'You have at least 3 ideas written down',
          'Each idea describes a specific, repeatable process (not a vague goal like "be more productive")',
          'You can estimate how often you do each task (daily, weekly, etc.)',
          'At least one idea makes you think "I wish someone would just automate this"',
        ],
        exampleOutput: 'Good example: "Every Monday I manually copy order data from Shopify into a Google Sheet, calculate totals, and email the summary to my team."\n\nBad example: "I want to be more organized" (too vague)',
      },
      {
        id: '0-2',
        title: 'AI Scoping Session',
        description: 'Work with AI to pick and scope your project',
        type: 'chat',
        context: 'Most first-time coders fail because they try to build something too big. This AI-guided conversation will help you pick ONE project and scope it down to something you can actually finish.',
        instructions: [
          'Share your 3 brainstormed ideas with the AI assistant',
          'Be honest about which one frustrates you most (that\'s usually the best choice)',
          'Answer the AI\'s clarifying questions - the more specific you are, the better your project will be',
          'Work with the AI until you have a clear Project Brief with 5-10 specific tasks',
        ],
        expectedOutcome: 'A completed Project Brief with: a clear title, one-sentence description, who will use it, and 5-10 specific tasks.',
        successCriteria: [
          'You\'ve selected ONE project (not trying to do all 3)',
          'Your Project Brief has a clear, specific title',
          'The task list has 5-10 items (not fewer, not many more)',
          'Each task is something you can imagine completing in 1-2 hours',
          'You can explain the project to a friend in 1-2 sentences',
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
        context: 'The terminal shows you one folder at a time. You need to know where you are and how to move around. Think of it like navigating through folders in Finder/Explorer, but with text commands instead of clicks.',
        instructions: [
          'Type pwd and press Enter - this shows your current location (like a "You Are Here" sign)',
          'Type ls and press Enter - this lists everything in your current folder',
          'Type cd documents and press Enter - this moves you INTO the documents folder',
          'Type pwd again to confirm you moved - your location should now include "documents"',
          'Type cd .. and press Enter - the two dots mean "go up one level" (back to where you started)',
          'Type pwd one more time to confirm you\'re back where you started',
        ],
        expectedOutcome: 'You can navigate in and out of folders and always know where you are.',
        successCriteria: [
          'pwd shows your current location (something like /home/user)',
          'ls shows a list of files and folders',
          'After cd documents, pwd shows you\'re now inside documents',
          'After cd .., pwd shows you\'re back to your starting location',
        ],
        exampleOutput: '$ pwd\n/home/user\n$ ls\ndocuments  downloads  projects\n$ cd documents\n$ pwd\n/home/user/documents',
        hints: [
          'pwd = "print working directory" (where am I?)',
          'ls = "list" (what\'s here?)',
          'cd = "change directory" (go somewhere)',
          'cd .. = go up/back one folder',
        ],
        validation: {
          type: 'command',
          value: 'cd',
        },
        // Enhanced framework fields
        duration: {
          beginner: '15-20 minutes',
          intermediate: '5-10 minutes',
          review: '2-3 minutes',
        },
        difficultyLevel: 1 as const,
        mentalModel: {
          coreInsight: 'The terminal is just a text-based file explorer - same folders, different view',
          analogy: 'Think of your computer like a building. Folders are rooms. `cd` is walking between rooms. `ls` is looking around the room you\'re in. `pwd` is checking the room number on the door.',
          conceptsExplained: [
            {
              term: 'directory',
              meaning: 'Another word for folder - they\'re identical',
              example: 'Your "Documents" folder is also the "Documents directory"',
            },
            {
              term: 'path',
              meaning: 'The address of a folder, like a street address',
              example: '/Users/yourname/Documents - read as "Users folder, then yourname folder, then Documents folder"',
            },
            {
              term: 'home directory',
              meaning: 'Your personal folder - where your stuff lives',
              example: 'Usually /Users/yourname on Mac or /home/yourname on Linux',
            },
          ],
          commonMisconceptions: [
            {
              misconception: 'The terminal is "code" or "programming"',
              reality: 'It\'s just typing commands instead of clicking - same computer, different interface',
            },
            {
              misconception: 'You can break your computer with wrong commands',
              reality: 'In this simulator, you can\'t break anything. In real terminals, dangerous commands require confirmation',
            },
          ],
        },
        walkthrough: {
          overview: 'You\'ll learn three commands: pwd (where am I?), ls (what\'s here?), cd (go somewhere)',
          steps: [
            {
              instruction: 'Type `pwd` and press Enter',
              why: 'This shows your current location - essential before moving anywhere',
              expectedOutput: '/home/user',
              variations: [
                { scenario: 'On a Mac', output: '/Users/yourname' },
                { scenario: 'On Linux', output: '/home/yourname' },
              ],
            },
            {
              instruction: 'Type `ls` and press Enter',
              why: 'This lists what\'s in your current folder - like opening your eyes in a room',
              expectedOutput: 'documents  desktop  projects',
              variations: [
                { scenario: 'Empty folder', output: '(nothing appears - the folder is empty, that\'s okay!)' },
              ],
            },
            {
              instruction: 'Type `cd documents` and press Enter',
              why: 'This moves you into the documents folder',
              expectedOutput: '(no output means success!)',
            },
            {
              instruction: 'Type `pwd` again',
              why: 'Confirm you moved - always verify after navigation',
              expectedOutput: '/home/user/documents',
            },
            {
              instruction: 'Type `cd ..` and press Enter',
              why: 'The two dots mean "go up one level" - back to where you started',
              expectedOutput: '(no output)',
            },
          ],
        },
        troubleshooting: [
          {
            symptom: 'bash: cd: documents: No such file or directory',
            meaning: 'The folder "documents" doesn\'t exist in your current location',
            reassurance: 'This is the most common error - you\'re just looking in the wrong place',
            solution: 'Run `ls` first to see what folders actually exist here, then cd into one of those',
            verification: 'Run `ls` and confirm you see the folder you want to enter',
          },
          {
            symptom: 'Nothing happened after cd',
            meaning: 'That\'s success! cd doesn\'t print anything when it works',
            reassurance: 'Unlike graphical interfaces, terminal commands are quiet when successful',
            solution: 'Run `pwd` to confirm you\'re in the new location',
            verification: 'pwd shows a different path than before',
          },
          {
            symptom: 'Command not found',
            meaning: 'You may have a typo in the command name',
            reassurance: 'Even experienced developers make typos constantly',
            solution: 'Check spelling: pwd (not pws), ls (not is or Is), cd (not Cd)',
            verification: 'The command runs without the "not found" error',
          },
        ],
        verificationProtocol: {
          checkpoints: [
            {
              description: 'You can see your current location',
              command: 'pwd',
              expectedResult: 'Shows a path like /home/user or /Users/yourname',
              ifDifferent: 'Any path is correct - this confirms pwd works',
            },
            {
              description: 'You can list folder contents',
              command: 'ls',
              expectedResult: 'Shows files/folders OR nothing (if empty)',
              ifDifferent: 'Both outcomes are correct!',
            },
            {
              description: 'You can move into a folder',
              command: 'cd [foldername] && pwd',
              expectedResult: 'Path now includes the folder you entered',
              ifDifferent: 'Make sure the folder exists (check with ls first)',
            },
          ],
          falsePositives: [
            {
              appearance: 'ls shows nothing',
              explanation: 'Empty folders are valid - you\'re in an empty directory',
            },
            {
              appearance: 'The prompt looks different after cd',
              explanation: 'Many terminals show your current folder in the prompt - that\'s helpful!',
            },
          ],
        },
        practice: {
          guided: {
            steps: [
              {
                instruction: 'Type `pwd` and press Enter',
                why: 'This shows your current location - essential before moving anywhere',
                expectedOutput: '/home/user',
              },
              {
                instruction: 'Type `ls` and press Enter',
                why: 'This lists what\'s in your current folder',
                expectedOutput: 'documents  desktop  projects',
              },
              {
                instruction: 'Type `cd documents` and press Enter',
                why: 'This moves you into the documents folder',
                expectedOutput: '(no output means success!)',
              },
            ],
          },
          supported: {
            task: 'Navigate to the projects folder inside your home directory',
            hints: [
              'First, make sure you\'re in your home directory (cd ~)',
              'Use ls to see if projects exists',
              'cd into projects',
            ],
            solution: 'cd ~ && cd projects (or cd ~/projects)',
          },
          independent: {
            challenge: 'Starting from anywhere, navigate to ~/documents, list its contents, and return to home',
            successCriteria: [
              'pwd shows ~/documents at the midpoint',
              'ls shows files inside documents',
              'pwd shows ~ (home) at the end',
            ],
          },
        },
        conceptBridge: {
          skillAcquired: 'Navigate the filesystem using pwd, ls, and cd',
          connectionToNext: 'Now that you can move around, you\'ll learn to create folders and files',
          futureApplication: 'When using Claude Code, you\'ll navigate to your project folder before asking Claude to help',
        },
      },
      {
        id: '1-2',
        title: 'Creating Structure',
        description: 'Create files and folders',
        type: 'terminal',
        context: 'Every coding project needs a folder to live in, and files to hold the code. Here you\'ll learn to create both from scratch.',
        instructions: [
          'First, make sure you\'re in a good starting location: type cd ~ (this goes to your home folder)',
          'Type mkdir my-project - this creates a new folder called "my-project"',
          'Type ls to verify - you should see "my-project" in the list',
          'Type cd my-project to enter your new folder',
          'Type pwd to confirm you\'re inside (should end with /my-project)',
          'Type touch index.html - this creates an empty file called "index.html"',
          'Type ls to verify - you should see "index.html" listed',
          'Type cat index.html - this shows the file contents (it will be empty, which is expected)',
        ],
        expectedOutcome: 'You\'ve created a project folder with an HTML file inside it.',
        successCriteria: [
          'A folder called "my-project" exists',
          'You can cd into my-project',
          'A file called "index.html" exists inside my-project',
          'ls inside my-project shows index.html',
        ],
        exampleOutput: '$ mkdir my-project\n$ ls\nmy-project\n$ cd my-project\n$ touch index.html\n$ ls\nindex.html',
        hints: [
          'mkdir = "make directory" (create folder)',
          'touch = create an empty file',
          'If you get "No such file or directory", you probably mistyped the folder name',
        ],
        validation: {
          type: 'file-exists',
          value: '/home/user/my-project/index.html',
        },
        // Enhanced framework fields
        duration: {
          beginner: '10-15 minutes',
          intermediate: '5 minutes',
          review: '2 minutes',
        },
        difficultyLevel: 1 as const,
        mentalModel: {
          coreInsight: 'Creating folders and files is like organizing physical items - you need containers (folders) before you can put things (files) in them',
          analogy: 'Think of `mkdir` like buying a new filing cabinet, and `touch` like putting a blank piece of paper inside it. The file exists even if it\'s empty.',
          conceptsExplained: [
            {
              term: 'mkdir',
              meaning: 'Make directory - creates a new empty folder',
              example: 'mkdir photos creates a folder named "photos"',
            },
            {
              term: 'touch',
              meaning: 'Create an empty file (or update its timestamp if it exists)',
              example: 'touch notes.txt creates an empty file called notes.txt',
            },
            {
              term: 'cat',
              meaning: 'Display the contents of a file (short for "concatenate")',
              example: 'cat readme.txt shows what\'s inside readme.txt',
            },
          ],
          commonMisconceptions: [
            {
              misconception: 'You need to specify a file extension for folders',
              reality: 'Folders don\'t have extensions. `mkdir myproject` is correct, not `mkdir myproject.folder`',
            },
            {
              misconception: 'touch creates files with content',
              reality: 'touch creates completely empty files. Use echo or an editor to add content',
            },
          ],
        },
        walkthrough: {
          overview: 'You\'ll create a project folder and add your first file inside it',
          steps: [
            {
              instruction: 'Type `cd ~` and press Enter',
              why: 'Go to your home folder - a clean starting point',
              expectedOutput: '(no output)',
            },
            {
              instruction: 'Type `mkdir my-project` and press Enter',
              why: 'Create a new folder for your project',
              expectedOutput: '(no output means success)',
            },
            {
              instruction: 'Type `ls` to verify',
              why: 'Confirm the folder was created',
              expectedOutput: 'my-project (among other folders)',
            },
            {
              instruction: 'Type `cd my-project`',
              why: 'Enter the folder you just created',
              expectedOutput: '(no output)',
            },
            {
              instruction: 'Type `touch index.html`',
              why: 'Create your first file - a blank HTML file',
              expectedOutput: '(no output)',
            },
            {
              instruction: 'Type `ls` to verify',
              why: 'Confirm the file was created',
              expectedOutput: 'index.html',
            },
          ],
        },
        troubleshooting: [
          {
            symptom: 'mkdir: cannot create directory: File exists',
            meaning: 'A folder with that name already exists',
            reassurance: 'This is fine - the folder is already there',
            solution: 'Just cd into the existing folder, or choose a different name',
            verification: 'ls shows the folder exists',
          },
          {
            symptom: 'touch: cannot touch: No such file or directory',
            meaning: 'The parent folder doesn\'t exist',
            reassurance: 'You need to create folders before creating files inside them',
            solution: 'Make sure you\'re in the right folder (pwd), or create the folder first (mkdir)',
            verification: 'pwd shows you\'re in the folder where you want the file',
          },
          {
            symptom: 'cat shows nothing',
            meaning: 'The file is empty (which is expected after touch)',
            reassurance: 'An empty file is still a valid file',
            solution: 'This is correct! touch creates empty files',
            verification: 'ls shows the file exists, even if cat shows nothing',
          },
        ],
        verificationProtocol: {
          checkpoints: [
            {
              description: 'The folder exists',
              command: 'ls ~',
              expectedResult: 'my-project appears in the list',
              ifDifferent: 'Run mkdir my-project from your home directory',
            },
            {
              description: 'The file exists inside the folder',
              command: 'ls ~/my-project',
              expectedResult: 'index.html appears',
              ifDifferent: 'cd into my-project first, then run touch index.html',
            },
          ],
          falsePositives: [
            {
              appearance: 'cat index.html shows nothing',
              explanation: 'Empty output is correct - touch creates empty files',
            },
          ],
        },
        practice: {
          guided: {
            steps: [
              {
                instruction: 'Type `cd ~`',
                why: 'Start from home directory',
                expectedOutput: '(no output)',
              },
              {
                instruction: 'Type `mkdir my-project`',
                why: 'Create the project folder',
                expectedOutput: '(no output)',
              },
              {
                instruction: 'Type `cd my-project && touch index.html`',
                why: 'Enter folder and create file in one line',
                expectedOutput: '(no output)',
              },
            ],
          },
          supported: {
            task: 'Create a folder called "notes" with a file called "todo.txt" inside it',
            hints: [
              'First create the folder with mkdir',
              'Then cd into it',
              'Then create the file with touch',
            ],
            solution: 'mkdir notes && cd notes && touch todo.txt',
          },
          independent: {
            challenge: 'Create a folder called "website" containing two files: index.html and style.css',
            successCriteria: [
              'ls ~/website shows both index.html and style.css',
              'Both files exist (even if empty)',
            ],
          },
        },
        conceptBridge: {
          skillAcquired: 'Create folders and files from the command line',
          connectionToNext: 'Next you\'ll create a complete project structure with multiple folders',
          futureApplication: 'When Claude Code creates files, you\'ll understand where they go and can verify they exist',
        },
      },
      {
        id: '1-3',
        title: 'Project Structure',
        description: 'Build a complete project folder structure',
        type: 'terminal',
        context: 'Real projects have multiple folders to keep code organized. A typical structure separates source code (src), public files (public), and documentation (docs). This organization makes projects easier to navigate and maintain.',
        instructions: [
          'Start fresh: cd ~ then mkdir real-project then cd real-project',
          'Create three folders: mkdir src, mkdir public, mkdir docs',
          'Type ls to verify all three folders exist',
          'Enter the src folder: cd src',
          'Create a main file: touch app.js',
          'Go back up: cd ..',
          'Enter public folder: cd public',
          'Create a homepage: touch index.html',
          'Go back up: cd ..',
          'Enter docs folder: cd docs',
          'Create a readme: touch README.md',
          'Go back to project root: cd ..',
          'Verify structure: type ls to see all folders, then ls src, ls public, ls docs to see files inside each',
        ],
        expectedOutcome: 'A project folder with three subfolders (src, public, docs), each containing one file.',
        successCriteria: [
          'real-project folder exists with src, public, and docs inside',
          'src contains app.js',
          'public contains index.html',
          'docs contains README.md',
          'You can navigate in and out of each folder confidently',
        ],
        exampleOutput: '$ ls\nsrc  public  docs\n$ ls src\napp.js\n$ ls public\nindex.html\n$ ls docs\nREADME.md',
        hints: [
          'You can create multiple folders at once: mkdir src public docs',
          'If you get lost, use pwd to see where you are',
          'Use cd .. to go up, cd foldername to go in',
        ],
        validation: {
          type: 'custom',
          value: 'project-structure',
        },
        // Enhanced framework fields
        duration: {
          beginner: '15-20 minutes',
          intermediate: '5-8 minutes',
          review: '3 minutes',
        },
        difficultyLevel: 2 as const,
        mentalModel: {
          coreInsight: 'Project structure is like a filing system - organized folders make finding and managing code much easier',
          analogy: 'Think of a project like a house. `src` is where you live (your actual code), `public` is the front yard (what visitors see), and `docs` is the instruction manual (how things work).',
          conceptsExplained: [
            {
              term: 'src',
              meaning: 'Source code folder - where your application logic lives',
              example: 'src/app.js contains the main code that runs your app',
            },
            {
              term: 'public',
              meaning: 'Public assets - files served directly to users',
              example: 'public/index.html is the webpage users see in their browser',
            },
            {
              term: 'docs',
              meaning: 'Documentation - files that explain your project',
              example: 'docs/README.md tells people what your project does and how to use it',
            },
          ],
          commonMisconceptions: [
            {
              misconception: 'You can put all files in one folder',
              reality: 'While possible, it becomes chaotic quickly. Structure helps you and others find things',
            },
            {
              misconception: 'Folder names don\'t matter',
              reality: 'Standard names (src, public, docs) help everyone understand your project instantly',
            },
          ],
        },
        walkthrough: {
          overview: 'You\'ll create a professional project structure with three main folders, each with its own purpose',
          steps: [
            {
              instruction: 'Type `cd ~` then `mkdir real-project` then `cd real-project`',
              why: 'Start fresh in a new project folder',
              expectedOutput: '(no output - you\'re now in real-project)',
            },
            {
              instruction: 'Type `mkdir src public docs`',
              why: 'Create all three folders at once (you can list multiple names)',
              expectedOutput: '(no output)',
            },
            {
              instruction: 'Type `ls` to verify',
              why: 'Confirm all folders were created',
              expectedOutput: 'docs  public  src',
            },
            {
              instruction: 'Type `cd src && touch app.js && cd ..`',
              why: 'Enter src, create the main app file, and return',
              expectedOutput: '(no output)',
            },
            {
              instruction: 'Type `cd public && touch index.html && cd ..`',
              why: 'Enter public, create the homepage, and return',
              expectedOutput: '(no output)',
            },
            {
              instruction: 'Type `cd docs && touch README.md && cd ..`',
              why: 'Enter docs, create the readme, and return',
              expectedOutput: '(no output)',
            },
            {
              instruction: 'Type `ls src && ls public && ls docs`',
              why: 'Verify each folder has its file',
              expectedOutput: 'app.js\nindex.html\nREADME.md',
            },
          ],
        },
        troubleshooting: [
          {
            symptom: 'mkdir: cannot create directory: File exists',
            meaning: 'One of the folders already exists',
            reassurance: 'This is fine - it means you already created it',
            solution: 'Continue with the next step - the folder is already there',
            verification: 'ls shows all three folders',
          },
          {
            symptom: 'I\'m lost and don\'t know where I am',
            meaning: 'You\'ve navigated somewhere unexpected',
            reassurance: 'This happens to everyone - that\'s why pwd exists',
            solution: 'Type pwd to see where you are, then cd ~ to go home and cd real-project to get back',
            verification: 'pwd shows /home/user/real-project',
          },
          {
            symptom: 'ls shows files in wrong folder',
            meaning: 'You might have created files in the wrong location',
            reassurance: 'Easy to fix by moving or recreating files',
            solution: 'Navigate to the correct folder first, then create the file',
            verification: 'ls src shows app.js, ls public shows index.html, ls docs shows README.md',
          },
        ],
        verificationProtocol: {
          checkpoints: [
            {
              description: 'Project folder exists',
              command: 'ls ~ | grep real-project',
              expectedResult: 'real-project appears',
              ifDifferent: 'Create it with mkdir ~/real-project',
            },
            {
              description: 'All three subfolders exist',
              command: 'ls ~/real-project',
              expectedResult: 'docs public src',
              ifDifferent: 'Create missing folders: mkdir ~/real-project/src etc.',
            },
            {
              description: 'Each folder has its file',
              command: 'ls ~/real-project/src ~/real-project/public ~/real-project/docs',
              expectedResult: 'app.js, index.html, README.md',
              ifDifferent: 'Create missing files with touch inside each folder',
            },
          ],
          falsePositives: [
            {
              appearance: 'Files are listed in a different order',
              explanation: 'ls may sort alphabetically - order doesn\'t matter',
            },
          ],
        },
        practice: {
          guided: {
            steps: [
              {
                instruction: 'Type `cd ~ && mkdir real-project && cd real-project`',
                why: 'Create and enter the project folder',
                expectedOutput: '(no output)',
              },
              {
                instruction: 'Type `mkdir src public docs`',
                why: 'Create all subfolders at once',
                expectedOutput: '(no output)',
              },
              {
                instruction: 'Type `touch src/app.js public/index.html docs/README.md`',
                why: 'Create files directly without changing directories',
                expectedOutput: '(no output)',
              },
            ],
          },
          supported: {
            task: 'Create a project called "my-website" with folders: pages, styles, scripts, and one file in each',
            hints: [
              'First mkdir my-website and cd into it',
              'Create all folders: mkdir pages styles scripts',
              'Create files: touch pages/home.html styles/main.css scripts/app.js',
            ],
            solution: 'mkdir my-website && cd my-website && mkdir pages styles scripts && touch pages/home.html styles/main.css scripts/app.js',
          },
          independent: {
            challenge: 'Create a project called "api-server" with: src (containing server.js and routes.js), config (containing settings.json), and tests (containing server.test.js)',
            successCriteria: [
              'ls ~/api-server/src shows server.js and routes.js',
              'ls ~/api-server/config shows settings.json',
              'ls ~/api-server/tests shows server.test.js',
            ],
          },
        },
        conceptBridge: {
          skillAcquired: 'Create organized project structures with multiple folders and files',
          connectionToNext: 'You now know terminal basics! Next you\'ll learn Git - how to save snapshots of your project',
          futureApplication: 'When Claude Code creates project files, they\'ll go in organized folders like these',
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
        title: 'Git Concepts Quiz',
        description: 'Understand the mental model of version control',
        type: 'quiz',
        context: 'Before using Git commands, you need to understand what Git is actually doing. Think of Git as a time machine for your code - it saves snapshots so you can always go back.',
        instructions: [
          'Read through the concepts above and answer the quiz questions',
          'A "commit" is like saving a checkpoint in a video game - a snapshot you can return to',
          'The "staging area" is like a shopping cart - you add items before checkout (commit)',
          '"Local" means on your computer, "remote" means on GitHub\'s servers',
        ],
        expectedOutcome: 'You understand the core Git concepts before running any commands.',
        successCriteria: [
          'You can explain what a commit is in your own words',
          'You understand why we "add" files before committing',
          'You know the difference between your local repo and GitHub',
        ],
      },
      {
        id: '2-2',
        title: 'Your First Repository',
        description: 'Create a Git repository and make commits',
        type: 'project',
        context: 'Now you\'ll create a real Git repository on your computer. This is something you\'ll do for every project you build.',
        instructions: [
          'Open your computer\'s real terminal (not the simulated one) - Terminal on Mac, Command Prompt or PowerShell on Windows',
          'Navigate to a project folder, or create one: mkdir my-first-git-project && cd my-first-git-project',
          'Create a simple file: echo "# My Project" > README.md',
          'Initialize Git: git init (you should see "Initialized empty Git repository")',
          'Check status: git status (you should see README.md listed as "untracked")',
          'Stage the file: git add README.md (or git add . to add everything)',
          'Check status again: git status (README.md should now be green, under "Changes to be committed")',
          'Make your first commit: git commit -m "Initial commit: add README"',
          'View your history: git log (you should see your commit with the message you wrote)',
        ],
        expectedOutcome: 'A local Git repository with one commit in its history.',
        successCriteria: [
          'git status shows "nothing to commit, working tree clean"',
          'git log shows your "Initial commit: add README" entry',
          'You understand the add → commit workflow',
        ],
        exampleOutput: '$ git init\nInitialized empty Git repository in /Users/you/my-first-git-project/.git/\n$ git add .\n$ git commit -m "Initial commit: add README"\n[main (root-commit) abc1234] Initial commit: add README\n 1 file changed, 1 insertion(+)',
        hints: [
          'If git commit opens a text editor, type your message, save, and close it',
          'git status is your best friend - run it often to see what\'s happening',
          'You can\'t commit if you haven\'t added anything to the staging area',
        ],
      },
      {
        id: '2-3',
        title: 'Push to GitHub',
        description: 'Connect your local project to GitHub',
        type: 'project',
        context: 'Your code is saved locally, but what if your computer dies? GitHub stores your code in the cloud and makes it accessible from anywhere. This is also how Claude Code will be able to see your project.',
        instructions: [
          'Go to github.com and log in (create a free account if you don\'t have one)',
          'Click the + button in the top right, then "New repository"',
          'Name it the same as your local folder (e.g., "my-first-git-project")',
          'Leave it Public, do NOT initialize with README (you already have one locally)',
          'Click "Create repository"',
          'GitHub will show you commands - look for the section "…or push an existing repository"',
          'In your terminal, run: git remote add origin https://github.com/YOUR-USERNAME/my-first-git-project.git',
          'Then run: git branch -M main (ensures your branch is named "main")',
          'Finally: git push -u origin main',
          'You may be asked to log in - follow the prompts',
          'Refresh your GitHub page - you should see your README.md file!',
        ],
        expectedOutcome: 'Your local code is now visible on GitHub.com.',
        successCriteria: [
          'You can see your repository at github.com/YOUR-USERNAME/my-first-git-project',
          'The README.md file is visible on GitHub',
          'Running git push in your terminal uploads new changes to GitHub',
        ],
        exampleOutput: '$ git push -u origin main\nEnumerating objects: 3, done.\nCounting objects: 100% (3/3), done.\nWriting objects: 100% (3/3), 234 bytes | 234.00 KiB/s, done.\nTotal 3 (delta 0), reused 0 (delta 0)\nTo https://github.com/yourname/my-first-git-project.git\n * [new branch]      main -> main',
        hints: [
          'The URL must match YOUR GitHub username and repo name exactly',
          'If push fails with an auth error, you may need to set up a Personal Access Token',
          'GitHub has excellent documentation at docs.github.com if you get stuck',
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
        title: 'Map Your Project Architecture',
        description: 'Identify the technical components your project needs',
        type: 'project',
        context: 'Every web project is made of building blocks: frontends, backends, databases, and APIs. Before building, you need to know which blocks YOUR project requires. Some projects are simple (just a frontend), others need all four.',
        instructions: [
          'Get your Project Brief and look at each task',
          'For each task, ask: Does a human need to SEE something? If yes → you need a frontend (user interface)',
          'Ask: Does data need to be PROCESSED or calculated? If yes → you need a backend (server logic)',
          'Ask: Does data need to PERSIST between sessions? If yes → you need a database',
          'Ask: Do you need data from ANOTHER service (weather, payments, etc.)? If yes → you need to call an API',
          'Write down your answers in a simple list: "My project needs: [frontend/backend/database/APIs]"',
        ],
        expectedOutcome: 'A clear list of which technical components your specific project requires.',
        successCriteria: [
          'You\'ve answered Yes/No for each of the four components',
          'You can explain WHY you need (or don\'t need) each component',
          'You\'ve written this down somewhere you can reference later',
        ],
        exampleOutput: 'Example for an "Order Report Generator":\n- Frontend: YES (need a page to trigger the report and display results)\n- Backend: YES (need to process order data and calculate totals)\n- Database: NO (data comes from Shopify, don\'t need to store it ourselves)\n- APIs: YES (need to fetch data from Shopify\'s API)',
        hints: [
          'Simple automations often don\'t need a frontend - they run in the background',
          'If you\'re just DISPLAYING data (not storing it), you might not need a database',
          'Most projects that interact with other services (Shopify, Stripe, etc.) need API calls',
        ],
      },
      {
        id: '3-2',
        title: 'Data Flow Diagram',
        description: 'Draw how data moves through your project',
        type: 'project',
        context: 'Understanding data flow prevents confusion later. Where does information come from? Where does it go? What happens to it along the way?',
        instructions: [
          'Get a piece of paper or open a simple drawing tool',
          'Draw a box for each "place" data lives: User, Your App, Database, External APIs, etc.',
          'Draw arrows showing how data flows BETWEEN these places',
          'Label each arrow with WHAT data is flowing (e.g., "order info", "report PDF")',
          'Mark any TRANSFORMATIONS that happen (e.g., "calculate totals", "format as PDF")',
          'Take a photo or save your diagram - you\'ll reference this when building',
        ],
        expectedOutcome: 'A simple visual showing where data comes from, what happens to it, and where it ends up.',
        successCriteria: [
          'You have a drawn/created diagram (can be rough - sketches are fine!)',
          'It shows all the "places" data exists in your system',
          'Arrows show the direction data flows',
          'You can walk someone through the diagram and explain each step',
        ],
        exampleOutput: 'Example: [User] → clicks button → [Your App] → requests data → [Shopify API]\n[Shopify API] → returns orders → [Your App] → calculates totals → [Your App] → displays report → [User]',
        hints: [
          'Don\'t overthink it - a simple hand-drawn sketch works great',
          'If you can\'t draw the flow, you might not fully understand the project yet',
          'This diagram will be incredibly helpful when you start prompting Claude Code',
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
        description: 'Practice identifying vague vs. specific tasks',
        type: 'quiz',
        context: 'The biggest reason AI coding fails: vague instructions. If YOU can\'t explain exactly what you want, how can AI figure it out? This exercise trains you to spot vague tasks and fix them.',
        instructions: [
          'Review the examples of "bad" prompts shown above',
          'For each one, identify WHAT makes it vague',
          'Rewrite each bad prompt to be specific and actionable',
          'A good task should answer: What exactly will be created/changed? How will I know it\'s done?',
        ],
        expectedOutcome: 'You can identify vague tasks and rewrite them to be specific.',
        successCriteria: [
          'You\'ve worked through all the bad prompt examples',
          'You can explain why each original was too vague',
          'Your rewrites include specific details: file names, expected behavior, success criteria',
        ],
        exampleOutput: 'Bad: "Make the login better"\nProblem: "Better" how? Faster? Prettier? More secure?\nGood: "Add email validation to the login form in src/Login.tsx. When user enters an invalid email format, show the error message \'Please enter a valid email\' in red below the input field."',
        hints: [
          'If you can\'t picture exactly what "done" looks like, the task is too vague',
          'Add details: file names, function names, specific behaviors',
          '"Better", "improve", "fix" are almost always too vague',
        ],
      },
      {
        id: '4-2',
        title: 'Task Breakdown',
        description: 'Break your project into 5-10 specific, ordered tasks',
        type: 'project',
        context: 'Your Project Brief has high-level tasks, but they\'re probably still too big. Each task should be something you can complete in 1-2 focused hours. Smaller tasks = clearer prompts = better AI results.',
        instructions: [
          'Open your Project Brief and look at your tasks',
          'For EACH task, ask: "Can I complete this in 1-2 hours?" If no, break it into smaller pieces',
          'Put tasks in ORDER. Ask: "What has to exist before I can do this?"',
          'Number your tasks 1, 2, 3... based on this order',
          'For each task, write a one-sentence description of what "done" looks like',
          'Your final list should have 5-10 tasks that build on each other',
        ],
        expectedOutcome: 'An ordered list of 5-10 specific tasks, each with a clear "done" definition.',
        successCriteria: [
          'You have 5-10 numbered tasks (not fewer, not many more)',
          'Each task is completable in 1-2 hours',
          'Tasks are in order - each task only depends on tasks BEFORE it',
          'Each task has a "done" definition (what will exist when complete)',
          'A stranger could read your list and understand what to build',
        ],
        exampleOutput: 'Example breakdown for "Build order report generator":\n1. Create project folder with basic HTML page (Done: can open index.html in browser)\n2. Add button that logs "clicked" to console (Done: clicking button shows message in console)\n3. Create function to fetch orders from Shopify API (Done: function returns array of order objects)\n4. Display orders in a simple list on the page (Done: order IDs visible on page)\n5. Calculate total revenue from orders (Done: total number displayed on page)\n...',
        hints: [
          'If a task sounds like "build the whole feature", it\'s too big',
          'First tasks are often: set up project, create basic UI, get one thing working',
          'When in doubt, make tasks smaller not bigger',
        ],
      },
      {
        id: '4-3',
        title: 'Scope Review',
        description: 'Get AI feedback on your task breakdown',
        type: 'chat',
        context: 'A second opinion catches blind spots. The AI will review your tasks and flag any that are still too vague, too big, or missing dependencies.',
        instructions: [
          'Copy your entire task list (all 5-10 tasks with their "done" definitions)',
          'Paste it into the chat with the AI assistant',
          'Ask for feedback: "Are any of these tasks too vague or too big?"',
          'Listen to the feedback - if a task gets flagged, try rewriting it',
          'Keep refining until the AI says your tasks look good',
          'Update your Project Brief with the improved task list',
        ],
        expectedOutcome: 'An AI-reviewed task list with no vague or oversized tasks.',
        successCriteria: [
          'You\'ve shared your full task list with the AI',
          'You\'ve addressed any feedback about vague or large tasks',
          'The AI confirms your tasks are specific and achievable',
          'Your Project Brief is updated with the final task list',
        ],
        hints: [
          'Don\'t be defensive about feedback - the goal is a better project, not being "right"',
          'If you disagree with feedback, explain your reasoning and discuss it',
          'Better to refine now than struggle later',
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
        description: 'Learn to spot and fix ineffective prompts',
        type: 'quiz',
        context: 'Bad prompts waste time. You\'ll go back and forth with the AI, getting frustrated when it doesn\'t understand what you want. Learning to spot bad prompts helps you write good ones.',
        instructions: [
          'Work through each "bad prompt" example shown above',
          'For each one, identify the specific problem (too vague? missing context? unclear goal?)',
          'Write your improved version in the text area',
          'Compare with the example solution to see if you caught everything',
          'Notice patterns - the same problems appear again and again',
        ],
        expectedOutcome: 'You can identify why a prompt will fail and know how to fix it.',
        successCriteria: [
          'You\'ve attempted to rewrite each bad prompt',
          'Your rewrites include specific file names, expected behaviors, or success criteria',
          'You\'ve compared your rewrites to the solutions and understand any differences',
          'You can name 3+ common prompting mistakes',
        ],
        exampleOutput: 'Common mistakes:\n1. Vague adjectives: "make it better", "improve", "fix"\n2. Missing location: not saying which file to change\n3. No success criteria: not explaining what "done" looks like\n4. Missing context: not mentioning what already exists',
        // Enhanced framework fields
        duration: {
          beginner: '20-30 minutes',
          intermediate: '10-15 minutes',
          review: '5 minutes',
        },
        difficultyLevel: 2 as const,
        mentalModel: {
          coreInsight: 'Claude can only work with what you give it - vague input = guessing output',
          analogy: 'Imagine asking someone to "make dinner" vs "make spaghetti with marinara sauce, enough for 4 people, ready by 7pm." The second request gets you what you actually want.',
          conceptsExplained: [
            {
              term: 'context',
              meaning: 'Background information Claude needs to understand your situation',
              example: '"I have a React app" vs just "my app" - the first tells Claude what technology to use',
            },
            {
              term: 'specificity',
              meaning: 'Exact details instead of general descriptions',
              example: '"Make it faster" (vague) vs "Reduce load time from 5s to under 2s" (specific)',
            },
            {
              term: 'expected behavior',
              meaning: 'What the result should look like or do',
              example: '"When I click Submit, it should show a green success message and clear the form"',
            },
            {
              term: 'success criteria',
              meaning: 'How you\'ll know the task is complete',
              example: '"Done when: tests pass, page loads in under 2s, user sees confirmation"',
            },
          ],
          commonMisconceptions: [
            {
              misconception: 'Longer prompts are always better',
              reality: 'Focused detail > verbose padding. Add relevant context, not filler.',
            },
            {
              misconception: 'Claude should figure out what I mean',
              reality: 'Claude is literal - it works with your words, not your intentions',
            },
            {
              misconception: 'I need to know how to code to write good prompts',
              reality: 'You need to know WHAT you want, not HOW to implement it',
            },
          ],
        },
        walkthrough: {
          overview: 'You\'ll analyze bad prompts, identify what\'s wrong, and practice rewriting them',
          steps: [
            {
              instruction: 'Read the bad prompt: "Fix my code"',
              why: 'This is the most common bad prompt pattern',
              expectedOutput: 'N/A - analysis exercise',
            },
            {
              instruction: 'Identify what\'s missing',
              why: 'Learn to diagnose before fixing',
              expectedOutput: 'Missing: which file, what the bug is, what should happen, what currently happens',
            },
            {
              instruction: 'Write an improved version',
              why: 'Practice the skill of being specific',
              expectedOutput: '"In src/components/LoginForm.tsx, the form submits but shows no feedback. Expected: show \'Login successful\' message. Actual: nothing happens after clicking Submit."',
            },
            {
              instruction: 'Compare with the example solution',
              why: 'See if you caught all the important elements',
              expectedOutput: 'Check: Does yours have file path? Expected behavior? Actual behavior?',
            },
          ],
        },
        troubleshooting: [
          {
            symptom: 'I don\'t know what details to add',
            meaning: 'You might not have fully thought through what you want',
            reassurance: 'This is the whole point of the exercise - to practice this thinking',
            solution: 'Ask yourself: What file? What should happen? What currently happens? Who sees it?',
            verification: 'Your rewrite answers at least 3 of those questions',
          },
          {
            symptom: 'My rewrite is too long',
            meaning: 'You might be adding unnecessary details',
            reassurance: 'Balance is learned through practice',
            solution: 'Focus on: location, expected behavior, actual behavior, and one example',
            verification: 'Your rewrite is 2-4 sentences, not a paragraph',
          },
          {
            symptom: 'I can\'t think of what context is needed',
            meaning: 'Imagine you\'re explaining to a new developer on their first day',
            reassurance: 'If they\'d ask "what framework?" or "which button?" - that\'s missing context',
            solution: 'Add the technology, file path, and visual description of what you\'re talking about',
            verification: 'A stranger could understand your prompt without seeing your codebase',
          },
        ],
        verificationProtocol: {
          checkpoints: [
            {
              description: 'Your rewrite includes a file location',
              expectedResult: 'Something like "in src/components/..." or "the login page"',
              ifDifferent: 'Add where the code lives - Claude needs to know which file to change',
            },
            {
              description: 'Your rewrite describes expected behavior',
              expectedResult: '"Should show a success message" or "should redirect to dashboard"',
              ifDifferent: 'Add what SHOULD happen when the code works correctly',
            },
            {
              description: 'Your rewrite describes actual behavior',
              expectedResult: '"Currently shows nothing" or "throws an error"',
              ifDifferent: 'Add what ACTUALLY happens now (the bug or missing feature)',
            },
            {
              description: 'Your rewrite is actionable',
              expectedResult: 'Claude could start working immediately without asking questions',
              ifDifferent: 'Remove vague words like "better" or "improve" - be specific',
            },
          ],
          falsePositives: [
            {
              appearance: 'My rewrite is different from the example solution',
              explanation: 'There\'s no single "right" answer - as long as it\'s specific and complete',
            },
          ],
        },
        practice: {
          guided: {
            steps: [
              {
                instruction: 'Read: "Add a feature"',
                why: 'Identify what\'s vague about this',
                expectedOutput: 'No feature description, no location, no expected behavior',
              },
              {
                instruction: 'Add specifics: What feature? Where? How should it work?',
                why: 'Practice the process of making vague requests specific',
                expectedOutput: '"Add a dark mode toggle to the Settings page that saves preference to localStorage"',
              },
              {
                instruction: 'Add success criteria',
                why: 'Define what "done" looks like',
                expectedOutput: '"When clicked, all colors switch to dark theme and preference persists on reload"',
              },
            ],
          },
          supported: {
            task: 'Rewrite this prompt: "Make the button work"',
            hints: [
              'What button? Where is it? (file path)',
              'What should clicking it do? (expected behavior)',
              'What does it do now? (actual behavior)',
              'Any error messages? (debugging context)',
            ],
            solution: '"In src/pages/Contact.tsx, the Submit button on line 45 doesn\'t send the form. Expected: clicking Submit should POST to /api/contact and show a confirmation. Actual: clicking does nothing, no console errors."',
          },
          independent: {
            challenge: 'Take a prompt from your own project and improve it using the framework',
            successCriteria: [
              'Your prompt includes a file location or page name',
              'Your prompt describes expected behavior',
              'Your prompt describes current state or problem',
              'A stranger could start working on it without questions',
            ],
          },
        },
        conceptBridge: {
          skillAcquired: 'Identify and fix vague prompts with specific, actionable details',
          connectionToNext: 'Next you\'ll learn prompt templates for common scenarios - creation, bug fixes, features',
          futureApplication: 'Every prompt you write to Claude Code should pass the "specificity test" you just learned',
        },
      },
      {
        id: '5-2',
        title: 'Prompt Templates',
        description: 'Practice writing prompts for common scenarios',
        type: 'code',
        context: 'Most prompts fall into patterns: creating something new, fixing a bug, or adding to existing code. Having a template for each makes you faster and more consistent.',
        instructions: [
          'CREATION PROMPT: Write a prompt that asks Claude Code to create a new file. Include: what the file should be named, what it should do, any specific requirements.',
          'BUG FIX PROMPT: Write a prompt for fixing a bug. Include: what the expected behavior is, what\'s actually happening, which file the bug is in.',
          'FEATURE PROMPT: Write a prompt to add a feature to existing code. Include: what the new feature does, where it should be added, how it should work.',
          'Write all three prompts based on your actual project\'s first few tasks.',
        ],
        expectedOutcome: 'Three well-structured prompts you can use as templates for future work.',
        successCriteria: [
          'Your creation prompt specifies a file name and clear purpose',
          'Your bug fix prompt describes expected vs. actual behavior',
          'Your feature prompt explains where to add code and what it should do',
          'All three could be used on your actual project',
        ],
        exampleOutput: 'Creation example:\n"Create a new file called src/utils/formatCurrency.ts that exports a function formatCurrency(amount: number). The function should take a number like 1234.5 and return a string like $1,234.50 with proper comma separators and two decimal places."',
        hints: [
          'More context = better results. When in doubt, include it.',
          'Specific file paths prevent Claude from creating files in the wrong place',
          'Including an example of expected input/output makes requirements crystal clear',
        ],
      },
      {
        id: '5-3',
        title: 'Your First Real Prompt',
        description: 'Write the opening prompt for your actual project',
        type: 'project',
        context: 'This is the prompt you\'ll use to start building your real project with Claude Code. Take your time - a good first prompt sets the tone for the whole project.',
        instructions: [
          'Look at Task #1 from your Project Brief',
          'Write a full prompt that includes:\n   - CONTEXT: Brief description of what you\'re building overall\n   - TASK: Specific thing you want done right now\n   - DETAILS: File names, function names, expected behavior\n   - SUCCESS: How you\'ll know it\'s done',
          'Save this prompt somewhere - you\'ll use it in the next module',
          'Optionally: paste it into the AI chat above to get feedback before using it for real',
        ],
        expectedOutcome: 'A polished, detailed prompt ready to use with real Claude Code.',
        successCriteria: [
          'Your prompt explains the overall project context (1-2 sentences)',
          'Your prompt specifies exactly what to create/change',
          'Your prompt includes specific file names or locations',
          'Your prompt explains what "done" looks like (success criteria)',
          'Reading it, someone could start working immediately without questions',
        ],
        exampleOutput: 'Example first prompt:\n"I\'m building an order report generator that fetches data from Shopify and displays weekly summaries.\n\nFor this first task, create the initial project structure:\n1. Create an index.html file with a basic HTML5 structure and a heading that says \'Order Report Generator\'\n2. Create a styles.css file with basic styling (dark background, light text)\n3. Create a script.js file that logs \'App loaded\' to the console when the page loads\n\nSuccess: When I open index.html in a browser, I see the heading, the page is styled, and the console shows \'App loaded\'."',
        hints: [
          'Don\'t try to do too much in the first prompt - start simple',
          'First prompts often just set up the project structure',
          'It\'s OK to ask Claude Code to create multiple related files at once',
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
        title: 'Install Claude Code',
        description: 'Install Claude Code on your computer',
        type: 'project',
        context: 'Time to install the real thing! Claude Code runs in your terminal and can read, write, and modify files on your computer. The installation takes about 5 minutes.',
        instructions: [
          'Open your computer\'s terminal (Terminal on Mac, PowerShell on Windows)',
          'Check if Node.js is installed: run node --version (you need v18 or higher)',
          'If Node.js is missing, install it from nodejs.org first',
          'Install Claude Code globally: npm install -g @anthropic-ai/claude-code',
          'Verify installation: run claude-code --version (should show a version number)',
          'Run claude-code once and follow the prompts to log in with your Anthropic account',
          'Create a test folder: mkdir cc-test && cd cc-test',
          'Run claude-code to start an interactive session',
          'Type a simple test: "Create a file called hello.txt that contains the text Hello World"',
          'Verify it worked: run cat hello.txt in your terminal (outside of Claude Code)',
        ],
        expectedOutcome: 'Claude Code is installed and you\'ve successfully created a file with it.',
        successCriteria: [
          'claude-code --version shows a version number',
          'You\'ve logged in to Claude Code successfully',
          'You\'ve created a test file using Claude Code',
          'The test file exists and contains the expected content',
        ],
        exampleOutput: '$ npm install -g @anthropic-ai/claude-code\n$ claude-code --version\n1.0.0\n$ mkdir cc-test && cd cc-test\n$ claude-code\n> Create a file called hello.txt with "Hello World"\n✓ Created hello.txt\n$ cat hello.txt\nHello World',
        hints: [
          'If npm install fails, you might need to use sudo (Mac/Linux) or run as administrator (Windows)',
          'You\'ll need an Anthropic account - create one at console.anthropic.com',
          'If you hit rate limits, you may need to add a payment method to your Anthropic account',
        ],
      },
      {
        id: '6-2',
        title: 'Complete Your First Task',
        description: 'Use Claude Code to complete task #1 from your project',
        type: 'project',
        context: 'This is the real thing. You\'ll use the prompt you wrote in Module 5 to start building your actual project. Remember: prompt → review → iterate.',
        instructions: [
          'Create a folder for your project: mkdir your-project-name && cd your-project-name',
          'Start Claude Code: claude-code',
          'Paste the prompt you wrote in Module 5 (your first task prompt)',
          'Wait for Claude to generate code - this may take 30 seconds to a few minutes',
          'CAREFULLY review what Claude created. Don\'t just accept it blindly!',
          'Check: Did it create the files you expected? Do they contain what you asked for?',
          'If something\'s wrong, tell Claude specifically what to fix (e.g., "The button should be blue, not green")',
          'Keep iterating until Task #1 is truly complete according to your success criteria',
          'Test the result manually - does it work as expected?',
          'Once Task #1 is complete, commit your progress: git add . && git commit -m "Complete Task 1"',
        ],
        expectedOutcome: 'Task #1 from your Project Brief is complete and committed to Git.',
        successCriteria: [
          'You\'ve run your prompt in Claude Code',
          'You\'ve reviewed the output (not just accepted blindly)',
          'The result meets the success criteria you defined for Task #1',
          'You\'ve tested it manually and it works',
          'You\'ve committed the code to Git',
        ],
        hints: [
          'If Claude goes in the wrong direction, say "Stop. Let me clarify..." and explain again',
          'Screenshots can help - if something looks wrong, describe what you see',
          'It\'s OK if this takes multiple iterations. That\'s normal!',
          'Save working versions frequently with Git commits',
        ],
      },
      {
        id: '6-3',
        title: 'Turbo Mode: Skip Permissions',
        description: 'Learn to use --dangerously-skip-permissions for faster workflows',
        type: 'project',
        context: 'By default, Claude Code asks for permission before writing files, running commands, or making changes. This is safe but can slow you down when you trust what Claude is doing. The --dangerously-skip-permissions flag lets Claude work without asking.',
        instructions: [
          'Understand what permissions Claude normally asks for:',
          '  - Writing or modifying files',
          '  - Creating new files',
          '  - Running shell commands',
          '  - Making network requests',
          'Run Claude Code with the flag: claude --dangerously-skip-permissions',
          'Notice how Claude now executes actions immediately without confirmation prompts',
          'Try a simple task: "Create a folder called turbo-test with three files: index.html, style.css, and app.js"',
          'Watch how Claude creates everything in one smooth flow without stopping to ask',
          'Important: Only use this flag when you TRUST what Claude will do',
          'Exit and try without the flag to see the difference in workflow',
        ],
        expectedOutcome: 'You understand when and how to use --dangerously-skip-permissions for faster development.',
        successCriteria: [
          'You\'ve run Claude Code with --dangerously-skip-permissions',
          'You\'ve observed the difference in workflow (no permission prompts)',
          'You understand the tradeoff: speed vs. safety',
          'You know when it\'s appropriate to use this flag',
        ],
        exampleOutput: '$ claude --dangerously-skip-permissions\n> Create a folder called turbo-test with index.html, style.css, and app.js\n✓ Created turbo-test/\n✓ Created turbo-test/index.html\n✓ Created turbo-test/style.css\n✓ Created turbo-test/app.js\nDone! (no permission prompts)',
        hints: [
          'Use this flag when you\'re iterating quickly on a project you trust',
          'Avoid this flag when working with sensitive files or unfamiliar codebases',
          'You can also set CLAUDE_DANGEROUSLY_SKIP_PERMISSIONS=1 as an environment variable',
          'If something goes wrong, use git to undo: git checkout . or git reset --hard',
        ],
        // Enhanced framework fields
        duration: {
          beginner: '10-15 minutes',
          intermediate: '5 minutes',
          review: '2 minutes',
        },
        difficultyLevel: 2 as const,
        mentalModel: {
          coreInsight: 'Permission prompts are training wheels - once you trust the ride, you can take them off for speed',
          analogy: 'Think of it like a car asking "Are you sure?" before every turn. Helpful when learning, but annoying once you know the route. --dangerously-skip-permissions is like turning off those confirmations.',
          conceptsExplained: [
            {
              term: '--dangerously-skip-permissions',
              meaning: 'A command-line flag that tells Claude Code to execute actions without asking for confirmation',
              example: 'claude --dangerously-skip-permissions starts Claude in "turbo mode"',
            },
            {
              term: 'permission prompt',
              meaning: 'A confirmation dialog that appears before Claude takes an action that modifies your system',
              example: '"Claude wants to create file src/app.js. Allow? [y/n]"',
            },
            {
              term: 'environment variable',
              meaning: 'A system setting that affects how programs run, set outside the program itself',
              example: 'CLAUDE_DANGEROUSLY_SKIP_PERMISSIONS=1 sets turbo mode permanently in your shell',
            },
          ],
          commonMisconceptions: [
            {
              misconception: 'This flag is always dangerous and should never be used',
              reality: 'It\'s safe when you trust the task and have version control. The name is a warning, not a prohibition.',
            },
            {
              misconception: 'Claude will do harmful things without the permission prompts',
              reality: 'Claude still follows your instructions - it just doesn\'t pause to ask. The behavior is the same, just faster.',
            },
            {
              misconception: 'I should use this flag all the time for maximum speed',
              reality: 'Use it for trusted, routine tasks. Keep permissions on when exploring unfamiliar code or doing risky operations.',
            },
          ],
        },
        walkthrough: {
          overview: 'You\'ll experience the difference between normal mode and turbo mode, then learn when to use each',
          steps: [
            {
              instruction: 'Start Claude Code normally: `claude`',
              why: 'First, observe the default behavior with permission prompts',
              expectedOutput: 'Claude starts and waits for your prompt',
            },
            {
              instruction: 'Ask: "Create a file called test-normal.txt with the text \'Hello\'"',
              why: 'This triggers a permission prompt',
              expectedOutput: 'Claude asks: "Allow creating test-normal.txt? [y/n]"',
            },
            {
              instruction: 'Type `y` to allow, then exit with `/exit` or Ctrl+C',
              why: 'Complete the action and exit to try turbo mode',
              expectedOutput: 'File created, Claude exits',
            },
            {
              instruction: 'Start Claude in turbo mode: `claude --dangerously-skip-permissions`',
              why: 'Now we\'ll see the faster workflow',
              expectedOutput: 'Claude starts (same as before)',
            },
            {
              instruction: 'Ask: "Create a file called test-turbo.txt with the text \'Speed\'"',
              why: 'This time, no permission prompt',
              expectedOutput: 'Claude immediately creates the file without asking',
            },
            {
              instruction: 'Verify both files exist: `ls test-*.txt` in your terminal',
              why: 'Confirm both modes work, just with different workflows',
              expectedOutput: 'test-normal.txt  test-turbo.txt',
            },
          ],
        },
        troubleshooting: [
          {
            symptom: 'Claude still asks for permissions with the flag',
            meaning: 'The flag might not have been passed correctly',
            reassurance: 'Command-line flags can be tricky - easy to fix',
            solution: 'Make sure there\'s a space after "claude" and the flag is spelled exactly: claude --dangerously-skip-permissions',
            verification: 'Claude should say something like "Running in permissionless mode" or just not ask for confirmations',
          },
          {
            symptom: 'I\'m nervous about Claude running without asking',
            meaning: 'That\'s a healthy instinct!',
            reassurance: 'The flag is optional. You can always use normal mode when you want more control.',
            solution: 'Use git init and commit before using turbo mode, so you can always undo with git checkout .',
            verification: 'Run git status to confirm you have version control as a safety net',
          },
          {
            symptom: 'Claude made changes I didn\'t want',
            meaning: 'This can happen in turbo mode if your prompt was ambiguous',
            reassurance: 'If you have git, nothing is permanent',
            solution: 'Run git diff to see changes, then git checkout . to undo all changes, or git checkout <file> for specific files',
            verification: 'Your files are back to the last committed state',
          },
        ],
        verificationProtocol: {
          checkpoints: [
            {
              description: 'You can start Claude in turbo mode',
              command: 'claude --dangerously-skip-permissions',
              expectedResult: 'Claude starts without errors',
              ifDifferent: 'Check the flag spelling and ensure Claude Code is installed',
            },
            {
              description: 'Claude creates files without asking in turbo mode',
              expectedResult: 'Files appear immediately after your request',
              ifDifferent: 'Exit and restart with the flag',
            },
            {
              description: 'You have git as a safety net',
              command: 'git status',
              expectedResult: 'Shows you\'re in a git repository',
              ifDifferent: 'Run git init to set up version control first',
            },
          ],
          falsePositives: [
            {
              appearance: 'Claude still shows some status messages',
              explanation: 'Status messages (like "Creating file...") aren\'t permission prompts - those are just progress updates',
            },
          ],
        },
        practice: {
          guided: {
            steps: [
              {
                instruction: 'Run `claude --dangerously-skip-permissions`',
                why: 'Start turbo mode',
                expectedOutput: 'Claude starts',
              },
              {
                instruction: 'Ask: "Create a project folder called speed-test with an index.html and style.css file"',
                why: 'Test multi-file creation without prompts',
                expectedOutput: 'Both files created immediately',
              },
              {
                instruction: 'Exit and check: `ls speed-test/`',
                why: 'Verify the files were created',
                expectedOutput: 'index.html  style.css',
              },
            ],
          },
          supported: {
            task: 'Create a small website folder with HTML, CSS, and JS files using turbo mode',
            hints: [
              'Start with claude --dangerously-skip-permissions',
              'Ask Claude to create all three files in one request',
              'Verify with ls after exiting',
            ],
            solution: 'claude --dangerously-skip-permissions → "Create a folder called my-site with index.html, style.css, and script.js" → exit → ls my-site/',
          },
          independent: {
            challenge: 'Use turbo mode to scaffold your actual project\'s next feature, then verify everything was created correctly',
            successCriteria: [
              'You started Claude with --dangerously-skip-permissions',
              'Claude created multiple files without permission prompts',
              'You verified the files exist and contain expected content',
              'You committed the changes with git',
            ],
          },
        },
        conceptBridge: {
          skillAcquired: 'Use --dangerously-skip-permissions for faster Claude Code workflows',
          connectionToNext: 'Now you can work at full speed with Claude. Next, you\'ll unlock Opus 4.6 power features - agent teams, divide-and-conquer workflows, and effort levels.',
          futureApplication: 'When doing rapid prototyping or trusted refactoring, turbo mode lets you iterate much faster',
        },
      },
    ],
    isSimulated: false,
    requiresProject: true,
  },
  {
    id: '7',
    title: 'Opus 4.6 Power Features',
    subtitle: 'Agent Teams & Advanced Workflows',
    duration: '2 hours',
    description: 'Unlock the full potential of Claude Code with Opus 4.6. Learn to run multiple agents in parallel, design divide-and-conquer workflows, write optimized prompts, and match effort levels to task complexity.',
    learningObjectives: [
      'Set up and run agent teams (multiple agents in parallel)',
      'Design divide-and-conquer workflows with dependency phases',
      'Write prompts using System Context, Constraint-First, and Multi-File patterns',
      'Match effort levels to task complexity',
      'Apply these to a real multi-part build',
    ],
    exercises: [
      {
        id: '7-1',
        title: 'Your First Agent Team',
        description: 'Run multiple Claude Code agents in parallel on independent tasks',
        type: 'project',
        context: 'Most people use Claude Code one task at a time, like hiring a single freelancer. But Opus 4.6 can run multiple agents simultaneously - like having a full team. The key rule: each agent must work on independent files so they don\'t conflict.',
        instructions: [
          'Open 3 separate terminal windows (or tabs) on your computer',
          'Navigate each terminal to your project folder',
          'In terminal 1, start Claude Code and give it Task A (e.g., "Create a webhook endpoint in src/webhooks.ts that accepts POST requests and logs the body")',
          'IMMEDIATELY switch to terminal 2, start Claude Code and give it Task B (e.g., "Create a utility function in src/utils/classifier.ts that takes a string and returns \'positive\', \'negative\', or \'neutral\'")',
          'IMMEDIATELY switch to terminal 3, start Claude Code and give it Task C (e.g., "Create a database schema file in src/schema.sql with tables for leads and messages")',
          'Watch all three work simultaneously - you just 3x\'d your output!',
          'Wait for all three to complete, then verify each file was created correctly',
          'Check for conflicts: make sure no two agents touched the same file',
        ],
        expectedOutcome: 'Three independent pieces of your project built simultaneously by parallel agents.',
        successCriteria: [
          'You ran 3 Claude Code instances at the same time',
          'Each agent worked on a different file/task',
          'No file conflicts occurred between agents',
          'All three outputs are correct and usable',
        ],
        exampleOutput: 'Terminal 1: Created src/webhooks.ts (webhook endpoint)\nTerminal 2: Created src/utils/classifier.ts (classifier function)\nTerminal 3: Created src/schema.sql (database schema)\nAll three completed in ~2 minutes total (vs ~6 minutes sequential)',
        hints: [
          'The golden rule: each agent works on DIFFERENT files',
          'If two agents need to edit the same file, they\'re not independent - run them sequentially',
          'Your computer may slow down with 3 agents - that\'s normal, they\'re CPU-intensive',
          'Start with just 2 agents if 3 feels overwhelming',
        ],
        duration: {
          beginner: '20-30 minutes',
          intermediate: '10-15 minutes',
          review: '5 minutes',
        },
        difficultyLevel: 2 as const,
        mentalModel: {
          coreInsight: 'Agent teams = parallel departments, not a solo freelancer. Each agent handles one independent piece.',
          analogy: 'Think of building a house. One crew pours the foundation while another frames the walls and a third does electrical. They work simultaneously because they\'re in different areas. If two crews tried to work in the same room at the same time, they\'d get in each other\'s way.',
          conceptsExplained: [
            {
              term: 'agent team',
              meaning: 'Multiple Claude Code instances running at the same time, each on a different task',
              example: 'Three terminal windows, each with Claude Code working on a separate file',
            },
            {
              term: 'independent tasks',
              meaning: 'Tasks that don\'t depend on each other and don\'t touch the same files',
              example: 'Building a webhook handler and a CSS stylesheet are independent - they don\'t share files',
            },
            {
              term: 'file conflict',
              meaning: 'When two agents try to modify the same file, causing overwrites or merge issues',
              example: 'Both agents editing src/index.ts would conflict. Give them separate files instead.',
            },
          ],
          commonMisconceptions: [
            {
              misconception: 'You need a special tool or subscription for agent teams',
              reality: 'Just open multiple terminals and run Claude Code in each one. That\'s it.',
            },
            {
              misconception: 'More agents = always faster',
              reality: 'Only if the tasks are truly independent. Dependent tasks must run sequentially.',
            },
          ],
        },
        walkthrough: {
          overview: 'You\'ll open three terminals, give each an independent task, and watch them work in parallel',
          steps: [
            {
              instruction: 'Open your first terminal and navigate to your project folder',
              why: 'Each agent needs to be in the same project directory',
              expectedOutput: 'You\'re in your project folder (check with pwd)',
            },
            {
              instruction: 'Start Claude Code and give it a task that creates a NEW file',
              why: 'New files are safest for parallel work - no merge conflicts',
              expectedOutput: 'Claude starts working on the task',
            },
            {
              instruction: 'Without waiting, open a second terminal, navigate to the project, and start another Claude Code with a different task',
              why: 'The key is starting them simultaneously, not waiting for one to finish',
              expectedOutput: 'Two Claude instances running at the same time',
            },
            {
              instruction: 'Repeat with a third terminal and task',
              why: 'Three parallel agents = roughly 3x throughput',
              expectedOutput: 'Three Claude instances all working simultaneously',
            },
            {
              instruction: 'Wait for all three to finish and verify the results',
              why: 'Check that all files were created and no conflicts occurred',
              expectedOutput: 'Three new files, all correct, no overwrites',
            },
          ],
        },
        troubleshooting: [
          {
            symptom: 'Computer is very slow with 3 agents running',
            meaning: 'Claude Code uses CPU and memory for each instance',
            reassurance: 'This is normal - your computer is doing a lot of work',
            solution: 'Try 2 agents instead of 3, or close other applications to free up resources',
            verification: 'Agents complete successfully, just a bit slower',
          },
          {
            symptom: 'Two agents modified the same file',
            meaning: 'The tasks weren\'t truly independent',
            reassurance: 'This is a learning moment - dependency detection is a key skill',
            solution: 'Use git diff to see what changed, then manually resolve. Next time, ensure tasks touch different files.',
            verification: 'git status shows clean state after resolving',
          },
          {
            symptom: 'One agent finished much faster than others',
            meaning: 'Tasks were different sizes - that\'s fine',
            reassurance: 'Not all tasks take the same time. The goal is parallel execution, not synchronized completion.',
            solution: 'You can give the fast agent another task while waiting for the others',
            verification: 'All tasks eventually complete successfully',
          },
        ],
        verificationProtocol: {
          checkpoints: [
            {
              description: 'All three files exist',
              command: 'ls src/webhooks.ts src/utils/classifier.ts src/schema.sql',
              expectedResult: 'All three files listed',
              ifDifferent: 'Check which agent failed and re-run its task',
            },
            {
              description: 'No file conflicts',
              command: 'git status',
              expectedResult: 'Clean working tree or only new untracked files',
              ifDifferent: 'If you see merge conflicts, the tasks weren\'t independent enough',
            },
          ],
          falsePositives: [
            {
              appearance: 'Agents finished at different times',
              explanation: 'Expected - different tasks take different amounts of time',
            },
          ],
        },
        practice: {
          guided: {
            steps: [
              {
                instruction: 'Open 2 terminals and navigate to your project',
                why: 'Start with 2 agents before scaling to 3',
                expectedOutput: 'Two terminals, both in your project folder',
              },
              {
                instruction: 'Agent 1: "Create src/hello.ts that exports a function sayHello(name: string)"',
                why: 'Simple, isolated task',
                expectedOutput: 'File created with the function',
              },
              {
                instruction: 'Agent 2 (immediately): "Create src/goodbye.ts that exports a function sayGoodbye(name: string)"',
                why: 'Parallel task on a different file',
                expectedOutput: 'Both files created simultaneously',
              },
            ],
          },
          supported: {
            task: 'Use 3 agents to build three components of a feature simultaneously',
            hints: [
              'Plan three tasks that each create a NEW file',
              'Make sure no two tasks reference the same file',
              'Start all three as quickly as possible',
            ],
            solution: 'Agent 1: create route handler, Agent 2: create utility function, Agent 3: create type definitions - all in separate files',
          },
          independent: {
            challenge: 'Identify 3 independent tasks from your project and execute them in parallel with agent teams',
            successCriteria: [
              'All three tasks completed successfully',
              'No file conflicts between agents',
              'Total time was significantly less than running sequentially',
            ],
          },
        },
        conceptBridge: {
          skillAcquired: 'Run multiple Claude Code agents in parallel on independent tasks',
          connectionToNext: 'Now that you can run agent teams, you\'ll learn to plan WHICH tasks to parallelize using divide-and-conquer',
          futureApplication: 'Every multi-file feature you build can be broken into parallel agent tasks for faster completion',
        },
      },
      {
        id: '7-2',
        title: 'Divide and Conquer',
        description: 'Map task dependencies, group into phases, and execute with agent teams',
        type: 'project',
        context: 'Agent teams are powerful, but only if you run the RIGHT tasks in parallel. Some tasks depend on others - you can\'t build the UI for data that doesn\'t exist yet. Divide-and-conquer means: map dependencies, group independent tasks into phases, then execute each phase with agent teams.',
        instructions: [
          'Pick a feature or mini-project with 5+ tasks',
          'Write each task on a separate line',
          'For each task, ask: "What must exist BEFORE I can do this?" Draw arrows showing dependencies',
          'Group tasks into phases: Phase 1 = tasks with NO dependencies (can all run in parallel), Phase 2 = tasks that depend only on Phase 1 output, Phase 3 = tasks that depend on Phase 2, etc.',
          'Execute Phase 1 using agent teams (all tasks in parallel)',
          'Wait for ALL Phase 1 tasks to complete',
          'Execute Phase 2 using agent teams',
          'Continue until all phases are done',
          'Compare: how long did this take vs. doing everything one at a time?',
        ],
        expectedOutcome: 'A multi-part feature built in phases, with parallel execution within each phase.',
        successCriteria: [
          'You\'ve mapped task dependencies clearly',
          'Tasks are grouped into 2+ phases',
          'Each phase was executed with parallel agents where possible',
          'The final result works correctly (all pieces integrate)',
        ],
        exampleOutput: 'Real example from building a GTM system (~65 min vs ~2.5 hrs sequential):\n\nPhase 1 (parallel, ~20 min):\n  - Agent 1: Webhook endpoint (src/webhooks/heyreach.ts)\n  - Agent 2: Reply classifier (src/utils/reply-classifier.ts)\n  - Agent 3: Database schema (src/schema/pipeline.sql)\n\nPhase 2 (parallel, ~25 min, depends on Phase 1):\n  - Agent 1: Pipeline trigger that uses webhook + classifier + schema\n  - Agent 2: Dashboard UI that reads from the schema\n\nPhase 3 (sequential, ~20 min, depends on Phase 2):\n  - Cold email integration that ties into the pipeline',
        hints: [
          'Dependencies are about DATA, not difficulty. "Phase 1" doesn\'t mean "easiest"',
          'If Task B reads a file that Task A creates, B depends on A',
          'Draw it out on paper first - visual dependency mapping is clearer than mental mapping',
          'Phases should be as wide as possible (max parallel tasks) and as few as possible (min phases)',
        ],
      },
      {
        id: '7-3',
        title: 'Writing 4.6-Optimized Prompts',
        description: 'Learn three prompt patterns that get the best results from Opus 4.6',
        type: 'project',
        context: 'Opus 4.6 responds differently to prompt structure than older models. Three patterns consistently produce better results: System Context (front-load project knowledge), Constraint-First (say what NOT to do before what TO do), and Multi-File Coordination (tell Claude about related files it can\'t see).',
        instructions: [
          'PATTERN 1 - System Context: Start your prompt with 2-3 sentences about your project before asking for anything. Example: "This is a Next.js 16 app using Supabase for auth and Trigger.dev for background jobs. The webhook handler at src/webhooks/heyreach.ts receives LinkedIn reply data. Add retry logic with exponential backoff when the classifier API call fails."',
          'PATTERN 2 - Constraint-First: Tell Claude what NOT to change before telling it what TO change. Example: "Do NOT modify the existing handleReply function signature or the database schema. DO add a new retryClassification function in the same file that wraps the API call with 3 retries and exponential backoff."',
          'PATTERN 3 - Multi-File Coordination: When Claude needs to know about files it isn\'t editing, mention them. Example: "The types are defined in src/types/pipeline.ts (LeadRecord has fields: id, email, status, lastReply). The database helper is at src/db/queries.ts (updateLeadStatus takes id and newStatus). Create a new file src/services/pipeline.ts that uses both."',
          'Pick one task from your project',
          'Write the same task using all 3 patterns',
          'Choose the best version and run it in Claude Code',
          'Compare the output quality to how you would have prompted before this exercise',
        ],
        expectedOutcome: 'Three versions of the same prompt using different patterns, with one executed in Claude Code.',
        successCriteria: [
          'You\'ve written a System Context version of your prompt',
          'You\'ve written a Constraint-First version of your prompt',
          'You\'ve written a Multi-File Coordination version of your prompt',
          'You\'ve run the best version and gotten a good result',
        ],
        exampleOutput: 'System Context prompt: "This is a GTM system that processes LinkedIn replies..."\nConstraint-First prompt: "Do NOT change the webhook handler. DO add..."\nMulti-File prompt: "Types are in src/types.ts, DB helper is in src/db.ts. Create..."',
        hints: [
          'System Context works best for new features in existing projects',
          'Constraint-First works best when modifying code that must keep working',
          'Multi-File works best when the new code depends on existing types or functions',
          'You can combine patterns! System Context + Constraint-First is very powerful',
        ],
      },
      {
        id: '7-4',
        title: 'Effort Levels',
        description: 'Learn when to use high, medium, and low effort for different tasks',
        type: 'project',
        context: 'Not every task needs the same level of AI effort. Complex logic deserves high effort (thorough, careful output). Simple changes work fine with low effort (fast, less thorough). Matching effort to task complexity saves time and money.',
        instructions: [
          'Understand the three effort levels:',
          '  HIGH effort: Complex logic, error handling, multi-step algorithms, anything with edge cases. Claude takes longer but produces more thorough, well-tested code.',
          '  MEDIUM effort: Standard features, CRUD operations, typical UI components. Good balance of speed and quality.',
          '  LOW effort: Simple changes, config updates, renaming, adding env vars, boilerplate. Claude responds quickly with straightforward output.',
          'Look at your project\'s remaining tasks',
          'Label each task as HIGH, MEDIUM, or LOW effort',
          'Pick one task and run it at different effort levels (if your Claude Code version supports it, or observe the difference in prompt detail)',
          'Compare: Which effort level produced the best result for that specific task?',
          'Rule of thumb: when in doubt, start with medium effort',
        ],
        expectedOutcome: 'Your remaining tasks are labeled by effort level, and you understand when to use each.',
        successCriteria: [
          'You\'ve categorized at least 5 tasks by effort level',
          'You can explain why each task got its effort level',
          'You\'ve observed the difference in output quality between effort levels',
          'You have a personal rule of thumb for choosing effort levels',
        ],
        exampleOutput: 'GTM system task classification:\n- HIGH: Reply classifier with retry logic and failure handling (complex logic, edge cases)\n- HIGH: Pipeline trigger that orchestrates webhook → classify → store → notify (multi-step)\n- MEDIUM: Dashboard page showing pipeline records (standard CRUD UI)\n- LOW: Add HEYREACH_API_KEY to environment variables (simple config)\n- LOW: Update README with new webhook endpoint docs (boilerplate)',
        hints: [
          'If a task has the word "logic", "algorithm", or "handle errors" it\'s probably HIGH',
          'If a task is mostly wiring things together, it\'s probably MEDIUM',
          'If a task could be done with find-and-replace, it\'s probably LOW',
          'Over-efforting simple tasks wastes time. Under-efforting complex tasks produces bugs.',
        ],
      },
    ],
    isSimulated: false,
    requiresProject: true,
  },
  {
    id: '8',
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
        id: '8-1',
        title: 'Automation Audit',
        description: 'Identify what parts of your project could run automatically',
        type: 'project',
        context: 'You\'ve built something that works. Now ask: what parts could run WITHOUT you clicking a button? Automation = things that happen on their own, triggered by time or events.',
        instructions: [
          'Look at your completed tasks and ask for each: "Does this need to run on a schedule?"',
          'Examples of schedule triggers: Every morning at 9am, Every Monday, Every hour',
          'Look again and ask: "Does this need to run when something happens?"',
          'Examples of event triggers: When a new order comes in, When someone fills a form, When a file is uploaded',
          'Write down 1-3 potential automations with their triggers',
          'For each automation, note: Trigger (when it runs), Action (what it does), Output (what\'s produced)',
          'Decide if any of these are worth implementing for your project',
        ],
        expectedOutcome: 'A list of 1-3 potential automations with clear triggers and actions.',
        successCriteria: [
          'You\'ve identified at least 1 potential automation',
          'Each automation has a clear trigger (when it runs)',
          'Each automation has a clear action (what it does)',
          'You\'ve decided which (if any) to implement',
        ],
        exampleOutput: 'Automation: Daily Order Summary\n- Trigger: Every day at 9am\n- Action: Fetch yesterday\'s orders from Shopify, calculate totals\n- Output: Send summary email to team\n\nAutomation: New Order Alert\n- Trigger: When order over $500 comes in\n- Action: Check order value, if > $500 send alert\n- Output: Slack notification to sales channel',
        hints: [
          'Not every project needs automation - that\'s OK!',
          'Start with ONE automation. You can add more later.',
          'Time-based triggers (schedules) are simpler than event-based triggers',
        ],
      },
      {
        id: '8-2',
        title: 'Build an Automation',
        description: 'Implement one automation using n8n, Make, or Zapier',
        type: 'project',
        context: 'If you identified a useful automation, let\'s build it. We\'ll use a no-code automation tool so you don\'t have to write server code.',
        instructions: [
          'Pick ONE automation from your audit (the simplest one)',
          'Choose your tool:\n   - n8n.io: Free self-hosted option, very powerful\n   - Make.com: Free tier, visual builder\n   - Zapier.com: Easiest to use, limited free tier',
          'Create an account on your chosen platform',
          'Create a new workflow/zap/scenario',
          'Set up the trigger: What starts the automation?',
          'Set up the action: What happens when triggered?',
          'Add your credentials (API keys, login) for any services involved',
          'Test with real data - does it work?',
          'Turn on the automation so it runs for real',
          'Wait for it to trigger once, then verify the output',
        ],
        expectedOutcome: 'A working automation that runs without your involvement.',
        successCriteria: [
          'You\'ve created a workflow in your chosen tool',
          'The trigger is configured correctly',
          'The action is configured correctly',
          'You\'ve tested it successfully at least once',
          'It\'s turned on and running automatically',
        ],
        exampleOutput: 'Example in Make.com:\n1. Trigger: Schedule - Every day at 9:00 AM\n2. HTTP Module: GET request to your app\'s /api/daily-report endpoint\n3. Email Module: Send the response as an email to team@company.com\nStatus: Active, last ran successfully at 9:00 AM today',
        hints: [
          'Start with the tool\'s template if one matches your use case',
          'Test each step individually before connecting them',
          'If using webhooks, make sure your app is deployed and accessible online',
          'It\'s OK to skip this exercise if your project doesn\'t need automation',
        ],
      },
    ],
    isSimulated: false,
    requiresProject: true,
  },
  {
    id: '9',
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
        id: '9-1',
        title: 'Choose Your Hosting',
        description: 'Select the right platform for your specific project',
        type: 'project',
        context: 'Different projects need different hosting. A simple website has different needs than an app with a database. Choosing correctly now saves migration headaches later.',
        instructions: [
          'Review what your project needs (from your Module 3 architecture map)',
          'Match your needs to a platform:',
          '   VERCEL: Best for frontend-focused projects, especially Next.js/React. Free tier is generous. Choose if: your project is mostly a website/UI with API calls.',
          '   RAILWAY: Best for full-stack apps with databases. Simple pricing. Choose if: your project needs a database or backend server running 24/7.',
          '   RENDER: Good all-around option. Choose if: you need more control or have specific requirements.',
          'Create a free account on your chosen platform',
          'Explore the dashboard - find where you\'ll deploy from GitHub',
        ],
        expectedOutcome: 'You\'ve selected a hosting platform and created an account.',
        successCriteria: [
          'You\'ve reviewed your project\'s requirements',
          'You can explain why you chose your specific platform',
          'You have an account created on your chosen platform',
          'You know where the "deploy" or "new project" button is',
        ],
        exampleOutput: 'Decision log:\n- My project is a Next.js dashboard that calls external APIs\n- I don\'t need a database (data comes from Shopify)\n- I don\'t need a backend server running 24/7\n→ Chose Vercel because it\'s optimized for Next.js and my needs are frontend-focused',
        hints: [
          'Vercel has the best free tier for simple projects',
          'If you\'re unsure, start with Vercel - you can always migrate later',
          'Railway is great but costs money faster for always-on servers',
        ],
      },
      {
        id: '9-2',
        title: 'Deploy to Production',
        description: 'Get your project live on a real URL',
        type: 'project',
        context: 'This is it - your project is about to be accessible to anyone in the world. Deployment connects your GitHub repository to a hosting platform that builds and serves your code.',
        instructions: [
          'Make sure your code is pushed to GitHub (git push)',
          'In your hosting platform, click "New Project" or "Add New"',
          'Select "Import from GitHub" and authorize access',
          'Find and select your project repository',
          'Configure settings:\n   - Build command (usually auto-detected: npm run build)\n   - Output directory (usually auto-detected: .next or build)',
          'Add environment variables if needed:\n   - Click "Environment Variables"\n   - Add any API keys your app needs (e.g., SHOPIFY_API_KEY)\n   - NEVER commit these to Git - only set them in the hosting dashboard',
          'Click Deploy and wait (usually 1-3 minutes)',
          'Once complete, you\'ll get a URL like yourproject.vercel.app',
          'Open the URL in your browser - your app is live!',
          'Test everything: click buttons, submit forms, verify it works like it did locally',
        ],
        expectedOutcome: 'Your project is live on a public URL.',
        successCriteria: [
          'Your project is connected to GitHub in the hosting dashboard',
          'Environment variables are set (if your app needs them)',
          'Deployment completed successfully (no build errors)',
          'You can access your project at its public URL',
          'Core functionality works on the live site',
        ],
        exampleOutput: '✓ Connected to github.com/yourname/your-project\n✓ Environment variable SHOPIFY_API_KEY set\n✓ Build completed in 47 seconds\n✓ Deployed to https://your-project.vercel.app\n✓ Tested: dashboard loads, data displays correctly',
        hints: [
          'If the build fails, read the error message carefully - it usually tells you what\'s wrong',
          'Common issues: missing environment variables, wrong Node version, TypeScript errors',
          'Your hosting platform shows logs - check them if something\'s not working',
          'You can redeploy anytime by pushing to GitHub - it updates automatically',
        ],
      },
    ],
    isSimulated: false,
    requiresProject: true,
  },
  {
    id: '10',
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
        id: '10-1',
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
        id: '10-2',
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
        id: '10-3',
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
