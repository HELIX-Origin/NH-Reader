<script lang="ts">
	let { label = 'Loading…' }: { label?: string } = $props();
</script>

<div class="loader" data-scope="loader" role="status">
	<div class="spinner"></div>
	<span class="faint">{label}</span>
</div>
