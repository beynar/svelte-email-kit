<script lang="ts">
	import { Section, Heading, Text } from '$lib/index.js';
	import Layout from '../_shared/Layout.svelte';
	import Btn from '../_shared/Btn.svelte';
	import { acme, type Brand } from '../_shared/brand.js';

	let {
		headline = 'Introducing Insights 2.0',
		intro = 'We rebuilt Insights from the ground up so you can see what matters the moment it happens. Faster dashboards, reports you can shape yourself, and a workspace your whole team can act on together.',
		features = [
			{
				title: 'Real-time dashboards',
				body: 'Metrics now stream in live — no more refreshing or waiting on overnight syncs. Watch trends shift as they unfold and catch issues before they become problems.'
			},
			{
				title: 'Custom reports',
				body: 'Build the exact view you need with drag-and-drop fields, saved filters, and scheduled delivery straight to your inbox. Answer your own questions without writing a single query.'
			},
			{
				title: 'Team sharing',
				body: 'Publish any dashboard or report to your workspace in one click. Teammates get the same numbers, comment in context, and stay aligned on what to do next.'
			}
		],
		ctaUrl = 'https://acme.com/whats-new',
		ctaLabel = "See what's new",
		brand = acme
	}: {
		headline?: string;
		intro?: string;
		features?: { title: string; body: string }[];
		ctaUrl?: string;
		ctaLabel?: string;
		brand?: Brand;
	} = $props();
</script>

<Layout preview={`${headline} — ${intro}`}>
	<Section class="px-8 pb-2">
		<Heading as="h1" class="m-0 text-2xl font-bold text-neutral-900">{headline}</Heading>
		<Text class="mt-3 mb-0 text-base leading-6 text-neutral-500">{intro}</Text>
	</Section>
	<Section class="px-8 pt-4 pb-2">
		{#each features as f, i (i)}
			<Text class="mt-4 mb-0 text-base font-semibold text-neutral-900">{f.title}</Text>
			<Text class="mt-1 mb-0 text-sm leading-5 text-neutral-500">{f.body}</Text>
		{/each}
	</Section>
	<Section class="px-8 py-6 text-center">
		<Btn href={ctaUrl}>{ctaLabel}</Btn>
	</Section>
	<Section class="px-8 pb-2">
		<Text class="m-0 text-sm leading-5 text-neutral-500">— The {brand.name} team</Text>
	</Section>
</Layout>
