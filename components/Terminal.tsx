'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import { VirtualFileSystem, CommandResult } from '@/lib/terminal-commands';

interface TerminalProps {
  onCommand?: (command: string, result: CommandResult) => void;
  filesystem?: VirtualFileSystem;
  welcomeMessage?: string;
  className?: string;
}

export default function Terminal({
  onCommand,
  filesystem: externalFs,
  welcomeMessage,
  className = '',
}: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fsRef = useRef<VirtualFileSystem>(externalFs || new VirtualFileSystem());
  const [currentLine, setCurrentLine] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const commandHistoryRef = useRef<string[]>([]);

  const writePrompt = useCallback(() => {
    if (!xtermRef.current) return;
    const path = fsRef.current.getCurrentPathString();
    const shortPath = path.replace('/home/user', '~');
    xtermRef.current.write(`\r\n\x1b[32muser@training\x1b[0m:\x1b[34m${shortPath}\x1b[0m$ `);
  }, []);

  const handleCommand = useCallback((command: string) => {
    if (!xtermRef.current) return;

    const trimmed = command.trim();
    if (trimmed) {
      commandHistoryRef.current.push(trimmed);
    }

    const result = fsRef.current.executeCommand(trimmed);

    if (result.output) {
      // Handle clear command specially
      if (result.output === '\x1bc') {
        xtermRef.current.clear();
      } else {
        xtermRef.current.write('\r\n' + result.output);
      }
    }

    if (result.hint) {
      xtermRef.current.write(`\r\n\x1b[33m💡 Hint: ${result.hint}\x1b[0m`);
    }

    if (onCommand) {
      onCommand(trimmed, result);
    }

    writePrompt();
    setHistoryIndex(-1);
  }, [onCommand, writePrompt]);

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    const xterm = new XTerm({
      theme: {
        background: '#1a1b26',
        foreground: '#a9b1d6',
        cursor: '#c0caf5',
        cursorAccent: '#1a1b26',
        black: '#32344a',
        red: '#f7768e',
        green: '#9ece6a',
        yellow: '#e0af68',
        blue: '#7aa2f7',
        magenta: '#ad8ee6',
        cyan: '#449dab',
        white: '#787c99',
        brightBlack: '#444b6a',
        brightRed: '#ff7a93',
        brightGreen: '#b9f27c',
        brightYellow: '#ff9e64',
        brightBlue: '#7da6ff',
        brightMagenta: '#bb9af7',
        brightCyan: '#0db9d7',
        brightWhite: '#acb0d0',
      },
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      fontSize: 14,
      lineHeight: 1.2,
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 1000,
    });

    xterm.open(terminalRef.current);
    xtermRef.current = xterm;

    // Write welcome message
    if (welcomeMessage) {
      xterm.writeln(welcomeMessage);
    } else {
      xterm.writeln('\x1b[1;36m╔════════════════════════════════════════════════════════╗\x1b[0m');
      xterm.writeln('\x1b[1;36m║\x1b[0m   Welcome to the Claude Code Training Terminal!       \x1b[1;36m║\x1b[0m');
      xterm.writeln('\x1b[1;36m║\x1b[0m   Type \x1b[33mhelp\x1b[0m to see available commands.                \x1b[1;36m║\x1b[0m');
      xterm.writeln('\x1b[1;36m╚════════════════════════════════════════════════════════╝\x1b[0m');
    }
    writePrompt();

    // Handle input
    let currentInput = '';

    xterm.onData((data) => {
      const code = data.charCodeAt(0);

      // Enter key
      if (code === 13) {
        handleCommand(currentInput);
        currentInput = '';
        setCurrentLine('');
        return;
      }

      // Backspace
      if (code === 127) {
        if (currentInput.length > 0) {
          currentInput = currentInput.slice(0, -1);
          xterm.write('\b \b');
          setCurrentLine(currentInput);
        }
        return;
      }

      // Arrow keys (escape sequences)
      if (data === '\x1b[A') {
        // Up arrow - previous command
        const history = commandHistoryRef.current;
        if (history.length > 0) {
          const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
          setHistoryIndex(newIndex);
          // Clear current line
          xterm.write('\r\x1b[K');
          const path = fsRef.current.getCurrentPathString().replace('/home/user', '~');
          xterm.write(`\x1b[32muser@training\x1b[0m:\x1b[34m${path}\x1b[0m$ `);
          currentInput = history[newIndex] || '';
          xterm.write(currentInput);
          setCurrentLine(currentInput);
        }
        return;
      }

      if (data === '\x1b[B') {
        // Down arrow - next command
        const history = commandHistoryRef.current;
        if (historyIndex !== -1) {
          const newIndex = historyIndex + 1;
          if (newIndex >= history.length) {
            setHistoryIndex(-1);
            xterm.write('\r\x1b[K');
            const path = fsRef.current.getCurrentPathString().replace('/home/user', '~');
            xterm.write(`\x1b[32muser@training\x1b[0m:\x1b[34m${path}\x1b[0m$ `);
            currentInput = '';
            setCurrentLine('');
          } else {
            setHistoryIndex(newIndex);
            xterm.write('\r\x1b[K');
            const path = fsRef.current.getCurrentPathString().replace('/home/user', '~');
            xterm.write(`\x1b[32muser@training\x1b[0m:\x1b[34m${path}\x1b[0m$ `);
            currentInput = history[newIndex] || '';
            xterm.write(currentInput);
            setCurrentLine(currentInput);
          }
        }
        return;
      }

      // Ignore other escape sequences
      if (data.startsWith('\x1b')) {
        return;
      }

      // Printable characters
      if (code >= 32) {
        currentInput += data;
        xterm.write(data);
        setCurrentLine(currentInput);
      }
    });

    // Focus on mount
    xterm.focus();

    return () => {
      xterm.dispose();
      xtermRef.current = null;
    };
  }, [welcomeMessage, writePrompt, handleCommand, historyIndex]);

  // Sync external filesystem changes
  useEffect(() => {
    if (externalFs) {
      fsRef.current = externalFs;
    }
  }, [externalFs]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={terminalRef}
        className="h-full w-full rounded-lg overflow-hidden"
        onClick={() => xtermRef.current?.focus()}
      />
      <div className="absolute bottom-2 right-2 text-xs text-gray-500">
        Type <code className="bg-gray-700 px-1 rounded">help</code> for commands
      </div>
    </div>
  );
}
