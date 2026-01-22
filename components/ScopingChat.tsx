'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, generateMessageId, extractProjectBrief, systemPrompts } from '@/lib/ai';
import { saveProjectBrief, incrementAiMessages, getRemainingAiMessages, getApiKey, setApiKey, ProjectBrief } from '@/lib/progress';

interface ScopingChatProps {
  initialIdeas?: string[];
  onProjectBriefGenerated?: (brief: Partial<ProjectBrief>) => void;
  chatType?: 'scoping' | 'scopeReview' | 'promptCoach' | 'debugHelper';
  className?: string;
}


export default function ScopingChat({
  initialIdeas = [],
  onProjectBriefGenerated,
  chatType = 'scoping',
  className = '',
}: ScopingChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [briefReady, setBriefReady] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Check for API key on mount
  useEffect(() => {
    setHasApiKey(!!getApiKey());
  }, []);

  // Initialize with ideas if provided
  useEffect(() => {
    if (initialIdeas.length > 0 && messages.length === 0) {
      const systemMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'system',
        content: systemPrompts[chatType],
        timestamp: new Date(),
      };

      const assistantGreeting: ChatMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: getGreeting(chatType, initialIdeas),
        timestamp: new Date(),
      };

      setMessages([systemMessage, assistantGreeting]);
    }
  }, [initialIdeas, chatType, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getGreeting = (type: string, ideas: string[]): string => {
    switch (type) {
      case 'scoping':
        return `Great! I see you've brainstormed some ideas:\n\n${ideas.map((idea, i) => `${i + 1}. ${idea}`).join('\n')}\n\nThese all sound like they could be useful projects! Let's pick one to focus on.\n\nWhich of these frustrates you the most in your day-to-day work? Or if you have a favorite, tell me more about it - what specifically is annoying about the current process?`;
      case 'scopeReview':
        return "I'll help you review your project scope. Share your task list and I'll give you feedback on how to make each task clearer and more achievable.";
      case 'promptCoach':
        return "I'm here to help you write better prompts! Share a prompt you're working on and I'll help you improve it.";
      case 'debugHelper':
        return "I'm here to help you debug! Tell me what you expected to happen and what's actually happening.";
      default:
        return "How can I help you today?";
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Check rate limit
    const remaining = getRemainingAiMessages();
    const apiKey = getApiKey();

    if (remaining === 0 && !apiKey) {
      setError('You\'ve used all your free AI messages. Add your Claude API key to continue.');
      return;
    }

    const userMessage: ChatMessage = {
      id: generateMessageId(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Use rate limit
      if (!apiKey) {
        incrementAiMessages();
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].filter(m => m.role !== 'system'),
          systemPrompt: systemPrompts[chatType],
          apiKey: apiKey || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Check if response contains a project brief
      if (chatType === 'scoping') {
        const brief = extractProjectBrief(data.content);
        if (brief && (brief.projectTitle || brief.tasks?.length)) {
          saveProjectBrief(brief);
          onProjectBriefGenerated?.(brief);
          setBriefReady(true);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      setApiKey(apiKeyInput.trim());
      setHasApiKey(true);
      setShowApiKeyInput(false);
      setApiKeyInput('');
      setError(null);
    }
  };

  const remainingMessages = getRemainingAiMessages();

  return (
    <div className={`flex flex-col bg-card rounded-xl border border-border ${className}`}>
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-[300px] max-h-[500px]">
        {messages.filter(m => m.role !== 'system').map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-foreground'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
              <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-background/60' : 'text-muted-foreground'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-xl px-4 py-3">
              <div className="flex items-center gap-1.5">
                <div className="animate-bounce h-2 w-2 bg-foreground/60 rounded-full" />
                <div className="animate-bounce h-2 w-2 bg-foreground/60 rounded-full [animation-delay:0.1s]" />
                <div className="animate-bounce h-2 w-2 bg-foreground/60 rounded-full [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {briefReady && chatType === 'scoping' && (
          <div className="bg-muted/50 border border-foreground rounded-xl px-4 py-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Project Brief Created!</p>
                <p className="text-muted-foreground text-xs mt-0.5">Click &quot;Review Project Brief&quot; below to continue</p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-border p-5">
        {/* API Key Input Modal */}
        {showApiKeyInput && (
          <div className="mb-4 bg-muted rounded-xl p-5 border border-border">
            <h4 className="text-sm font-medium text-foreground mb-2">Enter your Claude API Key</h4>
            <p className="text-xs text-muted-foreground mb-4">
              Get your API key from{' '}
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline underline-offset-2"
              >
                console.anthropic.com
              </a>
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="sk-ant-..."
                className="flex-1 bg-background text-foreground rounded-lg px-4 py-2.5 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                onKeyDown={(e) => e.key === 'Enter' && handleSaveApiKey()}
              />
              <button
                onClick={handleSaveApiKey}
                disabled={!apiKeyInput.trim()}
                className="btn btn-primary px-4 py-2.5 text-sm"
              >
                Save
              </button>
              <button
                onClick={() => setShowApiKeyInput(false)}
                className="btn btn-secondary px-4 py-2.5 text-sm"
              >
                Cancel
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Your key is stored locally in your browser and never sent to our servers.
            </p>
          </div>
        )}

        {/* API Key Warning */}
        {!hasApiKey && !showApiKeyInput && (
          <div className="mb-4 bg-muted/50 border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">
                  {remainingMessages > 0
                    ? `${remainingMessages} free messages remaining`
                    : 'No free messages remaining'}
                </p>
                <p className="text-xs text-muted-foreground">Add your Claude API key for unlimited chat</p>
              </div>
              <button
                onClick={() => setShowApiKeyInput(true)}
                className="btn btn-outline px-4 py-2 text-sm"
              >
                Add API Key
              </button>
            </div>
          </div>
        )}

        {/* API Key Configured */}
        {hasApiKey && (
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              API key configured
            </span>
            <button
              onClick={() => setShowApiKeyInput(true)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Change key
            </button>
          </div>
        )}

        <div className="flex gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 bg-muted text-foreground rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            rows={2}
            disabled={isLoading || (!hasApiKey && remainingMessages === 0)}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim() || (!hasApiKey && remainingMessages === 0)}
            className="btn btn-primary px-4 py-3 self-end"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
