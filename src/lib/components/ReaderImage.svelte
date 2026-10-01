<script lang="ts">
	import { pagePath, thumbPath, proxiedBlobUrl } from '$lib/image';
	import { isDownloaded, getDownloadedPageBlobUrl } from '$lib/stores/library.svelte';
	import type { PageInfo, ReaderQuality } from '$lib/types';
	import Icon from './Icon.svelte';

	let {
		page,
		galleryId,
		fit = 'width',
		quality = 'high',
		visible = true,
	}: {
		page: PageInfo;
		galleryId?: number;
		fit?: 'width' | 'height' | 'contain';
		quality?: ReaderQuality;
		visible?: boolean;
	} = $props();

	let currentSrc = $state('');
	let failed = $state(false);
	let trying = $state(false);

	const targetUrl = $derived(quality === 'low' ? thumbPath(page.thumbnail) : pagePath(page.path));

	$effect(() => {
		failed = false;
		trying = false;
		if (galleryId && isDownloaded(galleryId)) {
			getDownloadedPageBlobUrl(galleryId, page.number - 1)
				.then((url) => {
					currentSrc = url;
				})
				.catch(() => {
					currentSrc = targetUrl;
				});
		} else {
			currentSrc = targetUrl;
		}
	});

	async function onError() {
		if (trying || failed) return;
		trying = true;
		try {
			if (galleryId) {
				const url = await getDownloadedPageBlobUrl(galleryId, page.number - 1);
				currentSrc = url;
				failed = false;
				return;
			}
		} catch {}
		try {
			currentSrc = await proxiedBlobUrl(targetUrl);
			failed = false;
		} catch {
			failed = true;
		} finally {
			trying = false;
		}
	}
</script>

<div class="slot" data-scope="reader-image" class:off={!visible} data-fit={fit}>
	{#if failed}
		<span class="ph"><Icon name="image" size={26} /></span>
	{:else}
		<img src={currentSrc} alt={`Page ${page.number}`} draggable="false" onerror={onError} />
	{/if}
</div>
