<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLTdAttributes } from 'svelte/elements';
	import { mergeStyle } from '../style.js';
	import type { Style } from '../types.js';

	interface Props extends Omit<HTMLTdAttributes, 'style'> {
		align?: HTMLTdAttributes['align'];
		valign?: HTMLTdAttributes['valign'];
		style?: Style;
		children?: Snippet;
	}

	let { align, valign, style, children, ...rest }: Props = $props();

	const s = $derived(mergeStyle(style));
</script>

<td {...rest} {align} {valign} style={s || undefined}>{@render children?.()}</td>
