<script lang="ts">
	import {
		getFavorites,
		clearFavorites,
		removeFavorite,
		exportFavoritesData,
		importFavoritesData,
		isDownloaded,
	} from '$lib/stores/library.svelte';
	import { downloadJson, pickAndReadJson } from '$lib/exportImport';
	import { titlebarQuery } from '$lib/stores/titlebarSearch.svelte';
	import type { GalleryListItem } from '$lib/types';
	import { formatCount } from '$lib/format';
	import { thumbPath } from '$lib/image';
	import Icon from './Icon.svelte';
	import CoverImage from './CoverImage.svelte';
	import EmptyState from './EmptyState.svelte';
	import { locale } from '$lib/stores/locale.svelte';

	let { downloadedOnly = false }: { downloadedOnly?: boolean } = $props();

	const query = $derived(titlebarQuery.value.trim().toLowerCase());
	const list = $derived(
		downloadedOnly
			? getFavorites().filter((g) => isDownloaded(g.id))
			: getFavorites(),
	);
	const sorted = $derived(
		list
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

	function onExport() {
		downloadJson('nh-reader-favorites.json', exportFavoritesData());
	}

	async function onImport() {
		try {
			const data = await pickAndReadJson<unknown>();
			importFavoritesData(data);
		} catch {
		}
	}
</script>

<div class="favorites" data-scope="favorites-view">
	<div class="head">
		<h2>{downloadedOnly ? locale.t('library.downloadedFavorites') : locale.t('favorites.title')}</h2>
		{#if !downloadedOnly}
			<div class="btn-group">
				<button class="btn btn-ghost" onclick={onExport} title={locale.t('favorites.export')}>
					<Icon name="download" size={14} />
					{locale.t('favorites.export')}
				</button>
				<button class="btn btn-ghost" onclick={onImport} title={locale.t('favorites.import')}>
					<Icon name="upload" size={14} />
					{locale.t('favorites.import')}
				</button>
				{#if sorted.length > 0}
					<button class="btn btn-ghost faint" onclick={clearFavorites}>
						<Icon name="close" size={14} />
						{locale.t('favorites.clearAll')}
					</button>
				{/if}
			</div>
		{/if}
	</div>

	{#if sorted.length === 0}
		<EmptyState
			icon="heart"
			title={downloadedOnly ? locale.t('library.emptyFavorites') : locale.t('favorites.emptyTitle')}
			description={downloadedOnly ? locale.t('library.emptyFavoritesHint') : locale.t('favorites.emptyDesc')}
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
								{formatCount(g.num_pages ?? 0)} {locale.t('common.pages')} · {formatCount(g.num_favorites ?? 0)}
							</span>
						</div>
					</a>
					<button class="remove" onclick={() => onRemove(g.id)} aria-label={locale.t('favorites.removeFromFavorites')}>
						<Icon name="close" size={13} />
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>
