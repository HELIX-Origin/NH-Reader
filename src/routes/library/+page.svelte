<script lang="ts">
	import { getDownloaded, getFavorites, getHistory, isDownloaded } from '$lib/stores/library.svelte';
	import { locale } from '$lib/stores/locale.svelte';
	import DownloadedView from '$lib/components/DownloadedView.svelte';
	import FavoritesView from '$lib/components/FavoritesView.svelte';
	import HistoryView from '$lib/components/HistoryView.svelte';
	import Icon from '$lib/components/Icon.svelte';

	type LibraryTab = 'downloaded' | 'favorites' | 'history';

	let activeTab = $state<LibraryTab>('downloaded');

	const downloadedCount = $derived(getDownloaded().length);
	const downloadedFavoritesCount = $derived(
		getFavorites().filter((f) => isDownloaded(f.id)).length,
	);
	const historyCount = $derived(getHistory().length);
</script>

<svelte:head>
	<title>{locale.t('library.title')} — {locale.t('app.name')}</title>
</svelte:head>

<div class="page" data-scope="page-library">
	<div class="page-head">
		<h2>{locale.t('library.title')}</h2>
		<nav class="library-tabs" aria-label="Library categories">
			<button
				class="tab-btn"
				class:active={activeTab === 'downloaded'}
				onclick={() => (activeTab = 'downloaded')}
			>
				<Icon name="download" size={15} />
				<span>{locale.t('library.downloaded')}</span>
				{#if downloadedCount > 0}
					<span class="tab-badge">{downloadedCount}</span>
				{/if}
			</button>
			<button
				class="tab-btn"
				class:active={activeTab === 'favorites'}
				onclick={() => (activeTab = 'favorites')}
			>
				<Icon name="heart" size={15} />
				<span>{locale.t('library.favorites')}</span>
				{#if downloadedFavoritesCount > 0}
					<span class="tab-badge">{downloadedFavoritesCount}</span>
				{/if}
			</button>
			<button
				class="tab-btn"
				class:active={activeTab === 'history'}
				onclick={() => (activeTab = 'history')}
			>
				<Icon name="clock" size={15} />
				<span>{locale.t('library.history')}</span>
				{#if historyCount > 0}
					<span class="tab-badge">{historyCount}</span>
				{/if}
			</button>
		</nav>
	</div>

	<div class="library-content">
		{#if activeTab === 'downloaded'}
			<DownloadedView />
		{:else if activeTab === 'favorites'}
			<FavoritesView downloadedOnly={true} />
		{:else if activeTab === 'history'}
			<HistoryView entries={getHistory()} />
		{/if}
	</div>
</div>

<style>
	.page-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20px;
		flex-wrap: wrap;
		gap: 16px;
	}

	.page-head h2 {
		margin: 0;
		font-size: 24px;
		font-weight: 700;
		color: #fff;
	}

	.library-tabs {
		display: flex;
		align-items: center;
		gap: 6px;
		background: #1a1a1a;
		border: 1px solid #282828;
		border-radius: 8px;
		padding: 4px;
	}

	.tab-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 6px 14px;
		background: transparent;
		border: none;
		border-radius: 6px;
		color: #888;
		font-size: 13px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.tab-btn:hover {
		color: #ddd;
		background: #242424;
	}

	.tab-btn.active {
		background: #2c2c2c;
		color: #fff;
		font-weight: 600;
	}

	.tab-badge {
		background: #383838;
		color: #ddd;
		font-size: 11px;
		padding: 2px 6px;
		border-radius: 6px;
		font-weight: 600;
	}

	.tab-btn.active .tab-badge {
		background: #ed2553;
		color: #fff;
	}

	.library-content {
		width: 100%;
	}
</style>
