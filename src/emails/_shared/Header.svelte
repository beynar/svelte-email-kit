<script lang="ts">
	import { Section, Img, Text } from '$lib/index.js';
	import { acme, type Brand } from './brand.js';

	// Defaults to the `acme` brand, so templates can use `<Header />` directly.
	let { brand = acme }: { brand?: Brand } = $props();
</script>

<Section class="px-8 pt-8 pb-4">
	{#if brand.logoUrl}
		<Img
			src={brand.logoUrl}
			alt={brand.name}
			width={brand.logoWidth ?? 40}
			height={brand.logoHeight ?? 40}
		/>
	{:else}
		<Text class="m-0 text-xl font-bold text-neutral-900">{brand.name}</Text>
	{/if}
</Section>
