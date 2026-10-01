import { locale } from '$lib/stores/locale.svelte';

export function formatCount(n: number | null | undefined, customLocale?: string): string {
	if (!n || n <= 0) return '0';
	const loc = customLocale ?? locale.value;
	try {
		return new Intl.NumberFormat(loc, { notation: 'compact', maximumFractionDigits: 1 }).format(n);
	} catch {
		if (n < 1000) return String(n);
		const v = n / 1000;
		return `${v >= 100 ? Math.round(v) : v.toFixed(1)}k`;
	}
}

export function formatDate(unixSeconds: number | null | undefined, customLocale?: string): string {
	if (!unixSeconds) return '';
	const loc = customLocale ?? locale.value;
	try {
		return new Intl.DateTimeFormat(loc, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		}).format(new Date(unixSeconds * 1000));
	} catch {
		return new Date(unixSeconds * 1000).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	}
}

export function relativeDate(unixSeconds: number | null | undefined, customLocale?: string): string {
	if (!unixSeconds) return '';
	const diff = Date.now() / 1000 - unixSeconds;
	const minute = 60;
	const hour = minute * 60;
	const day = hour * 24;
	const week = day * 7;
	const month = day * 30;
	const year = day * 365;

	const loc = customLocale ?? locale.value;
	try {
		const rtf = new Intl.RelativeTimeFormat(loc, { numeric: 'auto' });
		if (diff < minute) return rtf.format(0, 'second');
		if (diff < hour) return rtf.format(-Math.floor(diff / minute), 'minute');
		if (diff < day) return rtf.format(-Math.floor(diff / hour), 'hour');
		if (diff < week) return rtf.format(-Math.floor(diff / day), 'day');
		if (diff < month) return rtf.format(-Math.floor(diff / week), 'week');
		if (diff < year) return rtf.format(-Math.floor(diff / month), 'month');
		return rtf.format(-Math.floor(diff / year), 'year');
	} catch {
		if (diff < minute) return 'just now';
		if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
		if (diff < day) return `${Math.floor(diff / hour)}h ago`;
		if (diff < week) return `${Math.floor(diff / day)}d ago`;
		if (diff < month) return `${Math.floor(diff / week)}w ago`;
		if (diff < year) return `${Math.floor(diff / month)}mo ago`;
		return `${Math.floor(diff / year)}y ago`;
	}
}

export function formatBytes(bytes: number | null | undefined, customLocale?: string): string {
	if (!bytes || bytes <= 0) return '0 B';
	const k = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	const idx = Math.min(i, sizes.length - 1);
	const loc = customLocale ?? locale.value;
	const val = parseFloat((bytes / Math.pow(k, idx)).toFixed(idx > 1 ? 1 : 0));
	try {
		return `${new Intl.NumberFormat(loc).format(val)} ${sizes[idx]}`;
	} catch {
		return `${val} ${sizes[idx]}`;
	}
}