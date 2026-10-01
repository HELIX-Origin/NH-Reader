import { backend } from '$lib/client';

const PREFIX = 'nh-reader:';
const LEGACY_PREFIX = 'nh-desktop:';

const memory = new Map<string, string>();

function appKey(key: string): string {
	return PREFIX + key;
}

export async function cacheGet(key: string): Promise<string | null> {
	return memory.get(appKey(key)) ?? null;
}

export async function cacheSet(key: string, value: string): Promise<void> {
	memory.set(appKey(key), value);
	backend.dbSet(appKey(key), value).catch(() => undefined);
}

export async function cacheDel(key: string): Promise<void> {
	memory.delete(appKey(key));
	backend.dbDel(appKey(key)).catch(() => undefined);
}

export async function cacheGetJson<T>(key: string): Promise<T | null> {
	const raw = await cacheGet(key);
	if (raw === null) return null;
	try {
		return JSON.parse(raw) as T;
	} catch {
		return null;
	}
}

export async function cacheSetJson(key: string, value: unknown): Promise<void> {
	await cacheSet(key, JSON.stringify(value));
}

export async function cacheInit(): Promise<void> {
	const rows = await backend.dbDump();
	for (const [key, value] of rows) {
		if (key.startsWith(PREFIX) || !key.includes(':')) {
			memory.set(key, value);
		} else if (key.startsWith(LEGACY_PREFIX)) {
			const migrated = PREFIX + key.slice(LEGACY_PREFIX.length);
			memory.set(migrated, value);
			backend.dbSet(migrated, value).catch(() => undefined);
		}
	}
}

export async function cacheFlush(): Promise<void> {
	for (const key of [...memory.keys()]) {
		if (key.startsWith(PREFIX + 'cache:') || key.startsWith(LEGACY_PREFIX + 'cache:')) {
			memory.delete(key);
		}
	}
	await backend.clearQueryCache().catch(() => undefined);
}