<script lang="ts">
	import { Section, Heading, Text } from '$lib/index.js';
	import Layout from '../_shared/Layout.svelte';
	import Btn from '../_shared/Btn.svelte';
	import { acme, type Brand } from '../_shared/brand.js';

	let {
		name = 'there',
		incentive = '20% off your next 3 months',
		returnUrl = 'https://acme.com/welcome-back',
		brand = acme
	}: { name?: string; incentive?: string; returnUrl?: string; brand?: Brand } = $props();
</script>

<Layout preview={`We miss you at ${brand.name} — here's something to bring you back.`}>
	<Section class="px-8 pb-2">
		<Heading as="h1" class="m-0 text-2xl font-bold text-neutral-900">We miss you, {name}</Heading>
		<Text class="mt-3 text-base leading-6 text-neutral-500">
			It's been a while since you visited {brand.name}. We've shipped a lot of improvements we think
			you'll love.
		</Text>
		{#if incentive}
			<Text class="mt-4 mb-0 text-base leading-6 text-neutral-900 font-semibold text-center">
				Come back and get {incentive}.
			</Text>
		{/if}
	</Section>
	<Section class="px-8 py-6 text-center">
		<Btn href={returnUrl}>Come back to {brand.name}</Btn>
	</Section>
	<Section class="px-8 pb-2">
		<Text class="m-0 text-sm leading-5 text-neutral-500">
			Not interested anymore? You can unsubscribe below.
		</Text>
	</Section>
</Layout>
