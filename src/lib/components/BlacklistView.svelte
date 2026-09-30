<script lang="ts">
	import { getSettings, updateSettings } from '$lib/stores/settings.svelte';
	import {
		getBlacklist,
		addTag,
		removeEntry,
		removeByRef,
		clearBlacklist,
	} from '$lib/stores/blacklist.svelte';
	import {
		getAccountState,
		addAccountBlacklist,
		removeAccountBlacklist,
	} from '$lib/stores/account.svelte';
	import { api } from '$lib/api';
	import Icon from './Icon.svelte';
	import EmptyState from './EmptyState.svelte';
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
</script>

<div class="blacklist" data-scope="blacklist-view">
	<div class="head">
		<h2>Blacklist</h2>
		<span class="count faint">{entries.length} blocked</span>
	</div>

	<section class="panel">
		<div class="panel-row">
			<div>
				<div class="row-title">Master switch</div>
				<p class="faint">Applies blacklisted tags everywhere — searches and browse views.</p>
			</div>
			<button
				class="switch"
				class:on={s.blacklistEnabled}
				onclick={() => updateSettings({ blacklistEnabled: !s.blacklistEnabled })}
				role="switch"
				aria-checked={s.blacklistEnabled}
				aria-label="Toggle blacklist"
			>
				<span class="knob"></span>
			</button>
		</div>

		<div class="panel-row">
			<div>
				<div class="row-title">Treatment</div>
				<p class="faint">Hide blocked galleries entirely, or keep the grid intact and blur them.</p>
			</div>
			<select class="select" value={s.blacklistMode} onchange={(e) => updateSettings({ blacklistMode: e.currentTarget.value as 'hide' | 'blur' })}>
				<option value="hide">Hide</option>
				<option value="blur">Blur</option>
			</select>
		</div>
	</section>

	<section class="panel">
		<div class="row-title">Pick tags to block</div>
		<p class="faint">Choose from popular {pickerType}s — tap + to add, − to remove.</p>

		<div class="type-tabs" role="tablist" aria-label="Tag type">
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
			<p class="faint picker-loading">Loading options…</p>
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
					Prev
				</button>
				<span class="faint">Page {pickerPage} of {options.num_pages}</span>
				<button class="btn" onclick={() => (pickerPage += 1)} disabled={pickerPage >= options.num_pages}>
					Next
					<Icon name="chevron-right" size={14} />
				</button>
			</div>
		{/if}
	</section>

	<section class="panel">
		<div class="row-title">Blocked</div>
		{#if entries.length === 0}
			<EmptyState
				icon="shield"
				title="Nothing blocked yet"
				description="Pick tags above — they'll be excluded from results and hidden or blurred in grids."
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
						<button class="icon-btn" onclick={() => onRemove(i)} aria-label={`Unblock ${e.name}`}>
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
					<div class="row-title">Sync with nhentai account</div>
					<p class="faint">
						Push your local blacklist to <b>{account.user?.username ?? 'your account'}</b> so
						searches on the site respect it too.
					</p>
					{#if syncMessage}
						<p class="sync" class:error={syncMessage.startsWith('Sync failed')}>{syncMessage}</p>
					{/if}
				</div>
			</div>
			<button class="btn" onclick={onSyncToAccount} disabled={syncing || entries.length === 0}>
				<Icon name="user" size={14} />
				{syncing ? 'Syncing…' : `Sync ${entries.filter((e) => e.id > 0).length} to account`}
			</button>
		</section>
	{/if}

	{#if entries.length > 0}
		<div class="foot">
			<button class="btn btn-danger" onclick={clearBlacklist}>
				<Icon name="close" size={14} />
				Clear all blocked tags
			</button>
		</div>
	{/if}
</div>
