<script lang="ts">
	import { Column } from '$lib/index.js';
	import type { Style } from '$lib/index.js';

	let { style }: { style?: Style } = $props();
</script>

<Column align="center" valign="top" {style}>content</Column>
