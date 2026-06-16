import type { CSSProperties } from '../types.js';

/**
 * Per-element style overrides accepted by `Markdown` (and used as its defaults).
 * Each key targets the inline `style` applied to that rendered element.
 */
export type StylesType = {
	h1?: CSSProperties;
	h2?: CSSProperties;
	h3?: CSSProperties;
	h4?: CSSProperties;
	h5?: CSSProperties;
	h6?: CSSProperties;
	blockQuote?: CSSProperties;
	bold?: CSSProperties;
	italic?: CSSProperties;
	link?: CSSProperties;
	codeBlock?: CSSProperties;
	codeInline?: CSSProperties;
	p?: CSSProperties;
	li?: CSSProperties;
	ul?: CSSProperties;
	ol?: CSSProperties;
	image?: CSSProperties;
	br?: CSSProperties;
	hr?: CSSProperties;
	table?: CSSProperties;
	thead?: CSSProperties;
	tbody?: CSSProperties;
	tr?: CSSProperties;
	th?: CSSProperties;
	td?: CSSProperties;
	strikethrough?: CSSProperties;
};

const emptyStyle: CSSProperties = {};

const baseHeaderStyles = {
	fontWeight: 500,
	paddingTop: 20
} satisfies CSSProperties;

const h1 = { ...baseHeaderStyles, fontSize: '2.5rem' } satisfies CSSProperties;
const h2 = { ...baseHeaderStyles, fontSize: '2rem' } satisfies CSSProperties;
const h3 = { ...baseHeaderStyles, fontSize: '1.75rem' } satisfies CSSProperties;
const h4 = { ...baseHeaderStyles, fontSize: '1.5rem' } satisfies CSSProperties;
const h5 = { ...baseHeaderStyles, fontSize: '1.25rem' } satisfies CSSProperties;
const h6 = { ...baseHeaderStyles, fontSize: '1rem' } satisfies CSSProperties;

const bold = { fontWeight: 'bold' } satisfies CSSProperties;
const italic = { fontStyle: 'italic' } satisfies CSSProperties;

const blockQuote = {
	background: '#f9f9f9',
	borderLeft: '10px solid #ccc',
	margin: '1.5em 10px',
	padding: '1em 10px'
} satisfies CSSProperties;

const codeInline = {
	color: '#212529',
	fontSize: '87.5%',
	display: 'inline',
	background: ' #f8f8f8',
	fontFamily: 'SFMono-Regular,Menlo,Monaco,Consolas,monospace'
} satisfies CSSProperties;

const codeBlock = {
	...codeInline,
	display: 'block',
	paddingTop: 10,
	paddingRight: 10,
	paddingLeft: 10,
	paddingBottom: 1,
	marginBottom: 20,
	background: ' #f8f8f8'
} satisfies CSSProperties;

const link = {
	color: '#007bff',
	textDecoration: 'underline',
	backgroundColor: 'transparent'
} satisfies CSSProperties;

/** react-email's default Markdown element styles. */
export const styles: StylesType = {
	h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	blockQuote,
	bold,
	italic,
	link,
	codeBlock: { ...codeBlock, wordWrap: 'break-word' },
	codeInline: { ...codeInline, wordWrap: 'break-word' },
	p: emptyStyle,
	li: emptyStyle,
	ul: emptyStyle,
	ol: emptyStyle,
	image: emptyStyle,
	br: emptyStyle,
	hr: emptyStyle,
	table: emptyStyle,
	thead: emptyStyle,
	tbody: emptyStyle,
	th: emptyStyle,
	td: emptyStyle,
	tr: emptyStyle,
	strikethrough: emptyStyle
};
