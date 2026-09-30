<script lang="ts">
	import { pagePath, proxiedBlobUrl } from '$lib/image';
	import type { PageInfo } from '$lib/types';
	import Icon from './Icon.svelte';

	let {
		page,
		fit = 'width',
		visible = true,
	}: {
		page: PageInfo;
		fit?: 'width' | 'height' | 'contain';
		visible?: boolean;
	} = $props();

	let currentSrc = $state('');
	let failed = $state(false);
	let trying = $state(false);

	$effect(() => {
		currentSrc = pagePath(page.path);
		failed = false;
		trying = false;
	});

	async function onError() {
		if (trying || failed) return;
		trying = true;
		try {
			currentSrc = await proxiedBlobUrl(pagePath(page.path));
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
