<script lang="ts">
	let { name, type = 'tag', active = false, disabled = false, onclick }: {
		name: string;
		type?: string;
		active?: boolean;
		disabled?: boolean;
		onclick?: (e: MouseEvent) => void;
	} = $props();
</script>

{#if onclick}
	<button
		class="chip"
		data-scope="tag-chip"
		class:active
		class:disabled
		data-type={type}
		onclick={onclick}
		type="button"
	>
		<span class="dot" aria-hidden="true"></span>
		{name}
	</button>
{:else}
	<span class="chip" data-scope="tag-chip" class:active data-type={type}>
		<span class="dot" aria-hidden="true"></span>
	</span>
{/if}
