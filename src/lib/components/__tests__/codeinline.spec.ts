import { describe, it, expect } from 'vitest';
import { renderToStaticString } from '../../../tests/render.js';
import CodeInline from '../../../tests/fixtures/CodeInlineCase.svelte';

describe('CodeInline', () => {
	it('renders the Orange.fr dual-render: <style> + .cino <code> + hidden .cio <span>', async () => {
		const html = await renderToStaticString(CodeInline);

		// The cino/cio fallback stylesheet.
		expect(html).toContain('meta ~ .cino');
		expect(html).toContain('meta ~ .cio');
		// The visible <code> carries the `cino` class (no default styling).
		expect(html).toContain('<code class="cino">const x = 1;</code>');
		// The Orange.fr-only <span> carries `cio` and is hidden by default.
		expect(html).toContain('<span class="cio" style="display:none;">const x = 1;</span>');

		expect(html).toMatchInlineSnapshot(
			`"<style>meta ~ .cino { display: none !important; opacity: 0 !important; } meta ~ .cio { display: block !important; }</style> <code class="cino">const x = 1;</code> <span class="cio" style="display:none;">const x = 1;</span>"`
		);
	});

	it('applies a user style object to the code (and after display:none on the span)', async () => {
		const html = await renderToStaticString(CodeInline, { style: { color: 'red' } });
		expect(html).toContain('<code class="cino" style="color:red;">const x = 1;</code>');
		expect(html).toContain('<span class="cio" style="display:none;color:red;">const x = 1;</span>');
	});
});
