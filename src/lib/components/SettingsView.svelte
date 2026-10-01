<script lang="ts">
	import { getSettings, updateSettings } from '$lib/stores/settings.svelte';
	import { getAccountState, setApiKey, clearApiKey } from '$lib/stores/account.svelte';
	import {
		getServiceAutoRefresh,
		getServiceJobs,
		setServiceAutoRefresh,
		enqueueMaintenance,
		enqueueSync,
		serviceKindLabel,
		getDownloadsDir,
		setDownloadsDir,
		resetDownloadsDir,
		openDownloadsFolder,
	} from '$lib/stores/service.svelte';
	import { cacheFlush } from '$lib/cache';
	import { exportFavoritesData, importFavoritesData } from '$lib/stores/library.svelte';
	import { exportBlacklistData, importBlacklistData } from '$lib/stores/blacklist.svelte';
	import { downloadJson, pickAndReadJson } from '$lib/exportImport';
	import { backend } from '$lib/client';
	import type { StorageStats } from '$lib/types';
	import { formatBytes } from '$lib/format';
	import { locale } from '$lib/stores/locale.svelte';
	import { locales } from '$lib/i18n';
	import { onMount } from 'svelte';
	import Icon from './Icon.svelte';
	import LoginModal from './LoginModal.svelte';

	const s = getSettings();
	const account = $derived(getAccountState());
	const serviceJobs = $derived(getServiceJobs());
	const autoRefresh = $derived(getServiceAutoRefresh());

	let showLoginModal = $state(false);
	let keyInput = $state('');
	let busy = $state(false);
	let message = $state<{ ok: boolean; text: string } | null>(null);

	let downloadsDir = $state('');

	onMount(async () => {
		downloadsDir = await getDownloadsDir();
		await loadStorageStats();
	});

	async function onSaveDownloadsDir() {
		const dir = downloadsDir.trim();
		if (!dir) return;
		try {
			await setDownloadsDir(dir);
			message = { ok: true, text: `Downloads folder set to ${dir}` };
		} catch (e) {
			message = { ok: false, text: String(e) };
		}
	}

	async function onResetDownloadsDir() {
		await resetDownloadsDir();
		downloadsDir = await getDownloadsDir();
		message = { ok: true, text: 'Downloads folder restored to the default.' };
	}

	async function onOpenDownloadsFolder() {
		try {
			await openDownloadsFolder();
		} catch (e) {
			message = { ok: false, text: String(e) };
		}
	}

	async function onSetKey(event: Event) {
		event.preventDefault();
		if (!keyInput.trim()) return;
		busy = true;
		message = null;
		try {
			await setApiKey(keyInput);
			message = { ok: true, text: 'Key accepted and verified.' };
			keyInput = '';
		} catch (e) {
			message = { ok: false, text: String(e) };
		} finally {
			busy = false;
		}
	}

	async function onClearKey() {
		busy = true;
		try {
			await clearApiKey();
			message = { ok: true, text: 'API key removed from this device.' };
		} finally {
			busy = false;
		}
	}

	async function onClearCache() {
		await cacheFlush();
		message = { ok: true, text: 'Local cache cleared. Data will be re-fetched on demand.' };
	}

	function onExportFavorites() {
		downloadJson('nh-reader-favorites.json', exportFavoritesData());
	}

	async function onImportFavorites() {
		try {
			const data = await pickAndReadJson<unknown>();
			importFavoritesData(data);
		} catch {
		}
	}

	function onExportBlacklist() {
		downloadJson('nh-reader-blacklist.json', exportBlacklistData());
	}

	async function onImportBlacklist() {
		try {
			const data = await pickAndReadJson<unknown>();
			importBlacklistData(data);
		} catch {
		}
	}

	async function onToggleAutoRefresh() {
		const current = getServiceAutoRefresh();
		await setServiceAutoRefresh({ ...current, enabled: !current.enabled });
	}

	let storageStats = $state<StorageStats | null>(null);

	async function loadStorageStats() {
		try {
			storageStats = await backend.getStorageStats();
		} catch {
		}
	}

	async function onSetBudget(mb: number) {
		try {
			await backend.setCacheBudget(mb);
			if (storageStats) storageStats.cache_budget_mb = mb;
		} catch {
		}
	}

	async function onClearImageCache() {
		try {
			const count = await backend.clearImageCache();
			message = { ok: true, text: `Cleared ${count} cached images.` };
			await loadStorageStats();
		} catch (e) {
			message = { ok: false, text: String(e) };
		}
	}

	async function onClearQueryCache() {
		try {
			await cacheFlush();
			message = { ok: true, text: 'Cleared response cache.' };
			await loadStorageStats();
		} catch (e) {
			message = { ok: false, text: String(e) };
		}
	}

	async function onOptimizeStorage() {
		try {
			busy = true;
			const res = await backend.optimizeStorage();
			message = { ok: true, text: res };
			await loadStorageStats();
		} catch (e) {
			message = { ok: false, text: String(e) };
		} finally {
			busy = false;
		}
	}
