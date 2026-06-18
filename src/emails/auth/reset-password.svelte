<script lang="ts">
	import { Section, Heading, Text, Link } from '$lib/index.js';
	import Layout from '../_shared/Layout.svelte';
	import Btn from '../_shared/Btn.svelte';
	import { acme, type Brand } from '../_shared/brand.js';

	let {
		name = 'there',
		brand = acme,
		resetUrl = 'https://acme.com/reset?token=abc123',
		expiresIn = '1 hour'
	}: { name?: string; brand?: Brand; resetUrl?: string; expiresIn?: string } = $props();
</script>

<Layout preview={`Reset your ${brand.name} password — this link expires in ${expiresIn}.`}>
	<Section class="px-8 pb-2">
		<Heading as="h1" class="m-0 text-2xl font-bold text-neutral-900">Reset your password</Heading>
		<Text class="mt-3 text-base leading-6 text-neutral-500">
			Hi {name}, we received a request to reset the password for your {brand.name} account. Click below
			to choose a new one.
		</Text>
	</Section>
	<Section class="px-8 py-6 text-center">
		<Btn href={resetUrl}>Reset password</Btn>
	</Section>
	<Section class="px-8 pb-2">
		<Text class="m-0 text-sm leading-5 text-neutral-500">
			Or paste this link into your browser:
			<Link href={resetUrl} class="text-neutral-900 underline">{resetUrl}</Link>
		</Text>
		<Text class="mt-4 mb-0 text-sm leading-5 text-neutral-500">
			This link expires in {expiresIn}.
		</Text>
		<Text class="mt-2 mb-0 text-sm leading-5 text-neutral-500">
			If you didn't request a password reset, you can ignore this email — your password won't
			change.
		</Text>
	</Section>
</Layout>
