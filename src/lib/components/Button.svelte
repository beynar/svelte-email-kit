<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import { parsePadding, pxToPt, styleToString } from '../style.js';
	import type { CSSProperties } from '../types.js';

	// `href`/`target` flow through `...rest`, so the props extend the anchor
	// attribute set (a superset of HTMLAttributes<HTMLAnchorElement>) that carries
	// them; the `style` object overrides the string-typed inherited `style`.
	interface Props extends Omit<HTMLAnchorAttributes, 'style'> {
		style?: CSSProperties;
		target?: string;
		children?: Snippet;
	}

	let { style = {}, target = '_blank', children, ...rest }: Props = $props();

	/**
	 * react-email's MSO padding hack. The hidden `<i>` spans Outlook renders use
	 * `mso-font-width` to fake horizontal padding; the content span uses
	 * `mso-text-raise` for vertical centering. We cap the per-space font width at
	 * `maxFontWidth` and add as many hair spaces as needed to fill the padding.
	 */
	const maxFontWidth = 5;
	function computeFontWidthAndSpaceCount(expectedWidth: number): readonly [number, number] {
		if (expectedWidth === 0) return [0, 0] as const;
		let smallestSpaceCount = 0;
		const computeRequiredFontWidth = () =>
			smallestSpaceCount > 0 ? expectedWidth / smallestSpaceCount / 2 : Number.POSITIVE_INFINITY;
		while (computeRequiredFontWidth() > maxFontWidth) smallestSpaceCount++;
		return [computeRequiredFontWidth(), smallestSpaceCount] as const;
	}

	const toPx = (value: string | number) => parseFloat(String(value).replace('px', ''));

	// `parsePadding` takes a shorthand, not a style object, so resolve the four
	// sides ourselves: start from the `padding` shorthand (if any), then let any
	// explicit longhand override its side.
	const base = $derived(
		style.padding !== undefined
			? parsePadding(style.padding)
			: { paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0 }
	);
	const pt = $derived(style.paddingTop !== undefined ? toPx(style.paddingTop) : base.paddingTop);
	const pr = $derived(
		style.paddingRight !== undefined ? toPx(style.paddingRight) : base.paddingRight
	);
	const pb = $derived(
		style.paddingBottom !== undefined ? toPx(style.paddingBottom) : base.paddingBottom
	);
	const pl = $derived(style.paddingLeft !== undefined ? toPx(style.paddingLeft) : base.paddingLeft);

	const y = $derived(pt + pb);
	const textRaise = $derived(pxToPt(y));
	const left = $derived(computeFontWidthAndSpaceCount(pl));
	const right = $derived(computeFontWidthAndSpaceCount(pr));

	// Our `styleToString` does not append `px`, so write padding longhands as
	// explicit `px` strings to match react-email's React-appended output.
	const anchorStyle = $derived(
		styleToString({
			lineHeight: '100%',
			textDecoration: 'none',
			display: 'inline-block',
			maxWidth: '100%',
			msoPaddingAlt: '0px',
			...style,
			paddingTop: `${pt}px`,
			paddingRight: `${pr}px`,
			paddingBottom: `${pb}px`,
			paddingLeft: `${pl}px`
		} as Record<string, string | number> as CSSProperties)
	);

	const contentStyle = $derived(
		styleToString({
			maxWidth: '100%',
			display: 'inline-block',
			lineHeight: '120%',
			msoPaddingAlt: '0px',
			msoTextRaise: `${pxToPt(pb)}px`
		} as Record<string, string | number> as CSSProperties)
	);

	const leftMso = $derived(
		`<!--[if mso]><i style="mso-font-width:${left[0] * 100}%;mso-text-raise:${textRaise}" hidden>${'&#8202;'.repeat(left[1])}</i><![endif]-->`
	);
	const rightMso = $derived(
		`<!--[if mso]><i style="mso-font-width:${right[0] * 100}%" hidden>${'&#8202;'.repeat(right[1])}&#8203;</i><![endif]-->`
	);
</script>

<!--
	The MSO conditional comments must be emitted verbatim as raw HTML — Svelte
	would otherwise strip/escape them — so `{@html}` is the only option here. The
	content is a fixed, internally-built MSO string (no user input), so the XSS
	rule does not apply.
-->
<!-- eslint-disable svelte/no-at-html-tags -->
<a {...rest} {target} style={anchorStyle || undefined}
	>{@html leftMso}<span style={contentStyle}>{@render children?.()}</span>{@html rightMso}</a
>
<!-- eslint-enable svelte/no-at-html-tags -->
