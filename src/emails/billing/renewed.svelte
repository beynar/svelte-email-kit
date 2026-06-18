<script lang="ts">
	import { Section, Heading, Text } from '$lib/index.js';
	import Layout from '../_shared/Layout.svelte';
	import Btn from '../_shared/Btn.svelte';
	import { acme, type Brand } from '../_shared/brand.js';

	let {
		planName = 'Pro',
		amount = '$29.00',
		nextBillingDate = 'July 18, 2026',
		manageUrl = 'https://acme.com/billing',
		brand = acme
	}: {
		planName?: string;
		amount?: string;
		nextBillingDate?: string;
		manageUrl?: string;
		brand?: Brand;
	} = $props();
</script>

<Layout preview={`Your ${brand.name} ${planName} plan has renewed.`}>
	<Section class="px-8 pb-2">
		<Heading as="h1" class="m-0 text-2xl font-bold text-neutral-900"
			>Your subscription renewed</Heading
		>
		<Text class="mt-3 text-base leading-6 text-neutral-500">
			Thanks for staying with {brand.name}! Your {planName} plan has renewed.
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
					<td class="border-b border-neutral-200 py-3 pr-3 align-top text-neutral-500">Plan</td>
					<td class="border-b border-neutral-200 py-3 text-right align-top text-neutral-900"
						>{planName}</td
					>
				</tr>
				<tr>
					<td class="border-b border-neutral-200 py-3 pr-3 align-top text-neutral-500"
						>Amount charged</td
					>
					<td class="border-b border-neutral-200 py-3 text-right align-top text-neutral-900"
						>{amount}</td
					>
				</tr>
				<tr>
					<td class="py-3 pr-3 align-top text-neutral-500">Next billing date</td>
					<td class="py-3 text-right align-top text-neutral-900">{nextBillingDate}</td>
				</tr>
			</tbody>
		</table>
	</Section>
	<Section class="px-8 py-6 text-center">
		<Btn href={manageUrl}>Manage subscription</Btn>
	</Section>
	<Section class="px-8 pb-2">
		<Text class="m-0 text-sm leading-5 text-neutral-500">
			You can update or cancel anytime from your billing settings.
		</Text>
	</Section>
</Layout>
