<script lang="ts">
	import Icon from './Icon.svelte';
	import { locale } from '$lib/stores/locale.svelte';

	let { page, numPages, ongoto }: { page: number; numPages: number; ongoto: (p: number) => void } =
		$props();

	const atStart = $derived(page <= 1);
	const atEnd = $derived(page >= numPages);
</script>

<nav class="pager" data-scope="pager" aria-label="Pagination">
	<button class="btn" disabled={atStart} onclick={() => ongoto(page - 1)}>
		<Icon name="chevron-left" size={15} />
		{locale.t('common.prev')}
	</button>
	<span class="page-info">
		{locale.t('common.page')} <b>{page}</b> {locale.t('common.of')} <b>{numPages > 0 ? numPages : 1}</b>
	</span>
	<button class="btn" disabled={atEnd} onclick={() => ongoto(page + 1)}>
		{locale.t('common.next')}
		<Icon name="chevron-right" size={15} />
	</button>
</nav>
