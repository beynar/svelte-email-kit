<script lang="ts">
	import { Section, Hr, Text, Link } from '$lib/index.js';
	import { acme, type Brand } from './brand.js';

	// Defaults to the `acme` brand, so templates can use `<Footer />` directly.
	// The unsubscribe link comes from `brand.unsubscribeUrl`.
	let { brand = acme }: { brand?: Brand } = $props();
</script>

<Hr class="mx-8 my-6" />
<Section class="px-8 pb-8">
	<Text class="m-0 text-xs leading-5 text-neutral-500">{brand.address}</Text>
	<Text class="mt-2 mb-0 text-xs leading-5 text-neutral-500">
		{#if brand.unsubscribeUrl}<Link href={brand.unsubscribeUrl} class="text-neutral-500 underline"
				>Unsubscribe</Link
			> ·
		{/if}<Link href={brand.url} class="text-neutral-500 underline">{brand.name}</Link>
	</Text>
</Section>
