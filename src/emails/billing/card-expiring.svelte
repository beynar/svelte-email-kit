<script lang="ts">
	import { Section, Heading, Text } from '$lib/index.js';
	import Layout from '../_shared/Layout.svelte';
	import Btn from '../_shared/Btn.svelte';
	import { acme, type Brand } from '../_shared/brand.js';

	let {
		cardLast4 = '4242',
		expMonthYear = '07/2026',
		updatePaymentUrl = 'https://acme.com/billing',
		brand = acme
	}: {
		cardLast4?: string;
		expMonthYear?: string;
		updatePaymentUrl?: string;
		brand?: Brand;
	} = $props();
</script>

<Layout preview={`Your card ending in ${cardLast4} expires ${expMonthYear}.`}>
	<Section class="px-8 pb-2">
		<Heading as="h1" class="m-0 text-2xl font-bold text-neutral-900"
			>Your card is expiring soon</Heading
		>
		<Text class="mt-3 mb-0 text-base leading-6 text-neutral-500">
			The card ending in {cardLast4} on your {brand.name} account expires {expMonthYear}. Update it
			now to avoid any interruption to your subscription.
		</Text>
	</Section>
	<Section class="px-8 py-6 text-center">
		<Btn href={updatePaymentUrl}>Update card</Btn>
	</Section>
	<Section class="px-8 pb-2">
		<Text class="m-0 text-sm leading-5 text-neutral-500">
			If you've already updated your card, you can ignore this email.
		</Text>
	</Section>
</Layout>
