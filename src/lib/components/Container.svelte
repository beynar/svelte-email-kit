<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { mergeStyle } from '../style.js';
	import type { Style } from '../types.js';

	interface Props extends Omit<HTMLAttributes<HTMLTableElement>, 'style'> {
		style?: Style;
		children?: Snippet;
	}

	let { style, children, ...rest }: Props = $props();

	const s = $derived(mergeStyle({ maxWidth: '37.5em' }, style));
</script>

<table
	align="center"
	width="100%"
	border={0}
	cellpadding="0"
	cellspacing="0"
	role="presentation"
	{...rest}
	style={s || undefined}
>
	<tbody>
		<tr style="width:100%">
			<td>{@render children?.()}</td>
		</tr>
	</tbody>
</table>
