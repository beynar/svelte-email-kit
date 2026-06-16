<script lang="ts">
	import { CodeBlock } from '$lib/index.js';
	import type { Theme, Style } from '$lib/index.js';

	let {
		code,
		language,
		theme,
		lineNumbers,
		fontFamily,
		style
	}: {
		code: string;
		language: string;
		theme: Theme;
		lineNumbers?: boolean;
		fontFamily?: string;
		style?: Style;
	} = $props();
</script>

<CodeBlock {code} {language} {theme} {lineNumbers} {fontFamily} {style} />
