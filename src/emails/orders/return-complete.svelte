<script lang="ts">
	import { Section, Heading, Text } from '$lib/index.js';
	import Layout from '../_shared/Layout.svelte';
	import { acme, sampleOrder, type Brand, type LineItem } from '../_shared/brand.js';

	let {
		orderNumber = sampleOrder.number,
		items = sampleOrder.items,
		refundAmount = sampleOrder.total,
		refundEta = '5–7 business days',
		brand = acme
	}: {
		orderNumber?: string;
		items?: LineItem[];
		refundAmount?: string;
		refundEta?: string;
		brand?: Brand;
	} = $props();
</script>

<Layout preview={`Your return for order #${orderNumber} has been received and refunded.`}>
	<Section class="px-8 pb-2">
		<Heading as="h1" class="m-0 text-2xl font-bold text-neutral-900"
			>We've received your return</Heading
		>
		<Text class="mt-3 text-base leading-6 text-neutral-500">
			Thanks — your {brand.name} return for order #{orderNumber} has arrived and been processed.
		</Text>
	</Section>
	<Section class="px-8 pb-2">
		{#each items as item (item.name)}
			<Text class="my-1 text-base leading-6 text-neutral-900">{item.name} × {item.qty}</Text>
		{/each}
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
					<td class="border-b border-neutral-200 py-3 pr-3 align-top text-neutral-500"
						>Refund amount</td
					>
					<td
						class="border-b border-neutral-200 py-3 text-right align-top font-semibold text-neutral-900"
						>{refundAmount}</td
					>
				</tr>
				<tr>
					<td class="py-3 pr-3 align-top text-neutral-500">Arrives in</td>
					<td class="py-3 text-right align-top text-neutral-900">{refundEta}</td>
				</tr>
			</tbody>
		</table>
	</Section>
	<Section class="px-8 pb-2">
		<Text class="m-0 text-sm leading-5 text-neutral-500">
			It may take a few days to appear on your statement.
		</Text>
	</Section>
</Layout>
