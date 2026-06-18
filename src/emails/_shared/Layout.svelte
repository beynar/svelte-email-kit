<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Container, Preview } from '$lib/index.js';
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
	import { acme, type Brand } from './brand.js';

	// The shared email shell: a hidden <Preview> line + a branded Container with the
	// Header above and Footer below the template body. Templates render
	// `<Layout preview="…">…</Layout>`; the plugin's forgiveness pass then injects the
	// surrounding Html/Head/Body. `brand` defaults to `acme`, so it's optional.
	let {
		preview,
		brand = acme,
		children
	}: { preview: string; brand?: Brand; children: Snippet } = $props();
</script>

<Preview children={preview} />
<Container class="my-8 rounded-2xl border border-neutral-200 bg-white">
	<Header {brand} />
	{@render children()}
	<Footer {brand} />
</Container>
