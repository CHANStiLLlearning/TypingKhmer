import { spawn, execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const exePath = path.resolve(__dirname, '..', 'release', 'win-unpacked', 'Khmer Typing Tutor.exe');

const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;

const child = spawn(exePath, [], {
  env,
  detached: true,
  stdio: 'ignore'
});

child.unref();

console.log('App launched successfully with PID:', child.pid);
