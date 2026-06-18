<script lang="ts">
	import { Section, Heading, Text } from '$lib/index.js';
	import Layout from '../_shared/Layout.svelte';
	import Btn from '../_shared/Btn.svelte';
	import { acme, type Brand } from '../_shared/brand.js';

	let {
		name = 'there',
		planName = 'Pro',
		daysLeft = '3',
		upgradeUrl = 'https://acme.com/upgrade',
		brand = acme
	}: {
		name?: string;
		planName?: string;
		daysLeft?: string;
		upgradeUrl?: string;
		brand?: Brand;
	} = $props();
</script>

<Layout
	preview={`Your ${brand.name} trial ends in ${daysLeft} days — upgrade to keep your projects.`}
>
	<Section class="px-8 pb-2">
		<Heading as="h1" class="m-0 text-2xl font-bold text-neutral-900"
			>Your trial ends in {daysLeft} days</Heading
		>
		<Text class="mt-3 text-base leading-6 text-neutral-500">
			Hi {name}, your {planName} trial of {brand.name} is almost over. Upgrade now to keep your projects,
			data, and premium features.
		</Text>
	</Section>
	<Section class="px-8 py-6 text-center">
		<Btn href={upgradeUrl}>Upgrade now</Btn>
	</Section>
	<Section class="px-8 pb-2">
		<Text class="m-0 text-sm leading-5 text-neutral-500">
			When your trial ends, your account moves to the free plan and premium features are paused —
			nothing is deleted.
		</Text>
	</Section>
</Layout>
