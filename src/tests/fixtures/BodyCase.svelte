<script lang="ts">
	import { Body } from '$lib/index.js';
	import type { Style } from '$lib/index.js';

	let { style }: { style?: Style } = $props();
</script>

<Body {style}>content</Body>
