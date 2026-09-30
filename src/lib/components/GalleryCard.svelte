<script lang="ts">
	import { getSettings } from '$lib/stores/settings.svelte';
	import { getBlacklist } from '$lib/stores/blacklist.svelte';
	import { isFavorite, toggleFavorite } from '$lib/stores/library.svelte';
	import { formatCount } from '$lib/format';
	import { thumbPath } from '$lib/image';
	import type { GalleryListItem } from '$lib/types';
	import Icon from './Icon.svelte';
	import CoverImage from './CoverImage.svelte';

	let { gallery }: { gallery: GalleryListItem } = $props();

	const s = getSettings();
	const blocked = $derived(
		s.blacklistEnabled && getBlacklist().some((e) => gallery.tag_ids.includes(e.id)),
	);
	const fav = $derived(isFavorite(gallery.id));

	function onFav(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		toggleFavorite(gallery);
	}
</script>

<a class="card" data-scope="gallery-card" class:blurred={s.blacklistMode === 'blur' && blocked} href={`/gallery/${gallery.id}`}>
	<div class="thumb">
		<CoverImage src={thumbPath(gallery.thumbnail)} alt={gallery.english_title} />
		{#if blocked}
			<span class="blocked-tag"><Icon name="shield" size={11} /> blocked</span>
		{/if}
		<button class="fav" class:on={fav} onclick={onFav} aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}>
			<Icon name="heart" size={15} />
		</button>
	</div>

	<h3 class="title" title={gallery.english_title}>{gallery.english_title}</h3>
	<div class="meta">
		<span>{gallery.num_pages ?? 0} pages</span>
		<span aria-hidden="true">·</span>
		<span>{formatCount(gallery.num_favorites ?? 0)} favs</span>
	</div>
</a>
