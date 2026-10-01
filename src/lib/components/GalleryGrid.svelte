<script lang="ts">
	import { getSettings } from '$lib/stores/settings.svelte';
	import { matchesBlacklist } from '$lib/stores/blacklist.svelte';
	import type { GalleryListItem } from '$lib/types';
	import GalleryCard from './GalleryCard.svelte';
	import EmptyState from './EmptyState.svelte';
	import { locale } from '$lib/stores/locale.svelte';

	let { galleries }: { galleries: GalleryListItem[] } = $props();

	const s = getSettings();
	let containerWidth = $state(0);

	const showBlur = $derived(s.blacklistEnabled && s.blacklistMode === 'blur');
	const hideBlocked = $derived(s.blacklistEnabled && s.blacklistMode === 'hide');

	const visible = $derived(
		hideBlocked ? galleries.filter((g) => !matchesBlacklist(g)) : galleries,
	);

	const cols = $derived.by(() => {
		if (!containerWidth) return 5;
		const targetWidth = s.density === 'compact' ? 140 : 176;
		const gap = s.density === 'compact' ? 8 : 12;
		return Math.max(2, Math.floor((containerWidth + gap) / (targetWidth + gap)));
	});

	const displayed = $derived.by(() => {
		if (!s.dynamicScaling || visible.length <= cols) {
			return visible;
		}
		const fullRowCount = Math.floor(visible.length / cols) * cols;
		return fullRowCount > 0 ? visible.slice(0, fullRowCount) : visible;
	});
</script>

{#if visible.length === 0}
	<EmptyState
		icon="shield"
		title={locale.t('grid.noGalleries')}
		description={locale.t('grid.filteredByBlacklist')}
	/>
{:else}
	<div
		class="grid"
		data-scope="gallery-grid"
		class:compact={s.density === 'compact'}
		class:dynamic={s.dynamicScaling}
		data-blur={showBlur}
		bind:clientWidth={containerWidth}
		style={s.dynamicScaling ? `--grid-cols: ${cols};` : undefined}
	>
		{#each displayed as g}
			<GalleryCard gallery={g} />
		{/each}
	</div>
{/if}
