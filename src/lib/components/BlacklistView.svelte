<script lang="ts">
	import { getSettings, updateSettings } from '$lib/stores/settings.svelte';
	import {
		getBlacklist,
		addTag,
		removeEntry,
		removeByRef,
		clearBlacklist,
		exportBlacklistData,
		importBlacklistData,
	} from '$lib/stores/blacklist.svelte';
	import { downloadJson, pickAndReadJson } from '$lib/exportImport';
	import {
		getAccountState,
		addAccountBlacklist,
		removeAccountBlacklist,
	} from '$lib/stores/account.svelte';
	import { api } from '$lib/api';
	import Icon from './Icon.svelte';
	import EmptyState from './EmptyState.svelte';
	import { locale } from '$lib/stores/locale.svelte';
	import type { Paginated, Tag } from '$lib/types';

	const s = getSettings();
	const entries = $derived(getBlacklist());
	const account = $derived(getAccountState());

	const TYPES = [
		{ value: 'tag', label: 'Tag' },
		{ value: 'artist', label: 'Artist' },
		{ value: 'character', label: 'Character' },
		{ value: 'parody', label: 'Parody' },
		{ value: 'group', label: 'Group' },
		{ value: 'language', label: 'Language' },
		{ value: 'category', label: 'Category' },
	];

	let pickerType = $state('tag');
	let pickerPage = $state(1);
	let options = $state<Paginated<Tag> | null>(null);
	let pickerLoading = $state(false);
	let pickerError = $state<string | null>(null);
	let syncing = $state(false);
	let syncMessage = $state<string | null>(null);

	$effect(() => {
		const type = pickerType;
		const page = pickerPage;
		let cancelled = false;
		pickerLoading = true;
		pickerError = null;
		options = null;
		api
			.tagsByType(type, 'popular', page, 24)
			.then((res) => {
				if (!cancelled) options = res;
			})
			.catch((e) => {
				if (!cancelled) pickerError = String(e);
			})
			.finally(() => {
				if (!cancelled) pickerLoading = false;
			});
		return () => {
			cancelled = true;
		};
	});

	function changeType(type: string) {
		pickerType = type;
		pickerPage = 1;
	}

	function isBlocked(tag: Tag): boolean {
		return entries.some((e) => e.name === tag.name && e.type === tag.type);
	}

	function onToggle(tag: Tag) {
		if (isBlocked(tag)) {
			removeByRef({ id: tag.id, name: tag.name, type: tag.type, slug: tag.slug });
		} else {
			addTag(tag);
		}
	}

	async function onSyncToAccount() {
		syncing = true;
		syncMessage = null;
		try {
			const ids = entries.filter((e) => e.id > 0).map((e) => e.id);
			if (ids.length > 0) await addAccountBlacklist(ids);
			syncMessage = `Synced ${ids.length} tag(s) to your nhentai account.`;
		} catch (e) {
			syncMessage = `Sync failed: ${String(e)}`;
		} finally {
			syncing = false;
		}
	}

	async function onRemove(index: number) {
		const entry = entries[index];
		removeEntry(index);
		if (account.keyStatus.configured && entry.id > 0) {
			try {
				await removeAccountBlacklist([entry.id]);
			} catch {
			}
		}
	}

	function onExport() {
		downloadJson('nh-reader-blacklist.json', exportBlacklistData());
	}

	async function onImport() {
		try {
			const data = await pickAndReadJson<unknown>();
			importBlacklistData(data);
		} catch {
		}
	}
</script>

