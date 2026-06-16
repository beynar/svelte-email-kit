import { render } from 'svelte/server';
import { cleanSvelteMarkup } from '../lib/render.js';

/**
 * Render a Svelte component to its static HTML body for tests, sanitized of
 * Svelte SSR artifacts exactly as the library's `render()` does — so snapshots
 * reflect the markup that actually ships in an email.
 *
 * Lives outside `src/lib` so it is not packaged by svelte-package.
 */
export async function renderToStaticString<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	P extends Record<string, any>
>(component: import('svelte').Component<P>, props?: P): Promise<string> {
	const { body } = await render(component, { props: (props ?? {}) as P });
	return cleanSvelteMarkup(body);
}
