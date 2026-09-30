export interface LocaleInfo {
	code: string;
	name: string;
	nativeName: string;
}

export type LocaleCode = string;

export class LocaleCatalog {
	private readonly dictionaries = new Map<string, Record<string, unknown>>();
	private readonly list: LocaleInfo[] = [];
	readonly defaultLocale = 'en';

	constructor() {
		this.loadFromFiles();
	}

	private loadFromFiles(): void {
		const modules = import.meta.glob<Record<string, unknown>>('./*.json', {
			eager: true,
			import: 'default',
		});

		for (const [path, content] of Object.entries(modules)) {
			const match = path.match(/\/([^/]+)\.json$/);
			if (!match) continue;
			const fileCode = match[1];

			const meta =
				content && typeof content === 'object' && '_meta' in content
					? (content._meta as { code?: string; name?: string; nativeName?: string })
					: undefined;

			const code = meta?.code ?? fileCode;
			let name = meta?.name;
			let nativeName = meta?.nativeName;

			if (!name || !nativeName) {
				try {
					name = name ?? new Intl.DisplayNames(['en'], { type: 'language' }).of(code) ?? code;
					nativeName =
						nativeName ?? new Intl.DisplayNames([code], { type: 'language' }).of(code) ?? name;
				} catch {
					name = name ?? code;
					nativeName = nativeName ?? code;
				}
			}

			this.dictionaries.set(code, content);
			this.list.push({ code, name, nativeName });
		}

		this.list.sort((a, b) => {
			if (a.code === this.defaultLocale) return -1;
			if (b.code === this.defaultLocale) return 1;
			return a.name.localeCompare(b.name);
		});
	}

	get locales(): LocaleInfo[] {
		return this.list;
	}

	isLocaleCode(code: string): boolean {
		return this.dictionaries.has(code);
	}

	hasDictionary(code: string): boolean {
		return this.dictionaries.has(code);
	}

	getDictionary(code: string): Record<string, unknown> | undefined {
		return this.dictionaries.get(code) ?? this.dictionaries.get(this.defaultLocale);
	}

	loadDictionary(code: string, dict: Record<string, unknown>): void {
		this.dictionaries.set(code, dict);
	}

	private resolveKey(
		dict: Record<string, unknown> | undefined,
		key: string,
	): string | undefined {
		if (!dict) return undefined;
		const parts = key.split('.');
		let current: unknown = dict;
		for (const part of parts) {
			if (current && typeof current === 'object' && part in current) {
				current = (current as Record<string, unknown>)[part];
			} else {
				return undefined;
			}
		}
		return typeof current === 'string' ? current : undefined;
	}

	t(key: string, locale: string = this.defaultLocale, systemLocale?: string): string {
		const activeVal = this.resolveKey(this.dictionaries.get(locale), key);
		if (activeVal !== undefined) return activeVal;

		if (systemLocale && systemLocale !== locale) {
			const sysVal = this.resolveKey(this.dictionaries.get(systemLocale), key);
			if (sysVal !== undefined) return sysVal;
		}

		if (locale !== this.defaultLocale && systemLocale !== this.defaultLocale) {
			const defaultVal = this.resolveKey(this.dictionaries.get(this.defaultLocale), key);
			if (defaultVal !== undefined) return defaultVal;
		}

		return key;
	}
}

export const catalog = new LocaleCatalog();
export const locales = catalog.locales;
export const defaultLocale = catalog.defaultLocale;
export const isLocaleCode = (code: string) => catalog.isLocaleCode(code);
export const hasDictionary = (code: string) => catalog.hasDictionary(code);
export const getDictionary = (code: string) => catalog.getDictionary(code);
export const loadDictionary = (code: string, dict: Record<string, unknown>) =>
	catalog.loadDictionary(code, dict);
export const t = (key: string, locale?: string, systemLocale?: string) =>
	catalog.t(key, locale, systemLocale);