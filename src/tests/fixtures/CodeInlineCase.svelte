<script lang="ts">
	import { CodeInline } from '$lib/index.js';
	import type { Style } from '$lib/index.js';

	let { style }: { style?: Style } = $props();
</script>

<CodeInline {style}>const x = 1;</CodeInline>
