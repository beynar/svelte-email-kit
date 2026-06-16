<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { mergeStyle, withMargin } from '../style.js';
	import type { Margin, Style } from '../types.js';

	interface Props extends Omit<HTMLAttributes<HTMLParagraphElement>, 'style'>, Margin {
		style?: Style;
		children?: Snippet;
	}

	let { m, mx, my, mt, mr, mb, ml, style, children, ...rest }: Props = $props();

	const s = $derived(
		mergeStyle(
			{ fontSize: '14px', lineHeight: '24px', margin: '16px 0' },
			withMargin({ m, mx, my, mt, mr, mb, ml }),
			style
		)
	);
</script>

<p {...rest} style={s || undefined}>{@render children?.()}</p>
