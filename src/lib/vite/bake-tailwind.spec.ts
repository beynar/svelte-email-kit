import { describe, it, expect } from 'vitest';
import { extractClasses } from './extract-classes.js';
import { generateTailwindMap } from '../internal/tailwind/generate-map.js';
import { bakeTailwind } from './bake-tailwind.js';

/** Build the class→style map the same way the plugin will, then bake. */
async function bake(source: string): Promise<string> {
	const map = await generateTailwindMap(extractClasses(source).classes);
	return bakeTailwind(source, map);
}

describe('bakeTailwind — static classes', () => {
	it('inlines a static class to a style and drops the class attribute', async () => {
		const out = await bake('<a class="text-red-500 bg-blue-500">x</a>');
		expect(out).toContain('style="color:rgb(251, 44, 54);background-color:rgb(43, 127, 255);"');
		expect(out).not.toContain('class=');
	});

	it('merges with an existing style — author declarations win (emitted after)', async () => {
		const out = await bake('<a style="font-weight:bold" class="text-red-500">x</a>');
		expect(out).toContain('style="color:rgb(251, 44, 54);font-weight:bold"');
		expect(out).not.toContain('class=');
	});

	it('keeps unknown (non-Tailwind) classes untouched alongside the inlined style', async () => {
		const out = await bake('<a class="text-red-500 my-custom">x</a>');
		expect(out).toContain('color:rgb(251, 44, 54)');
		expect(out).toContain('class="my-custom"');
	});

	it('hoists variant classes into the Head <style> and keeps them sanitized on the element', async () => {
		const source =
			'<Html><Head/><Body><a class="sm:text-lg hover:underline px-5">x</a></Body></Html>';
		const out = await bake(source);
		// The element keeps the sanitized variant classes…
		expect(out).toContain('class="sm_text-lg hover_underline"');
		// …and gets the inlinable px-5 as a style.
		expect(out).toContain('style="padding-left:20px;padding-right:20px;"');
		// The Head now carries the hoisted rules via {@html '<style>…</style>'}.
		expect(out).toContain("{@html '<style>");
		expect(out).toContain('@media (min-width: 640px){.sm_text-lg{');
		expect(out).toContain('.hover_underline:hover{');
		expect(out).toContain("</style>'}");
		// The original <Head/> was expanded to an open/close pair.
		expect(out).toContain('<Head>');
		expect(out).toContain('</Head>');
	});

	it('throws when variant rules are produced but there is no <Head>', async () => {
		const source = '<div class="sm:text-lg">x</div>';
		const map = await generateTailwindMap(extractClasses(source).classes);
		expect(() => bakeTailwind(source, map)).toThrow(/no <Head>/);
	});

	it('expands a self-closing <Head/> to <Head>…</Head> when there are hoisted rules', async () => {
		const source = '<Html><Head/><Body><a class="hover:underline">x</a></Body></Html>';
		const out = await bake(source);
		expect(out).not.toContain('<Head/>');
		expect(out).toMatch(/<Head>\{@html '<style>.*<\/style>'\}<\/Head>/);
	});

	it('preserves attributes on a self-closing <Head .../> when expanding it', async () => {
		const source = '<Html><Head class="dark"/><Body><a class="hover:underline">x</a></Body></Html>';
		const out = await bake(source);
		expect(out).toContain('<Head class="dark">{@html');
		expect(out).toContain('</Head>');
	});

	it('injects into an already-open <Head></Head> without breaking it', async () => {
		const source =
			'<Html><Head><title>Hi</title></Head><Body><a class="hover:underline">x</a></Body></Html>';
		const out = await bake(source);
		// Existing head children are preserved; the style is injected as the last child.
		expect(out).toContain('<title>Hi</title>{@html');
		expect(out).toContain("</style>'}</Head>");
	});

	it('returns the source unchanged when nothing is recognized', async () => {
		const source = '<a class="totally-not-tailwind another-one">x</a>';
		const out = await bake(source);
		expect(out).toBe(source);
	});
});

