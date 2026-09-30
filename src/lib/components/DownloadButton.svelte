<script lang="ts">
	import { enqueueDownload, getServiceJobs } from '$lib/stores/service.svelte';
	import Icon from './Icon.svelte';

	let { galleryId }: { galleryId: number } = $props();

	const jobs = $derived(getServiceJobs());

	const FORMATS = ['zip', 'cbz'] as const;
	type Format = (typeof FORMATS)[number];

	let open = $state(false);
	let format = $state<Format>('zip');
	let jobId = $state<number | null>(null);
	let started = $state(false);
	let done = $state(false);
	let failed = $state(false);
	let message = $state('');
	let progress = $state<number | null>(null);

	const job = $derived(
		jobId === null ? null : (jobs.find((j) => j.jobId === jobId) ?? null),
	);

	$effect(() => {
		const j = job;
		if (!j || j.kind !== 'download') return;
		if (j.state === 'running') {
			progress = j.total && j.total > 0 ? Math.round(((j.done ?? 0) / j.total) * 100) : null;
		} else if (j.state === 'finished') {
			done = true;
			started = false;
			failed = false;
			message = j.message ?? 'Download finished';
		} else if (j.state === 'failed') {
			failed = true;
			started = false;
			done = false;
			message = j.error ?? 'Download failed';
		}
	});

	async function start(fmt: Format) {
		format = fmt;
		open = false;
		started = true;
		done = false;
		failed = false;
		message = '';
		progress = null;
		try {
			jobId = await enqueueDownload(galleryId, fmt);
		} catch (e) {
			failed = true;
			started = false;
			message = String(e);
		}
	}

	function onMenuClick(e: MouseEvent) {
		const t = e.target as HTMLElement | null;
		if (t?.closest('.menu')) return;
		open = !open;
	}
</script>

<div class="download" data-scope="download-button">
	{#if failed}
		<button class="btn btn-danger" class:open={open} onclick={() => (failed = false)} title={message}>
			<Icon name="alert" size={15} />
			Retry
		</button>
		<span class="note err" title={message}>{message}</span>
	{:else if done}
		<button
			class="btn"
			class:open={open}
			onclick={onMenuClick}
			title="Download another format"
			aria-label="Download"
		>
			<Icon name="check" size={15} />
			Downloaded
		</button>
	{:else if started}
		<button class="btn" disabled title="Downloading…">
			<span class="spin"><Icon name="download" size={15} /></span>
			{progress !== null ? `${progress}%` : 'Queued'}
		</button>
	{:else}
		<button class="btn" class:open={open} onclick={onMenuClick} aria-label="Download" aria-haspopup="menu">
			<Icon name="download" size={15} />
			Download
		</button>
	{/if}
	<span class="note faint">
		{format === 'zip' ? 'ZIP' : 'CBZ'}
	</span>

	{#if open}
		<div class="menu" role="menu">
			{#each FORMATS as fmt}
				<button class="item" role="menuitem" onclick={() => start(fmt)}>
					<span class="name">{fmt.toUpperCase()}</span>
					<span class="desc">
						{fmt === 'zip' ? 'Zip archive' : 'Comic book archive'}
					</span>
				</button>
			{/each}
		</div>
	{/if}
</div>
