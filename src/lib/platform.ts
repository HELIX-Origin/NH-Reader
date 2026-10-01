export type Platform = 'windows' | 'macos' | 'linux' | 'other';

export function getPlatform(): Platform {
	if (typeof navigator === 'undefined') return 'windows';
	const ua = navigator.userAgent.toLowerCase();
	if (ua.includes('mac') || ua.includes('darwin')) return 'macos';
	if (ua.includes('linux')) return 'linux';
	if (ua.includes('win')) return 'windows';
	return 'windows';
}
