<script lang="ts">
	import { Section, Heading, Text } from '$lib/index.js';
	import Layout from '../_shared/Layout.svelte';
	import Btn from '../_shared/Btn.svelte';
	import { acme, type Brand } from '../_shared/brand.js';

	let {
		headline = 'Summer sale: 25% off everything',
		discount = '25% OFF',
		code = 'SUMMER25',
		expiresAt = 'June 30, 2026',
		shopUrl = 'https://acme.com/shop',
		brand = acme
	}: {
		headline?: string;
		discount?: string;
		code?: string;
		expiresAt?: string;
		shopUrl?: string;
		brand?: Brand;
	} = $props();
</script>

<Layout preview={`${discount} sitewide at ${brand.name} — use code ${code}.`}>
	<Section class="px-8 pb-2">
		<Heading as="h1" class="m-0 text-2xl font-bold text-neutral-900">{headline}</Heading>
		<Text class="mt-3 text-base leading-6 text-neutral-500">
			Treat yourself to {discount} on everything at {brand.name}. Apply your code at checkout and
			the savings are yours.
		</Text>
	</Section>
	<Section class="px-8 py-6 text-center">
		<Section class="rounded-xl border border-neutral-200 py-5">
			<Text class="m-0 text-2xl font-bold tracking-widest text-neutral-900 text-center">{code}</Text
			>
			<Text class="mt-2 mb-0 text-sm leading-5 text-neutral-500 text-center"
				>Use code at checkout</Text
			>
		</Section>
	</Section>
	<Section class="px-8 py-6 text-center">
		<Btn href={shopUrl}>Shop now</Btn>
	</Section>
	<Section class="px-8 pb-2">
		<Text class="m-0 text-sm leading-5 text-neutral-500">Offer ends {expiresAt}. Terms apply.</Text>
	</Section>
</Layout>
