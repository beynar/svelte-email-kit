<script lang="ts">
	import { Section, Heading, Text } from '$lib/index.js';
	import Layout from '../_shared/Layout.svelte';
	import Btn from '../_shared/Btn.svelte';
	import { acme, sampleOrder, type Brand, type LineItem } from '../_shared/brand.js';

	let {
		orderNumber = sampleOrder.number,
		items = sampleOrder.items,
		returnLabelUrl = 'https://acme.com/returns/AC-100482/label.pdf',
		dropoffBy = 'June 28, 2026',
		brand = acme
	}: {
		orderNumber?: string;
		items?: LineItem[];
		returnLabelUrl?: string;
		dropoffBy?: string;
		brand?: Brand;
	} = $props();
</script>

<Layout preview={`Your return for order #${orderNumber} is all set.`}>
	<Section class="px-8 pb-2">
		<Heading as="h1" class="m-0 text-2xl font-bold text-neutral-900">Your return is all set</Heading
		>
		<Text class="mt-3 text-base leading-6 text-neutral-500">
			We've started a return for your {brand.name} order #{orderNumber}. Here's what to do next.
		</Text>
	</Section>
	<Section class="px-8 py-6 text-center">
		<Btn href={returnLabelUrl}>Download return label</Btn>
	</Section>
	<Section class="px-8 pb-2">
		<Text class="mt-0 mb-1 text-base leading-6 text-neutral-900"
			>1. Print the prepaid label and tape it to the box.</Text
		>
		<Text class="my-1 text-base leading-6 text-neutral-900">2. Pack the item(s) securely.</Text>
		<Text class="mt-1 mb-0 text-base leading-6 text-neutral-900"
			>3. Drop it off at any carrier location.</Text
		>
	</Section>
	<Section class="px-8 pt-4 pb-2">
		{#each items as item (item.name)}
			<Text class="my-1 text-base leading-6 text-neutral-900">{item.name} × {item.qty}</Text>
		{/each}
	</Section>
	<Section class="px-8 pb-2">
		<Text class="m-0 text-sm leading-5 text-neutral-500"
			>Please ship your return by {dropoffBy}.</Text
		>
	</Section>
</Layout>
