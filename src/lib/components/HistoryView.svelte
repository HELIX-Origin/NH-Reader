<script lang="ts">
	import type { HistoryEntry } from '$lib/types';
	import { relativeDate } from '$lib/format';
	import { clearHistory, isFavorite, toggleFavorite } from '$lib/stores/library.svelte';
	import { titlebarQuery } from '$lib/stores/titlebarSearch.svelte';
	import { thumbPath } from '$lib/image';
	import Icon from './Icon.svelte';
	import { locale } from '$lib/stores/locale.svelte';

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
		<h2>{locale.t('history.title')}</h2>
		{#if filtered.length > 0}
			<button class="btn btn-ghost faint" onclick={onClear}>
				<Icon name="close" size={14} />
				{locale.t('history.clearAll')}
			</button>
		{/if}
	</div>

	{#if filtered.length === 0}
		<p class="faint">{locale.t('history.empty')}</p>
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
								{h.numPages ? `${h.numPages} ${locale.t('common.pages')}` : ''}
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
						aria-label={locale.t('history.toggleFavorite')}
					>
						<Icon name="heart" size={15} />
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
