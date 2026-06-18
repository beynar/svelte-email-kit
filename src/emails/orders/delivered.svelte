<script lang="ts">
	import { Section, Heading, Text } from '$lib/index.js';
	import Layout from '../_shared/Layout.svelte';
	import Btn from '../_shared/Btn.svelte';
	import { acme, sampleOrder, type Brand, type LineItem } from '../_shared/brand.js';

	let {
		orderNumber = sampleOrder.number,
		deliveredAt = 'today at 2:14 PM',
		items = sampleOrder.items,
		reviewUrl = 'https://acme.com/orders/AC-100482/review',
		brand = acme
	}: {
		orderNumber?: string;
		deliveredAt?: string;
		items?: LineItem[];
		reviewUrl?: string;
		brand?: Brand;
	} = $props();
</script>

<Layout preview={`Order #${orderNumber} was delivered — we hope you love it!`}>
	<Section class="px-8 pb-2">
		<Heading as="h1" class="m-0 text-2xl font-bold text-neutral-900"
			>Your order was delivered</Heading
		>
		<Text class="mt-3 text-base leading-6 text-neutral-500">
			Your {brand.name} order #{orderNumber} was delivered {deliveredAt}. We hope you love it!
		</Text>
		{#each items as item (item.name)}
			<Text class="my-1 text-base leading-6 text-neutral-900">{item.name} × {item.qty}</Text>
		{/each}
	</Section>
	<Section class="px-8 py-6 text-center">
		<Btn href={reviewUrl}>Leave a review</Btn>
	</Section>
	<Section class="px-8 pb-2">
		<Text class="m-0 text-sm leading-5 text-neutral-500">
			Didn't receive it? Let us know within 48 hours.
		</Text>
	</Section>
</Layout>
