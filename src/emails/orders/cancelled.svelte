<script lang="ts">
	import { Section, Heading, Text } from '$lib/index.js';
	import Layout from '../_shared/Layout.svelte';
	import Btn from '../_shared/Btn.svelte';
	import { acme, sampleOrder, type Brand } from '../_shared/brand.js';

	let {
		orderNumber = sampleOrder.number,
		reason = 'at your request',
		refundAmount = sampleOrder.total,
		refundEta = '5–7 business days',
		supportUrl = 'https://acme.com/support',
		brand = acme
	}: {
		orderNumber?: string;
		reason?: string;
		refundAmount?: string;
		refundEta?: string;
		supportUrl?: string;
		brand?: Brand;
	} = $props();
</script>

<Layout preview={`Order #${orderNumber} has been cancelled.`}>
	<Section class="px-8 pb-2">
		<Heading as="h1" class="m-0 text-2xl font-bold text-neutral-900"
			>Your order was cancelled</Heading
		>
		<Text class="mt-3 text-base leading-6 text-neutral-500">
			Your {brand.name} order #{orderNumber} has been cancelled {reason}.
		</Text>
		{#if refundAmount}
			<Text class="mt-4 mb-0 text-base leading-6 text-neutral-900">
				A refund of {refundAmount} is on its way and should appear in {refundEta}.
			</Text>
		{/if}
	</Section>
	<Section class="px-8 py-6 text-center">
		<Btn href={supportUrl} variant="secondary">Contact support</Btn>
	</Section>
	<Section class="px-8 pb-2">
		<Text class="m-0 text-sm leading-5 text-neutral-500">
			Changed your mind? You can place a new order anytime.
		</Text>
	</Section>
</Layout>
