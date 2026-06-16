<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { mergeStyle } from '../style.js';
	import type { Style } from '../types.js';

	interface Props extends Omit<HTMLAttributes<HTMLImageElement>, 'style'> {
		src?: string;
		alt?: string;
		width?: string | number;
		height?: string | number;
		style?: Style;
	}

	let { src, alt, width, height, style, ...rest }: Props = $props();

	const s = $derived(
		mergeStyle({ display: 'block', outline: 'none', border: 'none', textDecoration: 'none' }, style)
	);
</script>

<img {...rest} {src} {alt} {width} {height} style={s || undefined} />
