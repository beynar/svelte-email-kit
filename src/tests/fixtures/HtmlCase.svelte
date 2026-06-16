<script lang="ts">
	import { Html } from '$lib/index.js';
	import type { Style } from '$lib/index.js';

	let { style }: { style?: Style } = $props();
</script>

<Html {style}>content</Html>
