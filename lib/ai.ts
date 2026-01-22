// AI integration for scoping chat and prompt feedback

import { ProjectBrief } from './progress';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ScopingConversation {
  messages: ChatMessage[];
  stage: 'brainstorm' | 'selection' | 'scoping' | 'complete';
  projectBrief?: Partial<ProjectBrief>;
}

// System prompts for different AI assistants
export const systemPrompts = {
  scoping: `You are a friendly, experienced tech mentor helping someone scope their first coding project. Your goal is to help them pick a project that is:
1. Actually useful for their business (not just a learning exercise)
2. Achievable with Claude Code by a beginner (no complex infrastructure)
3. Completable in a few hours of focused work

Start by asking about their business and the manual processes they mentioned. Help them pick ONE project and scope it down to something achievable.

Guidelines:
- Be encouraging but realistic - help them avoid scope creep
- Ask clarifying questions to understand what "done" looks like
- Break down vague ideas into concrete features
- Suggest simpler alternatives when they aim too big
- Focus on the core value - what's the ONE thing this needs to do?
- Ask 2-4 questions maximum before creating the brief (don't drag it out)

When you have enough information (usually after 2-3 exchanges), create a Project Brief with this EXACT format:

---
PROJECT BRIEF

Project Title: [name]
Description: [one sentence]
Problem it solves: [what pain point this addresses]
Who will use it: [target user]

Tasks:
1. [specific task]
2. [specific task]
...
---

IMPORTANT: After you output the Project Brief, your job is DONE. Say something like "Your project brief is ready! Continue to the next module to start learning how to build this."

DO NOT:
- Discuss technical implementation details (APIs, databases, code)
- Offer to help build it
- Suggest next steps beyond "continue to the next module"
- Keep the conversation going after the brief is created

Your ONLY job is to help them define WHAT to build, not HOW to build it. The rest of the course teaches that.

Keep responses concise and conversational. Use simple language, not technical jargon.`,

  scopeReview: `You are a technical mentor reviewing a project scope. Your job is to:
1. Check if tasks are specific enough (the "5-year-old test")
2. Identify any missing dependencies (what needs to happen first?)
3. Flag tasks that are too big and suggest how to break them down
4. Suggest any missing tasks they might have overlooked

Be constructive and specific. For each piece of feedback, explain WHY and give a concrete example of how to improve it.`,

  promptCoach: `You are a prompt engineering coach. Help users write better prompts for Claude Code by:
1. Identifying what's missing (context, specifics, expected behavior)
2. Suggesting improvements with examples
3. Explaining why the changes help

Focus on practical, actionable feedback. Don't just say "be more specific" - show them HOW to be more specific for their exact situation.`,

  debugHelper: `You are a patient debugging assistant. When users are stuck:
1. Ask clarifying questions about what they expected vs what happened
2. Help them isolate the problem
3. Suggest debugging strategies
4. Provide code fixes when appropriate

Be encouraging - everyone gets stuck. Focus on teaching debugging skills, not just giving answers.`,
};

// Generate a unique message ID
export function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Create a new scoping conversation
export function createScopingConversation(ideas: string[]): ScopingConversation {
  const systemMessage: ChatMessage = {
    id: generateMessageId(),
    role: 'system',
    content: systemPrompts.scoping,
    timestamp: new Date(),
  };

  const userIntro: ChatMessage = {
    id: generateMessageId(),
    role: 'user',
    content: `Here are some manual or annoying processes in my business that I'd like to automate:\n\n${ideas.map((idea, i) => `${i + 1}. ${idea}`).join('\n')}`,
    timestamp: new Date(),
  };

  return {
    messages: [systemMessage, userIntro],
    stage: 'brainstorm',
  };
}

// Format messages for API call
export function formatMessagesForAPI(messages: ChatMessage[]): Array<{ role: string; content: string }> {
  return messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role,
      content: m.content,
    }));
}

// Extract system prompt from conversation
export function getSystemPrompt(messages: ChatMessage[]): string | undefined {
  const systemMessage = messages.find(m => m.role === 'system');
  return systemMessage?.content;
}

