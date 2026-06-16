import { describe, it, expect } from 'vitest';
import { renderToStaticString } from '../../../tests/render.js';
import Font from '../../../tests/fixtures/FontCase.svelte';
import FontInHead from '../../../tests/fixtures/FontInHeadCase.svelte';

describe('Font', () => {
	it('emits an @font-face plus a `*` fallback rule from a web font', async () => {
		const html = await renderToStaticString(Font, {
			fontFamily: 'Roboto',
			fallbackFontFamily: 'Verdana',
			webFont: { url: 'https://example.com/roboto.woff2', format: 'woff2' }
		});

		// Rendered as a real <style> element (not swallowed as component CSS).
		expect(html).toContain('<style>');
		expect(html).toContain('</style>');
		expect(html).toContain('@font-face');
		expect(html).toContain("font-family: 'Roboto'");
		expect(html).toContain('font-style: normal');
		expect(html).toContain('font-weight: 400');
		expect(html).toContain("mso-font-alt: 'Verdana'");
		expect(html).toContain("src: url(https://example.com/roboto.woff2) format('woff2')");
		// The global rule applies the family with its fallback.
		expect(html).toContain('* {');
		expect(html).toContain("font-family: 'Roboto', Verdana;");

		expect(html).toMatchInlineSnapshot(`
			"<style>
			    @font-face {
			      font-family: 'Roboto';
			      font-style: normal;
			      font-weight: 400;
			      mso-font-alt: 'Verdana';
			      src: url(https://example.com/roboto.woff2) format('woff2');
			    }

			    * {
			      font-family: 'Roboto', Verdana;
			    }
			  </style>"
		`);
	});

	it('uses only the first fallback for mso-font-alt and joins the rest in `*`', async () => {
		const html = await renderToStaticString(Font, {
			fontFamily: 'Roboto',
			fallbackFontFamily: ['Verdana', 'Arial'],
			webFont: { url: 'https://example.com/roboto.woff2', format: 'woff2' }
		});

		// Outlook only takes the first fallback.
		expect(html).toContain("mso-font-alt: 'Verdana'");
		expect(html).not.toContain("mso-font-alt: 'Verdana, Arial'");
		// The global rule joins every fallback.
		expect(html).toContain("font-family: 'Roboto', Verdana, Arial;");
	});

	it('omits the src declaration when no web font is given', async () => {
		const html = await renderToStaticString(Font, {
			fontFamily: 'Roboto',
			fallbackFontFamily: 'Verdana'
		});

		expect(html).toContain('@font-face');
		expect(html).toContain("font-family: 'Roboto'");
		// No web font → no src declaration at all.
		expect(html).not.toContain('src:');
		expect(html).not.toContain('url(');
	});

	it('renders inside <head> with no Svelte hydration markers', async () => {
		const html = await renderToStaticString(FontInHead);

		// The <style> font block lands inside the real <head> element.
		expect(html).toMatch(/<head[\s\S]*<style>[\s\S]*@font-face[\s\S]*<\/style>[\s\S]*<\/head>/);
		expect(html).toContain("font-family: 'Roboto'");
		expect(html).toContain("src: url(https://example.com/roboto.woff2) format('woff2')");

		// cleanSvelteMarkup strips every hydration artifact.
		expect(html).not.toMatch(/<!--[a-z0-9]+-->/);
		expect(html).not.toContain('<!--[-->');
	});
});
