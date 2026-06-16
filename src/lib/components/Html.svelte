<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { mergeStyle } from '../style.js';
	import type { Style } from '../types.js';

	interface Props extends Omit<HTMLAttributes<HTMLHtmlElement>, 'style'> {
		lang?: HTMLAttributes<HTMLHtmlElement>['lang'];
		dir?: HTMLAttributes<HTMLHtmlElement>['dir'];
		style?: Style;
		children?: Snippet;
	}

	let { lang = 'en', dir = 'ltr', style, children, ...rest }: Props = $props();

	const s = $derived(mergeStyle(style));
</script>

<html {...rest} {dir} {lang} style={s || undefined}>
	{@render children?.()}
</html>
