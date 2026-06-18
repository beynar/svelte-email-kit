<script lang="ts">
	import { Section, Heading, Text } from '$lib/index.js';
	import Layout from '../_shared/Layout.svelte';
	import { acme, type Brand } from '../_shared/brand.js';

	let {
		code = '318924',
		expiresIn = '10 minutes',
		brand = acme
	}: { code?: string; expiresIn?: string; brand?: Brand } = $props();
</script>

<Layout preview={`Your ${brand.name} verification code is ${code}.`}>
	<Section class="px-8 pb-2">
		<Heading as="h1" class="m-0 text-2xl font-bold text-neutral-900">Your verification code</Heading
		>
		<Text class="mt-3 text-base leading-6 text-neutral-500">
			Enter this code to finish signing in to your {brand.name} account.
		</Text>
	</Section>
	<Section class="px-8 py-6 text-center">
		<Section class="rounded-xl border border-neutral-200 py-5">
			<Text class="m-0 text-4xl font-bold tracking-widest text-neutral-900 text-center">{code}</Text
			>
		</Section>
	</Section>
	<Section class="px-8 pb-2">
		<Text class="m-0 text-sm leading-5 text-neutral-500">This code expires in {expiresIn}.</Text>
		<Text class="mt-2 mb-0 text-sm leading-5 text-neutral-500">
			For your security, never share this code with anyone.
		</Text>
	</Section>
</Layout>
