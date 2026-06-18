<script lang="ts">
	import { Section, Heading, Text } from '$lib/index.js';
	import Layout from '../_shared/Layout.svelte';
	import Btn from '../_shared/Btn.svelte';
	import { acme, type Brand } from '../_shared/brand.js';

	let {
		invoiceNumber = 'INV-2026-0482',
		date = 'June 18, 2026',
		lineItems = [
			{ description: 'Pro plan — Monthly', amount: '$29.00' },
			{ description: 'Additional seats (3)', amount: '$45.00' }
		],
		total = '$74.00',
		card = 'Visa ending in 4242',
		invoiceUrl = 'https://acme.com/invoices/INV-2026-0482',
		brand = acme
	}: {
		invoiceNumber?: string;
		date?: string;
		lineItems?: { description: string; amount: string }[];
		total?: string;
		card?: string;
		invoiceUrl?: string;
		brand?: Brand;
	} = $props();
</script>

<Layout preview={`Your ${brand.name} receipt for ${invoiceNumber} — ${total}.`}>
	<Section class="px-8 pb-2">
		<Heading as="h1" class="m-0 text-2xl font-bold text-neutral-900">Payment receipt</Heading>
		<Text class="mt-3 text-base leading-6 text-neutral-500">
			Thanks for your payment. Here's your receipt for invoice {invoiceNumber} · {date}.
		</Text>
	</Section>
	<Section class="px-8 py-2">
		<table
			class="w-full text-sm"
			role="presentation"
			cellpadding="0"
			cellspacing="0"
			style="border-collapse:collapse"
		>
			<tbody>
				{#each lineItems as item, i (i)}
					<tr>
						<td class="border-b border-neutral-200 py-3 pr-3 align-top text-neutral-900">
							{item.description}
						</td>
						<td
							class="border-b border-neutral-200 py-3 text-right align-top text-neutral-900"
							style="white-space:nowrap">{item.amount}</td
						>
					</tr>
				{/each}
				<tr>
					<td class="pt-3 text-base font-bold text-neutral-900">Total</td>
					<td class="pt-3 text-right text-base font-bold text-neutral-900">{total}</td>
				</tr>
			</tbody>
		</table>
		<Text class="mt-4 mb-0 text-sm leading-5 text-neutral-500">Paid with {card}</Text>
	</Section>
	<Section class="px-8 py-6 text-center">
		<Btn href={invoiceUrl}>View invoice</Btn>
	</Section>
</Layout>
