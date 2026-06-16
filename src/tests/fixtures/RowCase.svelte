<script lang="ts">
	import { Row, Column } from '$lib/index.js';
	import type { Style } from '$lib/index.js';

	let { style }: { style?: Style } = $props();
</script>

<Row {style}><Column>content</Column></Row>
