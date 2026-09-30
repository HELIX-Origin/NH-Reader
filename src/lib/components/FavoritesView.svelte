<script lang="ts">
	import { getFavorites, clearFavorites, removeFavorite } from '$lib/stores/library.svelte';
	import { titlebarQuery } from '$lib/stores/titlebarSearch.svelte';
	import type { GalleryListItem } from '$lib/types';
	import { formatCount } from '$lib/format';
	import { thumbPath } from '$lib/image';
	import Icon from './Icon.svelte';
	import CoverImage from './CoverImage.svelte';
	import EmptyState from './EmptyState.svelte';

	const query = $derived(titlebarQuery.value.trim().toLowerCase());
	const sorted = $derived(
		getFavorites()
			.filter((g) => {
				if (!query) return true;
				const text = `${g.english_title} ${g.japanese_title ?? ''}`.toLowerCase();
				return text.includes(query);
			})
			.sort((a, b) => b.id - a.id),
	);

	function onRemove(id: number) {
		removeFavorite(id);
	}
</script>

<div class="favorites" data-scope="favorites-view">
	<div class="head">
		<h2>Favorites</h2>
		{#if sorted.length > 0}
			<button class="btn btn-ghost faint" onclick={clearFavorites}>
				<Icon name="close" size={14} />
				Clear all
			</button>
		{/if}
	</div>

	{#if sorted.length === 0}
		<EmptyState
			icon="heart"
			title="No favorites yet"
			description="Tap the heart on any gallery to save it here — stored locally on this device."
		/>
	{:else}
		<div class="grid">
			{#each sorted as g (g.id)}
				<div class="cell">
					<a class="card" href={`/gallery/${g.id}`}>
						<CoverImage src={thumbPath(g.thumbnail)} alt={g.english_title} />
						<div class="info">
							<span class="title">{g.english_title}</span>
							<span class="meta faint">
								{formatCount(g.num_pages ?? 0)} pages · {formatCount(g.num_favorites ?? 0)}
							</span>
						</div>
					</a>
					<button class="remove" onclick={() => onRemove(g.id)} aria-label="Remove from favorites">
						<Icon name="close" size={13} />
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>
