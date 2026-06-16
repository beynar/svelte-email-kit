import { describe, it, expect } from 'vitest';
import { styleToString, pxToPt, parsePadding, withMargin, mergeStyle } from './style.js';
import type { CSSProperties } from './types.js';

describe('styleToString', () => {
	it('converts camelCase keys to kebab-case', () => {
		expect(styleToString({ fontSize: '14px', lineHeight: '24px' })).toBe(
			'font-size:14px;line-height:24px;'
		);
	});

	it('kebab-cases mso-prefixed keys (msoPaddingAlt → mso-padding-alt)', () => {
		// mso-* properties are not part of csstype, so cast through a string-keyed record.
		expect(styleToString({ msoPaddingAlt: '0px' } as Record<string, string> as CSSProperties)).toBe(
			'mso-padding-alt:0px;'
		);
	});

	it('emits values as-is without appending px', () => {
		expect(styleToString({ lineHeight: 24 })).toBe('line-height:24;');
	});

	it('skips keys whose value is null or undefined', () => {
		expect(
			styleToString({ color: 'red', margin: undefined, padding: null } as unknown as CSSProperties)
		).toBe('color:red;');
	});

	it('returns an empty string for an empty object', () => {
		expect(styleToString({})).toBe('');
	});
});

describe('pxToPt', () => {
	it('converts 16 to 12', () => {
		expect(pxToPt(16)).toBe(12);
	});

	it('parses numeric strings', () => {
		expect(pxToPt('16px')).toBe(12);
	});

	it('returns null for non-numeric input', () => {
		expect(pxToPt('not-a-number')).toBeNull();
	});
});

describe('parsePadding', () => {
	it('expands a single value to all four sides', () => {
		expect(parsePadding('10px')).toEqual({
			paddingTop: 10,
			paddingRight: 10,
			paddingBottom: 10,
			paddingLeft: 10
		});
	});

	it('treats two values as [vertical, horizontal]', () => {
		expect(parsePadding('10px 20px')).toEqual({
			paddingTop: 10,
			paddingRight: 20,
			paddingBottom: 10,
			paddingLeft: 20
		});
	});

	it('treats three values as [top, horizontal, bottom]', () => {
		expect(parsePadding('10px 20px 30px')).toEqual({
			paddingTop: 10,
			paddingRight: 20,
			paddingBottom: 30,
			paddingLeft: 20
		});
	});

	it('treats four values as [top, right, bottom, left]', () => {
		expect(parsePadding('10px 20px 30px 40px')).toEqual({
			paddingTop: 10,
			paddingRight: 20,
			paddingBottom: 30,
			paddingLeft: 40
		});
	});

	it('accepts a bare number', () => {
		expect(parsePadding(12)).toEqual({
			paddingTop: 12,
			paddingRight: 12,
			paddingBottom: 12,
			paddingLeft: 12
		});
	});
});

describe('withMargin', () => {
	it('maps the `m` shorthand to a single margin longhand with px', () => {
		expect(withMargin({ m: 16 })).toEqual({ margin: '16px' });
	});

	it('maps `mx` to left and right margins', () => {
		expect(withMargin({ mx: 8 })).toEqual({ marginLeft: '8px', marginRight: '8px' });
	});

	it('maps `my` to top and bottom margins', () => {
		expect(withMargin({ my: '12' })).toEqual({ marginTop: '12px', marginBottom: '12px' });
	});

	it('maps individual side shorthands', () => {
		expect(withMargin({ mt: 4 })).toEqual({ marginTop: '4px' });
	});

	it('returns the first shorthand that produces keys', () => {
		expect(withMargin({ m: 16, mt: 4 })).toEqual({ margin: '16px' });
	});

	it('returns an empty object when no shorthand is provided', () => {
		expect(withMargin({})).toEqual({});
	});
});

describe('mergeStyle', () => {
	it('merges an object style and a string style into one string', () => {
		expect(mergeStyle({ color: 'red' }, 'font-weight:bold')).toBe('color:red;font-weight:bold;');
	});

	it('preserves left-to-right order', () => {
		expect(mergeStyle('a:1', { b: 2 } as Record<string, number> as CSSProperties)).toBe('a:1;b:2;');
	});

	it('does not double up trailing semicolons on string input', () => {
		expect(mergeStyle('color:red;')).toBe('color:red;');
	});

	it('ignores undefined inputs', () => {
		expect(mergeStyle(undefined, { color: 'blue' }, undefined)).toBe('color:blue;');
	});
});
