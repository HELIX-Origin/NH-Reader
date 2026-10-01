<script lang="ts">
	import { getDownloaded, deleteDownloaded, getDownloadedPageBlobUrl, loadDownloaded } from '$lib/stores/library.svelte';
	import { openDownloadsFolder } from '$lib/stores/service.svelte';
	import { formatBytes } from '$lib/format';
	import { locale } from '$lib/stores/locale.svelte';
	import Icon from './Icon.svelte';

	let searchQuery = $state('');
	let coverUrls = $state<Record<number, string>>({});
	let deletingId = $state<number | null>(null);

	const downloaded = $derived(getDownloaded());
	const filtered = $derived(
		downloaded.filter((item) => {
			if (!searchQuery.trim()) return true;
			const q = searchQuery.trim().toLowerCase();
			return item.title.toLowerCase().includes(q) || String(item.id).includes(q);
		}),
	);

	$effect(() => {
		for (const item of downloaded) {
			if (!coverUrls[item.id]) {
				getDownloadedPageBlobUrl(item.id, 0)
					.then((url) => {
						coverUrls[item.id] = url;
					})
					.catch(() => {});
			}
		}
	});

	async function onDelete(id: number) {
		if (window.confirm(locale.t('library.confirmDelete'))) {
			deletingId = id;
			try {
				await deleteDownloaded(id);
			} finally {
				deletingId = null;
			}
		}
	}

	async function onRefresh() {
		await loadDownloaded();
	}

	async function onOpenFolder() {
		try {
			await openDownloadsFolder();
		} catch {}
	}
</script>

