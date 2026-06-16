import type { CSSProperties, Margin, Style } from './types.js';

/**
 * Serialize a typed CSS object into an inline-style string.
 *
 * - Keys whose value is `null`/`undefined` are skipped.
 * - camelCase keys become kebab-case via
 *   `key.split(/(?=[A-Z])/).join('-').toLowerCase()`, so `msoPaddingAlt`
 *   becomes `mso-padding-alt` and `WebkitFoo` becomes `-webkit-foo`.
 * - Values are emitted as-is (no automatic `px` suffix).
 */
export function styleToString(style: CSSProperties): string {
	return (Object.keys(style) as Array<keyof CSSProperties>).reduce((acc, key) => {
		const value = style[key];
		if (value === null || value === undefined) {
			return acc;
		}
		const property = String(key)
			.split(/(?=[A-Z])/)
			.join('-')
			.toLowerCase();
		return `${acc}${property}:${value};`;
	}, '');
}

/**
 * Convert a pixel value to points (`(px * 3) / 4`). Returns `null` when the
 * input does not parse to a number.
 */
export function pxToPt(px: string | number): number | null {
	const parsed = parseFloat(px as string);
	return isNaN(parsed) ? null : (parsed * 3) / 4;
}

/**
 * Apply a single spacing value to the given longhand properties, appending
 * `px` to the value. Returns an empty object when the value is falsy.
 */
function withSpace(
	value: string | number | undefined,
	properties: Array<keyof CSSProperties>
): CSSProperties {
	return properties.reduce<CSSProperties>((styles, property) => {
		if (value || value === 0) {
			return { ...styles, [property]: `${value}px` };
		}
		return styles;
	}, {});
}

/**
 * Resolve margin shorthand props (`m`, `mx`, `my`, `mt`, `mr`, `mb`, `ml`)
 * into `margin*` longhands. Mirrors svelte-email: the first shorthand that
 * produces any keys wins.
 */
export function withMargin(props: Margin): CSSProperties {
	const margins = [
		withSpace(props.m, ['margin']),
		withSpace(props.mx, ['marginLeft', 'marginRight']),
		withSpace(props.my, ['marginTop', 'marginBottom']),
		withSpace(props.mt, ['marginTop']),
		withSpace(props.mr, ['marginRight']),
		withSpace(props.mb, ['marginBottom']),
		withSpace(props.ml, ['marginLeft'])
	].filter((style) => Object.keys(style).length);
	return margins[0] ?? {};
}

/**
 * Parse a CSS `padding` shorthand (1–4 space-separated values, `px` stripped)
 * into its four resolved sides following CSS rules:
 * 1 value → all sides, 2 → [vertical, horizontal], 3 → [top, horizontal,
 * bottom], 4 → [top, right, bottom, left].
 */
export function parsePadding(padding: string | number): {
	paddingTop: number;
	paddingRight: number;
	paddingBottom: number;
	paddingLeft: number;
} {
	const values = String(padding)
		.trim()
		.split(/\s+/)
		.map((value) => parseFloat(value.replace('px', '')));

	let top: number;
	let right: number;
	let bottom: number;
	let left: number;

	switch (values.length) {
		case 1:
			top = right = bottom = left = values[0];
			break;
		case 2:
			top = bottom = values[0];
			right = left = values[1];
			break;
		case 3:
			top = values[0];
			right = left = values[1];
			bottom = values[2];
			break;
		default:
			top = values[0];
			right = values[1];
			bottom = values[2];
			left = values[3];
			break;
	}

	return { paddingTop: top, paddingRight: right, paddingBottom: bottom, paddingLeft: left };
}

/**
 * Merge object and/or string styles into a single inline-style string,
 * left-to-right. Object styles are serialized with `styleToString`; string
 * styles are normalized to end with a single `;`.
 */
export function mergeStyle(...inputs: Array<Style | undefined>): string {
	return inputs.reduce<string>((acc, input) => {
		if (input === null || input === undefined) {
			return acc;
		}
		if (typeof input === 'string') {
			const trimmed = input.trim();
			if (!trimmed) {
				return acc;
			}
			return `${acc}${trimmed.endsWith(';') ? trimmed : `${trimmed};`}`;
		}
		return `${acc}${styleToString(input)}`;
	}, '');
}
