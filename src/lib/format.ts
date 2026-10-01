export function formatCount(n: number | null | undefined): string {
	if (!n || n <= 0) return '0';
	if (n < 1000) return String(n);
	if (n < 1_000_000) {
		const v = n / 1000;
		return `${v >= 100 ? Math.round(v) : v.toFixed(1)}k`;
	}
	const v = n / 1_000_000;
	return `${v >= 100 ? Math.round(v) : v.toFixed(1)}M`;
}

export function formatDate(unixSeconds: number | null | undefined): string {
	if (!unixSeconds) return '';
	return new Date(unixSeconds * 1000).toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
}

export function relativeDate(unixSeconds: number | null | undefined): string {
	if (!unixSeconds) return '';
	const diff = Date.now() / 1000 - unixSeconds;
	const minute = 60;
	const hour = minute * 60;
	const day = hour * 24;
	const week = day * 7;
	const month = day * 30;

	if (diff < minute) return 'just now';
	if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
	if (diff < day) return `${Math.floor(diff / hour)}h ago`;
	if (diff < week) return `${Math.floor(diff / day)}d ago`;
	if (diff < month) return `${Math.floor(diff / week)}w ago`;
	if (diff < day * 365) return `${Math.floor(diff / month)}mo ago`;
	return `${Math.floor(diff / (day * 365))}y ago`;
}

export function formatBytes(bytes: number | null | undefined): string {
	if (!bytes || bytes <= 0) return '0 B';
	const k = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	const idx = Math.min(i, sizes.length - 1);
	return `${parseFloat((bytes / Math.pow(k, idx)).toFixed(idx > 1 ? 1 : 0))} ${sizes[idx]}`;
}