<div class="downloaded-view" data-scope="downloaded-view">
	<div class="toolbar">
		<div class="search-box">
			<Icon name="search" size={15} />
			<input
				type="text"
				placeholder={locale.t('library.searchPlaceholder')}
				bind:value={searchQuery}
				aria-label={locale.t('library.searchPlaceholder')}
			/>
		</div>
		<div class="actions">
			<button class="btn btn-ghost" onclick={onRefresh} title={locale.t('library.refresh')}>
				<Icon name="refresh" size={14} />
				<span>{locale.t('library.refresh')}</span>
			</button>
			<button class="btn btn-ghost" onclick={onOpenFolder} title={locale.t('library.openFolder')}>
				<Icon name="folder" size={14} />
				<span>{locale.t('library.openFolder')}</span>
			</button>
		</div>
	</div>

	{#if filtered.length === 0}
		<div class="empty-state">
			<div class="empty-icon">
				<Icon name="book" size={40} />
			</div>
			<h3>{locale.t('library.emptyDownloaded')}</h3>
			<p class="faint">{locale.t('library.emptyDownloadedHint')}</p>
			<div class="empty-actions">
				<a class="btn btn-primary" href="/popular">
					<Icon name="flame" size={15} />
					<span>{locale.t('library.browsePopular')}</span>
				</a>
				<a class="btn btn-ghost" href="/downloads">
					<Icon name="download" size={15} />
					<span>{locale.t('nav.downloads')}</span>
				</a>
			</div>
		</div>
	{:else}
		<div class="grid">
			{#each filtered as item (item.id)}
				<article class="card">
					<a class="cover-wrapper" href={`/gallery/${item.id}/reader`} title={item.title}>
						{#if coverUrls[item.id]}
							<img src={coverUrls[item.id]} alt={item.title} loading="lazy" />
						{:else}
							<div class="cover-placeholder">
								<Icon name="image" size={32} />
							</div>
						{/if}
						<div class="cover-badge format">{item.format.toUpperCase()}</div>
					</a>

					<div class="details">
						<a class="title-link" href={`/gallery/${item.id}`} title={item.title}>
							<h4 class="title">{item.title}</h4>
						</a>

						<div class="meta-tags">
							<span class="meta-tag">{item.total_pages} {locale.t('common.pages')}</span>
							<span class="meta-dot">·</span>
							<span class="meta-tag">{formatBytes(item.file_size)}</span>
						</div>

						<div class="card-actions">
							<a class="btn-read" href={`/gallery/${item.id}/reader`}>
								<Icon name="book" size={14} />
								<span>{locale.t('library.readOffline')}</span>
							</a>
							<a class="btn-icon" href={`/gallery/${item.id}`} title={locale.t('library.details')}>
								<Icon name="external" size={14} />
							</a>
							<button
								class="btn-icon danger"
								onclick={() => onDelete(item.id)}
								disabled={deletingId === item.id}
								title={locale.t('library.delete')}
							>
								<Icon name="close" size={14} />
							</button>
						</div>
					</div>
				</article>
			{/each}
		</div>
	{/if}
</div>

<style>
	.downloaded-view {
		display: flex;
		flex-direction: column;
		gap: 18px;
		width: 100%;
	}

	.toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		flex-wrap: wrap;
	}

	.search-box {
		display: flex;
		align-items: center;
		gap: 8px;
		background: #1e1e1e;
		border: 1px solid #2e2e2e;
		border-radius: 8px;
		padding: 6px 12px;
		flex: 1;
		max-width: 380px;
		color: #999;
	}

	.search-box input {
		background: transparent;
		border: none;
		outline: none;
		color: #eee;
		font-size: 13px;
		width: 100%;
	}

	.search-box input::placeholder {
		color: #777;
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 64px 24px;
		text-align: center;
		background: #181818;
		border: 1px dashed #2c2c2c;
		border-radius: 8px;
		gap: 12px;
	}

	.empty-icon {
		color: #666;
		margin-bottom: 4px;
	}

	.empty-state h3 {
		margin: 0;
		font-size: 18px;
		font-weight: 600;
		color: #eee;
	}

	.empty-actions {
		display: flex;
		gap: 10px;
		margin-top: 12px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
		gap: 16px;
		width: 100%;
	}

	.card {
		background: #1c1c1c;
		border: 1px solid #282828;
		border-radius: 8px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		transition: transform 0.15s ease, border-color 0.15s ease;
	}

	.card:hover {
		border-color: #3e3e3e;
		transform: translateY(-2px);
	}

	.cover-wrapper {
		position: relative;
		width: 100%;
		aspect-ratio: 1 / 1.42;
		background: #141414;
		overflow: hidden;
		display: block;
	}

	.cover-wrapper img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.cover-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #444;
	}

	.cover-badge {
		position: absolute;
		top: 8px;
		left: 8px;
		padding: 3px 6px;
		font-size: 10px;
		font-weight: 700;
		border-radius: 6px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.cover-badge.format {
		background: rgba(18, 18, 18, 0.85);
		color: #ed2553;
		border: 1px solid rgba(237, 37, 83, 0.3);
	}

	.details {
		padding: 12px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		flex: 1;
	}

	.title-link {
		text-decoration: none;
		color: inherit;
	}

	.title {
		margin: 0;
		font-size: 13px;
		font-weight: 600;
		line-height: 1.35;
		color: #e4e4e4;
		display: -webkit-box;
		line-clamp: 2;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		min-height: 35px;
	}

	.title-link:hover .title {
		color: #ed2553;
	}

	.meta-tags {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 11px;
		color: #888;
	}

	.meta-dot {
		color: #555;
	}

	.card-actions {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-top: auto;
		padding-top: 6px;
	}

	.btn-read {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		background: #ed2553;
		color: #fff;
		border: none;
		border-radius: 6px;
		padding: 7px 10px;
		font-size: 12px;
		font-weight: 600;
		text-decoration: none;
		cursor: pointer;
		transition: opacity 0.15s ease;
	}

	.btn-read:hover {
		opacity: 0.9;
	}

	.btn-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 30px;
		background: #252525;
		color: #bbb;
		border: 1px solid #333;
		border-radius: 6px;
		cursor: pointer;
		text-decoration: none;
		transition: background 0.15s ease, color 0.15s ease;
	}

	.btn-icon:hover {
		background: #2e2e2e;
		color: #fff;
	}

	.btn-icon.danger:hover {
		background: rgba(237, 37, 83, 0.15);
		color: #ed2553;
		border-color: rgba(237, 37, 83, 0.4);
	}
</style>
