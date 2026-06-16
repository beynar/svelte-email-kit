import { describe, it, expect } from 'vitest';
import { extractClasses } from './extract-classes.js';

/** Helper: the class token set, order-independent. */
const classSet = (source: string) => new Set(extractClasses(source).classes);

describe('extractClasses', () => {
	it('extracts static class tokens', () => {
		const { classes, dynamic } = extractClasses('<a class="bg-blue-500 px-4">x</a>');
		expect(classes).toEqual(['bg-blue-500', 'px-4']);
		expect(dynamic).toEqual([]);
	});

	it('collects both branches of a ternary of literals', () => {
		const { classes, dynamic } = extractClasses(
			`<a class={cond ? 'bg-red-500' : 'bg-blue-500'}>x</a>`
		);
		expect(classSet(`<a class={cond ? 'bg-red-500' : 'bg-blue-500'}>x</a>`)).toEqual(
			new Set(['bg-red-500', 'bg-blue-500'])
		);
		expect(classes).toContain('bg-red-500');
		expect(classes).toContain('bg-blue-500');
		expect(dynamic).toEqual([]);
	});

	it('handles a template-literal class with a static part and a conditional interpolation', () => {
		const { classes, dynamic } = extractClasses(`<a class="px-4 {cond ? 'bg-red-500' : ''}">x</a>`);
		expect(new Set(classes)).toEqual(new Set(['px-4', 'bg-red-500']));
		expect(dynamic).toEqual([]);
	});

	it('captures a class: directive name alongside a static class', () => {
		const { classes, dynamic } = extractClasses('<a class:active={cond} class="px-4">x</a>');
		expect(new Set(classes)).toEqual(new Set(['active', 'px-4']));
		expect(dynamic).toEqual([]);
	});

	it('takes the right side of a `&&` logical expression', () => {
		const { classes, dynamic } = extractClasses(`<a class={isPrimary && 'bg-blue-500'}>x</a>`);
		expect(classes).toEqual(['bg-blue-500']);
		expect(dynamic).toEqual([]);
	});

	it('recurses both sides of a `||` fallback, flagging the dynamic left side', () => {
		const { classes, dynamic } = extractClasses(`<a class={base || 'bg-gray-100'}>x</a>`);
		expect(classes).toEqual(['bg-gray-100']);
		expect(dynamic).toHaveLength(1);
		expect(dynamic[0].expression).toBe('base');
	});

	it('flags a string-concatenation expression as dynamic with its source slice', () => {
		const source = `<a class={'bg-' + color}>x</a>`;
		const { classes, dynamic } = extractClasses(source);
		expect(classes).toEqual([]);
		expect(dynamic).toHaveLength(1);
		expect(dynamic[0].expression).toBe(`'bg-' + color`);
		expect(typeof dynamic[0].start).toBe('number');
		expect(source.slice(dynamic[0].start)).toContain(`'bg-' + color`);
	});

	it('flags a bare identifier class as dynamic', () => {
		const { classes, dynamic } = extractClasses('<a class={someClasses}>x</a>');
		expect(classes).toEqual([]);
		expect(dynamic).toHaveLength(1);
		expect(dynamic[0].expression).toBe('someClasses');
	});

	it('handles `??` nullish fallback like `||`', () => {
		const { classes, dynamic } = extractClasses(`<a class={base ?? 'bg-gray-100'}>x</a>`);
		expect(classes).toEqual(['bg-gray-100']);
		expect(dynamic.map((d) => d.expression)).toEqual(['base']);
	});

	it('extracts from each element of an array expression', () => {
		const { classes, dynamic } = extractClasses(
			`<a class={['px-4', cond ? 'bg-red-500' : 'bg-blue-500', flag && 'm-2']}>x</a>`
		);
		expect(new Set(classes)).toEqual(new Set(['px-4', 'bg-red-500', 'bg-blue-500', 'm-2']));
		expect(dynamic).toEqual([]);
	});

	it('extracts the static quasis of a template literal and flags dynamic interpolations', () => {
		const { classes, dynamic } = extractClasses('<a class={`px-4 bg-${color} text-lg`}>x</a>');
		expect(new Set(classes)).toEqual(new Set(['px-4', 'bg-', 'text-lg']));
		expect(dynamic.map((d) => d.expression)).toEqual(['color']);
	});

	it('ignores a boolean (valueless) class attribute', () => {
		const { classes, dynamic } = extractClasses('<a class>x</a>');
		expect(classes).toEqual([]);
		expect(dynamic).toEqual([]);
	});

	it('de-duplicates tokens while preserving first-seen order', () => {
		const { classes } = extractClasses(
			'<a class="px-4 bg-blue-500"></a><b class="bg-blue-500 px-4 m-2"></b>'
		);
		expect(classes).toEqual(['px-4', 'bg-blue-500', 'm-2']);
	});

	it('captures classes nested inside an {#if} block', () => {
		const { classes, dynamic } = extractClasses('{#if x}<a class="text-red-500">x</a>{/if}');
		expect(classes).toEqual(['text-red-500']);
		expect(dynamic).toEqual([]);
	});

	it('captures classes nested inside an {#each} block', () => {
		const { classes, dynamic } = extractClasses('{#each items as i}<a class="m-2">{i}</a>{/each}');
		expect(classes).toEqual(['m-2']);
		expect(dynamic).toEqual([]);
	});

	it('captures classes in both branches of {#if}/{:else}', () => {
		const { classes } = extractClasses(
			'{#if x}<a class="text-red-500">a</a>{:else}<a class="text-blue-500">b</a>{/if}'
		);
		expect(new Set(classes)).toEqual(new Set(['text-red-500', 'text-blue-500']));
	});

	it('ignores the condition of a class: directive (boolean expression, not a class)', () => {
		const { classes, dynamic } = extractClasses('<a class:active={isActive && other}>x</a>');
		expect(classes).toEqual(['active']);
		expect(dynamic).toEqual([]);
	});

	it('walks a small email fixture (Html>Head>Body) and unions the classes', () => {
		const source = `
<script>
	let { name } = $props();
	const variant = 'primary';
</script>

<Html>
	<Head />
	<Body class="bg-gray-100 px-4">
		<Container class="mx-auto max-w-xl">
			<Text class="text-base text-gray-900">Hi {name}</Text>
			<a
				class:active={variant === 'primary'}
				class="rounded-lg {variant === 'primary' ? 'bg-blue-500' : 'bg-gray-500'} px-6 py-3"
			>
				Click
			</a>
		</Container>
	</Body>
</Html>
`;
		const { classes, dynamic } = extractClasses(source, 'Welcome.svelte');
		expect(new Set(classes)).toEqual(
			new Set([
				'bg-gray-100',
				'px-4',
				'mx-auto',
				'max-w-xl',
				'text-base',
				'text-gray-900',
				'active',
				'rounded-lg',
				'bg-blue-500',
				'bg-gray-500',
				'px-6',
				'py-3'
			])
		);
		expect(dynamic).toEqual([]);
	});

	it('extracts classes from Component and SvelteElement nodes too', () => {
		const { classes, dynamic } = extractClasses(
			`<Button class="px-4" /><svelte:element this={tag} class="m-2" />`
		);
		expect(new Set(classes)).toEqual(new Set(['px-4', 'm-2']));
		expect(dynamic).toEqual([]);
	});
});
