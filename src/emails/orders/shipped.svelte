<script lang="ts">
	import { Section, Heading, Text } from '$lib/index.js';
	import Layout from '../_shared/Layout.svelte';
	import Btn from '../_shared/Btn.svelte';
	import { acme, sampleOrder, type Brand, type LineItem } from '../_shared/brand.js';

	let {
		orderNumber = sampleOrder.number,
		carrier = 'UPS',
		trackingNumber = '1Z999AA10123456784',
		trackingUrl = 'https://acme.com/track/1Z999AA10123456784',
		eta = 'Friday, June 20',
		items = sampleOrder.items,
		brand = acme
	}: {
		orderNumber?: string;
		carrier?: string;
		trackingNumber?: string;
		trackingUrl?: string;
		eta?: string;
		items?: LineItem[];
		brand?: Brand;
	} = $props();
</script>

<Layout preview={`Your ${brand.name} order #${orderNumber} has shipped.`}>
	<Section class="px-8 pb-2">
		<Heading as="h1" class="m-0 text-2xl font-bold text-neutral-900"
			>Your order is on its way</Heading
		>
		<Text class="mt-3 text-base leading-6 text-neutral-500">
			Good news — order #{orderNumber} has shipped.
		</Text>
	</Section>
	<Section class="px-8 pb-2">
		<table
			class="w-full text-sm"
			role="presentation"
			cellpadding="0"
			cellspacing="0"
			style="border-collapse:collapse"
		>
			<tbody>
				<tr>
					<td class="border-b border-neutral-200 py-3 pr-3 align-top text-neutral-500">Carrier</td>
					<td class="border-b border-neutral-200 py-3 text-right align-top text-neutral-900"
						>{carrier}</td
					>
				</tr>
				<tr>
					<td class="border-b border-neutral-200 py-3 pr-3 align-top text-neutral-500"
						>Tracking number</td
					>
					<td class="border-b border-neutral-200 py-3 text-right align-top text-neutral-900"
						>{trackingNumber}</td
					>
				</tr>
				<tr>
					<td class="py-3 pr-3 align-top text-neutral-500">Estimated delivery</td>
					<td class="py-3 text-right align-top text-neutral-900">{eta}</td>
				</tr>
			</tbody>
		</table>
	</Section>
	<Section class="px-8 py-6 text-center">
		<Btn href={trackingUrl}>Track your package</Btn>
	</Section>
	<Section class="px-8 pb-2">
		<Heading as="h2" class="m-0 text-base font-semibold text-neutral-900">In this shipment</Heading>
		{#each items as item (item.name)}
			<Text class="my-1 text-base leading-6 text-neutral-900">{item.name} × {item.qty}</Text>
		{/each}
	</Section>
</Layout>
