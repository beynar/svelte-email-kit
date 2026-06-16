import type { Properties } from 'csstype';

/**
 * A typed CSS object — `csstype`'s `Properties` allowing both string and
 * numeric values (e.g. `{ color: 'red', lineHeight: 24 }`).
 */
export type CSSProperties = Properties<string | number>;

/**
 * Margin shorthand props shared by components that support spacing
 * convenience props. Each maps to one or more `margin*` longhands.
 */
export interface Margin {
	m?: string | number;
	mx?: string | number;
	my?: string | number;
	mt?: string | number;
	mr?: string | number;
	mb?: string | number;
	ml?: string | number;
}

/**
 * A component `style` prop value: either a typed CSS object or a raw CSS
 * string (escape hatch).
 */
export type Style = CSSProperties | string;
