'use client';

import { useState } from 'react';

interface DiagramStep {
  id: string;
  title: string;
  description: string;
}

// Client-Server Model Diagram
export function ClientServerDiagram({ className = '' }: { className?: string }) {
  const [activeStep, setActiveStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps: DiagramStep[] = [
    {
      id: 'client',
      title: 'The Client (Your Browser)',
      description: 'You type a URL or click a link. Your browser is the "client" - it makes requests for information.',
    },
    {
      id: 'request',
      title: 'The Request',
      description: 'Your browser sends a request across the internet: "Hey, give me the content at this address!"',
    },
    {
      id: 'server',
      title: 'The Server',
      description: 'A computer somewhere in the world receives your request. It has the files and data you asked for.',
    },
    {
      id: 'response',
      title: 'The Response',
      description: 'The server sends back the content: HTML, CSS, JavaScript, images - everything your browser needs.',
    },
    {
      id: 'render',
      title: 'The Result',
      description: 'Your browser receives the response and renders the page. You see the website!',
    },
  ];

  const runAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveStep(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= steps.length) {
        clearInterval(interval);
        setIsAnimating(false);
      } else {
        setActiveStep(step);
      }
    }, 1500);
  };

  return (
    <div className={`bg-card rounded-xl border border-border overflow-hidden ${className}`}>
      {/* Visual Diagram */}
      <div className="p-8 bg-muted/30">
        <div className="flex items-center justify-between gap-4 relative">
          {/* Client */}
          <div className={`flex flex-col items-center transition-all duration-300 ${activeStep === 0 || activeStep === 4 ? 'scale-110' : 'opacity-70'}`}>
            <div className="w-20 h-16 bg-card border-2 border-border rounded-lg flex items-center justify-center mb-2">
              <svg className="w-10 h-10 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm text-muted-foreground">Client</span>
            <span className="text-xs text-muted-foreground/70">(Your Browser)</span>
          </div>

          {/* Connection Lines */}
          <div className="flex-1 relative h-8">
            {/* Request Arrow */}
            <div className={`absolute top-0 left-0 right-0 h-3 flex items-center transition-all duration-500 ${activeStep === 1 ? 'opacity-100' : 'opacity-30'}`}>
              <div className="flex-1 h-0.5 bg-foreground" />
              <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-foreground" />
            </div>
            <span className={`absolute top-0 left-1/2 -translate-x-1/2 text-xs text-muted-foreground transition-opacity ${activeStep === 1 ? 'opacity-100' : 'opacity-0'}`}>
              Request
            </span>

            {/* Response Arrow */}
            <div className={`absolute bottom-0 left-0 right-0 h-3 flex items-center flex-row-reverse transition-all duration-500 ${activeStep === 3 ? 'opacity-100' : 'opacity-30'}`}>
              <div className="flex-1 h-0.5 bg-foreground" />
              <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-8 border-r-foreground" />
            </div>
            <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-muted-foreground transition-opacity ${activeStep === 3 ? 'opacity-100' : 'opacity-0'}`}>
              Response
            </span>
          </div>

          {/* Server */}
          <div className={`flex flex-col items-center transition-all duration-300 ${activeStep === 2 ? 'scale-110' : 'opacity-70'}`}>
            <div className="w-20 h-16 bg-card border-2 border-border rounded-lg flex items-center justify-center mb-2">
              <svg className="w-10 h-10 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>
            <span className="text-sm text-muted-foreground">Server</span>
            <span className="text-xs text-muted-foreground/70">(Remote Computer)</span>
          </div>
        </div>
      </div>

      {/* Step Description */}
      <div className="p-6 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-foreground">{steps[activeStep].title}</h4>
          <span className="text-sm text-muted-foreground">Step {activeStep + 1} of {steps.length}</span>
        </div>
        <p className="text-muted-foreground text-sm mb-4">{steps[activeStep].description}</p>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={runAnimation}
            disabled={isAnimating}
            className="btn btn-primary px-4 py-2 text-sm disabled:opacity-50"
          >
            {isAnimating ? 'Playing...' : 'Play Animation'}
          </button>
          <div className="flex gap-1 ml-auto">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                disabled={isAnimating}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  activeStep === index ? 'bg-foreground scale-125' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// URL Journey Diagram
export function URLJourneyDiagram({ className = '' }: { className?: string }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: '1. You Type the URL',
      detail: 'https://example.com/page',
      description: 'You enter a URL in your browser. This contains the protocol (https), domain (example.com), and path (/page).',
    },
    {
      title: '2. DNS Lookup',
      detail: 'example.com → 93.184.216.34',
      description: 'Your browser asks DNS servers: "What\'s the IP address for example.com?" It translates the human-friendly name to a computer address.',
    },
    {
      title: '3. TCP Connection',
      detail: 'Connecting to 93.184.216.34:443',
      description: 'Your browser establishes a secure connection (HTTPS) with the server at that IP address.',
    },
    {
      title: '4. HTTP Request',
      detail: 'GET /page HTTP/1.1',
      description: 'Your browser sends an HTTP request asking for the specific page content.',
    },
    {
      title: '5. Server Processing',
      detail: 'Building response...',
      description: 'The server processes your request - maybe querying a database, running code, or just finding the right file.',
    },
    {
      title: '6. HTTP Response',
      detail: 'HTTP/1.1 200 OK + HTML',
      description: 'The server sends back the content (HTML, CSS, JS) along with a status code (200 = success!).',
    },
    {
      title: '7. Page Render',
      detail: 'Painting pixels...',
      description: 'Your browser parses the HTML, applies CSS, runs JavaScript, and renders the final page you see.',
    },
  ];

  return (
    <div className={`bg-card rounded-xl border border-border overflow-hidden ${className}`}>
      {/* Timeline */}
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Step indicators */}
          <div className="flex flex-col gap-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                  activeStep === index
                    ? 'bg-foreground text-background'
                    : activeStep > index
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-muted/50 text-muted-foreground/50'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-2">{steps[activeStep].title}</h4>
            <code className="block bg-muted px-3 py-2 rounded-lg text-sm text-foreground mb-3 font-mono">
              {steps[activeStep].detail}
            </code>
            <p className="text-muted-foreground text-sm">{steps[activeStep].description}</p>

            {/* Navigation */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                disabled={activeStep === 0}
                className="btn btn-outline px-3 py-1.5 text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
                disabled={activeStep === steps.length - 1}
                className="btn btn-outline px-3 py-1.5 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// API Diagram
export function APIDiagram({ className = '' }: { className?: string }) {
  const [selectedExample, setSelectedExample] = useState(0);

  const examples = [
    {
      name: 'Get Weather',
      request: 'GET /api/weather?city=London',
      response: '{ "temp": 15, "condition": "cloudy" }',
      description: 'Your app asks for weather data, the API returns it in a structured format (JSON).',
    },
    {
      name: 'Create User',
      request: 'POST /api/users\n{ "name": "Alice", "email": "alice@example.com" }',
      response: '{ "id": 123, "name": "Alice", "created": true }',
      description: 'Your app sends data to create something new. The API confirms it was created.',
    },
    {
      name: 'Update Profile',
      request: 'PUT /api/users/123\n{ "name": "Alice Smith" }',
      response: '{ "id": 123, "name": "Alice Smith", "updated": true }',
      description: 'Your app sends updated data. The API modifies the existing record.',
    },
    {
      name: 'Delete Item',
      request: 'DELETE /api/items/456',
      response: '{ "deleted": true }',
      description: 'Your app asks to remove something. The API confirms deletion.',
    },
  ];

  return (
    <div className={`bg-card rounded-xl border border-border overflow-hidden ${className}`}>
      <div className="p-6">
        <h4 className="font-semibold text-foreground mb-4">APIs: How Apps Talk to Each Other</h4>

        {/* Example selector */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => setSelectedExample(index)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                selectedExample === index
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {example.name}
            </button>
          ))}
        </div>

        {/* Request/Response visualization */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">Request</label>
            <pre className="bg-muted p-4 rounded-xl text-sm font-mono text-foreground whitespace-pre-wrap overflow-x-auto">
              {examples[selectedExample].request}
            </pre>
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">Response</label>
            <pre className="bg-muted p-4 rounded-xl text-sm font-mono text-foreground whitespace-pre-wrap overflow-x-auto">
              {examples[selectedExample].response}
            </pre>
          </div>
        </div>

        <p className="text-muted-foreground text-sm">{examples[selectedExample].description}</p>
      </div>
    </div>
  );
}

// Database Diagram
export function DatabaseDiagram({ className = '' }: { className?: string }) {
  const [viewMode, setViewMode] = useState<'visual' | 'table'>('visual');

  const sampleData = [
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'User' },
  ];

  return (
    <div className={`bg-card rounded-xl border border-border overflow-hidden ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-foreground">Databases: Where Data Lives</h4>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('visual')}
              className={`px-3 py-1 rounded-md text-sm transition-all ${
                viewMode === 'visual' ? 'bg-foreground text-background' : 'text-muted-foreground'
              }`}
            >
              Visual
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md text-sm transition-all ${
                viewMode === 'table' ? 'bg-foreground text-background' : 'text-muted-foreground'
              }`}
            >
              Table
            </button>
          </div>
        </div>

        {viewMode === 'visual' ? (
          <div className="flex items-center justify-center gap-8 py-8">
            {/* App */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm text-muted-foreground">Your App</span>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center">
                <div className="w-12 h-0.5 bg-foreground" />
                <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-foreground" />
              </div>
              <span className="text-xs text-muted-foreground">Query</span>
              <div className="flex items-center">
                <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-8 border-r-foreground" />
                <div className="w-12 h-0.5 bg-foreground" />
              </div>
              <span className="text-xs text-muted-foreground">Data</span>
            </div>

            {/* Database */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <span className="text-sm text-muted-foreground">Database</span>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">ID</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Name</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Email</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Role</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.map((row) => (
                  <tr key={row.id} className="border-b border-border/50">
                    <td className="py-2 px-3 text-foreground">{row.id}</td>
                    <td className="py-2 px-3 text-foreground">{row.name}</td>
                    <td className="py-2 px-3 text-foreground font-mono text-xs">{row.email}</td>
                    <td className="py-2 px-3 text-foreground">{row.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 p-4 bg-muted/50 rounded-xl">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">When do you need a database?</strong> When your app needs to remember things between sessions: user accounts, posts, orders, settings. If your data needs to persist, you need a database.
          </p>
        </div>
      </div>
    </div>
  );
}

// Combined component for the module page
export default function InteractiveDiagram({ type, className = '' }: { type: 'client-server' | 'url-journey' | 'api' | 'database'; className?: string }) {
  switch (type) {
    case 'client-server':
      return <ClientServerDiagram className={className} />;
    case 'url-journey':
      return <URLJourneyDiagram className={className} />;
    case 'api':
      return <APIDiagram className={className} />;
    case 'database':
      return <DatabaseDiagram className={className} />;
    default:
      return null;
  }
}
