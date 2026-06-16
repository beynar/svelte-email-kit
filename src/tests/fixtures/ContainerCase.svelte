<script lang="ts">
	import { Container } from '$lib/index.js';
	import type { Style } from '$lib/index.js';

	let { style }: { style?: Style } = $props();
</script>

<Container {style}>content</Container>
