<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLHeadElement> {
		children?: Snippet;
	}

	let { children, ...rest }: Props = $props();

	// react-email emits the canonical `Content-Type` casing; Svelte's `meta`
	// attribute union only allows the lowercase `content-type`, so spread a
	// plain record to keep the exact literal while satisfying svelte-check.
	const contentTypeMeta: Record<string, string> = {
		'http-equiv': 'Content-Type',
		content: 'text/html; charset=UTF-8'
	};
</script>

<!--
	PLAN §2 (Document model): Head is a real <head> element in the rendered tree,
	not svelte:head, so its markup lands inside render().body alongside <html>.
	The svelte/no-raw-special-elements rule is disabled here intentionally.
-->
<!-- eslint-disable-next-line svelte/no-raw-special-elements -->
<head {...rest}>
	<meta {...contentTypeMeta} />
	<meta name="x-apple-disable-message-reformatting" />
	{@render children?.()}
</head>