// Check if conversation has produced a project brief
export function extractProjectBrief(assistantMessage: string): Partial<ProjectBrief> | null {
  // Look for structured project brief in the message
  const titleMatch = assistantMessage.match(/Project (?:Title|Name):\s*(.+?)(?:\n|$)/i);
  const descMatch = assistantMessage.match(/Description:\s*(.+?)(?:\n|$)/i);
  const problemMatch = assistantMessage.match(/Problem (?:Solved|it solves):\s*(.+?)(?:\n|$)/i);
  const usersMatch = assistantMessage.match(/(?:Who will use it|Target Users|Users):\s*(.+?)(?:\n|$)/i);

  // Look for numbered task list
  const tasksMatch = assistantMessage.match(/(?:Tasks|Steps|To-do):\s*\n((?:\d+\..+\n?)+)/i);
  let tasks: string[] = [];

  if (tasksMatch) {
    tasks = tasksMatch[1]
      .split('\n')
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(line => line.length > 0);
  }

  if (titleMatch || descMatch || tasks.length > 0) {
    return {
      projectTitle: titleMatch?.[1]?.trim() || '',
      projectDescription: descMatch?.[1]?.trim() || '',
      problemSolved: problemMatch?.[1]?.trim() || '',
      targetUsers: usersMatch?.[1]?.trim() || '',
      tasks: tasks.length > 0 ? tasks : [],
    };
  }

  return null;
}

// Prompt evaluation
export interface PromptEvaluation {
  score: number; // 1-10
  strengths: string[];
  improvements: string[];
  suggestedRevision?: string;
}

export function evaluatePromptLocally(prompt: string): PromptEvaluation {
  const strengths: string[] = [];
  const improvements: string[] = [];
  let score = 5;

  // Check for file path
  if (prompt.match(/\b(src\/|\.tsx?|\.jsx?|\.py|\.js)\b/)) {
    strengths.push('Includes specific file path');
    score += 1;
  } else {
    improvements.push('Add the specific file path (e.g., src/components/Button.tsx)');
  }

  // Check for specificity
  if (prompt.length > 100) {
    strengths.push('Good level of detail');
    score += 1;
  } else {
    improvements.push('Add more context and specifics');
  }

  // Check for desired behavior
  if (prompt.match(/should|expect|return|display|show/i)) {
    strengths.push('Describes expected behavior');
    score += 1;
  } else {
    improvements.push('Describe what the result should look like or do');
  }

  // Check for context
  if (prompt.match(/current|existing|already|now/i)) {
    strengths.push('Provides context about current state');
    score += 1;
  } else {
    improvements.push('Mention the current state or behavior');
  }

  // Check for examples
  if (prompt.match(/example|e\.g\.|for instance|like:/i)) {
    strengths.push('Includes examples');
    score += 1;
  } else {
    improvements.push('Consider adding a concrete example');
  }

  // Penalize vague phrases
  const vaguePhrases = ['make it better', 'improve', 'fix it', 'make it work', 'add some'];
  for (const phrase of vaguePhrases) {
    if (prompt.toLowerCase().includes(phrase)) {
      improvements.push(`"${phrase}" is vague - be specific about what you want`);
      score -= 1;
    }
  }

  return {
    score: Math.max(1, Math.min(10, score)),
    strengths,
    improvements,
  };
}

// Rate limiting helper
export interface RateLimitInfo {
  remaining: number;
  resetTime?: Date;
  isLimited: boolean;
}

export function checkRateLimit(messagesUsed: number, maxFree: number = 10): RateLimitInfo {
  const remaining = Math.max(0, maxFree - messagesUsed);
  return {
    remaining,
    isLimited: remaining === 0,
    resetTime: undefined, // Could add daily reset logic here
  };
}

// API key validation (basic format check)
export function isValidApiKeyFormat(key: string): boolean {
  // Anthropic API keys start with 'sk-ant-'
  return key.startsWith('sk-ant-') && key.length > 20;
}
