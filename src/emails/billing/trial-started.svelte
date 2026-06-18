<script lang="ts">
	import { Section, Heading, Text } from '$lib/index.js';
	import Layout from '../_shared/Layout.svelte';
	import Btn from '../_shared/Btn.svelte';
	import { acme, type Brand } from '../_shared/brand.js';

	let {
		name = 'there',
		planName = 'Pro',
		trialEnds = 'July 2, 2026',
		manageUrl = 'https://acme.com/billing',
		brand = acme
	}: {
		name?: string;
		planName?: string;
		trialEnds?: string;
		manageUrl?: string;
		brand?: Brand;
	} = $props();
</script>

<Layout preview={`Your ${planName} trial of ${brand.name} is live.`}>
	<Section class="px-8 pb-2">
		<Heading as="h1" class="m-0 text-2xl font-bold text-neutral-900"
			>Your {planName} trial is live</Heading
		>
		<Text class="mt-3 text-base leading-6 text-neutral-500">
			Hi {name}, your 14-day {planName} trial of {brand.name} has started. Here's what you can do now:
		</Text>
		<Text class="mt-4 mb-0 text-base leading-6 text-neutral-900"
			>→ Unlimited projects and seats.</Text
		>
		<Text class="my-1 text-base leading-6 text-neutral-900">→ Advanced analytics and exports.</Text>
		<Text class="mt-1 mb-0 text-base leading-6 text-neutral-900">→ Priority support.</Text>
		<Text class="mt-4 mb-0 text-base leading-6 text-neutral-500">
			Your trial ends on {trialEnds}. You won't be charged until then.
		</Text>
	</Section>
	<Section class="px-8 py-6 text-center">
		<Btn href={manageUrl}>Manage subscription</Btn>
	</Section>
</Layout>
