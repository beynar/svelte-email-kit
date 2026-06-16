<script lang="ts">
	import { Markdown } from '$lib/index.js';
	import type { StylesType, CSSProperties } from '$lib/index.js';

	let {
		children,
		markdownCustomStyles,
		markdownContainerStyles
	}: {
		children: string;
		markdownCustomStyles?: StylesType;
		markdownContainerStyles?: CSSProperties;
	} = $props();
</script>

<Markdown {children} {markdownCustomStyles} {markdownContainerStyles} />
