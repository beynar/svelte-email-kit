<script lang="ts" module>
	import type { CSSProperties } from '../types.js';

	/** Email-safe fallback font families react-email exposes for `mso-font-alt`. */
	export type FallbackFont =
		| 'Arial'
		| 'Helvetica'
		| 'Verdana'
		| 'Georgia'
		| 'Times New Roman'
		| 'serif'
		| 'sans-serif'
		| 'monospace'
		| 'cursive'
		| 'fantasy';

	/** `@font-face` source format hints accepted by `webFont.format`. */
	export type FontFormat = 'woff' | 'woff2' | 'truetype' | 'opentype' | 'embedded-opentype' | 'svg';

	export interface FontProps {
		/** The custom font-family name registered by the `@font-face` rule. */
		fontFamily: string;
		/** One or more email-safe fallbacks; the first feeds Outlook's `mso-font-alt`. */
		fallbackFontFamily: FallbackFont | FallbackFont[];
		/** Optional web font to load via `src: url(...) format('...')`. */
		webFont?: { url: string; format: FontFormat };
		/** `@font-face` font-style (default `'normal'`). */
		fontStyle?: CSSProperties['fontStyle'];
		/** `@font-face` font-weight (default `400`). */
		fontWeight?: CSSProperties['fontWeight'];
	}
</script>

<script lang="ts">
	let {
		fontFamily,
		fallbackFontFamily,
		webFont,
		fontStyle = 'normal',
		fontWeight = 400
	}: FontProps = $props();

	const src = $derived(webFont ? `src: url(${webFont.url}) format('${webFont.format}');` : '');

	// Mirrors react-email's Font template string verbatim so the emitted CSS is
	// byte-for-byte faithful (including indentation/whitespace).
	const style = $derived(`
    @font-face {
      font-family: '${fontFamily}';
      font-style: ${fontStyle};
      font-weight: ${fontWeight};
      mso-font-alt: '${Array.isArray(fallbackFontFamily) ? fallbackFontFamily[0] : fallbackFontFamily}';
      ${src}
    }

    * {
      font-family: '${fontFamily}', ${Array.isArray(fallbackFontFamily) ? fallbackFontFamily.join(', ') : fallbackFontFamily};
    }
  `);
</script>

<!--
	react-email renders <style dangerouslySetInnerHTML>. A literal <style> tag in a
	Svelte template would be hijacked as the component's scoped stylesheet rather
	than rendered as an element, so we emit it as raw HTML via {@html}. The CSS is
	built solely from this component's own props for an email <style> block (same
	intent as react-email's dangerouslySetInnerHTML), so the XSS rule does not apply.
-->
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html `<style>${style}</style>`}
