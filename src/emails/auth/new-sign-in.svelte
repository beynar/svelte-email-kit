<script lang="ts">
	import { Section, Heading, Text } from '$lib/index.js';
	import Layout from '../_shared/Layout.svelte';
	import Btn from '../_shared/Btn.svelte';
	import { acme, type Brand } from '../_shared/brand.js';

	let {
		name = 'there',
		brand = acme,
		device = 'Chrome on macOS',
		location = 'London, United Kingdom',
		time = 'June 18, 2026 at 2:30 PM UTC',
		secureAccountUrl = 'https://acme.com/security'
	}: {
		name?: string;
		brand?: Brand;
		device?: string;
		location?: string;
		time?: string;
		secureAccountUrl?: string;
	} = $props();
</script>

<Layout preview={`New sign-in to your ${brand.name} account.`}>
	<Section class="px-8 pb-2">
		<Heading as="h1" class="m-0 text-2xl font-bold text-neutral-900"
			>New sign-in to your account</Heading
		>
		<Text class="mt-3 text-base leading-6 text-neutral-500">
			Hi {name}, we noticed a new sign-in to your {brand.name} account.
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
					<td class="border-b border-neutral-200 py-3 pr-3 align-top text-neutral-500">Device</td>
					<td class="border-b border-neutral-200 py-3 text-right align-top text-neutral-900"
						>{device}</td
					>
				</tr>
				<tr>
					<td class="border-b border-neutral-200 py-3 pr-3 align-top text-neutral-500">Location</td>
					<td class="border-b border-neutral-200 py-3 text-right align-top text-neutral-900"
						>{location}</td
					>
				</tr>
				<tr>
					<td class="py-3 pr-3 align-top text-neutral-500">When</td>
					<td class="py-3 text-right align-top text-neutral-900">{time}</td>
				</tr>
			</tbody>
		</table>
	</Section>
	<Section class="px-8 py-6 text-center">
		<Btn href={secureAccountUrl}>Secure your account</Btn>
	</Section>
	<Section class="px-8 pb-2">
		<Text class="m-0 text-sm leading-5 text-neutral-500">
			If this was you, you can ignore this email.
		</Text>
	</Section>
</Layout>
