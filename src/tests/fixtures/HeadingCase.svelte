<script lang="ts">
	import { Heading } from '$lib/index.js';
	import type { Style } from '$lib/index.js';

	let {
		as,
		style,
		m,
		mx,
		my,
		mt,
		mr,
		mb,
		ml
	}: {
		as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
		style?: Style;
		m?: string | number;
		mx?: string | number;
		my?: string | number;
		mt?: string | number;
		mr?: string | number;
		mb?: string | number;
		ml?: string | number;
	} = $props();
</script>

<Heading {as} {style} {m} {mx} {my} {mt} {mr} {mb} {ml}>content</Heading>
