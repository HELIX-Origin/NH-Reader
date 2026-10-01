<script lang="ts">
	import {
		getServiceJobs,
		removeJobs,
		enqueueDownload,
		openDownloadsFolder,
	} from '$lib/stores/service.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { locale } from '$lib/stores/locale.svelte';

	const downloads = $derived(getServiceJobs().filter((j) => j.kind === 'download'));

	const FORMAT_LABEL: Record<string, string> = {
		zip: 'ZIP',
		cbz: 'CBZ',
	};

	function redownload(galleryId: number, format?: 'zip' | 'cbz') {
		enqueueDownload(galleryId, format ?? 'zip');
	}

	function clearFinished() {
		removeJobs((j) => j.kind === 'download' && (j.state === 'finished' || j.state === 'failed'));
	}

	function clearAll() {
		removeJobs((j) => j.kind === 'download');
	}

	async function onOpenFolder() {
		try {
			await openDownloadsFolder();
		} catch {}
	}
</script>

<svelte:head>
	<title>{locale.t('downloads.title')} — {locale.t('app.name')}</title>
</svelte:head>

<div class="page" data-scope="page-downloads">
	<div class="page-head">
		<h2>{locale.t('downloads.title')}</h2>
		<div class="btn-group">
			<button class="btn" onclick={onOpenFolder} title={locale.t('settings.openFolder')}>
				<Icon name="folder" size={15} />
				<span>{locale.t('settings.openFolder')}</span>
			</button>
			{#if downloads.length > 0}
				<button class="btn" onclick={clearFinished}>{locale.t('downloads.clearFinished')}</button>
				<button class="btn" onclick={clearAll}>{locale.t('downloads.clearAll')}</button>
			{/if}
		</div>
	</div>

	{#if downloads.length === 0}
		<p class="empty faint">
			{locale.t('downloads.empty')}
		</p>
	{:else}
		<ul class="dl-list">
			{#each downloads as job (job.jobId)}
				<li class="dl-row" class:failed={job.state === 'failed'}>
					<span class="dl-icon">
						{#if job.state === 'running'}
							<span class="spin"><Icon name="download" size={16} /></span>
						{:else if job.state === 'finished'}
							<span class="ok"><Icon name="check" size={16} /></span>
						{:else if job.state === 'failed'}
							<span class="err"><Icon name="alert" size={16} /></span>
						{:else}
							<Icon name="download" size={16} />
						{/if}
					</span>

					<span class="dl-main">
						<span class="dl-title">
							{#if job.galleryId}
								<a class="dl-link" href={`/gallery/${job.galleryId}`}>{locale.t('downloads.galleryPrefix')}{job.galleryId}</a>
							{:else}
								<span>{job.label ?? locale.t('downloads.download')}</span>
							{/if}
							{#if job.format}<span class="tag-fmt">{FORMAT_LABEL[job.format]} {locale.t('downloads.file')}</span>{/if}
						</span>

						{#if job.state === 'running' && job.total}
							<div class="bar">
								<div
									class="bar-fill"
									style="width:{Math.min(100, Math.round(((job.done ?? 0) / job.total) * 100))}%"
								></div>
							</div>
						{:else if job.state === 'finished'}
							<span class="dl-note" title={job.message}>{job.message ?? locale.t('downloads.finished')}</span>
						{:else if job.state === 'failed'}
							<span class="dl-note err" title={job.error}>{job.error ?? locale.t('downloads.failed')}</span>
						{:else}
							<span class="dl-note">{locale.t('downloads.queued')}</span>
						{/if}
					</span>

					<span class="dl-actions">
						{#if job.state === 'finished'}
							{#if job.galleryId}
								<a class="btn" href={`/gallery/${job.galleryId}`} title={locale.t('reader.title')}>
									<Icon name="book" size={14} />
									<span>{locale.t('reader.title')}</span>
								</a>
							{/if}
							<button class="icon-btn" onclick={() => removeJobs((j) => j.jobId === job.jobId)} aria-label={locale.t('downloads.remove')}>
								<Icon name="close" size={15} />
							</button>
						{:else if job.state === 'failed'}
							{#if job.galleryId}
								<button
									class="btn btn-danger"
									onclick={() => {
										removeJobs((j) => j.jobId === job.jobId);
										redownload(job.galleryId!, job.format);
									}}
								>
									{locale.t('downloads.retry')}
								</button>
							{:else}
								<button class="icon-btn" onclick={() => removeJobs((j) => j.jobId === job.jobId)} aria-label={locale.t('downloads.remove')}>
									<Icon name="close" size={15} />
								</button>
							{/if}
						{:else}
							<button class="icon-btn" onclick={() => removeJobs((j) => j.jobId === job.jobId)} aria-label={locale.t('downloads.remove')}>
								<Icon name="close" size={15} />
							</button>
						{/if}
					</span>
				</li>
			{/each}
		</ul>
	{/if}
</div>
