<script lang="ts">
	import { Section, Heading, Text } from '$lib/index.js';
	import Layout from '../_shared/Layout.svelte';
	import Btn from '../_shared/Btn.svelte';
	import { acme, type Brand } from '../_shared/brand.js';

	let {
		actorName = 'Ada Lovelace',
		context = 'in Q3 Roadmap',
		snippet = 'Hey — can you take a look at the analytics section before Friday? Your input would really help.',
		replyUrl = 'https://acme.com/threads/482',
		brand = acme
	}: {
		actorName?: string;
		context?: string;
		snippet?: string;
		replyUrl?: string;
		brand?: Brand;
	} = $props();
</script>

<Layout preview={`${actorName} mentioned you ${context}.`}>
	<Section class="px-8 pb-2">
		<Heading as="h1" class="m-0 text-2xl font-bold text-neutral-900"
			>{actorName} mentioned you</Heading
		>
		<Text class="mt-3 text-base leading-6 text-neutral-500">
			{actorName} mentioned you {context} on {brand.name}.
		</Text>
	</Section>
	<Section class="border-l-4 border-neutral-200 pl-4">
		<Text class="m-0 text-base leading-6 text-neutral-500">"{snippet}"</Text>
	</Section>
	<Section class="px-8 py-6 text-center">
		<Btn href={replyUrl}>Reply</Btn>
	</Section>
</Layout>
