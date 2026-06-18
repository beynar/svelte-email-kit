<script lang="ts">
	import { Section, Heading, Text } from '$lib/index.js';
	import Layout from '../_shared/Layout.svelte';
	import Btn from '../_shared/Btn.svelte';
	import { acme, type Brand } from '../_shared/brand.js';

	let {
		title = 'Live webinar: Scaling analytics in 2026',
		date = 'Thursday, June 26, 2026',
		time = '11:00 AM PT / 2:00 PM ET',
		location = 'Online · Zoom',
		rsvpUrl = 'https://acme.com/events/scaling-2026',
		brand = acme
	}: {
		title?: string;
		date?: string;
		time?: string;
		location?: string;
		rsvpUrl?: string;
		brand?: Brand;
	} = $props();
</script>

<Layout preview={`You're invited: ${title}`}>
	<Section class="px-8 pb-2">
		<Heading as="h1" class="m-0 text-2xl font-bold text-neutral-900">{title}</Heading>
		<Text class="mt-3 text-base leading-6 text-neutral-500">
			Join the {brand.name} team for a live, practical session on scaling your analytics stack as your
			data grows. We'll walk through real architectures, common bottlenecks, and the tradeoffs that matter
			— built for data and engineering leaders planning their next phase of growth.
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
				<tr>
					<td class="border-b border-neutral-200 py-3 pr-3 align-top text-neutral-500">When</td>
					<td class="border-b border-neutral-200 py-3 text-right align-top text-neutral-900"
						>{date}</td
					>
				</tr>
				<tr>
					<td class="border-b border-neutral-200 py-3 pr-3 align-top text-neutral-500">Time</td>
					<td class="border-b border-neutral-200 py-3 text-right align-top text-neutral-900"
						>{time}</td
					>
				</tr>
				<tr>
					<td class="py-3 pr-3 align-top text-neutral-500">Where</td>
					<td class="py-3 text-right align-top text-neutral-900">{location}</td>
				</tr>
			</tbody>
		</table>
	</Section>
	<Section class="px-8 py-6 text-center">
		<Btn href={rsvpUrl}>Save your spot</Btn>
	</Section>
	<Section class="px-8 pb-2">
		<Text class="m-0 text-sm leading-5 text-neutral-500">
			Can't make it? Register anyway and we'll send the recording.
		</Text>
	</Section>
</Layout>
