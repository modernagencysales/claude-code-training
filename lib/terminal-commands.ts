// Virtual filesystem and terminal command implementation

export interface FileNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: Map<string, FileNode>;
  createdAt: Date;
  modifiedAt: Date;
}

export interface CommandResult {
  output: string;
  success: boolean;
  hint?: string;
}

export class VirtualFileSystem {
  private root: FileNode;
  private currentPath: string[];
  private commandHistory: string[];

  constructor() {
    this.root = this.createInitialFileSystem();
    this.currentPath = ['home', 'user'];
    this.commandHistory = [];
  }

  private createInitialFileSystem(): FileNode {
    const now = new Date();

    const createDir = (name: string, children?: Map<string, FileNode>): FileNode => ({
      name,
      type: 'directory',
      children: children || new Map(),
      createdAt: now,
      modifiedAt: now,
    });

    const createFile = (name: string, content: string = ''): FileNode => ({
      name,
      type: 'file',
      content,
      createdAt: now,
      modifiedAt: now,
    });

    // Build the file system structure
    const userDir = createDir('user');
    const documentsDir = createDir('documents');
    const projectsDir = createDir('projects');
    const desktopDir = createDir('desktop');

    // Add some example files
    documentsDir.children!.set('readme.txt', createFile('readme.txt', 'Welcome to your documents folder!\n\nThis is where you can store your files.'));
    documentsDir.children!.set('notes.txt', createFile('notes.txt', 'My Notes\n========\n\n- Learn terminal commands\n- Build something useful\n- Deploy to the web'));

    projectsDir.children!.set('example', createDir('example'));
    const exampleProject = projectsDir.children!.get('example')!;
    exampleProject.children!.set('index.html', createFile('index.html', '<!DOCTYPE html>\n<html>\n<head>\n  <title>Example Project</title>\n</head>\n<body>\n  <h1>Hello World!</h1>\n</body>\n</html>'));
    exampleProject.children!.set('style.css', createFile('style.css', 'body {\n  font-family: sans-serif;\n  margin: 20px;\n}'));

    desktopDir.children!.set('welcome.txt', createFile('welcome.txt', 'Welcome to the Claude Code Training Platform!\n\nThis simulated terminal will help you learn the basics.\n\nTry these commands:\n- pwd (print working directory)\n- ls (list files)\n- cd documents (change to documents folder)\n- cat welcome.txt (read this file)'));

    userDir.children!.set('documents', documentsDir);
    userDir.children!.set('projects', projectsDir);
    userDir.children!.set('desktop', desktopDir);

    const homeDir = createDir('home');
    homeDir.children!.set('user', userDir);

    const root = createDir('/');
    root.children!.set('home', homeDir);

    return root;
  }

  private getNodeAtPath(path: string[]): FileNode | null {
    let current = this.root;

    for (const segment of path) {
      if (segment === '' || segment === '/') continue;
      if (current.type !== 'directory' || !current.children) return null;
      const child = current.children.get(segment);
      if (!child) return null;
      current = child;
    }

    return current;
  }

  private getCurrentNode(): FileNode | null {
    return this.getNodeAtPath(this.currentPath);
  }

  getCurrentPathString(): string {
    return '/' + this.currentPath.join('/');
  }

