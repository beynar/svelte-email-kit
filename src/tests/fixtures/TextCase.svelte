<script lang="ts">
	import { Text } from '$lib/index.js';
	import type { Style } from '$lib/index.js';

	let { style }: { style?: Style } = $props();
</script>

<Text {style}>content</Text>
