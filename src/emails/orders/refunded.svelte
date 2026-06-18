<script lang="ts">
	import { Section, Heading, Text } from '$lib/index.js';
	import Layout from '../_shared/Layout.svelte';
	import { acme, sampleOrder, type Brand } from '../_shared/brand.js';

	let {
		orderNumber = sampleOrder.number,
		amount = sampleOrder.total,
		method = 'Visa ending in 4242',
		eta = '5–7 business days',
		brand = acme
	}: {
		orderNumber?: string;
		amount?: string;
		method?: string;
		eta?: string;
		brand?: Brand;
	} = $props();
</script>

<Layout preview={`Your refund for order #${orderNumber} is on the way.`}>
	<Section class="px-8 pb-2">
		<Heading as="h1" class="m-0 text-2xl font-bold text-neutral-900"
			>Your refund is on the way</Heading
		>
		<Text class="mt-3 text-base leading-6 text-neutral-500">
			We've processed a refund for your {brand.name} order #{orderNumber}.
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
					<td class="border-b border-neutral-200 py-3 pr-3 align-top text-neutral-500">Amount</td>
					<td
						class="border-b border-neutral-200 py-3 text-right align-top text-neutral-900 font-semibold"
						>{amount}</td
					>
				</tr>
				<tr>
					<td class="border-b border-neutral-200 py-3 pr-3 align-top text-neutral-500"
						>Refunded to</td
					>
					<td class="border-b border-neutral-200 py-3 text-right align-top text-neutral-900"
						>{method}</td
					>
				</tr>
				<tr>
					<td class="py-3 pr-3 align-top text-neutral-500">Arrives in</td>
					<td class="py-3 text-right align-top text-neutral-900">{eta}</td>
				</tr>
			</tbody>
		</table>
	</Section>
	<Section class="px-8 pb-2">
		<Text class="m-0 text-sm leading-5 text-neutral-500">
			Refund times depend on your bank or card issuer.
		</Text>
	</Section>
</Layout>
