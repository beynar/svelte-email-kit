<script lang="ts">
	import { Button } from '$lib/index.js';
	import type { Snippet } from 'svelte';

	let {
		href,
		variant = 'primary',
		children
	}: { href: string; variant?: 'primary' | 'secondary'; children: Snippet } = $props();
</script>

{#if variant === 'secondary'}
	<Button
		{href}
		class="inline-block rounded-lg border border-neutral-200 bg-white px-6 py-3 text-base font-semibold text-neutral-900"
	>
		{@render children()}
	</Button>
{:else}
	<Button
		{href}
		class="inline-block rounded-lg bg-neutral-900 px-6 py-3 text-base font-semibold text-white"
	>
		{@render children()}
	</Button>
{/if}
