<script lang="ts">
	import { getHistory } from '$lib/stores/library.svelte';
	import HistoryView from '$lib/components/HistoryView.svelte';
</script>

<div class="page" data-scope="page-history">
	<HistoryView entries={getHistory()} />
</div>