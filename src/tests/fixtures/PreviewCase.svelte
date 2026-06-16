<script lang="ts">
	import { Preview } from '$lib/index.js';

	let { children }: { children: string | string[] } = $props();
</script>

<Preview {children} />
