<script lang="ts">
	import { Section, Heading, Text, Link, Hr } from '$lib/index.js';
	import Layout from '../_shared/Layout.svelte';
	import { acme, type Brand } from '../_shared/brand.js';

	let {
		issue = 'Issue #12 · June 2026',
		intro = "This month we shipped faster previews, a redesigned dashboard, and a few quality-of-life fixes you've been asking for. Here's everything worth catching up on.",
		stories = [
			{
				title: 'Live previews are now 3x faster',
				excerpt:
					'We rebuilt the rendering pipeline so your changes show up almost instantly. No more waiting on a spinner to see what your email will look like.',
				url: 'https://acme.com/blog/faster-previews'
			},
			{
				title: 'A cleaner, calmer dashboard',
				excerpt:
					'The new dashboard puts your most recent sends front and center and tucks the noise away. Everything you reach for daily is one click closer.',
				url: 'https://acme.com/blog/dashboard-refresh'
			},
			{
				title: 'Import templates from a single file',
				excerpt:
					'Bring your existing designs over in seconds. Drag in a file, map your fields, and you are ready to send — no copy-paste required.',
				url: 'https://acme.com/blog/template-import'
			}
		],
		brand = acme
	}: {
		issue?: string;
		intro?: string;
		stories?: { title: string; excerpt: string; url: string }[];
		brand?: Brand;
	} = $props();
</script>

<Layout preview={`${brand.name} Digest — ${issue}`}>
	<Section class="px-8 pb-2">
		<Heading as="h1" class="m-0 text-2xl font-bold text-neutral-900">{brand.name} Digest</Heading>
		<Text class="mt-1 mb-0 text-sm leading-5 text-neutral-500">{issue}</Text>
		<Text class="mt-4 mb-0 text-base leading-6 text-neutral-500">{intro}</Text>
	</Section>
	<Section class="px-8 pt-4 pb-2">
		{#each stories as story, i (i)}
			{#if i > 0}
				<Hr class="my-5" />
			{/if}
			<Text class="m-0 text-base font-semibold text-neutral-900">{story.title}</Text>
			<Text class="mt-2 mb-0 text-sm leading-6 text-neutral-500">{story.excerpt}</Text>
			<Text class="mt-2 mb-0 text-sm leading-6">
				<Link href={story.url} class="text-neutral-900 underline">Read more →</Link>
			</Text>
		{/each}
	</Section>
</Layout>
