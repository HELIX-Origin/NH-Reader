import { listen } from '@tauri-apps/api/event';
import type { UnlistenFn } from '@tauri-apps/api/event';
import { backend } from '$lib/client';
import { cacheDel, cacheGetJson, cacheSetJson } from '$lib/cache';
import { syncAccountBlacklist } from '$lib/stores/account.svelte';
import { loadDownloaded } from '$lib/stores/library.svelte';
import type {
	AutoRefreshConfig,
	DownloadFormat,
	ServiceEvent,
	ServiceJobKind,
	ServiceStatus,
} from '$lib/types';

export interface ServiceJobView {
	jobId: number;
	kind: ServiceJobKind;
	state: 'queued' | 'running' | 'finished' | 'failed';
	message?: string;
	error?: string;
	done?: number;
	total?: number | null;
	label?: string;
	format?: DownloadFormat;
	galleryId?: number;
}

const JOBS_STORAGE_KEY = 'downloads:jobs';

let jobs = $state<ServiceJobView[]>([]);
let lastRefreshAt = $state<number | null>(null);
let autoRefresh = $state<AutoRefreshConfig>({ enabled: false, intervalMinutes: 15 });
const downloadMeta = new Map<number, { galleryId: number; format: DownloadFormat }>();

const KIND_LABELS: Record<ServiceJobKind, string> = {
	download: 'Download',
	prefetch: 'Image prefetch',
	maintenance: 'Maintenance',
	refresh: 'Popular refresh',
	sync: 'Account sync',
};

function persistJobs(): void {
	cacheSetJson(JOBS_STORAGE_KEY, jobs.slice(0, 50)).catch(() => undefined);
}

export function getServiceJobs(): ServiceJobView[] {
	return jobs;
}

export function getServiceAutoRefresh(): AutoRefreshConfig {
	return autoRefresh;
}

export function getServiceLastRefreshAt(): number | null {
	return lastRefreshAt;
}

export function serviceKindLabel(kind: ServiceJobKind): string {
	return KIND_LABELS[kind];
}

function enrichDownload(jobId: number, view: ServiceJobView): ServiceJobView {
	const meta = downloadMeta.get(jobId);
	if (!meta) return view;
	return {
		...view,
		galleryId: meta.galleryId,
		format: meta.format,
		label: view.label ?? `Downloading gallery ${meta.galleryId}`,
	};
}

function upsertJob(jobId: number, patch: Partial<ServiceJobView>, persist = false): void {
	const base = { jobId, ...patch } as ServiceJobView;
	const enriched = enrichDownload(jobId, base);
	const existing = jobs.findIndex((j) => j.jobId === jobId);
	if (existing >= 0) {
		jobs[existing] = { ...jobs[existing], ...enriched };
	} else {
		jobs = [enriched, ...jobs];
	}
	if (persist) {
		persistJobs();
	}
}

function applyEvent(event: ServiceEvent): void {
	switch (event.state) {
		case 'queued':
			upsertJob(event.job_id, { jobId: event.job_id, kind: event.kind, state: 'queued' }, true);
			break;
		case 'started':
			upsertJob(event.job_id, { jobId: event.job_id, kind: event.kind, state: 'running' }, false);
			break;
		case 'progress':
			upsertJob(
				event.job_id,
				{
					jobId: event.job_id,
					kind: event.kind,
					state: 'running',
					done: event.done,
					total: event.total,
					label: event.label,
				},
				false,
			);
			break;
		case 'finished':
			upsertJob(
				event.job_id,
				{
					jobId: event.job_id,
					kind: event.kind,
					state: 'finished',
					message: event.message,
				},
				true,
			);
			if (event.kind === 'refresh') {
				cacheDel('cache:popular').catch(() => undefined);
				if (typeof window !== 'undefined') {
					window.dispatchEvent(new CustomEvent('nh-reader:refresh:popular'));
				}
			} else if (event.kind === 'sync') {
				syncAccountBlacklist().catch(() => undefined);
				if (typeof window !== 'undefined') {
					window.dispatchEvent(new CustomEvent('nh-reader:refresh:account'));
				}
			} else if (event.kind === 'download') {
				loadDownloaded().catch(() => undefined);
			}
			break;
		case 'failed':
			upsertJob(
				event.job_id,
				{
					jobId: event.job_id,
					kind: event.kind,
					state: 'failed',
					error: event.error,
				},
				true,
			);
			break;
	}
}

let unlistenJob: UnlistenFn | null = null;
let unlistenRefresh: UnlistenFn | null = null;

export async function initServiceStore(): Promise<void> {
	const savedJobs = await cacheGetJson<ServiceJobView[]>(JOBS_STORAGE_KEY);
	if (savedJobs && Array.isArray(savedJobs)) {
		jobs = savedJobs.map((j) => {
			if (j.galleryId && j.format) {
				downloadMeta.set(j.jobId, { galleryId: j.galleryId, format: j.format });
			}
			if (j.state === 'running' || j.state === 'queued') {
				return {
					...j,
					state: 'failed',
					error: 'Interrupted by app shutdown',
				};
			}
			return j;
		});
	}

	if (!unlistenJob) {
		unlistenJob = await listen<ServiceEvent>('service://job', (e) => {
			applyEvent(e.payload);
			jobs = jobs.slice(0, 50);
		});
	}
	if (!unlistenRefresh) {
		unlistenRefresh = await listen<string>('service://refresh', async (e) => {
			lastRefreshAt = Date.now();
			if (e.payload === 'popular') {
				await cacheDel('cache:popular');
				if (typeof window !== 'undefined') {
					window.dispatchEvent(new CustomEvent('nh-reader:refresh:popular'));
				}
			}
		});
	}
	autoRefresh = await backend.serviceGetAutoRefresh();
}

export async function refreshServiceStatus(): Promise<ServiceStatus> {
	const status = await backend.serviceStatus();
	lastRefreshAt = lastRefreshAt;
	return status;
}

export async function setServiceAutoRefresh(config: AutoRefreshConfig): Promise<void> {
	await backend.serviceSetAutoRefresh(config.enabled, config.intervalMinutes);
	autoRefresh = config;
}

export async function enqueueMaintenance(): Promise<number> {
	return backend.serviceEnqueueMaintenance();
}

export async function enqueueSync(): Promise<number> {
	return backend.serviceEnqueueSync();
}

export async function enqueueDownload(id: number, format: DownloadFormat = 'zip'): Promise<number> {
	const jobId = await backend.serviceEnqueueDownload(id, format);
	downloadMeta.set(jobId, { galleryId: id, format });
	upsertJob(jobId, { jobId, kind: 'download', state: 'queued' });
	return jobId;
}

export function removeJobs(predicate: (job: ServiceJobView) => boolean): void {
	jobs = jobs.filter((job) => !predicate(job));
	for (const jobId of [...downloadMeta.keys()]) {
		const job = jobs.find((j) => j.jobId === jobId);
		if (!job) downloadMeta.delete(jobId);
	}
	persistJobs();
}

export async function prefetchImages(urls: string[]): Promise<number> {
	return backend.serviceEnqueuePrefetch(urls);
}

export async function getDownloadsDir(): Promise<string> {
	return backend.serviceGetDownloadsDir();
}

export async function setDownloadsDir(dir: string): Promise<void> {
	await backend.serviceSetDownloadsDir(dir);
}

export async function resetDownloadsDir(): Promise<void> {
	await backend.serviceResetDownloadsDir();
}

export function openDownloadsFolder(): Promise<void> {
	return backend.openDownloadsFolder();
}