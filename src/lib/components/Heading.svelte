<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { mergeStyle, withMargin } from '../style.js';
	import type { Margin, Style } from '../types.js';

	interface Props extends Omit<HTMLAttributes<HTMLHeadingElement>, 'style'>, Margin {
		as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
		style?: Style;
		children?: Snippet;
	}

	let { as = 'h1', m, mx, my, mt, mr, mb, ml, style, children, ...rest }: Props = $props();

	const s = $derived(mergeStyle(withMargin({ m, mx, my, mt, mr, mb, ml }), style));
</script>

<svelte:element this={as} {...rest} style={s || undefined}>{@render children?.()}</svelte:element>
