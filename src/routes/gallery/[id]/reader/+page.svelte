<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { api } from '$lib/api';
	import { backend } from '$lib/client';
	import { getSettings, updateSettings } from '$lib/stores/settings.svelte';
	import { addToHistory } from '$lib/stores/library.svelte';
	import type { GalleryDetail } from '$lib/types';
	import ReaderImage from '$lib/components/ReaderImage.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import ErrorNotice from '$lib/components/ErrorNotice.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { locale } from '$lib/stores/locale.svelte';
	import { thumbPath } from '$lib/image';

	const id = $derived(Number(page.params.id));
	const settings = getSettings();

	const FIT_ORDER: ('width' | 'height' | 'contain')[] = ['width', 'contain', 'height'];
	const FIT_LABEL: Record<string, string> = { width: 'Fit width', contain: 'Fit page', height: 'Fit height' };

	let gallery = $state<GalleryDetail | null>(null);
	let error = $state<string | null>(null);
	let loading = $state(true);
	let currentIdx = $state(0);
	let stageEl = $state<HTMLDivElement>();

	const pages = $derived(gallery?.pages ?? []);
	const orderedPages = $derived(settings.readerRtl ? [...pages].reverse() : pages);
	const current = $derived(orderedPages[currentIdx] ?? null);
	const shown = $derived(orderedPages.slice(Math.max(0, currentIdx - 1), currentIdx + 2));
	const isLast = $derived(currentIdx >= orderedPages.length - 1);

	function forward() {
		if (currentIdx >= orderedPages.length - 1) return;
		currentIdx++;
	}

	function back() {
		if (currentIdx <= 0) return;
		currentIdx--;
	}

	function cycleFit() {
		const next = FIT_ORDER[(FIT_ORDER.indexOf(settings.readerFit) + 1) % FIT_ORDER.length];
		updateSettings({ readerFit: next });
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape' || e.key === 'Backspace') {
			goto(`/gallery/${id}`);
		} else if (e.key === 'ArrowRight') {
			settings.readerRtl ? back() : forward();
		} else if (e.key === 'ArrowLeft') {
			settings.readerRtl ? forward() : back();
		} else if (e.key === 'f' || e.key === 'F') {
			cycleFit();
		} else if (e.key === 'r' || e.key === 'R') {
			updateSettings({ readerRtl: !settings.readerRtl });
			currentIdx = 0;
		}
	}

	onMount(() => {
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});

	function bounce() {
		goto(`/gallery/${id}`);
	}

	function onStageKey(e: KeyboardEvent) {
		if (e.key === 'ArrowRight') settings.readerRtl ? back() : forward();
		else if (e.key === 'ArrowLeft') settings.readerRtl ? forward() : back();
	}

	$effect(() => {
		void id;
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
			})
			.catch(async (e) => {
				if (cancelled) return;
				try {
					const dl = await backend.getDownloadedGalleryInfo(id);
					if (cancelled) return;
					gallery = {
						id: dl.id,
						media_id: String(dl.id),
						title: { english: dl.title, japanese: null, pretty: dl.title },
						cover: { path: '', width: 300, height: 400 },
						thumbnail: { path: '', width: 250, height: 350 },
						tags: [],
						num_pages: dl.total_pages,
						pages: dl.pages.map((p, idx) => ({
							number: idx + 1,
							path: p,
							width: 1200,
							height: 1600,
							thumbnail: p,
							thumbnail_width: 250,
							thumbnail_height: 350,
						})),
					};
					loading = false;
					addToHistory({
						galleryId: dl.id,
						mediaId: String(dl.id),
						englishTitle: dl.title,
						thumbnail: '',
						numPages: dl.total_pages,
						visitedAt: Date.now(),
					});
				} catch {
					if (!cancelled) {
						error = String(e);
						loading = false;
					}
				}
			});
		return () => {
			cancelled = true;
		};
	});

	$effect(() => {
		void currentIdx;
		void settings.readerFit;
		if (stageEl) {
			stageEl.scrollTop = 0;
			stageEl.scrollLeft = 0;
		}
	});
</script>

<svelte:head>
	<title>{gallery?.title.english ?? locale.t('reader.title')} — {locale.t('app.name')}</title>
</svelte:head>

{#if loading && !gallery}
	<div class="page" data-scope="page-reader"><Loader label={locale.t('reader.loading')} /></div>
{:else if error && !gallery}
	<div class="page" data-scope="page-reader"><ErrorNotice message={error} onretry={() => (loading = true)} /></div>
{:else if gallery}
	<div class="reader" data-scope="page-reader" role="group">
		<header class="bar">
			<button class="btn btn-ghost icon-now" onclick={bounce} aria-label={locale.t('reader.backToGallery')}>
				<Icon name="arrow-left" size={16} />
			</button>

			<div class="info">
				<span class="title truncate">{gallery.title.english}</span>
			</div>

			<div class="controls">
				<span class="pos">{orderedPages.length ? currentIdx + 1 : 0} / {orderedPages.length}</span>
				<button class="btn btn-ghost" onclick={() => updateSettings({ readerRtl: !settings.readerRtl })} title={locale.t('reader.toggleReadingOrder')}>
					<Icon name="book" size={14} />
					{settings.readerRtl ? locale.t('reader.readingOrderRtl') : locale.t('reader.readingOrderLtr')}
				</button>
				<button class="btn btn-ghost" onclick={cycleFit} title={locale.t('reader.cycleFitMode')}>
					<Icon name="eye" size={14} />
					{settings.readerFit === 'width' ? locale.t('reader.fitWidth') : settings.readerFit === 'height' ? locale.t('reader.fitHeight') : locale.t('reader.fitPage')}
				</button>
				<a class="icon-now btn btn-ghost" href={`https://nhentai.net/g/${id}`}>
					<Icon name="external" size={14} />
				</a>
			</div>
		</header>

		<div
			class="stage"
			data-fit={settings.readerFit}
			bind:this={stageEl}
			role="button"
			tabindex="0"
			onkeydown={onStageKey}
			onclick={(e) => {
				const x = e.clientX;
				const w = window.innerWidth;
				if (x < w * 0.28) settings.readerRtl ? forward() : back();
				else if (x > w * 0.72) settings.readerRtl ? back() : forward();
			}}
		>
			{#if pages.length === 0}
				<p class="faint">{locale.t('reader.noPageData')}</p>
			{:else}
				{#each shown as p, i}
					<div class="layer" class:visible={p.number === current?.number}>
						<ReaderImage page={p} galleryId={id} fit={settings.readerFit} visible={p.number === current?.number} />
					</div>
				{/each}
			{/if}
		</div>

		<div class="edge-nav">
			<button
				class="edge-btn"
				disabled={settings.readerRtl ? isLast : currentIdx <= 0}
				onclick={() => (settings.readerRtl ? forward() : back())}
				aria-label={locale.t('reader.prevPage')}
			>
				<Icon name="chevron-left" size={22} />
			</button>
			<button
				class="edge-btn"
				disabled={!settings.readerRtl ? isLast : currentIdx <= 0}
				onclick={() => (!settings.readerRtl ? forward() : back())}
				aria-label={locale.t('reader.nextPage')}
			>
				<Icon name="chevron-right" size={22} />
			</button>
		</div>
	</div>
{/if}
