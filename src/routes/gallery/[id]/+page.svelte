<script lang="ts">
	import { page } from '$app/state';
	import { api } from '$lib/api';
	import { formatCount, formatDate, relativeDate } from '$lib/format';
	import type { GalleryDetail, GalleryListItem } from '$lib/types';
	import {
		isFavorite,
		toggleFavorite,
		addToHistory,
		toGalleryListItem,
	} from '$lib/stores/library.svelte';
	import {
		getBlacklist,
		addTag,
		removeByRef,
		matchesBlacklist,
	} from '$lib/stores/blacklist.svelte';
	import {
		getAccountState,
		refreshFavorite,
		toggleAccountFavorite,
	} from '$lib/stores/account.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import ErrorNotice from '$lib/components/ErrorNotice.svelte';
	import CoverImage from '$lib/components/CoverImage.svelte';
	import GalleryGrid from '$lib/components/GalleryGrid.svelte';
	import TagChip from '$lib/components/TagChip.svelte';
	import DownloadButton from '$lib/components/DownloadButton.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { thumbPath } from '$lib/image';

	const id = $derived(Number(page.params.id));

	let gallery = $state<GalleryDetail | null>(null);
	let error = $state<string | null>(null);
	let loading = $state(true);
	let related = $state<GalleryListItem[]>([]);
	let tick = $state(0);

	const account = $derived(getAccountState());
	const blacklist = $derived(getBlacklist());

	const localFav = $derived(isFavorite(id));
	const accountFav = $derived(account.keyStatus.configured ? account.accountFavorites.get(id) ?? false : localFav);
	const isBlocked = $derived(gallery ? matchesBlacklist(toGalleryListItem(gallery)) : false);

	$effect(() => {
		void id;
		void tick;
		let cancelled = false;
		loading = true;
		error = null;
		api.gallery(id)
			.then((res) => {
				if (cancelled) return;
				gallery = res;
				loading = false;
				addToHistory({
					galleryId: res.id,
					mediaId: res.media_id,
					englishTitle: res.title.english,
					thumbnail: thumbPath(res.thumbnail.path),
					numPages: res.num_pages,
					visitedAt: Date.now(),
				});
				if (account.keyStatus.configured) refreshFavorite(res.id);
				loadRelated();
			})
			.catch((e) => {
				if (!cancelled) {
					error = String(e);
					loading = false;
				}
			});
		return () => {
			cancelled = true;
		};
	});

	async function loadRelated() {
		try {
			const res = await api.related(id);
			related = res.result;
		} catch {}
	}

	function onLocalFav() {
		if (gallery) toggleFavorite(toGalleryListItem(gallery));
	}

	async function onAccountFav() {
		await toggleAccountFavorite(id);
	}

	function onToggleBlock(tag: { id: number; name: string; type: string; slug: string }) {
		if (blacklist.some((e) => e.name === tag.name && e.type === tag.type)) {
			removeByRef({ id: tag.id, name: tag.name, type: tag.type, slug: tag.slug });
		} else {
			addTag({ ...tag, url: '', count: 0 });
		}
	}

	function openExternal() {
		import('@tauri-apps/plugin-opener').then(({ openUrl }) =>
			openUrl(`https://nhentai.net/g/${id}`),
		);
	}

	const grouped = $derived.by(() => {
		if (!gallery) return [];
		const order = ['parody', 'character', 'artist', 'group', 'language', 'category', 'tag'];
		const map = new Map<string, typeof gallery.tags>();
		for (const t of gallery.tags) {
			if (t.type === 'tag' || t.type === 'category') continue;
			if (!map.has(t.type)) map.set(t.type, []);
			map.get(t.type)!.push(t);
		}
		return order.filter((k) => map.has(k)).map((k) => ({ type: k, tags: map.get(k)! }));
	});

	const plainTags = $derived(gallery?.tags.filter((t) => t.type === 'tag' || t.type === 'category') ?? []);
</script>

<div class="page" data-scope="page-gallery">
	{#if loading && !gallery}
		<Loader label="Loading gallery…" />
	{:else if error && !gallery}
		<ErrorNotice message={error} onretry={() => tick++} />
	{:else if gallery}
		<div class="detail">
			<div class="cover-col">
				<CoverImage
					src={thumbPath(gallery.thumbnail.path)}
					alt={gallery.title.english}
					ratio={gallery.thumbnail.width / gallery.thumbnail.height}
					loading="eager"
				/>
				{#if isBlocked}
					<div class="blocked-note">
						<Icon name="shield" size={14} />
						This gallery matches your blacklist.
					</div>
				{/if}
			</div>

			<div class="info-col">
				<h1 class="title">{gallery.title.english}</h1>
				{#if gallery.title.japanese}
					<p class="japanese secondary">{gallery.title.japanese}</p>
				{/if}

				<div class="stats">
					<div class="stat">
						<b>{gallery.num_pages ?? 0}</b>
						<span class="faint">pages</span>
					</div>
					<div class="stat">
						<b>{formatCount(gallery.num_favorites ?? 0)}</b>
						<span class="faint">favorites</span>
					</div>
					<div class="stat">
						<b>{relativeDate(gallery.upload_date ?? 0)}</b>
						<span class="faint">{formatDate(gallery.upload_date ?? 0)}</span>
					</div>
					<div class="stat">
						<b>#{gallery.id}</b>
						<span class="faint">id</span>
					</div>
				</div>

				<div class="actions">
					<a class="btn btn-primary" href={`/gallery/${id}/reader`}>
						<Icon name="book" size={15} />
						Open reader
					</a>
					<DownloadButton galleryId={id} />
					<button class="btn" class:on={localFav} onclick={onLocalFav} title="Save locally">
						<Icon name="heart" size={15} />
						{localFav ? 'Saved' : 'Favorite'}
					</button>
					{#if account.keyStatus.configured}
						<button class="btn" class:on={accountFav} onclick={onAccountFav} title="Favorite on nhentai">
							<Icon name="external" size={14} />
							{accountFav ? 'On nhentai' : 'Synced fav'}
						</button>
					{/if}
					<button class="btn btn-ghost" onclick={openExternal} title="Open in browser">
						<Icon name="external" size={14} />
					</button>
				</div>

				{#if gallery.scanlator}
					<p class="faint">Scanlator: {gallery.scanlator}</p>
				{/if}

				{#if grouped.length > 0}
					<div class="tag-sections">
						{#each grouped as section}
							<div class="tag-group">
								<h2>{section.type}</h2>
								<div class="chips">
									{#each section.tags as t}
										<TagChip
											name={t.name}
											type={t.type}
											active={blacklist.some((e) => e.name === t.name && e.type === t.type)}
											onclick={() =>
												onToggleBlock({ id: t.id, name: t.name, type: t.type, slug: t.slug })}
										/>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				{/if}

				{#if plainTags.length > 0}
					<div class="tag-group">
						<h2>tags</h2>
						<div class="chips">
							{#each plainTags as t}
								<TagChip
									name={t.name}
									type={t.type}
									active={blacklist.some((e) => e.name === t.name && e.type === t.type)}
									onclick={() =>
										onToggleBlock({ id: t.id, name: t.name, type: t.type, slug: t.slug })}
								/>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>

		{#if related.length > 0}
			<section class="related">
				<h2>Related</h2>
				<GalleryGrid galleries={related} />
			</section>
		{/if}
	{/if}
</div>
