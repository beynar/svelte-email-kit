# svelte-mail

**Build and send beautiful, email-client-safe HTML emails with Svelte 5 components.**

Typed Svelte 5 components (table layouts, inline styles, Outlook MSO hacks), a `render()` pipeline that produces a complete inlined HTML document, and a **build-time Tailwind** plugin that bakes utility classes into inline styles — so nothing heavy ever runs when you send mail.

![Svelte 5](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte&logoColor=white)
![Tailwind v4](<https://img.shields.io/badge/Tailwind-v4_(build--time)-38BDF8?logo=tailwindcss&logoColor=white>)
![License MIT](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Features

- 🦋 **Svelte 5 native** — author emails as ordinary components with runes (`$props()`) and snippets. No React.
- 🧩 **18 email components** — `Html`, `Head`, `Body`, `Container`, `Section`, `Row`, `Column`, `Text`, `Heading`, `Link`, `Button`, `Img`, `Hr`, `Preview`, `Font`, `Markdown`, `CodeInline`, `CodeBlock`.
- 🪄 **`render()` → `[html, text]`** — a complete email (XHTML 1.0 Transitional doctype + full `<html>…</html>`, with Svelte's SSR hydration markers stripped while **Outlook MSO conditional comments are preserved**) plus a plain-text alternative, in one call.
- 🅾️ **Outlook-ready out of the box** — the `Button` MSO padding hack, `Preview` invisible-Unicode inbox padding, and `Font` `@font-face` + fallback rule.
- 🎨 **Typed CSS-in-JS** — `style={{ color: 'red' }}` checked via `csstype` (or a raw string), plus `m`/`mx`/`my`/… margin shorthands.
- 📝 **Plain-text output** — the second element of `render()`'s tuple, produced via `html-to-text` (skips images and the hidden `<Preview>`).
- 🌬️ **Build-time Tailwind v4** — the `@beynar/svelte-email/vite` plugin bakes utility classes into inline styles and hoists responsive/stateful rules into `<Head>`. **Zero Tailwind, PostCSS, or HTML parser at runtime.**
- 🧬 **Email-safe value resolution** — `oklch()`→`rgb()`, opacity modifiers→`rgba()`, `calc()` and `rem`→`px`, logical→physical properties, `rounded-full`→`9999px`.
- 🗂️ **Auto-generated typed registry** — `import { emails } from './emails'; await emails.welcome({ name })` with props inferred from each component.
- ♻️ **First-class dev mode** — edit a class and the preview hot-reloads; add/remove an email and the registry regenerates.
- 🛡️ **Build-time safety** — a non-literal/composed class name fails the build, naming the file and `line:column`.
- 📨 **Rich content** — GitHub-style `Markdown` and Prism-highlighted `CodeBlock` (ships the `xonokai` theme).
- 🪶 **Lean runtime** — sending only needs `render()`; no compiler, no Tailwind, no PostCSS, no DOM parser.

---

## Install

```sh
pnpm add @beynar/svelte-email        # peer dependency: svelte@^5
```

`marked` (Markdown) and `prismjs` (CodeBlock) come bundled — nothing extra for those. Tailwind support is **build-time only**:

```sh
pnpm add -D tailwindcss@^4 postcss   # only if you use the Vite plugin
```

---

## Quickstart

Write an email as an ordinary Svelte 5 component:

```svelte
<!-- src/emails/WelcomeEmail.svelte -->
<script lang="ts">
	import {
		Html,
		Head,
		Preview,
		Body,
		Container,
		Section,
		Heading,
		Text,
		Button
	} from '@beynar/svelte-email';

	let { name = 'there' }: { name?: string } = $props();
</script>

<Html lang="en">
	<Head />
	<Preview children="Welcome to Acme — let's get you set up." />
	<Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'sans-serif' }}>
		<Container style={{ backgroundColor: '#ffffff', padding: '32px' }}>
			<Section>
				<Heading as="h1">Welcome, {name}!</Heading>
				<Text>Thanks for signing up. Click below to get started.</Text>
				<Button
					href="https://example.com/start"
					style={{
						padding: '12px 20px',
						backgroundColor: '#067df7',
						color: '#fff',
						borderRadius: '6px'
					}}
				>
					Get started
				</Button>
			</Section>
		</Container>
	</Body>
</Html>
```

Render it:

```ts
import { render } from '@beynar/svelte-email';
import WelcomeEmail from './emails/WelcomeEmail.svelte';

const [html, text] = await render(WelcomeEmail, { name: 'Ada' });
// html → '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" …><html …>…</html>'
// text → 'WELCOME, ADA!\n\n…'  (plain-text alternative)
```

## Sending

`render()` returns an `[html, text]` pair — destructure it and hand both to any provider.

<details open>
<summary><b>Resend</b></summary>

```ts
import { Resend } from 'resend';
import { render } from '@beynar/svelte-email';
import WelcomeEmail from './emails/WelcomeEmail.svelte';

const resend = new Resend(process.env.RESEND_API_KEY);
const [html, text] = await render(WelcomeEmail, { name: 'Ada' });
await resend.emails.send({
	from: 'Acme <hello@acme.com>',
	to: 'ada@example.com',
	subject: 'Welcome to Acme',
	html,
	text
});
```

</details>

<details>
<summary><b>Cloudflare Workers (Email Sending binding)</b></summary>

Add a `send_email` binding to `wrangler.jsonc` (`{ "send_email": [{ "name": "EMAIL" }] }`), with a domain onboarded via `wrangler email sending enable yourdomain.com`:

```ts
// a SvelteKit +server.ts on Cloudflare Workers
import { render } from '@beynar/svelte-email';
import WelcomeEmail from '../emails/WelcomeEmail.svelte';

export const GET = async ({ platform }) => {
	const [html, text] = await render(WelcomeEmail, { name: 'Ada' });
	await platform.env.EMAIL.send({
		to: 'ada@example.com',
		from: { email: 'hello@yourdomain.com', name: 'Acme' },
		subject: 'Welcome to Acme',
		html,
		text
	});
	return new Response('sent');
};
```

</details>

<details>
<summary><b>Nodemailer / SMTP</b></summary>

```ts
import nodemailer from 'nodemailer';
import { render } from '@beynar/svelte-email';
import WelcomeEmail from './emails/WelcomeEmail.svelte';

const transporter = nodemailer.createTransport({
	host: 'smtp.example.com',
	port: 587,
	auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});
const [html, text] = await render(WelcomeEmail, { name: 'Ada' });
await transporter.sendMail({
	from: 'Acme <hello@acme.com>',
	to: 'ada@example.com',
	subject: 'Welcome to Acme',
	html,
	text
});
```

</details>

## `render(component, props?, options?)`

```ts
type RenderResult = [html: string, text: string];

render(component: Component, props?: Record<string, any>, options?: RenderOptions): Promise<RenderResult>
```

Async (Svelte 5's server renderer is `PromiseLike`). Returns an `[html, text]` tuple:

- **`html`** — a **complete HTML document**: the XHTML 1.0 Transitional `<!DOCTYPE …>` then the full `<html>…</html>` tree, with Svelte's SSR hydration markers stripped (see [Svelte 5 notes](#svelte-5-notes)).
- **`text`** — a plain-text alternative (via `html-to-text`) that skips `<img>` and the hidden `<Preview>` node.

Destructure whichever parts you need: `const [html] = await render(…)` for HTML only, `const [, text] = await render(…)` for text only.

`RenderOptions`:

| Option              | Type                | Default | Description                                                                                                               |
| ------------------- | ------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------- |
| `htmlToTextOptions` | `HtmlToTextOptions` | —       | Passed through to `html-to-text` when producing the `text` part. User selectors are merged after the email-safe defaults. |

### Standalone helpers

- **`toPlainText(html, options?): Promise<string>`** — HTML → plain text (the same helper `render()` uses for the `text` part).
- **`cleanSvelteMarkup(html): string`** — strip Svelte 5 SSR hydration artifacts (used internally; exported for advanced use).
- **Style helpers:** `styleToString`, `mergeStyle`, `withMargin`, `parsePadding`, `pxToPt`. Types: `RenderResult`, `RenderOptions`, `CSSProperties`, `Style`, `Margin`.
- **Subpath:** `import { render, toPlainText } from '@beynar/svelte-email/render'` pulls in only the render pipeline (no components).

## Component reference

Every component accepts a typed `style` prop (a `CSSProperties` object, e.g. `style={{ color: 'red' }}`, or a raw CSS string) and passes extra HTML attributes (`id`, `data-*`, `align`, …) through to the rendered element.

| Component    | Renders                  | Key props / behavior                                                                                                                                                                           |
| ------------ | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Html`       | `<html>`                 | `lang` (default `"en"`), `dir` (default `"ltr"`). Wraps the document.                                                                                                                          |
| `Head`       | `<head>`                 | A **real `<head>` element** (not `<svelte:head>`). Emits `Content-Type` + `x-apple-disable-message-reformatting` meta. Hosts `<Font>`; the Tailwind plugin injects its hoisted `<style>` here. |
| `Body`       | `<body>`                 | Passthrough + `style`.                                                                                                                                                                         |
| `Container`  | `<table>`                | Centered presentation table, `max-width:37.5em`, single row/cell.                                                                                                                              |
| `Section`    | `<table>`                | Full-width presentation table, single row/cell.                                                                                                                                                |
| `Row`        | `<table>`/`<tr>`         | Presentation table whose children are the `<tr>`'s cells (use `Column`).                                                                                                                       |
| `Column`     | `<td>`                   | `align`, `valign`; width via `style`.                                                                                                                                                          |
| `Text`       | `<p>`                    | Defaults `font-size:14px; line-height:24px; margin:16px 0`. Margin shorthands `m`/`mx`/`my`/`mt`/`mr`/`mb`/`ml`.                                                                               |
| `Heading`    | `<h1>`–`<h6>`            | `as` selects the level (default `"h1"`). Margin shorthands.                                                                                                                                    |
| `Link`       | `<a>`                    | `href`, `target` (default `"_blank"`). Defaults `color:#067df7; text-decoration:none`.                                                                                                         |
| `Button`     | `<a>`                    | **MSO padding hack** driven by `style.padding` — emits hidden `<i>` spans in `<!--[if mso]>…<![endif]-->` for Outlook. `target` default `"_blank"`.                                            |
| `Img`        | `<img>`                  | `src`, `alt`, `width`, `height`. Defaults `display:block; outline:none; border:none; text-decoration:none`.                                                                                    |
| `Hr`         | `<hr>`                   | Defaults `width:100%; border:none; border-top:1px solid #eaeaea; margin:26px 0`.                                                                                                               |
| `Preview`    | hidden `<div>`           | **`children` is a string** (not a snippet). Truncated to ~150 chars and padded with invisible Unicode for the inbox line. Skipped in plain text.                                               |
| `Font`       | `<style>` (`@font-face`) | `fontFamily`, `fallbackFontFamily`, `webFont` (`{ url, format }`), `fontStyle`, `fontWeight`. **Place inside `<Head>`.**                                                                       |
| `Markdown`   | many elements            | **`children` is a Markdown source string.** `markdownCustomStyles` + `markdownContainerStyles` overrides.                                                                                      |
| `CodeInline` | `<code>` + `<span>`      | Inline code with the Orange.fr fallback (`.cino`/`.cio` sibling swap — needs a `<Head>` with `<meta>`). No default styling; style via `style`/Tailwind.                                        |
| `CodeBlock`  | `<pre>`/`<code>`         | Prism syntax highlighting. `code`, `language`, `theme` (use the exported `xonokai`), `lineNumbers`, `fontFamily`. Languages beyond Prism's defaults must be loaded via `prismjs/components/*`. |

```svelte
<!-- <Font> belongs inside <Head> -->
<Head>
	<Font
		fontFamily="Roboto"
		fallbackFontFamily="Verdana"
		webFont={{
			url: 'https://fonts.gstatic.com/s/roboto/v30/Roboto-Regular.woff2',
			format: 'woff2'
		}}
	/>
</Head>

<!-- <CodeBlock> with the bundled theme -->
<CodeBlock code={`const x = 1;`} language="javascript" theme={xonokai} lineNumbers />
```

## Build-time Tailwind (Vite plugin)

Tailwind is handled entirely at **build time** by `@beynar/svelte-email/vite`. It rewrites your email `.svelte` source before the Svelte compiler sees it, baking utility classes into inline styles (plus a `<Head>` `<style>` for responsive/stateful rules). The **runtime stays plain `render()`** — no Tailwind, PostCSS, or HTML parser loads when you send mail.

```ts
// vite.config.ts
import { svelteMail } from '@beynar/svelte-email/vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default {
	// `svelteMail` is `enforce: 'pre'`, so it bakes before vite-plugin-svelte.
	plugins: [svelteMail({ dir: 'src/emails' }), sveltekit()]
};
```

`svelteMail({ dir?, index?, tailwind? })` — `dir` is the email folder to bake (default `'src/emails'`), `index` overrides the generated registry path, and `tailwind.css` forwards Tailwind v4 CSS-first config (e.g. an `@theme { … }` block).

### Authoring rule

Class names must be **statically extractable** — static classes and **conditional literals** only:

```svelte
<Section class="bg-blue-500 px-4 rounded-lg" />
<!-- ✅ static -->
<Text class={isError ? 'text-red-500' : 'text-slate-600'} />
<!-- ✅ conditional literal -->
<Text class="px-4 {compact ? 'py-1' : 'py-3'}" />
<!-- ✅ template w/ literal branches -->
<Text class={'bg-' + color} />
<!-- ❌ composed → build error -->
```

A composed/non-literal class name is a **build error** naming the file and the offending expression with a `line:column`. Variant classes (`sm:`, `hover:`, `focus:`, …) can't be inlined — they're kept as sanitized classes and their rules are injected into your `<Head>` `<style>`, so a variant-using email **must** include a `<Head>`.

### Generated typed `emails` registry

The plugin scans `dir` and writes a typed registry (default `<dir>/index.ts`):

```ts
import { emails } from './emails'; // generated — add to .gitignore
const [html, text] = await emails.welcome({ name: 'Ada' }); // props typed from the component
```

Keys are camel-cased file names (`order-receipt.svelte` → `orderReceipt`), props are derived via `ComponentProps<typeof Component>` (a wrong prop is a type error), and each entry returns the same `Promise<[html, text]>` as `render()`.

### Dev workflow & dependency budget

In `vite dev` the bake runs on every save — editing a class **hot-reloads** updated inline styles and head rules with no restart; adding/removing an email regenerates the registry. `tailwindcss`/`postcss` are **build-time dev dependencies only**, never bundled into your runtime.

> **Caveat — responsive overrides.** Because base utilities are inlined and inline styles beat `<style>` rules, a responsive/stateful variant that overrides an _already-inlined_ property (e.g. `text-2xl sm:text-3xl`) won't take effect unless the hoisted rule wins. The fix is `!important` on hoisted rules — on the roadmap. Variants on properties that aren't otherwise inlined work today.

## Svelte 5 notes

- **Runes & snippets.** Components use `$props()` and `{@render children?.()}` (not slots). Write emails as ordinary Svelte 5 components.
- **Clean email HTML.** `svelte/server` emits hydration comment markers (`<!--[-->`, `<!--]-->`, indexed `<!--[0-->`, empty `<!---->`) and injects `onload`/`onerror="this.__e=event"` handlers. Email clients never hydrate, so `render()` strips all of these — while provably preserving Outlook MSO conditional comments.
- **Async render.** `render()` returns a `Promise<[html, text]>` and awaits Svelte 5's `PromiseLike` server output, so async components work.

## Design notes

- **Tailwind is a build-time Vite plugin**, not a runtime wrapper component — Svelte has no author-time tree to wrap, so classes are baked during the build. Custom config is CSS-first (`@theme { … }`).
- **Children are Svelte snippets.** `<Preview>` and `<Markdown>` take their content as a **string prop** (`children="…"`), since they measure/parse it.
- **Email-safe by construction** — presentation tables, inline styles, the XHTML Transitional doctype, the Button MSO hack, `<Preview>` invisible-Unicode padding, and the `<Font>` `@font-face` + fallback rule.

## License

MIT
