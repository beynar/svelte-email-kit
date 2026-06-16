<script lang="ts">
	import { Font } from '$lib/index.js';
	import type { FallbackFont, FontFormat } from '$lib/index.js';

	let {
		fontFamily,
		fallbackFontFamily,
		webFont,
		fontStyle,
		fontWeight
	}: {
		fontFamily: string;
		fallbackFontFamily: FallbackFont | FallbackFont[];
		webFont?: { url: string; format: FontFormat };
		fontStyle?: string;
		fontWeight?: string | number;
	} = $props();
</script>

<Font {fontFamily} {fallbackFontFamily} {webFont} {fontStyle} {fontWeight} />
