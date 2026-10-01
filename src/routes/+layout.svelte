<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { avatarUrl } from '$lib/image';
	import { loadSettings, getSettings } from '$lib/stores/settings.svelte';
	import { loadLibrary } from '$lib/stores/library.svelte';
	import { loadBlacklist, getBlacklist } from '$lib/stores/blacklist.svelte';
	import { initAccount, getAccountState } from '$lib/stores/account.svelte';
	import { initServiceStore } from '$lib/stores/service.svelte';
	import { cacheInit } from '$lib/cache';
	import { setTitlebarQuery } from '$lib/stores/titlebarSearch.svelte';
	import { locale } from '$lib/stores/locale.svelte';
	import { getCurrentWindow } from '@tauri-apps/api/window';
	import LoginModal from '$lib/components/LoginModal.svelte';
	import WindowControls from '$lib/components/WindowControls.svelte';
	import { getPlatform } from '$lib/platform';
	import '../lib/design/app.css';

	let { children } = $props();


	const nav = $derived([
		{ href: '/', label: locale.t('nav.latest'), icon: 'grid' },
		{ href: '/popular', label: locale.t('nav.popular'), icon: 'flame' },
		{ href: '/library', label: locale.t('nav.library'), icon: 'book' },
		{ href: '/favorites', label: locale.t('nav.favorites'), icon: 'heart' },
		{ href: '/history', label: locale.t('nav.history'), icon: 'clock' },
		{ href: '/downloads', label: locale.t('nav.downloads'), icon: 'download' },
		{ href: '/blacklist', label: locale.t('nav.blacklist'), icon: 'shield' },
		{ href: '/settings', label: locale.t('nav.settings'), icon: 'settings' },
	]);

	const settings = getSettings();
	const blacklist = $derived(getBlacklist());
	const account = $derived(getAccountState());
	const platform = getPlatform();

	const effectiveControlsPosition = $derived.by(() => {
		if (settings.windowControlsPosition === 'left') return 'left';
		if (settings.windowControlsPosition === 'right') return 'right';
		return platform === 'macos' ? 'left' : 'right';
	});

	let quickQuery = $state('');
	let ready = $state(false);
	let avatarBroken = $state(false);
	let loginModalOpen = $state(false);

	$effect(() => {
		account.user;
		avatarBroken = false;
	});

	function onQuickSearch(event: Event) {
		event.preventDefault();
		const q = quickQuery.trim();
		const path = page.url.pathname;

		if (path === '/search') {
			goto(`/search?${new URLSearchParams({ q })}`);
		} else if (path === '/favorites' || path === '/history') {
			setTitlebarQuery(q);
		} else {
			if (!q) return;
			goto(`/search?${new URLSearchParams({ q })}`);
		}
	}

	let topBarEl = $state<HTMLElement | null>(null);

	onMount(() => {
		function onTopBarMouseDown(e: MouseEvent) {
			if (e.buttons === 1 && !(e.target as HTMLElement)?.closest('input, button, a, kbd, [role="button"]')) {
				getCurrentWindow().startDragging().catch(() => {});
			}
		}

		function onTopBarDblClick(e: MouseEvent) {
			if (!(e.target as HTMLElement)?.closest('input, button, a, kbd, [role="button"]')) {
				getCurrentWindow().toggleMaximize().catch(() => {});
			}
		}

		topBarEl?.addEventListener('mousedown', onTopBarMouseDown);
		topBarEl?.addEventListener('dblclick', onTopBarDblClick);

		cacheInit()
			.then(() =>
				Promise.all([
					locale.init(),
					loadSettings(),
					loadLibrary(),
					loadBlacklist(),
					initAccount(),
					initServiceStore(),
				]),
			)
			.finally(() => {
				ready = true;
			});

		return () => {
			topBarEl?.removeEventListener('mousedown', onTopBarMouseDown);
			topBarEl?.removeEventListener('dblclick', onTopBarDblClick);
		};
	});
	$effect(() => {
		if (typeof document !== 'undefined') {
			document.documentElement.lang = locale.value;
			document.documentElement.dir = locale.dir;
		}
	});
</script>

<svelte:head>
	<title>{locale.t('app.name')}</title>
	<meta name="color-scheme" content="dark" />
</svelte:head>

<div class="app" dir={locale.dir}>
	<header
		class="top-bar"
		bind:this={topBarEl}
		data-tauri-drag-region
	>
		{#if effectiveControlsPosition === 'left'}
			<WindowControls position="left" />
		{/if}
		<div class="tb-brand" data-tauri-drag-region>
			<img class="tb-mark" src={`${base}/favicon.png`} alt="" data-tauri-drag-region />
			<span class="tb-title" data-tauri-drag-region>{locale.t('app.name')}</span>
		</div>
		<form class="quick-search" onsubmit={onQuickSearch} role="search">
			<Icon name="search" size={16} />
			<input
				class="quick-input"
				placeholder={locale.t('titlebar.searchPlaceholder')}
				bind:value={quickQuery}
				aria-label={locale.t('titlebar.searchPlaceholder')}
			/>
			<kbd>{locale.t('titlebar.searchShortcut')}</kbd>
		</form>
		<div class="bar-actions">
			<a class="chip-btn" href="/blacklist" title={locale.t('nav.blacklist')} aria-label={locale.t('nav.blacklist')}>
				<Icon name="shield" size={16} />
				{#if blacklist.length > 0}
					<span class="badge" class:off={!settings.blacklistEnabled}>
						{blacklist.length}
					</span>
				{/if}
			</a>

			<button
				class="account-chip"
				onclick={() => (loginModalOpen = true)}
				title={account.keyStatus.configured ? locale.t('account.accountSettings') : locale.t('account.signIn')}
			>
				{#if account.keyStatus.configured}
					{#if account.user?.avatar_url && !avatarBroken}
						<img
							class="avatar"
							src={avatarUrl(account.user.avatar_url)}
							alt=""
							onerror={() => (avatarBroken = true)}
						/>
					{:else if account.user?.username}
						<span class="avatar">{account.user.username[0]?.toUpperCase()}</span>
					{:else}
						<Icon name="user" size={16} />
					{/if}
					<span class="account-name">{account.user?.username ?? locale.t('account.connected')}</span>
				{:else}
					<Icon name="user" size={16} />
					<span class="account-name">{locale.t('account.signIn')}</span>
				{/if}
			</button>

			{#if effectiveControlsPosition === 'right'}
				<WindowControls position="right" />
			{/if}
		</div>
	</header>

	<div class="shell">
		<main class="content">
			{#if ready}
				{@render children()}
			{:else}
				<div class="boot-splash">
					<div class="boot-spinner"></div>
				</div>
			{/if}
		</main>
	</div>

	<nav class="bottom-nav" aria-label="Primary">
		<div class="bottom-nav-inner">
			{#each nav as item}
				<a
					class="bottom-nav-item"
					class:active={page.url.pathname === item.href}
					href={item.href}
				>
					<div class="nav-icon-wrapper">
						<Icon name={item.icon} size={20} />
					</div>
					<span class="nav-label">{item.label}</span>
				</a>
			{/each}
		</div>
	</nav>

	<LoginModal bind:open={loginModalOpen} />
</div>
