<script lang="ts">
	import type { HistoryEntry } from '$lib/types';
	import { relativeDate } from '$lib/format';
	import { clearHistory, isFavorite, toggleFavorite } from '$lib/stores/library.svelte';
	import { titlebarQuery } from '$lib/stores/titlebarSearch.svelte';
	import { thumbPath } from '$lib/image';
	import Icon from './Icon.svelte';

	let { entries }: { entries: HistoryEntry[] } = $props();

	const query = $derived(titlebarQuery.value.trim().toLowerCase());
	const filtered = $derived(
		entries.filter((h) => {
			if (!query) return true;
			return h.englishTitle.toLowerCase().includes(query);
		}),
	);

	function onClear() {
		clearHistory();
	}
</script>

<div class="history" data-scope="history-view">
	<div class="head">
		<h2>History</h2>
		{#if filtered.length > 0}
			<button class="btn btn-ghost faint" onclick={onClear}>
				<Icon name="close" size={14} />
				Clear all
			</button>
		{/if}
	</div>

	{#if filtered.length === 0}
		<p class="faint">Galleries you open will appear here.</p>
	{:else}
		<ul class="list">
			{#each filtered as h (h.galleryId)}
				<li>
					<a class="row" href={`/gallery/${h.galleryId}`}>
						<span class="thumb">
							<img src={thumbPath(h.thumbnail)} alt="" loading="lazy" />
						</span>
						<span class="info">
							<span class="title">{h.englishTitle}</span>
							<span class="meta faint">
								{h.numPages ? `${h.numPages} pages` : ''}
								<span aria-hidden="true">·</span>
								{relativeDate(Math.floor(h.visitedAt / 1000))}
							</span>
						</span>
					</a>
					<button
						class="icon-btn"
						class:on={isFavorite(h.galleryId)}
						onclick={() => {
							toggleFavorite({
								id: h.galleryId,
								media_id: h.mediaId,
								english_title: h.englishTitle,
								thumbnail: h.thumbnail,
								num_pages: h.numPages,
								tag_ids: [],
							});
						}}
						aria-label="Toggle favorite"
					>
						<Icon name="heart" size={15} />
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
