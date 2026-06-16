<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { mergeStyle } from '../style.js';
	import type { Style } from '../types.js';

	interface Props extends Omit<HTMLAttributes<HTMLBodyElement>, 'style'> {
		style?: Style;
		children?: Snippet;
	}

	let { style, children, ...rest }: Props = $props();

	const s = $derived(mergeStyle(style));
</script>

<!--
	PLAN §2 (Document model): Html/Head/Body must be real elements in the rendered
	tree (not svelte:head/svelte:body), so render().body contains the whole
	<html>…</html> document. The svelte/no-raw-special-elements rule pushes toward
	svelte:body, which would hoist content out of the SSR body string and break
	the email document model — so it is disabled here intentionally.
-->
<!-- eslint-disable-next-line svelte/no-raw-special-elements -->
<body {...rest} style={s || undefined}>
	{@render children?.()}
</body>
