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
	import { locale } from '$lib/stores/locale.svelte';
	import { locales } from '$lib/i18n';
	import { onMount } from 'svelte';
	import Icon from './Icon.svelte';

	const s = getSettings();
	const account = $derived(getAccountState());
	const serviceJobs = $derived(getServiceJobs());
	const autoRefresh = $derived(getServiceAutoRefresh());

	let keyInput = $state('');
	let busy = $state(false);
	let message = $state<{ ok: boolean; text: string } | null>(null);

	let downloadsDir = $state('');

	onMount(async () => {
		downloadsDir = await getDownloadsDir();
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

	async function onToggleAutoRefresh() {
		const current = getServiceAutoRefresh();
		await setServiceAutoRefresh({ ...current, enabled: !current.enabled });
	}
</script>

<div class="settings" data-scope="settings-view">
	<h2>Settings</h2>

	<section class="panel">
		<div class="section-title">
			<Icon name="key" size={16} />
			<h3>nhentai account</h3>
		</div>

		{#if account.keyStatus.configured}
			<p class="ok">
				Connected as <b>{account.user?.username ?? '…'}</b> — key
				<code>{account.keyStatus.prefix}••••••••</code>
			</p>
			<div class="row">
				<button class="btn btn-danger" onclick={onClearKey} disabled={busy}>
					Remove key from this device
				</button>
			</div>
		{:else}
			<p class="faint">
				Generate an API key in your
				<a class="link" href="https://nhentai.net/user/settings#apikeys" rel="noreferrer" onclick={(e) => { e.preventDefault(); import('@tauri-apps/plugin-opener').then(({ openUrl }) => openUrl('https://nhentai.net/user/settings#apikeys')); }}>
					nhentai account settings
				</a>.
				The key is stored encrypted-ish in the app database and never leaves the device unencrypted — only your key status is shown in the UI.
			</p>
			<form class="key-form" onsubmit={onSetKey}>
				<input
					class="input"
					type="password"
					placeholder="Paste your nhentai API key"
					bind:value={keyInput}
					aria-label="nhentai API key"
					autocomplete="off"
				/>
				<button class="btn btn-primary" type="submit" disabled={busy || !keyInput.trim()}>
					<Icon name="check" size={14} />
					{busy ? 'Verifying…' : 'Set & verify'}
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
			<h3>Appearance</h3>
		</div>

		<div class="row-label">
			<span>Grid density</span>
			<div class="seg">
				<button class:on={s.density === 'cozy'} onclick={() => updateSettings({ density: 'cozy' })}>Cozy</button>
				<button class:on={s.density === 'compact'} onclick={() => updateSettings({ density: 'compact' })}>Compact</button>
			</div>
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
			<h3>Reader</h3>
		</div>

		<div class="row-label">
			<span>Fit mode</span>
			<div class="seg">
				<button class:on={s.readerFit === 'width'} onclick={() => updateSettings({ readerFit: 'width' })}>Width</button>
				<button class:on={s.readerFit === 'height'} onclick={() => updateSettings({ readerFit: 'height' })}>Height</button>
				<button class:on={s.readerFit === 'contain'} onclick={() => updateSettings({ readerFit: 'contain' })}>Fit</button>
			</div>
		</div>

		<div class="row-label">
			<span>Right-to-left (manga order)</span>
			<button
				class="switch"
				class:on={s.readerRtl}
				onclick={() => updateSettings({ readerRtl: !s.readerRtl })}
				role="switch"
				aria-checked={s.readerRtl}
				aria-label="Right-to-left reading order"
			>
				<span class="knob"></span>
			</button>
		</div>
	</section>

	<section class="panel">
		<div class="section-title">
			<Icon name="download" size={16} />
			<h3>Downloads</h3>
		</div>

		<div class="row-label">
			<div>
				<span>Download folder</span>
				<div class="faint">Galleries are saved here as ZIP / CBZ archives.</div>
			</div>
			<a class="btn" href="/downloads">Manage downloads</a>
		</div>

		<input
			class="input dir-input"
			bind:value={downloadsDir}
			placeholder="Leave blank for the default (Documents/NH Desktop/downloads)"
			aria-label="Downloads folder"
		/>
		<div class="btn-group">
			<button class="btn" onclick={onSaveDownloadsDir}>Save folder</button>
			<button class="btn" onclick={onResetDownloadsDir}>Use default</button>
			<button class="btn" onclick={onOpenDownloadsFolder}>Open folder</button>
		</div>
	</section>

	<section class="panel">
		<div class="section-title">
			<Icon name="sparkle" size={16} />
			<h3>Background services</h3>
		</div>

		<div class="row-label">
			<span>Auto-refresh popular gallery list</span>
			<button
				class="switch"
				class:on={autoRefresh.enabled}
				onclick={onToggleAutoRefresh}
				role="switch"
				aria-checked={autoRefresh.enabled}
				aria-label="Auto-refresh popular gallery list"
			>
				<span class="knob"></span>
			</button>
		</div>
		{#if autoRefresh.enabled}
			<div class="row-label">
				<span>Refresh interval</span>
				<div class="seg">
					<button
						class:on={autoRefresh.intervalMinutes === 15}
						onclick={() => setServiceAutoRefresh({ enabled: true, intervalMinutes: 15 })}
					>15 min</button>
					<button
						class:on={autoRefresh.intervalMinutes === 60}
						onclick={() => setServiceAutoRefresh({ enabled: true, intervalMinutes: 60 })}
					>1 hour</button>
					<button
						class:on={autoRefresh.intervalMinutes === 1440}
						onclick={() => setServiceAutoRefresh({ enabled: true, intervalMinutes: 1440 })}
					>Daily</button>
				</div>
			</div>
		{/if}

		<div class="row">
			<p class="faint">Run scheduled tasks on demand.</p>
			<div class="btn-group">
				<button class="btn" onclick={() => enqueueSync()}>Sync account</button>
				<button class="btn" onclick={() => enqueueMaintenance()}>Run maintenance</button>
			</div>
		</div>

		{#if serviceJobs.length > 0}
			<div class="jobs">
				<h4>Recent jobs</h4>
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
			<h3>Data</h3>
		</div>
		<div class="row">
			<p class="faint">Your favorites, history, blacklist and API key live in the app's local database.</p>
			<button class="btn" onclick={onClearCache}>Clear cached responses</button>
		</div>
	</section>
</div>
