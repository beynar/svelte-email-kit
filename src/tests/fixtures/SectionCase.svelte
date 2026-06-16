<script lang="ts">
	import { Section } from '$lib/index.js';
	import type { Style } from '$lib/index.js';

	let { style }: { style?: Style } = $props();
</script>

<Section {style}>content</Section>
