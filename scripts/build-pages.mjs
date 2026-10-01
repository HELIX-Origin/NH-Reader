import { cpSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, process.argv[2] ?? '.pages');

rmSync(output, { recursive: true, force: true });
cpSync(join(root, 'docs'), output, { recursive: true });

console.log(`Staged docs/ into ${output}`);
