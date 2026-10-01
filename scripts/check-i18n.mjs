import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const i18nDir = join(__dirname, '..', 'src', 'lib', 'i18n');
const srcDir = join(__dirname, '..', 'src');

function flatten(obj, prefix = '') {
	return Object.entries(obj).flatMap(([key, value]) =>
		typeof value === 'string'
			? [[`${prefix}${key}`, value]]
			: value && typeof value === 'object'
				? flatten(value, `${prefix}${key}.`)
				: [],
	);
}

async function walk(dir) {
	const out = [];
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) {
			out.push(...(await walk(path)));
		} else if (entry.name.endsWith('.svelte')) {
			out.push(path);
		}
	}
	return out;
}

let failed = false;

const en = JSON.parse(await readFile(join(i18nDir, 'en.json'), 'utf8'));
const enEntries = new Map(flatten(en).filter(([key]) => !key.startsWith('_meta.')));
console.log(`en.json: ${enEntries.size} translation keys`);

const used = new Set();
for (const file of await walk(srcDir)) {
	const content = await readFile(file, 'utf8');
	for (const match of content.matchAll(/locale\.t\('([^']+)'\)/g)) {
		used.add(match[1]);
	}
}

const usedButMissing = [...used].filter((key) => !enEntries.has(key));
if (usedButMissing.length) {
	failed = true;
	console.error(`Used keys missing from en.json (${usedButMissing.length}): ${usedButMissing.join(', ')}`);
} else {
	console.log(`usage: ${used.size} referenced keys all covered in en.json`);
}

const codeRe = /^[a-z]{2,3}(-[A-Za-z0-9]+)?$/;
const allowedSame = new Set(['app.name', 'titlebar.searchShortcut', 'app.setup']);
const otherPacks = (await readdir(i18nDir)).filter((f) => f.endsWith('.json') && f !== 'en.json');

if (otherPacks.length > 0) {
	console.log(`Community packs found (${otherPacks.length}):`);
	for (const file of otherPacks.sort()) {
		const locale = file.replace(/\.json$/, '');
		if (!codeRe.test(locale)) {
			failed = true;
			console.error(`Invalid locale code filename: ${file}`);
			continue;
		}
		const dict = JSON.parse(await readFile(join(i18nDir, file), 'utf8'));
		const entries = new Map(flatten(dict).filter(([key]) => !key.startsWith('_meta.')));

		const missing = [...enEntries.keys()].filter((key) => !entries.has(key));
		const empty = [...entries.entries()].filter(([key, value]) => {
			const source = enEntries.get(key);
			return !value.trim() || (value.trim() === source?.trim() && !allowedSame.has(key));
		});
		const extra = [...entries.keys()].filter((key) => !enEntries.has(key));

		if (missing.length || empty.length || extra.length) {
			failed = true;
		}

		const status = missing.length === 0 && empty.length === 0 && extra.length === 0 ? 'OK' : 'ISSUES';
		console.log(
			`  ${locale.padEnd(10)} ${String(entries.size).padStart(3)}/${enEntries.size} keys  ${status}`,
		);
		if (missing.length) console.log(`    missing (${missing.length}): ${missing.join(', ')}`);
		if (empty.length) console.log(`    untranslated (${empty.length}): ${empty.map(([k]) => k).join(', ')}`);
		if (extra.length) console.log(`    unknown keys (${extra.length}): ${extra.join(', ')}`);
	}
} else {
	console.log('No extra community packs detected; shipping drop-in English default.');
}

process.exit(failed ? 1 : 0);