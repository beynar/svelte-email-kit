<script lang="ts">
	import { Link } from '$lib/index.js';
	import type { Style } from '$lib/index.js';

	let { href, target, style }: { href?: string; target?: string; style?: Style } = $props();
</script>

<Link {href} {target} {style}>content</Link>
