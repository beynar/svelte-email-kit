<script lang="ts">
	import { Section, Heading, Text, Link } from '$lib/index.js';
	import Layout from '../_shared/Layout.svelte';
	import Btn from '../_shared/Btn.svelte';
	import { acme, type Brand } from '../_shared/brand.js';

	let {
		name = 'there',
		brand = acme,
		verifyUrl = 'https://acme.com/verify?token=abc123',
		expiresIn = '24 hours'
	}: { name?: string; brand?: Brand; verifyUrl?: string; expiresIn?: string } = $props();
</script>

<Layout preview={`Confirm your email to finish setting up your ${brand.name} account.`}>
	<Section class="px-8 pb-2">
		<Heading as="h1" class="m-0 text-2xl font-bold text-neutral-900"
			>Confirm your email address</Heading
		>
		<Text class="mt-3 text-base leading-6 text-neutral-500">
			Hi {name}, please confirm this is your email address to finish setting up your {brand.name}
			account.
		</Text>
	</Section>
	<Section class="px-8 py-6 text-center">
		<Btn href={verifyUrl}>Verify email</Btn>
	</Section>
	<Section class="px-8 pb-2">
		<Text class="m-0 text-sm leading-5 text-neutral-500">
			Or paste this link into your browser:
			<Link href={verifyUrl} class="text-neutral-900 underline">{verifyUrl}</Link>
		</Text>
		<Text class="mt-4 mb-0 text-sm leading-5 text-neutral-500">
			This link expires in {expiresIn}.
		</Text>
		<Text class="mt-2 mb-0 text-sm leading-5 text-neutral-500">
			If you didn't create an account, you can ignore this email.
		</Text>
	</Section>
</Layout>
