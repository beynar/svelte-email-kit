<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { styleToString } from '../style.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children'> {
		children: string | string[];
	}

	let { children, ...rest }: Props = $props();

	const PREVIEW_MAX_LENGTH = 150;
	// Invisible Unicode run react-email pads the preview with: non-breaking space,
	// zero-width non-joiner, zero-width space, zero-width joiner, LTR/RTL marks,
	// and a zero-width no-break space.
	const whiteSpaceCodes = '\xa0‌​‍‎‏﻿';

	const text = $derived(
		(Array.isArray(children) ? children.join('') : children).substring(0, PREVIEW_MAX_LENGTH)
	);

	const previewStyle = styleToString({
		display: 'none',
		overflow: 'hidden',
		lineHeight: '1px',
		opacity: 0,
		maxHeight: 0,
		maxWidth: 0
	});

	const whiteSpace = $derived(whiteSpaceCodes.repeat(PREVIEW_MAX_LENGTH - text.length));
</script>

<div data-skip-in-text="true" {...rest} style={previewStyle}>
	{text}{#if text.length < PREVIEW_MAX_LENGTH}<div>{whiteSpace}</div>{/if}
</div>
