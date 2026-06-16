<script lang="ts">
	import { Button } from '$lib/index.js';
	import type { CSSProperties } from '$lib/index.js';

	let { href, target, style }: { href?: string; target?: string; style?: CSSProperties } = $props();
</script>

<Button {href} {target} {style}>Click me</Button>
