import { describe, it, expect } from 'vitest';
import { renderToStaticString } from '../../../tests/render.js';
import Preview from '../../../tests/fixtures/PreviewCase.svelte';

const PREVIEW_MAX_LENGTH = 150;
// The 7-char invisible Unicode run react-email pads with.
const whiteSpaceCodes = '\xa0‌​‍‎‏﻿';

describe('Preview', () => {
	it('renders the hidden container with the skip marker', async () => {
		const html = await renderToStaticString(Preview, { children: 'Hello there' });
		expect(html).toContain('data-skip-in-text="true"');
		expect(html).toContain(
			'style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0;"'
		);
	});

	it('pads short text with the invisible whitespace run to ~150 chars', async () => {
		const text = 'Hello there';
		const html = await renderToStaticString(Preview, { children: text });
		const expectedPadding = whiteSpaceCodes.repeat(PREVIEW_MAX_LENGTH - text.length);

		// Visible text is present, followed by the padding <div>.
		expect(html).toContain(text);
		expect(html).toContain(`<div>${expectedPadding}</div>`);
		// Padding fills the gap to PREVIEW_MAX_LENGTH "characters".
		expect(expectedPadding.length).toBe(
			(PREVIEW_MAX_LENGTH - text.length) * whiteSpaceCodes.length
		);
	});

	it('joins an array of strings before measuring', async () => {
		const html = await renderToStaticString(Preview, { children: ['Foo', 'Bar'] });
		expect(html).toContain('FooBar');
		const expectedPadding = whiteSpaceCodes.repeat(PREVIEW_MAX_LENGTH - 'FooBar'.length);
		expect(html).toContain(`<div>${expectedPadding}</div>`);
	});

	it('truncates long text to 150 chars and omits the padding div', async () => {
		const long = 'a'.repeat(200);
		const html = await renderToStaticString(Preview, { children: long });
		// Truncated to exactly 150 chars.
		expect(html).toContain('a'.repeat(PREVIEW_MAX_LENGTH));
		expect(html).not.toContain('a'.repeat(PREVIEW_MAX_LENGTH + 1));
		// No padding div when the text already meets the cap.
		expect(html).not.toContain(whiteSpaceCodes);
	});
});
