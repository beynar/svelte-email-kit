import { error } from '@sveltejs/kit';
import { emails } from '../../../emails/index.js';

// A registry leaf renders an email to `[html, text]` from its props.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RenderFn = (props: any) => Promise<[string, string]>;

// Walk the generated nested `emails` registry into flat [slug, renderFn] pairs,
// where slug is the dotted key path joined with `/` (e.g. `orders/returnComplete`).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function flatten(node: any, prefix: string[] = []): Array<[string, RenderFn]> {
	const out: Array<[string, RenderFn]> = [];
	for (const [key, value] of Object.entries(node)) {
		const path = [...prefix, key];
		if (typeof value === 'function') out.push([path.join('/'), value as RenderFn]);
		else out.push(...flatten(value, path));
	}
	return out;
}

const ALL = flatten(emails).sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
const LIST = ALL.map(([slug]) => slug);

// `/emails` (empty slug) lists every template; `/emails/<slug>` renders one with
// its default props. All gallery templates render standalone, so `{}` is enough.
export const load = async ({
	params
}: {
	params: { slug: string };
}): Promise<{ slug: string; list: string[]; html: string | null }> => {
	const slug = params.slug;
	if (!slug) return { slug: '', list: LIST, html: null };

	const entry = ALL.find(([s]) => s === slug);
	if (!entry) error(404, `Unknown email "${slug}"`);

	const [html] = await entry[1]({});
	return { slug, list: LIST, html };
};
