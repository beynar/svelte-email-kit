<script lang="ts">
	import { Section, Heading, Text, Link } from '$lib/index.js';
	import Layout from '../_shared/Layout.svelte';
	import Btn from '../_shared/Btn.svelte';
	import { acme, type Brand } from '../_shared/brand.js';

	let {
		planName = 'Pro',
		accessUntil = 'July 18, 2026',
		resubscribeUrl = 'https://acme.com/upgrade',
		feedbackUrl = 'https://acme.com/feedback',
		brand = acme
	}: {
		planName?: string;
		accessUntil?: string;
		resubscribeUrl?: string;
		feedbackUrl?: string;
		brand?: Brand;
	} = $props();
</script>

<Layout preview={`Your ${planName} plan on ${brand.name} has been cancelled.`}>
	<Section class="px-8 pb-2">
		<Heading as="h1" class="m-0 text-2xl font-bold text-neutral-900"
			>Your subscription is cancelled</Heading
		>
		<Text class="mt-3 text-base leading-6 text-neutral-500">
			Your {planName} plan on {brand.name} has been cancelled. You'll keep access until {accessUntil},
			then your account moves to the free plan.
		</Text>
	</Section>
	<Section class="px-8 py-6 text-center">
		<Btn href={resubscribeUrl}>Resubscribe</Btn>
	</Section>
	{#if feedbackUrl}
		<Section class="px-8 pb-2">
			<Text class="m-0 text-sm leading-5 text-neutral-500">
				Mind telling us why you left? <Link href={feedbackUrl} class="text-neutral-900 underline"
					>Share quick feedback</Link
				>.
			</Text>
		</Section>
	{/if}
</Layout>
