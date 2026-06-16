import type { CSSProperties } from './types.js';

/** Convert a camelCase property name to kebab-case (`fontSize` → `font-size`). */
function camelToKebabCase(str: string): string {
	return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/** Escape double quotes in string values so the result is safe inside `style="…"`. */
function escapeQuotes(value: unknown): unknown {
	if (typeof value === 'string' && value.includes('"')) {
		return value.replace(/"/g, '&#x27;');
	}
	return value;
}

/**
 * CSS-in-JS serializer ported from react-email. Unlike {@link styleToString},
 * this appends `px` to *numeric* values, but **only** for the dimension-like
 * properties listed in `numericalCssProperties`. This matches react-email's
 * Markdown/CodeBlock output byte-for-byte.
 *
 * Double quotes in values are escaped to `&#x27;` by default so the result is
 * safe to embed in a raw-HTML `style="…"` attribute (e.g. inside `{@html}`).
 * Pass `{ escapeQuotes: false }` when the result feeds a Svelte-bound
 * `style={…}` attribute — Svelte escapes it once, and pre-escaping would
 * double-encode (`"` → `&#x27;` → `&amp;#x27;`).
 *
 * @param cssProperties - A typed CSS object (or `undefined`).
 * @param options - `escapeQuotes` (default `true`) toggles quote escaping.
 * @returns A `;`-joined inline-css string, or `''` when `cssProperties` is undefined.
 */
export function parseCssInJsToInlineCss(
	cssProperties?: CSSProperties,
	options: { escapeQuotes?: boolean } = {}
): string {
	if (!cssProperties) return '';
	const { escapeQuotes: shouldEscapeQuotes = true } = options;

	const numericalCssProperties = [
		'width',
		'height',
		'margin',
		'marginTop',
		'marginRight',
		'marginBottom',
		'marginLeft',
		'padding',
		'paddingTop',
		'paddingRight',
		'paddingBottom',
		'paddingLeft',
		'borderWidth',
		'borderTopWidth',
		'borderRightWidth',
		'borderBottomWidth',
		'borderLeftWidth',
		'outlineWidth',
		'top',
		'right',
		'bottom',
		'left',
		'fontSize',
		'letterSpacing',
		'wordSpacing',
		'maxWidth',
		'minWidth',
		'maxHeight',
		'minHeight',
		'borderRadius',
		'borderTopLeftRadius',
		'borderTopRightRadius',
		'borderBottomLeftRadius',
		'borderBottomRightRadius',
		'textIndent',
		'gridColumnGap',
		'gridRowGap',
		'gridGap',
		'translateX',
		'translateY'
	];

	return Object.entries(cssProperties)
		.map(([property, value]) => {
			if (typeof value === 'number' && numericalCssProperties.includes(property)) {
				return `${camelToKebabCase(property)}:${value}px`;
			}

			const finalValue = shouldEscapeQuotes ? escapeQuotes(value) : value;
			return `${camelToKebabCase(property)}:${finalValue}`;
		})
		.join(';');
}
