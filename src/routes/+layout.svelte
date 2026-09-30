<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { getCurrentWindow } from '@tauri-apps/api/window';
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
	import '../lib/design/app.css';

	let { children } = $props();

	const isChildWindow = $derived(
		page.url.pathname.startsWith('/installer')
	);

	const nav = $derived([
		{ href: '/', label: locale.t('nav.latest'), icon: 'grid' },
		{ href: '/popular', label: locale.t('nav.popular'), icon: 'flame' },
		{ href: '/favorites', label: locale.t('nav.favorites'), icon: 'heart' },
		{ href: '/history', label: locale.t('nav.history'), icon: 'clock' },
		{ href: '/downloads', label: locale.t('nav.downloads'), icon: 'download' },
		{ href: '/blacklist', label: locale.t('nav.blacklist'), icon: 'shield' },
		{ href: '/settings', label: locale.t('nav.settings'), icon: 'settings' },
	]);

	const settings = getSettings();
	const blacklist = $derived(getBlacklist());
	const account = $derived(getAccountState());

	let quickQuery = $state('');
	let ready = $state(false);
	let avatarBroken = $state(false);

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

	const compact = () => getCurrentWindow().minimize();
	const zoom = () => getCurrentWindow().toggleMaximize();
	const quit = () => getCurrentWindow().close();

	const isMac = $derived(
		typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent),
	);

	function onBarPointerDown(e: PointerEvent) {
		if (e.button !== 0) return;
		const t = e.target as HTMLElement | null;
		if (t?.closest('button, select, input, a, [role="menuitem"]')) return;
		e.preventDefault();
		getCurrentWindow().startDragging();
	}

	function onBarDoubleClick(e: MouseEvent) {
		const t = e.target as HTMLElement | null;
		if (t?.closest('button, select, input, a')) return;
		getCurrentWindow().toggleMaximize();
	}

	onMount(() => {
		if (isChildWindow) {
			locale.init().finally(() => {
				ready = true;
			});
			return;
		}
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
	});
</script>

<svelte:head>
	<title>NH Desktop</title>
	<meta name="color-scheme" content="dark" />
</svelte:head>

{#if isChildWindow}
	{@render children()}
{:else}
<div class="app">
	<header
		class="titlebar"
		class:mac={isMac}
		role="presentation"
		onpointerdown={onBarPointerDown}
		ondblclick={onBarDoubleClick}
	>
		<div class="traffic" aria-label={locale.t('titlebar.closeTooltip')}>
			<button class="dot close" aria-label={locale.t('titlebar.closeTooltip')} onclick={quit}></button>
			<button class="dot min" aria-label={locale.t('titlebar.minimizeTooltip')} onclick={compact}></button>
			<button class="dot max" aria-label={locale.t('titlebar.maximizeTooltip')} onclick={zoom}></button>
		</div>
		<span class="tb-title">NH Desktop</span>
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

			<a class="account-chip" href="/settings" title={locale.t('account.accountSettings')}>
				{#if account.keyStatus.configured}
					{#if account.user && !avatarBroken}
						<img
							class="avatar"
							src={avatarUrl(account.user.avatar_url)}
							alt=""
							onerror={() => (avatarBroken = true)}
						/>
					{:else if account.user}
						<span class="avatar">{account.user.username[0]?.toUpperCase()}</span>
					{:else}
						<Icon name="user" size={16} />
					{/if}
					<span class="account-name">{account.user?.username ?? locale.t('account.connected')}</span>
				{:else}
					<Icon name="user" size={16} />
					<span class="account-name">{locale.t('account.signIn')}</span>
				{/if}
			</a>
		</div>
	</header>

	<div class="shell">
	<aside class="sidebar">
		<div class="brand">
			<img class="brand-mark" src={`${base}/favicon.png`} alt="NH Desktop logo" />
			<span class="brand-name">NH Desktop</span>
		</div>

		<nav class="nav" aria-label="Primary">
			{#each nav as item}
				<a
					class="nav-item"
					class:active={page.url.pathname === item.href}
					href={item.href}
				>
					<Icon name={item.icon} size={18} />
					<span class="nav-label">{item.label}</span>
				</a>
			{/each}
		</nav>

		<div class="sidebar-foot">
			<span class="faint">v0.4.0</span>
		</div>
	</aside>

	<div class="main">
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
</div>
</div>
{/if}
