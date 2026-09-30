<script lang="ts">
	import Icon from './Icon.svelte';

	let { icon = 'image', title, description }: { icon?: string; title: string; description?: string } =
		$props();
</script>

<div class="empty" data-scope="empty-state">
	<span class="icon"><Icon name={icon} size={20} /></span>
	<h3>{title}</h3>
	{#if description}
		<p class="faint">{description}</p>
	{/if}
</div>
