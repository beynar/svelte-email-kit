<script lang="ts">
	import { Section, Heading, Text, Link } from '$lib/index.js';
	import Layout from '../_shared/Layout.svelte';
	import Btn from '../_shared/Btn.svelte';
	import { acme, type Brand } from '../_shared/brand.js';

	let {
		inviterName = 'Ada Lovelace',
		teamName = 'Acme Engineering',
		role = 'Member',
		brand = acme,
		acceptUrl = 'https://acme.com/invite?token=abc123',
		expiresIn = '7 days'
	}: {
		inviterName?: string;
		teamName?: string;
		role?: string;
		brand?: Brand;
		acceptUrl?: string;
		expiresIn?: string;
	} = $props();
</script>

<Layout preview={`${inviterName} invited you to join ${teamName} on ${brand.name}.`}>
	<Section class="px-8 pb-2">
		<Heading as="h1" class="m-0 text-2xl font-bold text-neutral-900"
			>{inviterName} invited you to {teamName}</Heading
		>
		<Text class="mt-3 text-base leading-6 text-neutral-500">
			{inviterName} has invited you to join {teamName} on {brand.name} as a {role}.
		</Text>
	</Section>
	<Section class="px-8 py-6 text-center">
		<Btn href={acceptUrl}>Accept invitation</Btn>
	</Section>
	<Section class="px-8 pb-2">
		<Text class="m-0 text-sm leading-5 text-neutral-500">Or paste this link into your browser:</Text
		>
		<Text class="mt-1 mb-0 text-sm leading-5 text-neutral-900">
			<Link href={acceptUrl} class="text-neutral-900 underline">{acceptUrl}</Link>
		</Text>
		<Text class="mt-4 mb-0 text-sm leading-5 text-neutral-500">
			This invitation expires in {expiresIn}.
		</Text>
	</Section>
</Layout>
