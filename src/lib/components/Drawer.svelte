<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';

	let {
		open,
		title,
		width = 380,
		onclose,
		children,
	}: {
		open: boolean;
		title: string;
		width?: number;
		onclose: () => void;
		children: Snippet;
	} = $props();

	$effect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onclose();
		};
		window.addEventListener('keydown', onKey);
		const prev = document.documentElement.style.overflow;
		document.documentElement.style.overflow = 'hidden';
		return () => {
			window.removeEventListener('keydown', onKey);
			document.documentElement.style.overflow = prev;
		};
	});
</script>

{#if open}
	<button type="button" class="backdrop" data-scope="drawer" onclick={onclose} aria-label="Close drawer"></button>
	<div class="panel" data-scope="drawer" style={`width:${width}px`} role="dialog" aria-modal="true" aria-label={title}>
		<header class="head">
			<h3>{title}</h3>
			<button class="icon-btn" onclick={onclose} aria-label="Close">
				<Icon name="close" size={16} />
			</button>
		</header>
		<div class="body">
			{@render children()}
		</div>
	</div>
{/if}
