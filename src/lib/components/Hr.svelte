<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { mergeStyle } from '../style.js';
	import type { Style } from '../types.js';

	interface Props extends Omit<HTMLAttributes<HTMLHRElement>, 'style'> {
		style?: Style;
	}

	let { style, ...rest }: Props = $props();

	const s = $derived(
		mergeStyle(
			{ width: '100%', border: 'none', borderTop: '1px solid #eaeaea', margin: '26px 0' },
			style
		)
	);
</script>

<hr {...rest} style={s || undefined} />
