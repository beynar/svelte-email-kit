<script lang="ts">
	import { Section, Heading, Text, Link } from '$lib/index.js';
	import Layout from '../_shared/Layout.svelte';
	import Btn from '../_shared/Btn.svelte';
	import { acme, type Brand } from '../_shared/brand.js';

	let {
		brand = acme,
		loginUrl = 'https://acme.com/login?token=abc123',
		expiresIn = '15 minutes',
		requestedFrom = 'Chrome on macOS · 203.0.113.4'
	}: { brand?: Brand; loginUrl?: string; expiresIn?: string; requestedFrom?: string } = $props();
</script>

<Layout preview={`Your secure sign-in link for ${brand.name} — expires in ${expiresIn}.`}>
	<Section class="px-8 pb-2">
		<Heading as="h1" class="m-0 text-2xl font-bold text-neutral-900"
			>Sign in to {brand.name}</Heading
		>
		<Text class="mt-3 text-base leading-6 text-neutral-500">
			Click the button below to securely sign in. No password needed.
		</Text>
	</Section>
	<Section class="px-8 py-6 text-center">
		<Btn href={loginUrl}>Sign in</Btn>
	</Section>
	<Section class="px-8 pb-2">
		<Text class="m-0 text-sm leading-5 text-neutral-500">Or paste this link into your browser:</Text
		>
		<Text class="mt-1 mb-0 text-sm leading-5">
			<Link href={loginUrl} class="text-neutral-900 underline">{loginUrl}</Link>
		</Text>
		<Text class="mt-4 mb-0 text-xs leading-5 text-neutral-500">Requested from {requestedFrom}</Text>
		<Text class="mt-2 mb-0 text-xs leading-5 text-neutral-500">
			This link expires in {expiresIn} and can only be used once.
		</Text>
		<Text class="mt-1 mb-0 text-xs leading-5 text-neutral-500">
			If you didn't request this, you can safely ignore it.
		</Text>
	</Section>
</Layout>
