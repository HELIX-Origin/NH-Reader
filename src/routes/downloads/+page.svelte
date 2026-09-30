<script lang="ts">
	import { getServiceJobs, removeJobs } from '$lib/stores/service.svelte';
	import { enqueueDownload } from '$lib/stores/service.svelte';
	import DownloadButton from '$lib/components/DownloadButton.svelte';
	import Icon from '$lib/components/Icon.svelte';

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
</script>

<svelte:head>
	<title>Downloads — NH Desktop</title>
</svelte:head>

<div class="page" data-scope="page-downloads">
	<div class="page-head">
		<h2>Downloads</h2>
		{#if downloads.length > 0}
			<div class="btn-group">
				<button class="btn" onclick={clearFinished}>Clear finished</button>
				<button class="btn" onclick={clearAll}>Clear all</button>
			</div>
		{/if}
	</div>

	{#if downloads.length === 0}
		<p class="empty faint">
			No download jobs yet. Open a gallery and use its Download button to save a ZIP or CBZ
			archive.
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
								<a class="dl-link" href={`/gallery/${job.galleryId}`}>Gallery #{job.galleryId}</a>
							{:else}
								<span>{job.label ?? 'Download'}</span>
							{/if}
							{#if job.format}<span class="tag-fmt">{FORMAT_LABEL[job.format]} file</span>{/if}
						</span>

						{#if job.state === 'running' && job.total}
							<div class="bar">
								<div
									class="bar-fill"
									style="width:{Math.min(100, Math.round(((job.done ?? 0) / job.total) * 100))}%"
								></div>
							</div>
						{:else if job.state === 'finished'}
							<span class="dl-note" title={job.message}>{job.message ?? 'Finished'}</span>
						{:else if job.state === 'failed'}
							<span class="dl-note err" title={job.error}>{job.error ?? 'Failed'}</span>
						{:else}
							<span class="dl-note">Queued…</span>
						{/if}
					</span>

					<span class="dl-actions">
						{#if job.state === 'finished'}
							{#if job.galleryId}
								<DownloadButton galleryId={job.galleryId} />
							{/if}
							<button class="icon-btn" onclick={() => removeJobs((j) => j.jobId === job.jobId)} aria-label="Remove">
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
									Retry
								</button>
							{:else}
								<button class="icon-btn" onclick={() => removeJobs((j) => j.jobId === job.jobId)} aria-label="Remove">
									<Icon name="close" size={15} />
								</button>
							{/if}
						{:else}
							<button class="icon-btn" onclick={() => removeJobs((j) => j.jobId === job.jobId)} aria-label="Remove">
								<Icon name="close" size={15} />
							</button>
						{/if}
					</span>
				</li>
			{/each}
		</ul>
	{/if}
</div>
