// Progress tracking using localStorage

export interface ProjectBrief {
  businessName: string;
  projectTitle: string;
  projectDescription: string;
  problemSolved: string;
  targetUsers: string;
  tasks: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ModuleProgress {
  moduleId: string;
  completed: boolean;
  exercisesCompleted: string[];
  startedAt?: string;
  completedAt?: string;
}

export interface UserProgress {
  currentModule: number;
  modules: ModuleProgress[];
  projectBrief?: ProjectBrief;
  apiKeyConfigured: boolean;
  aiMessagesUsed: number;
  lastVisited: string;
}

const STORAGE_KEY = 'claude-code-training-progress';
const MAX_FREE_AI_MESSAGES = 10;

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') {
    return getDefaultProgress();
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return getDefaultProgress();
  }

  try {
    return JSON.parse(stored) as UserProgress;
  } catch {
    return getDefaultProgress();
  }
}

export function getDefaultProgress(): UserProgress {
  return {
    currentModule: 0,
    modules: [],
    apiKeyConfigured: false,
    aiMessagesUsed: 0,
    lastVisited: new Date().toISOString(),
  };
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;

  progress.lastVisited = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function completeModule(moduleId: string): void {
  const progress = getProgress();
  const moduleIndex = progress.modules.findIndex(m => m.moduleId === moduleId);

  if (moduleIndex >= 0) {
    progress.modules[moduleIndex].completed = true;
    progress.modules[moduleIndex].completedAt = new Date().toISOString();
  } else {
    progress.modules.push({
      moduleId,
      completed: true,
      exercisesCompleted: [],
      completedAt: new Date().toISOString(),
    });
  }

  const moduleNum = parseInt(moduleId);
  if (!isNaN(moduleNum) && moduleNum >= progress.currentModule) {
    progress.currentModule = moduleNum + 1;
  }

  saveProgress(progress);
}

export function completeExercise(moduleId: string, exerciseId: string): void {
  const progress = getProgress();
  let module = progress.modules.find(m => m.moduleId === moduleId);

  if (!module) {
    module = {
      moduleId,
      completed: false,
      exercisesCompleted: [],
      startedAt: new Date().toISOString(),
    };
    progress.modules.push(module);
  }

  if (!module.exercisesCompleted.includes(exerciseId)) {
    module.exercisesCompleted.push(exerciseId);
  }

  saveProgress(progress);
}

export function saveProjectBrief(brief: Partial<ProjectBrief>): void {
  const progress = getProgress();

  if (progress.projectBrief) {
    progress.projectBrief = {
      ...progress.projectBrief,
      ...brief,
      updatedAt: new Date().toISOString(),
    };
  } else {
    progress.projectBrief = {
      businessName: '',
      projectTitle: '',
      projectDescription: '',
      problemSolved: '',
      targetUsers: '',
      tasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...brief,
    };
  }

  saveProgress(progress);
}

export function incrementAiMessages(): boolean {
  const progress = getProgress();

  if (progress.apiKeyConfigured) {
    return true; // Unlimited with own API key
  }

  if (progress.aiMessagesUsed >= MAX_FREE_AI_MESSAGES) {
    return false; // Rate limited
  }

  progress.aiMessagesUsed++;
  saveProgress(progress);
  return true;
}

export function getRemainingAiMessages(): number {
  const progress = getProgress();

  if (progress.apiKeyConfigured) {
    return Infinity;
  }

  return Math.max(0, MAX_FREE_AI_MESSAGES - progress.aiMessagesUsed);
}

export function setApiKeyConfigured(configured: boolean): void {
  const progress = getProgress();
  progress.apiKeyConfigured = configured;
  saveProgress(progress);
}

export function getApiKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('claude-api-key');
}

export function setApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('claude-api-key', key);
  setApiKeyConfigured(true);
}

export function clearApiKey(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('claude-api-key');
  setApiKeyConfigured(false);
}

export function isModuleUnlocked(moduleId: string): boolean {
  const progress = getProgress();
  const moduleNum = parseInt(moduleId);

  if (isNaN(moduleNum)) return false;
  if (moduleNum === 0) return true;

  // Module is unlocked if previous module is completed
  return progress.currentModule >= moduleNum;
}

export function getModuleProgress(moduleId: string): ModuleProgress | null {
  const progress = getProgress();
  return progress.modules.find(m => m.moduleId === moduleId) || null;
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
