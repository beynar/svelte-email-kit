<script lang="ts">
	import { Section, Heading, Text, Link } from '$lib/index.js';
	import Layout from '../_shared/Layout.svelte';
	import Btn from '../_shared/Btn.svelte';
	import { acme, type Brand } from '../_shared/brand.js';

	let {
		name = 'there',
		brand = acme,
		getStartedUrl = 'https://acme.com/start',
		docsUrl = 'https://acme.com/docs'
	}: { name?: string; brand?: Brand; getStartedUrl?: string; docsUrl?: string } = $props();
</script>

<Layout preview={`Welcome to ${brand.name} — let's get you set up.`}>
	<Section class="px-8 pb-2">
		<Heading as="h1" class="m-0 text-2xl font-bold text-neutral-900">Welcome, {name}!</Heading>
		<Text class="mt-3 text-base leading-6 text-neutral-500">
			Thanks for joining {brand.name}. Your account is ready — here are a few things to try first.
		</Text>
		<Text class="mt-4 mb-0 text-base leading-6 text-neutral-900"
			>→ Set up your profile in under a minute.</Text
		>
		<Text class="my-1 text-base leading-6 text-neutral-900"
			>→ Invite a teammate to share the workspace.</Text
		>
		<Text class="mt-1 mb-0 text-base leading-6 text-neutral-900"
			>→ Connect your first integration.</Text
		>
	</Section>
	<Section class="px-8 py-6 text-center">
		<Btn href={getStartedUrl}>Get started</Btn>
	</Section>
	<Section class="px-8 pb-2">
		<Text class="m-0 text-sm leading-5 text-neutral-500">
			Prefer to explore on your own? Read the <Link
				href={docsUrl}
				class="text-neutral-900 underline">quick-start guide</Link
			>.
		</Text>
	</Section>
</Layout>