<div class="blacklist" data-scope="blacklist-view">
	<div class="head">
		<h2>{locale.t('blacklist.title')}</h2>
		<span class="count faint">{entries.length} {locale.t('blacklist.blockedCount')}</span>
	</div>

	<section class="panel">
		<div class="panel-row">
			<div>
				<div class="row-title">{locale.t('blacklist.masterSwitch')}</div>
				<p class="faint">{locale.t('blacklist.masterSwitchDesc')}</p>
			</div>
			<button
				class="switch"
				class:on={s.blacklistEnabled}
				onclick={() => updateSettings({ blacklistEnabled: !s.blacklistEnabled })}
				role="switch"
				aria-checked={s.blacklistEnabled}
				aria-label={locale.t('blacklist.toggleBlacklist')}
			>
				<span class="knob"></span>
			</button>
		</div>

		<div class="panel-row">
			<div>
				<div class="row-title">{locale.t('blacklist.treatment')}</div>
				<p class="faint">{locale.t('blacklist.treatmentDesc')}</p>
			</div>
			<select class="select" value={s.blacklistMode} onchange={(e) => updateSettings({ blacklistMode: e.currentTarget.value as 'hide' | 'blur' })}>
				<option value="hide">{locale.t('blacklist.hide')}</option>
				<option value="blur">{locale.t('blacklist.blur')}</option>
			</select>
		</div>
	</section>

	<section class="panel">
		<div class="row-title">{locale.t('blacklist.pickTags')}</div>
		<p class="faint">{locale.t('blacklist.pickTagsDesc')}</p>

		<div class="type-tabs" role="tablist" aria-label={locale.t('blacklist.tagType')}>
			{#each TYPES as t (t.value)}
				<button
					class="type-tab"
					class:on={pickerType === t.value}
					role="tab"
					aria-selected={pickerType === t.value}
					onclick={() => changeType(t.value)}
				>
					{t.label}
				</button>
			{/each}
		</div>

		{#if pickerError}
			<p class="picker-error">{pickerError}</p>
		{:else if pickerLoading}
			<p class="faint picker-loading">{locale.t('blacklist.loadingOptions')}</p>
		{:else if options}
			<ul class="options">
				{#each options.result as tag (tag.id)}
					<button
						class="option-pill"
						class:blocked={isBlocked(tag)}
						onclick={() => onToggle(tag)}
						aria-pressed={isBlocked(tag)}
					>
						<span class="dot" data-type={pickerType}></span>
						<span class="opt-name">{tag.name}</span>
						<span class="opt-count">{tag.count.toLocaleString()}</span>
						<span class="opt-action">
							{#if isBlocked(tag)}
								<Icon name="minus" size={13} />
							{:else}
								<Icon name="plus" size={13} />
							{/if}
						</span>
					</button>
				{/each}
			</ul>

			<div class="pager">
				<button class="btn" onclick={() => (pickerPage -= 1)} disabled={pickerPage <= 1}>
					<Icon name="chevron-left" size={14} />
					{locale.t('blacklist.prev')}
				</button>
				<span class="faint">{locale.t('common.page')} {pickerPage} {locale.t('common.of')} {options.num_pages}</span>
				<button class="btn" onclick={() => (pickerPage += 1)} disabled={pickerPage >= options.num_pages}>
					{locale.t('blacklist.next')}
					<Icon name="chevron-right" size={14} />
				</button>
			</div>
		{/if}
	</section>

	<section class="panel">
		<div class="row-title">{locale.t('blacklist.blocked')}</div>
		{#if entries.length === 0}
			<EmptyState
				icon="shield"
				title={locale.t('blacklist.emptyTitle')}
				description={locale.t('blacklist.emptyDesc')}
			/>
		{:else}
			<ul class="list">
				{#each entries as e, i (i)}
					<li>
						<span class="entry">
							<span class="type-pill">{e.type}</span>
							<span class="name">{e.name}</span>
							{#if e.count}
								<span class="count-chip faint">{e.count}</span>
							{/if}
						</span>
						<button class="icon-btn" onclick={() => onRemove(i)} aria-label={`${locale.t('blacklist.unblock')} ${e.name}`}>
							<Icon name="close" size={14} />
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	{#if account.keyStatus.configured}
		<section class="panel account">
			<div class="panel-row">
				<div>
					<div class="row-title">{locale.t('blacklist.syncAccount')}</div>
					<p class="faint">
						{locale.t('blacklist.syncAccountDesc')}
					</p>
					{#if syncMessage}
						<p class="sync" class:error={syncMessage.startsWith('Sync failed')}>{syncMessage}</p>
					{/if}
				</div>
			</div>
			<button class="btn" onclick={onSyncToAccount} disabled={syncing || entries.length === 0}>
				<Icon name="user" size={14} />
				{syncing ? locale.t('blacklist.syncing') : `${locale.t('blacklist.syncButton')} (${entries.filter((e) => e.id > 0).length})`}
			</button>
		</section>
	{/if}

	<div class="foot">
		<div class="btn-group">
			<button class="btn btn-ghost" onclick={onExport} title={locale.t('blacklist.export')}>
				<Icon name="download" size={14} />
				{locale.t('blacklist.export')}
			</button>
			<button class="btn btn-ghost" onclick={onImport} title={locale.t('blacklist.import')}>
				<Icon name="upload" size={14} />
				{locale.t('blacklist.import')}
			</button>
			{#if entries.length > 0}
				<button class="btn btn-danger" onclick={clearBlacklist}>
					<Icon name="close" size={14} />
					{locale.t('blacklist.clearAll')}
				</button>
			{/if}
		</div>
	</div>
</div>
