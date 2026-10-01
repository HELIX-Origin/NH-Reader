<script lang="ts">
	import { SORT_OPTIONS } from '$lib/query';
	import type { FilterModel, TagRef } from '$lib/types';
	import Icon from './Icon.svelte';
	import TagChip from './TagChip.svelte';
	import { locale } from '$lib/stores/locale.svelte';

	let {
		model,
		onupdate,
	}: {
		model: FilterModel;
		onupdate: (m: FilterModel) => void;
	} = $props();

	const LANGUAGES = [
		'english',
		'japanese',
		'chinese',
		'vietnamese',
		'korean',
		'spanish',
		'french',
		'german',
		'italian',
		'portuguese',
		'russian',
		'polish',
		'other',
	];

	const CATEGORIES = [
		'doujinshi',
		'manga',
		'artistcg',
		'gamecg',
		'western',
		'non-h',
		'imageset',
		'cosplay',
		'asianporn',
		'misc',
	];

	let newTagName = $state('');
	let newTagType = $state('tag');

	function update(m: FilterModel) {
		onupdate(m);
	}

	function removeTag(tags: TagRef[], ref: TagRef): TagRef[] {
		return tags.filter((t) => !(t.name === ref.name && t.type === ref.type));
	}

	function addTag(excluded: boolean) {
		const name = newTagName.trim();
		if (!name) return;
		const ref: TagRef = { id: 0, name, type: newTagType, slug: name.toLowerCase().replace(/\s+/g, '-') };
		if (excluded) {
			update({ ...model, excluded: [...model.excluded, ref] });
		} else {
			update({ ...model, included: [...model.included, ref] });
		}
		newTagName = '';
	}

	function reset() {
		onupdate({
			query: model.query,
			included: [],
			excluded: [],
			language: undefined,
			category: undefined,
			minPages: undefined,
			maxPages: undefined,
			sort: 'date',
		});
	}
</script>

<div class="filters" data-scope="filter-panel">
	<section class="group">
		<h4>{locale.t('filter.sort')}</h4>
		<div class="seg">
			{#each SORT_OPTIONS as opt}
				<button class:on={model.sort === opt.value} onclick={() => update({ ...model, sort: opt.value })}>
					{opt.label}
				</button>
			{/each}
		</div>
	</section>

	{#if model.included.length > 0}
		<section class="group">
			<h4>{locale.t('filter.includedTags')}</h4>
			<div class="chips">
				{#each model.included as t}
					<TagChip name={t.name} type={t.type} active onclick={() => update({ ...model, included: removeTag(model.included, t) })} />
				{/each}
			</div>
		</section>
	{/if}

	{#if model.excluded.length > 0}
		<section class="group">
			<h4>{locale.t('filter.excludedTags')}</h4>
			<div class="chips">
				{#each model.excluded as t}
					<TagChip name={t.name} type={t.type} onclick={() => update({ ...model, excluded: removeTag(model.excluded, t) })} />
				{/each}
			</div>
		</section>
	{/if}

	<section class="group">
		<h4>{locale.t('filter.addTagFilter')}</h4>
		<div class="add-row">
			<input class="input" placeholder={locale.t('filter.tagNamePlaceholder')} bind:value={newTagName} aria-label={locale.t('filter.addTagFilter')} />
			<select class="select type" bind:value={newTagType} aria-label={locale.t('filter.tagType')}>
				<option value="tag">Tag</option>
				<option value="artist">Artist</option>
				<option value="character">Character</option>
				<option value="parody">Parody</option>
				<option value="group">Group</option>
				<option value="language">Language</option>
				<option value="category">Category</option>
			</select>
		</div>
		<div class="add-actions">
			<button class="btn" onclick={() => addTag(false)} disabled={!newTagName.trim()}>
				<Icon name="plus" size={14} />
				{locale.t('filter.include')}
			</button>
			<button class="btn" onclick={() => addTag(true)} disabled={!newTagName.trim()}>
				<Icon name="minus" size={14} />
				{locale.t('filter.exclude')}
			</button>
		</div>
	</section>

	<section class="group">
		<h4>{locale.t('filter.language')}</h4>
		<select class="select" value={model.language ?? ''} onchange={(e) => update({ ...model, language: e.currentTarget.value || undefined })}>
			<option value="">{locale.t('filter.any')}</option>
			{#each LANGUAGES as lang}
				<option value={lang} selected={model.language === lang}>{lang}</option>
			{/each}
		</select>
	</section>

	<section class="group">
		<h4>{locale.t('filter.category')}</h4>
		<select class="select" value={model.category ?? ''} onchange={(e) => update({ ...model, category: e.currentTarget.value || undefined })}>
			<option value="">{locale.t('filter.any')}</option>
			{#each CATEGORIES as cat}
				<option value={cat} selected={model.category === cat}>{cat}</option>
			{/each}
		</select>
	</section>

	<section class="group row-group">
		<h4>{locale.t('filter.pageCount')}</h4>
		<div class="range-row">
			<input
				class="input"
				type="number"
				placeholder={locale.t('filter.min')}
				min="1"
				value={model.minPages ?? ''}
				oninput={(e) => update({ ...model, minPages: e.currentTarget.value ? Number(e.currentTarget.value) : undefined })}
				aria-label={locale.t('filter.min')}
			/>
			<span class="faint">{locale.t('filter.to')}</span>
			<input
				class="input"
				type="number"
				placeholder={locale.t('filter.max')}
				min="1"
				value={model.maxPages ?? ''}
				oninput={(e) => update({ ...model, maxPages: e.currentTarget.value ? Number(e.currentTarget.value) : undefined })}
				aria-label={locale.t('filter.max')}
			/>
		</div>
	</section>

	<div class="foot">
		<button class="btn btn-ghost faint" onclick={reset}>{locale.t('filter.reset')}</button>
	</div>
</div>