</script>

<div class="settings" data-scope="settings-view">
	<h2>{locale.t('settings.title')}</h2>

	<section class="panel">
		<div class="section-title">
			<Icon name="key" size={16} />
			<h3>{locale.t('settings.apiKey')}</h3>
		</div>

		{#if account.keyStatus.configured}
			<p class="ok">
				{locale.t('account.connected')} <b>{account.user?.username ?? '…'}</b> — key
				<code>{account.keyStatus.prefix}••••••••</code>
			</p>
			<div class="row">
				<button class="btn" onclick={() => (showLoginModal = true)}>
					<Icon name="user" size={14} />
					{locale.t('account.loginTitle')}
				</button>
				<button class="btn btn-danger" onclick={onClearKey} disabled={busy}>
					{locale.t('settings.removeKey')}
				</button>
			</div>
		{:else}
			<p class="faint">
				{locale.t('settings.apiKeyHelp')}
			</p>
			<div class="row" style="margin-bottom: 12px;">
				<button class="btn btn-primary" onclick={() => (showLoginModal = true)}>
					<Icon name="user" size={14} />
					{locale.t('account.loginTitle')}
				</button>
			</div>
			<form class="key-form" onsubmit={onSetKey}>
				<input
					class="input"
					type="password"
					placeholder={locale.t('settings.apiKeyPlaceholder')}
					bind:value={keyInput}
					aria-label={locale.t('settings.apiKey')}
					autocomplete="off"
				/>
				<button class="btn btn-primary" type="submit" disabled={busy || !keyInput.trim()}>
					<Icon name="check" size={14} />
					{busy ? locale.t('settings.verifying') : locale.t('settings.setAndVerify')}
				</button>
			</form>
		{/if}

		{#if message}
			<p class="msg" class:error={!message.ok}>{message.text}</p>
		{/if}
	</section>

	<section class="panel">
		<div class="section-title">
			<Icon name="grid" size={16} />
			<h3>{locale.t('settings.appearance')}</h3>
		</div>

		<div class="row-label">
			<span>{locale.t('settings.density')}</span>
			<div class="seg">
				<button class:on={s.density === 'cozy'} onclick={() => updateSettings({ density: 'cozy' })}>{locale.t('settings.densityCozy')}</button>
				<button class:on={s.density === 'compact'} onclick={() => updateSettings({ density: 'compact' })}>{locale.t('settings.densityCompact')}</button>
			</div>
		</div>

		<div class="row-label">
			<div>
				<span>{locale.t('settings.dynamicScaling')}</span>
				<div class="faint">{locale.t('settings.dynamicScalingDescription')}</div>
			</div>
			<button
				class="switch"
				class:on={s.dynamicScaling}
				onclick={() => updateSettings({ dynamicScaling: !s.dynamicScaling })}
				role="switch"
				aria-checked={s.dynamicScaling}
				aria-label={locale.t('settings.dynamicScaling')}
			>
				<span class="knob"></span>
			</button>
		</div>

		<div class="row-label">
			<div>
				<span>{locale.t('settings.language')}</span>
				<div class="faint">{locale.t('settings.languageDescription')}</div>
			</div>
			<select
				class="input locale-select"
				value={locale.value}
				onchange={(e) => locale.set(e.currentTarget.value)}
				aria-label={locale.t('settings.language')}
			>
				{#each locales as l}
					<option value={l.code}>{l.nativeName} ({l.name})</option>
				{/each}
			</select>
		</div>
	</section>

	<section class="panel">
		<div class="section-title">
			<Icon name="book" size={16} />
			<h3>{locale.t('settings.reader')}</h3>
		</div>

		<div class="row-label">
			<span>{locale.t('settings.fitMode')}</span>
			<div class="seg">
				<button class:on={s.readerFit === 'width'} onclick={() => updateSettings({ readerFit: 'width' })}>{locale.t('settings.fitWidth')}</button>
				<button class:on={s.readerFit === 'height'} onclick={() => updateSettings({ readerFit: 'height' })}>{locale.t('settings.fitHeight')}</button>
				<button class:on={s.readerFit === 'contain'} onclick={() => updateSettings({ readerFit: 'contain' })}>{locale.t('settings.fitContain')}</button>
			</div>
		</div>

		<div class="row-label">
			<span>{locale.t('settings.readerRtl')}</span>
			<button
				class="switch"
				class:on={s.readerRtl}
				onclick={() => updateSettings({ readerRtl: !s.readerRtl })}
				role="switch"
				aria-checked={s.readerRtl}
				aria-label={locale.t('settings.readerRtl')}
			>
				<span class="knob"></span>
			</button>
		</div>
	</section>

	<section class="panel">
		<div class="section-title">
			<Icon name="download" size={16} />
			<h3>{locale.t('settings.downloads')}</h3>
		</div>

		<div class="row-label">
			<div>
				<span>{locale.t('settings.downloadFolder')}</span>
				<div class="faint">{locale.t('settings.downloadFolderDesc')}</div>
			</div>
			<a class="btn" href="/downloads">{locale.t('settings.manageDownloads')}</a>
		</div>

		<input
			class="input dir-input"
			bind:value={downloadsDir}
			placeholder={locale.t('settings.downloadFolderPlaceholder')}
			aria-label={locale.t('settings.downloadFolder')}
		/>
		<div class="btn-group">
			<button class="btn" onclick={onSaveDownloadsDir}>{locale.t('settings.saveFolder')}</button>
			<button class="btn" onclick={onResetDownloadsDir}>{locale.t('settings.useDefault')}</button>
			<button class="btn" onclick={onOpenDownloadsFolder}>{locale.t('settings.openFolder')}</button>
		</div>
	</section>

	<section class="panel">
		<div class="section-title">
			<Icon name="sparkle" size={16} />
			<h3>{locale.t('settings.backgroundServices')}</h3>
		</div>

		<div class="row-label">
			<span>{locale.t('settings.autoRefresh')}</span>
			<button
				class="switch"
				class:on={autoRefresh.enabled}
				onclick={onToggleAutoRefresh}
				role="switch"
				aria-checked={autoRefresh.enabled}
				aria-label={locale.t('settings.autoRefresh')}
			>
				<span class="knob"></span>
			</button>
		</div>
		{#if autoRefresh.enabled}
			<div class="row-label">
				<span>{locale.t('settings.refreshInterval')}</span>
				<div class="seg">
					<button
						class:on={autoRefresh.intervalMinutes === 15}
						onclick={() => setServiceAutoRefresh({ enabled: true, intervalMinutes: 15 })}
					>{locale.t('settings.interval15m')}</button>
					<button
						class:on={autoRefresh.intervalMinutes === 60}
						onclick={() => setServiceAutoRefresh({ enabled: true, intervalMinutes: 60 })}
					>{locale.t('settings.interval1h')}</button>
					<button
						class:on={autoRefresh.intervalMinutes === 1440}
						onclick={() => setServiceAutoRefresh({ enabled: true, intervalMinutes: 1440 })}
					>{locale.t('settings.intervalDaily')}</button>
				</div>
			</div>
		{/if}

		<div class="row">
			<p class="faint">{locale.t('settings.runTasksOnDemand')}</p>
			<div class="btn-group">
				<button class="btn" onclick={() => enqueueSync()}>{locale.t('settings.syncAccount')}</button>
				<button class="btn" onclick={() => enqueueMaintenance()}>{locale.t('settings.runMaintenance')}</button>
			</div>
		</div>

		{#if serviceJobs.length > 0}
			<div class="jobs">
				<h4>{locale.t('settings.recentJobs')}</h4>
				<ul>
					{#each serviceJobs as job}
						<li class:job-failed={job.state === 'failed'}>
							<span class="job-kind">{serviceKindLabel(job.kind)}</span>
							<span class="job-state" class:done={job.state === 'finished'} class:err={job.state === 'failed'}>
								{job.state}
							</span>
							{#if job.state === 'running' && job.done !== undefined}
								<span class="job-progress">
									{job.done}{#if job.total} / {job.total}{/if}
								</span>
							{/if}
							<span class="job-note">
								{job.error ?? job.message ?? job.label ?? ''}
							</span>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</section>

	<section class="panel">
		<div class="section-title">
			<Icon name="settings" size={16} />
			<h3>{locale.t('settings.data')}</h3>
		</div>
		<div class="row">
			<p class="faint">{locale.t('settings.dataDesc')}</p>
			<button class="btn" onclick={onClearCache}>{locale.t('settings.clearCache')}</button>
		</div>
		<div class="row">
			<div class="btn-group">
				<button class="btn" onclick={onExportFavorites}>{locale.t('settings.exportFavorites')}</button>
				<button class="btn" onclick={onImportFavorites}>{locale.t('settings.importFavorites')}</button>
				<button class="btn" onclick={onExportBlacklist}>{locale.t('settings.exportBlacklist')}</button>
				<button class="btn" onclick={onImportBlacklist}>{locale.t('settings.importBlacklist')}</button>
			</div>
		</div>
	</section>

	<section class="panel">
		<div class="section-title">
			<Icon name="image" size={16} />
			<h3>{locale.t('settings.cacheManagement')}</h3>
		</div>

		{#if storageStats}
			<div class="row-label">
				<span>{locale.t('settings.imageCache')}</span>
				<b>{formatBytes(storageStats.image_cache_bytes)} ({storageStats.image_cache_files} {locale.t('settings.files')})</b>
			</div>
			<div class="row-label">
				<span>{locale.t('settings.responseCache')}</span>
				<b>{storageStats.db_cache_entries} {locale.t('settings.entries')}</b>
			</div>
			<div class="row-label">
				<span>{locale.t('settings.databaseStorage')}</span>
				<b>{formatBytes(storageStats.db_size_bytes)}</b>
			</div>

			<div class="row-label">
				<span>{locale.t('settings.cacheBudget')}</span>
				<div class="seg">
					<button class:on={storageStats.cache_budget_mb === 500} onclick={() => onSetBudget(500)}>
						{locale.t('settings.budget500mb')}
					</button>
					<button class:on={storageStats.cache_budget_mb === 1024} onclick={() => onSetBudget(1024)}>
						{locale.t('settings.budget1gb')}
					</button>
					<button class:on={storageStats.cache_budget_mb === 2048} onclick={() => onSetBudget(2048)}>
						{locale.t('settings.budget2gb')}
					</button>
					<button class:on={storageStats.cache_budget_mb === 5120} onclick={() => onSetBudget(5120)}>
						{locale.t('settings.budget5gb')}
					</button>
					<button class:on={storageStats.cache_budget_mb === 0} onclick={() => onSetBudget(0)}>
						{locale.t('settings.budgetUnlimited')}
					</button>
				</div>
			</div>

			<div class="row">
				<div class="btn-group">
					<button class="btn" onclick={onClearImageCache}>{locale.t('settings.clearImageCache')}</button>
					<button class="btn" onclick={onClearQueryCache}>{locale.t('settings.clearQueryCache')}</button>
					<button class="btn" onclick={onOptimizeStorage} disabled={busy}>
						{busy ? locale.t('settings.optimizing') : locale.t('settings.optimizeStorage')}
					</button>
				</div>
			</div>
		{/if}
	</section>

	<section class="panel">
		<div class="section-title">
			<Icon name="auto" size={16} />
			<h3>{locale.t('settings.mobileSupport')}</h3>
		</div>
		<p class="faint">{locale.t('settings.mobileSupportDesc')}</p>
		<div class="disclaimer-box">
			<div class="disclaimer-header">
				<Icon name="alert" size={16} />
				<b>{locale.t('settings.iosDisclaimerTitle')}</b>
			</div>
			<p class="disclaimer-text">{locale.t('settings.iosDisclaimerText')}</p>
		</div>
	</section>

</div>

<LoginModal bind:open={showLoginModal} />
