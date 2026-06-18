<script lang="ts">
	import { Section, Heading, Text } from '$lib/index.js';
	import Layout from '../_shared/Layout.svelte';
	import Btn from '../_shared/Btn.svelte';
	import { acme, type Brand } from '../_shared/brand.js';

	let {
		name = 'there',
		brand = acme,
		changedAt = 'June 18, 2026 at 2:30 PM UTC',
		supportUrl = 'https://acme.com/support'
	}: { name?: string; brand?: Brand; changedAt?: string; supportUrl?: string } = $props();
</script>

<Layout preview={`Your ${brand.name} password was changed.`}>
	<Section class="px-8 pb-2">
		<Heading as="h1" class="m-0 text-2xl font-bold text-neutral-900"
			>Your password was changed</Heading
		>
		<Text class="mt-3 text-base leading-6 text-neutral-500">
			Hi {name}, the password for your {brand.name} account was changed on {changedAt}.
		</Text>
		<Text class="mt-4 mb-0 text-base leading-6 text-neutral-900">
			If this wasn't you, your account may be at risk — secure it right away.
		</Text>
	</Section>
	<Section class="px-8 py-6 text-center">
		<Btn href={supportUrl} variant="secondary">Contact support</Btn>
	</Section>
	<Section class="px-8 pb-2">
		<Text class="m-0 text-sm leading-5 text-neutral-500">
			If you made this change, no further action is needed.
		</Text>
	</Section>
</Layout>
