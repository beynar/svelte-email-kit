import * as PrismImport from 'prismjs';
// `prismjs` ships a CommonJS namespace; depending on the bundler/interop the
// usable object is either the namespace itself or its `.default`. Normalize so
// `Prism.languages` / `Prism.tokenize` / `Prism.Token` are always available.
const Prism: typeof import('prismjs') =
	(PrismImport as { default?: typeof import('prismjs') }).default ?? PrismImport;
export { Prism };
