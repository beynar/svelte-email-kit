<script lang="ts">
	import { Section, Heading, Text } from '$lib/index.js';
	import Layout from '../_shared/Layout.svelte';
	import Btn from '../_shared/Btn.svelte';
	import { acme, type Brand } from '../_shared/brand.js';

	let {
		periodLabel = 'this week',
		stats = [
			{ label: 'Tasks completed', value: '24' },
			{ label: 'New comments', value: '12' },
			{ label: 'Hours tracked', value: '37.5' }
		],
		highlights = [
			'You closed out the Q3 launch checklist ahead of schedule.',
			'Three teammates joined your workspace.',
			'Your fastest response time yet — under 2 hours.'
		],
		dashboardUrl = 'https://acme.com/dashboard',
		brand = acme
	}: {
		periodLabel?: string;
		stats?: { label: string; value: string }[];
		highlights?: string[];
		dashboardUrl?: string;
		brand?: Brand;
	} = $props();
</script>

<Layout preview={`Your ${periodLabel} on ${brand.name}.`}>
	<Section class="px-8 pb-2">
		<Heading as="h1" class="m-0 text-2xl font-bold text-neutral-900"
			>Your {periodLabel} on {brand.name}</Heading
		>
		<Text class="mt-3 text-base leading-6 text-neutral-500">
			Here's a quick look at what you got done {periodLabel}. Keep up the momentum.
		</Text>
	</Section>
	<Section class="px-8 pb-2">
		<table
			class="w-full text-sm"
			role="presentation"
			cellpadding="0"
			cellspacing="0"
			style="border-collapse:collapse"
		>
			<tbody>
				{#each stats as s, i (i)}
					<tr>
						<td class="border-b border-neutral-200 py-3 pr-3 align-top text-neutral-500"
							>{s.label}</td
						>
						<td
							class="border-b border-neutral-200 py-3 text-right align-top font-semibold text-neutral-900"
							>{s.value}</td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</Section>
	<Section class="px-8 pb-2">
		<Text class="mt-4 mb-0 text-base font-semibold text-neutral-900">Highlights</Text>
		{#each highlights as h, i (i)}
			<Text class="my-1 text-base leading-6 text-neutral-500">• {h}</Text>
		{/each}
	</Section>
	<Section class="px-8 py-6 text-center">
		<Btn href={dashboardUrl}>Open dashboard</Btn>
	</Section>
</Layout>
