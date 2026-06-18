<script lang="ts">
	import { Section, Heading, Text, Link } from '$lib/index.js';
	import Layout from '../_shared/Layout.svelte';
	import { acme, type Brand } from '../_shared/brand.js';

	let {
		name = 'there',
		question = 'How likely are you to recommend us?',
		ratingUrl = 'https://acme.com/feedback',
		brand = acme
	}: { name?: string; question?: string; ratingUrl?: string; brand?: Brand } = $props();
</script>

<Layout preview={`${name}, how was your experience with ${brand.name}?`}>
	<Section class="px-8 pb-2">
		<Heading as="h1" class="m-0 text-2xl font-bold text-neutral-900">{question}</Heading>
		<Text class="mt-3 mb-0 text-base leading-6 text-neutral-500">
			Hi {name}, your feedback helps us improve {brand.name}. Tap a rating below — it takes two
			seconds.
		</Text>
	</Section>
	<Section class="px-8 py-6 text-center">
		<table role="presentation" class="mx-auto border-collapse">
			<tbody>
				<tr>
					{#each [1, 2, 3, 4, 5] as n (n)}
						<td class="px-1">
							<Link
								href={`${ratingUrl}?score=${n}`}
								class="inline-block rounded-lg border border-neutral-200 px-4 py-2 text-neutral-900"
								>{n}</Link
							>
						</td>
					{/each}
				</tr>
			</tbody>
		</table>
		<Text class="mt-3 mb-0 text-xs leading-5 text-neutral-500">Not likely · Very likely</Text>
	</Section>
</Layout>
