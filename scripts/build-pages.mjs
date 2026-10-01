import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, process.argv[2] ?? '.pages');
const repositoryUrl = 'https://github.com/HELIX-Origin/NH-Reader';
const branch = 'main';
const publishedFolder = 'repo';
const rawExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.bmp']);

const publishedFiles = readdirSync(root)
	.filter((name) => name.endsWith('.md'))
	.filter((name) => readFileSync(join(root, name), 'utf8').includes('id="translate-menu"'))
	.sort();

function rewriteTarget(target) {
	if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('#') || target.startsWith('/')) {
		return target;
	}
	const hashIndex = target.indexOf('#');
	const path = (hashIndex === -1 ? target : target.slice(0, hashIndex)).replace(/^\.\//, '');
	const hash = hashIndex === -1 ? '' : target.slice(hashIndex);
	if (path === '') return target;
	if (publishedFiles.includes(path)) return `${path}${hash}`;
	if (path.startsWith('docs/')) {
		const page = path.slice('docs/'.length).replace(/\.md$/, '.html');
		return `../${page}${hash}`;
	}
	const mode = rawExtensions.has(extname(path).toLowerCase()) ? 'raw' : 'blob';
	return `${repositoryUrl}/${mode}/${branch}/${path}${hash}`;
}

function rewriteLinks(markdown) {
	return markdown
		.replace(/\]\(([^)\s]+)((?:\s+"[^"]*")?)\)/g, (_, target, title) => `](${rewriteTarget(target)}${title})`)
		.replace(/\b(href|src)="([^"]+)"/g, (_, attribute, target) => `${attribute}="${rewriteTarget(target)}"`);
}

rmSync(output, { recursive: true, force: true });
cpSync(join(root, 'docs'), output, { recursive: true });
mkdirSync(join(output, publishedFolder), { recursive: true });

for (const name of publishedFiles) {
	const source = readFileSync(join(root, name), 'utf8');
	const frontMatter = `---\nsource_path: ${name}\n---\n`;
	writeFileSync(join(output, publishedFolder, name), frontMatter + rewriteLinks(source));
}

console.log(`Staged docs/ and ${publishedFiles.length} repository pages (${publishedFiles.join(', ')}) into ${output}`);