  executeCommand(input: string): CommandResult {
    const trimmed = input.trim();
    if (!trimmed) {
      return { output: '', success: true };
    }

    this.commandHistory.push(trimmed);

    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case 'pwd':
        return this.pwd();
      case 'ls':
        return this.ls(args);
      case 'cd':
        return this.cd(args);
      case 'mkdir':
        return this.mkdir(args);
      case 'touch':
        return this.touch(args);
      case 'rm':
        return this.rm(args);
      case 'cat':
        return this.cat(args);
      case 'echo':
        return this.echo(args);
      case 'cp':
        return this.cp(args);
      case 'mv':
        return this.mv(args);
      case 'clear':
        return { output: '\x1bc', success: true }; // ANSI clear screen
      case 'help':
        return this.help();
      case 'history':
        return this.history();
      case 'whoami':
        return { output: 'user', success: true };
      case 'date':
        return { output: new Date().toString(), success: true };
      default:
        return {
          output: `Command not found: ${command}`,
          success: false,
          hint: `Type 'help' to see available commands.`,
        };
    }
  }

  private pwd(): CommandResult {
    return {
      output: this.getCurrentPathString(),
      success: true,
    };
  }

  private ls(args: string[]): CommandResult {
    const showHidden = args.includes('-a') || args.includes('-la') || args.includes('-al');
    const longFormat = args.includes('-l') || args.includes('-la') || args.includes('-al');

    const targetPath = args.find(a => !a.startsWith('-'));
    let node: FileNode | null;

    if (targetPath) {
      const resolvedPath = this.resolvePath(targetPath);
      node = this.getNodeAtPath(resolvedPath);
    } else {
      node = this.getCurrentNode();
    }

    if (!node) {
      return {
        output: `ls: cannot access '${targetPath}': No such file or directory`,
        success: false,
      };
    }

    if (node.type === 'file') {
      return { output: node.name, success: true };
    }

    if (!node.children || node.children.size === 0) {
      return { output: '', success: true };
    }

    const entries = Array.from(node.children.values())
      .filter(child => showHidden || !child.name.startsWith('.'))
      .sort((a, b) => a.name.localeCompare(b.name));

    if (longFormat) {
      const lines = entries.map(child => {
        const type = child.type === 'directory' ? 'd' : '-';
        const perms = 'rwxr-xr-x';
        const size = child.type === 'file' ? (child.content?.length || 0).toString().padStart(8) : '    4096';
        const date = child.modifiedAt.toLocaleDateString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
        const name = child.type === 'directory' ? `\x1b[34m${child.name}\x1b[0m` : child.name;
        return `${type}${perms} 1 user user ${size} ${date} ${name}`;
      });
      return { output: lines.join('\n'), success: true };
    }

    const names = entries.map(child =>
      child.type === 'directory' ? `\x1b[34m${child.name}\x1b[0m` : child.name
    );
    return { output: names.join('  '), success: true };
  }

  private cd(args: string[]): CommandResult {
    if (args.length === 0 || args[0] === '~') {
      this.currentPath = ['home', 'user'];
      return { output: '', success: true };
    }

    const target = args[0];
    const newPath = this.resolvePath(target);
    const node = this.getNodeAtPath(newPath);

    if (!node) {
      return {
        output: `cd: no such file or directory: ${target}`,
        success: false,
        hint: `Use 'ls' to see what folders are available.`,
      };
    }

    if (node.type !== 'directory') {
      return {
        output: `cd: not a directory: ${target}`,
        success: false,
      };
    }

    this.currentPath = newPath;
    return { output: '', success: true };
  }

  private mkdir(args: string[]): CommandResult {
    if (args.length === 0) {
      return {
        output: 'mkdir: missing operand',
        success: false,
        hint: `Usage: mkdir <directory_name>`,
      };
    }

    const createParents = args.includes('-p');
    const dirName = args.find(a => !a.startsWith('-'));

    if (!dirName) {
      return { output: 'mkdir: missing operand', success: false };
    }

    const parentPath = this.resolvePath(dirName.includes('/') ? dirName.substring(0, dirName.lastIndexOf('/')) || '.' : '.');
    const parent = this.getNodeAtPath(parentPath);
    const newDirName = dirName.includes('/') ? dirName.substring(dirName.lastIndexOf('/') + 1) : dirName;

    if (!parent || parent.type !== 'directory') {
      if (!createParents) {
        return {
          output: `mkdir: cannot create directory '${dirName}': No such file or directory`,
          success: false,
        };
      }
    }

    if (parent && parent.children!.has(newDirName)) {
      return {
        output: `mkdir: cannot create directory '${newDirName}': File exists`,
        success: false,
      };
    }

    const now = new Date();
    parent!.children!.set(newDirName, {
      name: newDirName,
      type: 'directory',
      children: new Map(),
      createdAt: now,
      modifiedAt: now,
    });

    return { output: '', success: true };
  }

  private touch(args: string[]): CommandResult {
    if (args.length === 0) {
      return {
        output: 'touch: missing file operand',
        success: false,
        hint: `Usage: touch <filename>`,
      };
    }

    const fileName = args[0];
    const parentPath = this.resolvePath(fileName.includes('/') ? fileName.substring(0, fileName.lastIndexOf('/')) || '.' : '.');
    const parent = this.getNodeAtPath(parentPath);
    const newFileName = fileName.includes('/') ? fileName.substring(fileName.lastIndexOf('/') + 1) : fileName;

    if (!parent || parent.type !== 'directory') {
      return {
        output: `touch: cannot touch '${fileName}': No such file or directory`,
        success: false,
      };
    }

    const now = new Date();
    if (parent.children!.has(newFileName)) {
      // Update modified time
      parent.children!.get(newFileName)!.modifiedAt = now;
    } else {
      parent.children!.set(newFileName, {
        name: newFileName,
        type: 'file',
        content: '',
        createdAt: now,
        modifiedAt: now,
      });
    }

    return { output: '', success: true };
  }

  private rm(args: string[]): CommandResult {
    const recursive = args.includes('-r') || args.includes('-rf') || args.includes('-fr');
    const force = args.includes('-f') || args.includes('-rf') || args.includes('-fr');
    const target = args.find(a => !a.startsWith('-'));

    if (!target) {
      return {
        output: 'rm: missing operand',
        success: false,
        hint: `Usage: rm [-r] <file_or_directory>`,
      };
    }

    const resolvedPath = this.resolvePath(target);
    const node = this.getNodeAtPath(resolvedPath);

    if (!node) {
      if (force) {
        return { output: '', success: true };
      }
      return {
        output: `rm: cannot remove '${target}': No such file or directory`,
        success: false,
      };
    }

    if (node.type === 'directory' && !recursive) {
      return {
        output: `rm: cannot remove '${target}': Is a directory`,
        success: false,
        hint: `Use 'rm -r' to remove directories.`,
      };
    }

    // Get parent and remove
    const parentPath = resolvedPath.slice(0, -1);
    const parent = this.getNodeAtPath(parentPath);
    if (parent && parent.children) {
      parent.children.delete(node.name);
    }

    return { output: '', success: true };
  }

  private cat(args: string[]): CommandResult {
    if (args.length === 0) {
      return {
        output: 'cat: missing file operand',
        success: false,
        hint: `Usage: cat <filename>`,
      };
    }

    const outputs: string[] = [];
    for (const fileName of args) {
      const resolvedPath = this.resolvePath(fileName);
      const node = this.getNodeAtPath(resolvedPath);

      if (!node) {
        return {
          output: `cat: ${fileName}: No such file or directory`,
          success: false,
        };
      }

      if (node.type === 'directory') {
        return {
          output: `cat: ${fileName}: Is a directory`,
          success: false,
        };
      }

      outputs.push(node.content || '');
    }

    return { output: outputs.join('\n'), success: true };
  }

  private echo(args: string[]): CommandResult {
    // Handle basic redirection
    const redirectIndex = args.indexOf('>');
    const appendIndex = args.indexOf('>>');

    if (redirectIndex > -1 || appendIndex > -1) {
      const isAppend = appendIndex > -1;
      const opIndex = isAppend ? appendIndex : redirectIndex;
      const text = args.slice(0, opIndex).join(' ').replace(/^["']|["']$/g, '');
      const fileName = args[opIndex + 1];

      if (!fileName) {
        return { output: 'bash: syntax error near unexpected token `newline\'', success: false };
      }

      const parentPath = this.resolvePath('.');
      const parent = this.getNodeAtPath(parentPath);

      if (!parent || parent.type !== 'directory') {
        return { output: `bash: ${fileName}: No such file or directory`, success: false };
      }

      const now = new Date();
      const existing = parent.children!.get(fileName);

      if (existing && existing.type === 'directory') {
        return { output: `bash: ${fileName}: Is a directory`, success: false };
      }

      if (existing) {
        existing.content = isAppend ? (existing.content || '') + text + '\n' : text + '\n';
        existing.modifiedAt = now;
      } else {
        parent.children!.set(fileName, {
          name: fileName,
          type: 'file',
          content: text + '\n',
          createdAt: now,
          modifiedAt: now,
        });
      }

      return { output: '', success: true };
    }

    const text = args.join(' ').replace(/^["']|["']$/g, '');
    return { output: text, success: true };
  }

  private cp(args: string[]): CommandResult {
    if (args.length < 2) {
      return {
        output: 'cp: missing file operand',
        success: false,
        hint: `Usage: cp <source> <destination>`,
      };
    }

    const [source, dest] = args;
    const sourcePath = this.resolvePath(source);
    const sourceNode = this.getNodeAtPath(sourcePath);

    if (!sourceNode) {
      return {
        output: `cp: cannot stat '${source}': No such file or directory`,
        success: false,
      };
    }

    const destPath = this.resolvePath(dest);
    const destNode = this.getNodeAtPath(destPath);

    let targetParent: FileNode | null;
    let targetName: string;

    if (destNode && destNode.type === 'directory') {
      targetParent = destNode;
      targetName = sourceNode.name;
    } else {
      const parentPath = destPath.slice(0, -1);
      targetParent = this.getNodeAtPath(parentPath);
      targetName = destPath[destPath.length - 1];
    }

    if (!targetParent || targetParent.type !== 'directory') {
      return {
        output: `cp: cannot create regular file '${dest}': No such file or directory`,
        success: false,
      };
    }

    const now = new Date();
    targetParent.children!.set(targetName, {
      ...sourceNode,
      name: targetName,
      createdAt: now,
      modifiedAt: now,
      children: sourceNode.type === 'directory' ? new Map(sourceNode.children) : undefined,
    });

    return { output: '', success: true };
  }

  private mv(args: string[]): CommandResult {
    if (args.length < 2) {
      return {
        output: 'mv: missing file operand',
        success: false,
        hint: `Usage: mv <source> <destination>`,
      };
    }

    const copyResult = this.cp(args);
    if (!copyResult.success) {
      return copyResult;
    }

    // Remove source
    const sourcePath = this.resolvePath(args[0]);
    const parentPath = sourcePath.slice(0, -1);
    const parent = this.getNodeAtPath(parentPath);
    const sourceNode = this.getNodeAtPath(sourcePath);

    if (parent && parent.children && sourceNode) {
      parent.children.delete(sourceNode.name);
    }

    return { output: '', success: true };
  }

  private help(): CommandResult {
    const helpText = `Available commands:

  pwd           Print current directory
  ls [path]     List directory contents
                  -l  Long format
                  -a  Show hidden files
  cd <path>     Change directory
                  cd ..  Go up one level
                  cd ~   Go to home directory
  mkdir <name>  Create a directory
                  -p  Create parent directories
  touch <file>  Create an empty file
  rm <path>     Remove file or directory
                  -r  Remove directories recursively
                  -f  Force (no error if missing)
  cat <file>    Display file contents
  echo <text>   Display text
                  > file   Write to file
                  >> file  Append to file
  cp <src> <dst>  Copy file
  mv <src> <dst>  Move/rename file
  clear         Clear the screen
  history       Show command history
  help          Show this help message

Tips:
  - Use Tab for autocomplete (coming soon)
  - Use Up/Down arrows for command history
  - Paths can be relative or absolute`;

    return { output: helpText, success: true };
  }

  private history(): CommandResult {
    const lines = this.commandHistory.map((cmd, i) => `  ${i + 1}  ${cmd}`);
    return { output: lines.join('\n'), success: true };
  }

  private resolvePath(pathStr: string): string[] {
    if (pathStr === '/' || pathStr === '') {
      return [];
    }

    let basePath: string[];
    if (pathStr.startsWith('/')) {
      basePath = [];
    } else if (pathStr.startsWith('~')) {
      basePath = ['home', 'user'];
      pathStr = pathStr.substring(1);
    } else {
      basePath = [...this.currentPath];
    }

    const segments = pathStr.split('/').filter(s => s !== '');

    for (const segment of segments) {
      if (segment === '.') {
        continue;
      } else if (segment === '..') {
        if (basePath.length > 0) {
          basePath.pop();
        }
      } else {
        basePath.push(segment);
      }
    }

    return basePath;
  }

  // For exercise validation
  fileExists(path: string): boolean {
    const resolvedPath = this.resolvePath(path);
    return this.getNodeAtPath(resolvedPath) !== null;
  }

  fileContains(path: string, content: string): boolean {
    const resolvedPath = this.resolvePath(path);
    const node = this.getNodeAtPath(resolvedPath);
    if (!node || node.type !== 'file') return false;
    return (node.content || '').includes(content);
  }

  getDirectoryContents(path: string): string[] {
    const resolvedPath = this.resolvePath(path);
    const node = this.getNodeAtPath(resolvedPath);
    if (!node || node.type !== 'directory' || !node.children) return [];
    return Array.from(node.children.keys());
  }

  // Serialize for persistence
  toJSON(): string {
    const serializeNode = (node: FileNode): object => ({
      name: node.name,
      type: node.type,
      content: node.content,
      children: node.children ? Object.fromEntries(
        Array.from(node.children.entries()).map(([k, v]) => [k, serializeNode(v)])
      ) : undefined,
      createdAt: node.createdAt.toISOString(),
      modifiedAt: node.modifiedAt.toISOString(),
    });

    return JSON.stringify({
      root: serializeNode(this.root),
      currentPath: this.currentPath,
      commandHistory: this.commandHistory,
    });
  }

  static fromJSON(json: string): VirtualFileSystem {
    const fs = new VirtualFileSystem();
    try {
      const data = JSON.parse(json);

      const deserializeNode = (obj: Record<string, unknown>): FileNode => ({
        name: obj.name as string,
        type: obj.type as 'file' | 'directory',
        content: obj.content as string | undefined,
        children: obj.children ? new Map(
          Object.entries(obj.children as Record<string, unknown>).map(
            ([k, v]) => [k, deserializeNode(v as Record<string, unknown>)]
          )
        ) : undefined,
        createdAt: new Date(obj.createdAt as string),
        modifiedAt: new Date(obj.modifiedAt as string),
      });

      fs.root = deserializeNode(data.root);
      fs.currentPath = data.currentPath;
      fs.commandHistory = data.commandHistory || [];
    } catch {
      // Return fresh filesystem on error
    }
    return fs;
  }
}
