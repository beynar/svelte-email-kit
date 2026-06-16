<script lang="ts">
	import { Img } from '$lib/index.js';
	import type { Style } from '$lib/index.js';

	let {
		src,
		alt,
		width,
		height,
		style
	}: {
		src?: string;
		alt?: string;
		width?: string | number;
		height?: string | number;
		style?: Style;
	} = $props();
</script>

<Img {src} {alt} {width} {height} {style} />
