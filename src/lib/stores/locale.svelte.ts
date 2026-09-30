import { t, defaultLocale, isLocaleCode, hasDictionary, type LocaleCode } from '$lib/i18n';
import { cacheGet, cacheSet } from '$lib/cache';
import { invoke } from '@tauri-apps/api/core';

const LOCALE_KEY = 'settings:locale';

function normalizeLocale(raw: string): string {
	const trimmed = raw.trim();
	if (isLocaleCode(trimmed)) return trimmed;
	if (trimmed.startsWith('zh')) {
		if (trimmed.includes('TW') || trimmed.includes('HK') || trimmed.includes('Hant')) {
			return 'zh-Hant';
		}
		return 'zh-Hans';
	}
	const base = trimmed.split(/[-_]/)[0];
	if (isLocaleCode(base)) return base;
	return trimmed;
}

function createLocaleStore() {
	let value = $state<LocaleCode>(defaultLocale);
	let systemLocale = $state<string>(defaultLocale);
	let ready = $state(false);

	async function init(): Promise<void> {
		let detected: string = defaultLocale;
		try {
			const system: string = await invoke('get_system_locale');
			if (system) {
				detected = normalizeLocale(system);
			}
		} catch {
			detected = defaultLocale;
		}
		systemLocale = detected;

		const cached = await cacheGet(LOCALE_KEY);
		if (cached && isLocaleCode(cached)) {
			value = cached;
		} else if (hasDictionary(detected) && isLocaleCode(detected)) {
			value = detected;
		} else {
			value = defaultLocale;
		}
		ready = true;
	}

	async function set(locale: string): Promise<void> {
		if (!isLocaleCode(locale)) return;
		value = locale;
		await cacheSet(LOCALE_KEY, locale);
	}

	return {
		get value() {
			return value;
		},
		get systemLocale() {
			return systemLocale;
		},
		get ready() {
			return ready;
		},
		init,
		set,
		t: (key: string) => t(key, value, systemLocale),
	};
}

export const locale = createLocaleStore();