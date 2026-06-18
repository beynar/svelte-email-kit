<script lang="ts">
	import { Section, Heading, Text } from '$lib/index.js';
	import Layout from '../_shared/Layout.svelte';
	import Btn from '../_shared/Btn.svelte';
	import LineItems from '../_shared/LineItems.svelte';
	import { acme, sampleOrder, type Brand, type LineItem } from '../_shared/brand.js';

	let {
		orderNumber = sampleOrder.number,
		date = sampleOrder.date,
		items = sampleOrder.items,
		subtotal = sampleOrder.subtotal,
		shipping = sampleOrder.shipping,
		tax = sampleOrder.tax,
		total = sampleOrder.total,
		shipTo = sampleOrder.shipTo,
		viewOrderUrl = 'https://acme.com/orders/AC-100482',
		brand = acme
	}: {
		orderNumber?: string;
		date?: string;
		items?: LineItem[];
		subtotal?: string;
		shipping?: string;
		tax?: string;
		total?: string;
		shipTo?: string;
		viewOrderUrl?: string;
		brand?: Brand;
	} = $props();
</script>

<Layout preview={`Order ${orderNumber} confirmed — thanks for your purchase.`}>
	<Section class="px-8 pb-2">
		<Heading as="h1" class="m-0 text-2xl font-bold text-neutral-900">Order confirmed</Heading>
		<Text class="mt-3 text-base leading-6 text-neutral-500">
			Thanks for your order from {brand.name}! We're getting it ready. Order #{orderNumber} · {date}.
		</Text>
	</Section>
	<Section class="px-8 py-4">
		<LineItems {items} {subtotal} {shipping} {tax} {total} />
	</Section>
	<Section class="px-8 pb-2">
		<Text class="m-0 text-sm leading-5 text-neutral-500">Shipping to</Text>
		<Text class="mt-1 mb-0 text-base leading-6 text-neutral-900">{shipTo}</Text>
	</Section>
	<Section class="px-8 py-6 text-center">
		<Btn href={viewOrderUrl}>View your order</Btn>
	</Section>
</Layout>
