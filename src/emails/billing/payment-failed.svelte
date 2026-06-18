<script lang="ts">
	import { Section, Heading, Text } from '$lib/index.js';
	import Layout from '../_shared/Layout.svelte';
	import Btn from '../_shared/Btn.svelte';
	import { acme, type Brand } from '../_shared/brand.js';

	let {
		amount = '$29.00',
		card = 'Visa ending in 4242',
		retryDate = 'June 21, 2026',
		updatePaymentUrl = 'https://acme.com/billing',
		brand = acme
	}: {
		amount?: string;
		card?: string;
		retryDate?: string;
		updatePaymentUrl?: string;
		brand?: Brand;
	} = $props();
</script>

<Layout preview={`Your payment of ${amount} to ${brand.name} didn't go through.`}>
	<Section class="px-8 pb-2">
		<Heading as="h1" class="m-0 text-2xl font-bold text-neutral-900"
			>Your payment didn't go through</Heading
		>
		<Text class="mt-3 text-base leading-6 text-neutral-500">
			We tried to charge {amount} to your {card}, but the payment was declined.
		</Text>
	</Section>
	<Section class="px-8 py-6 text-center">
		<Btn href={updatePaymentUrl}>Update payment method</Btn>
	</Section>
	<Section class="px-8 pb-2">
		<Text class="m-0 text-base leading-6 text-neutral-900">
			We'll automatically try again on {retryDate}.
		</Text>
		<Text class="mt-3 mb-0 text-sm leading-5 text-neutral-500">
			To avoid any interruption to your {brand.name} subscription, please update your payment details.
		</Text>
	</Section>
</Layout>
