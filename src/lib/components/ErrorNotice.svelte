<script lang="ts">
	import Icon from './Icon.svelte';

	let { message, onretry }: { message: string; onretry?: () => void } = $props();
</script>

<div class="error" data-scope="error-notice" role="alert">
	<div class="row">
		<Icon name="alert" size={16} />
		<div class="body">
			<span class="title">Something went wrong</span>
			<span class="faint">{message}</span>
		</div>
	</div>
	{#if onretry}
		<button class="btn" onclick={onretry}>Retry</button>
	{/if}
</div>
