<script lang="ts">
	import { page } from '$app/state';
	import { api } from '$lib/api';
	import { buildQuery, summarizeFilters } from '$lib/query';
	import { buildServerExcludes } from '$lib/stores/blacklist.svelte';
	import type { FilterModel, GalleryList } from '$lib/types';
	import GalleryGrid from '$lib/components/GalleryGrid.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import ErrorNotice from '$lib/components/ErrorNotice.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import Pager from '$lib/components/Pager.svelte';
	import FilterPanel from '$lib/components/FilterPanel.svelte';
	import Drawer from '$lib/components/Drawer.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { locale } from '$lib/stores/locale.svelte';

	function freshModel(): FilterModel {
		return {
			query: '',
			included: [],
			excluded: [],
			language: undefined,
			category: undefined,
			minPages: undefined,
			maxPages: undefined,
			sort: 'date',
		};
	}

	const urlQuery = $derived(page.url.searchParams.get('q') ?? '');
	let lastIncoming = $state('');

	let model = $state<FilterModel>(freshModel());
	let appliedQuery = $state('');
	let pageNum = $state(1);
	let results = $state<GalleryList | null>(null);
	let error = $state<string | null>(null);
	let loading = $state(false);
	let tick = $state(0);
	let drawerOpen = $state(false);

	const filterCount = $derived(summarizeFilters(model).count);

	$effect(() => {
		if (urlQuery && urlQuery !== lastIncoming) {
			lastIncoming = urlQuery;
			model.query = urlQuery;
			run();
		}
	});

	function run() {
		const base = buildQuery(model);
		const excludes = buildServerExcludes();
		appliedQuery = [base, excludes].filter(Boolean).join(' ');
		pageNum = 1;
		tick++;
	}

	$effect(() => {
		if (!appliedQuery) return;
		let cancelled = false;
		loading = true;
		error = null;
		api.search(appliedQuery, model.sort, pageNum)
			.then((res) => {
				if (!cancelled) {
					results = res;
					loading = false;
				}
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

	function submit(event: Event) {
		event.preventDefault();
		run();
	}

	function updateModel(m: FilterModel) {
		model = m;
	}

	function resetAll() {
		model = freshModel();
		lastIncoming = '';
		run();
	}
</script>

<div class="page" data-scope="page-search">
	<div class="page-head">
		<h1>{locale.t('search.title')}</h1>
		{#if appliedQuery}
			<span class="query-pill truncate secondary" title={appliedQuery}>{appliedQuery}</span>
		{/if}
		<span class="spacer"></span>
		<button class="btn" class:active={filterCount > 0} onclick={() => (drawerOpen = true)}>
			<Icon name="filter" size={15} />
			{locale.t('search.filters')}
			{#if filterCount > 0}
				<span class="count">{filterCount}</span>
			{/if}
		</button>
	</div>

	<form class="search-bar" onsubmit={submit} role="search">
		<Icon name="search" size={17} />
		<input
			class="search-input"
			placeholder={locale.t('search.placeholder')}
			bind:value={model.query}
			aria-label={locale.t('search.title')}
		/>
		<button class="btn btn-primary" type="submit" disabled={!model.query.trim() && filterCount === 0}>
			{locale.t('search.submit')}
		</button>
	</form>

	{#if loading && !results}
		<Loader label={locale.t('search.searching')} />
	{:else if error && !results}
		<ErrorNotice message={error} onretry={() => tick++} />
	{:else if !appliedQuery}
		<EmptyState
			icon="search"
			title={locale.t('search.refineTitle')}
			description={locale.t('search.refineDesc')}
		/>
	{:else if results && results.result.length === 0}
		<EmptyState icon="search" title={locale.t('search.noResultsTitle')} description={locale.t('search.noResultsDesc')} />
	{:else if results}
		<GalleryGrid galleries={results.result} />
		<Pager page={pageNum} numPages={results.num_pages} ongoto={(n) => ((pageNum = n), (tick++))} />
	{/if}
</div>

<Drawer title={locale.t('search.filterDrawerTitle')} open={drawerOpen} width={400} onclose={() => (drawerOpen = false)}>
	<FilterPanel model={model} onupdate={updateModel} />
</Drawer>