describe('bakeTailwind — dynamic classes (Phase 3)', () => {
	it('rewrites a ternary of inlinable literals via the __tw helper', async () => {
		const out = await bake(`<a class={cond ? 'bg-red-500' : 'bg-blue-500'}>x</a>`);
		// The element is rewritten to helper-driven style + class.
		expect(out).toContain(`style={__twStyle((cond ? 'bg-red-500' : 'bg-blue-500'))}`);
		expect(out).toContain(`class={__twClass((cond ? 'bg-red-500' : 'bg-blue-500'))}`);
		// The original `class={…}` attribute is gone.
		expect(out).not.toContain(`class={cond`);
		// The helper block is injected once, with both branches' inline decls baked.
		expect(out).toContain('const __twMap = {');
		expect(out).toContain('function __twStyle(cls)');
		expect(out).toContain('function __twClass(cls)');
		expect(out).toContain(`'bg-red-500': 'background-color:rgb(251, 44, 54);'`);
		expect(out).toContain(`'bg-blue-500': 'background-color:rgb(43, 127, 255);'`);
	});

	it('hoists a variant referenced only in a dynamic branch into the Head', async () => {
		const source = `<Html><Head/><Body><a class={cond ? 'sm:text-lg' : 'px-5'}>x</a></Body></Html>`;
		const out = await bake(source);
		// The variant is renamed in the baked map…
		expect(out).toContain(`'sm:text-lg': 'sm_text-lg'`);
		// …and the inlinable branch lands in `inline`.
		expect(out).toContain(`'px-5': 'padding-left:20px;padding-right:20px;'`);
		// The Head carries the hoisted @media rule even though it lives in a branch.
		expect(out).toContain("{@html '<style>");
		expect(out).toContain('@media (min-width: 640px){.sm_text-lg{');
		expect(out).toContain("</style>'}");
	});

	it('rewrites a template class with a static prefix and an interpolation', async () => {
		const out = await bake(`<a class="px-4 {cond ? 'bg-red-500' : ''}">x</a>`);
		// CLS preserves the static literal prefix and chains the interpolation.
		expect(out).toContain(`style={__twStyle('px-4 ' + (cond ? 'bg-red-500' : ''))}`);
		expect(out).toContain(`class={__twClass('px-4 ' + (cond ? 'bg-red-500' : ''))}`);
		expect(out).toContain(`'px-4': 'padding-left:16px;padding-right:16px;'`);
		expect(out).toContain(`'bg-red-500': 'background-color:rgb(251, 44, 54);'`);
	});

	it('folds a class: directive into CLS and removes the directive', async () => {
		const out = await bake('<a class="px-4" class:font-bold={x}>x</a>');
		// The static class becomes a literal term; the directive a conditional term.
		expect(out).toContain(`style={__twStyle('px-4' + (x ? ' font-bold' : ''))}`);
		expect(out).toContain(`class={__twClass('px-4' + (x ? ' font-bold' : ''))}`);
		// No `class:` directive remains.
		expect(out).not.toContain('class:font-bold');
		// Both classes are in the baked map.
		expect(out).toContain(`'px-4': 'padding-left:16px;padding-right:16px;'`);
		expect(out).toContain(`'font-bold': 'font-weight:700;'`);
	});

	it('merges an existing static style after the helper output (author wins)', async () => {
		const out = await bake(`<a style="font-weight:bold" class={cond ? 'text-red-500' : ''}>x</a>`);
		expect(out).toContain(
			`style={__twStyle((cond ? 'text-red-500' : '')) + 'font-weight:bold'} class={__twClass((cond ? 'text-red-500' : ''))}`
		);
		// The original static `style` attribute was merged away.
		expect(out).not.toContain('style="font-weight:bold"');
	});

	it('injects the helper exactly once across multiple dynamic elements', async () => {
		const source = `<a class={cond ? 'bg-red-500' : ''}>x</a><a class:font-bold={y}>y</a>`;
		const out = await bake(source);
		expect(out.match(/const __twMap = \{/g)).toHaveLength(1);
		expect(out.match(/function __twStyle/g)).toHaveLength(1);
	});

	it('appends the helper to an existing instance <script>', async () => {
		const source = `<script>let cond = true;</script>\n<a class={cond ? 'bg-red-500' : ''}>x</a>`;
		const out = await bake(source);
		// No second <script> is created; the original declaration is preserved.
		expect(out.match(/<script>/g)).toHaveLength(1);
		expect(out).toContain('let cond = true;');
		expect(out).toContain('const __twMap = {');
	});

	it('does NOT inject the helper for a static-only email (Phase 2 path)', async () => {
		const out = await bake('<a class="text-red-500 bg-blue-500">x</a>');
		expect(out).not.toContain('__twMap');
		expect(out).not.toContain('__twStyle');
		expect(out).not.toContain('__twClass');
		// And the Phase 2 baking still produced the inline style.
		expect(out).toContain('style="color:rgb(251, 44, 54);background-color:rgb(43, 127, 255);"');
	});

	it('preserves other attributes on a dynamic element', async () => {
		const out = await bake(`<a href="#" class={cond ? 'bg-red-500' : ''} id="x">y</a>`);
		expect(out).toContain('href="#"');
		expect(out).toContain('id="x"');
		expect(out).toContain('style={__twStyle');
	});
});
