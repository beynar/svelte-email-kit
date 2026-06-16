import { describe, it, expect } from 'vitest';
import { render } from '$lib/index.js';
import WelcomeEmail from '../WelcomeEmail.svelte';
import ReceiptEmail from '../ReceiptEmail.svelte';
import OtpEmail from '../OtpEmail.svelte';

/** The XHTML 1.0 Transitional doctype every rendered email document starts with. */
const DOCTYPE_PREFIX = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"';

/**
 * Assert a rendered email string is a well-formed email document free of the
 * Svelte 5 SSR hydration artifacts that `render()` is supposed to strip.
 */
function expectCleanEmailDocument(html: string) {
	// Full XHTML document.
	expect(html.startsWith(DOCTYPE_PREFIX)).toBe(true);
	expect(html).toContain('<html');
	expect(html).toContain('</html>');
	// No Svelte hydration markers of any form.
	expect(html).not.toMatch(/<!--\[\d/);
	expect(html).not.toContain('<!--[-->');
	expect(html).not.toContain('<!--]-->');
	expect(html).not.toContain('<!---->');
	expect(html).not.toContain('this.__e=event');
}

describe('WelcomeEmail', () => {
	it('renders a clean email document with the recipient name and CTA', async () => {
		const [html] = await render(WelcomeEmail, { name: 'Ada' });
		expectCleanEmailDocument(html);
		expect(html).toContain('Welcome, Ada!');
		expect(html).toContain('Get started');
		// The Button's MSO conditional comments must survive cleaning.
		expect(html).toContain('<!--[if mso]>');
	});

	it('renders with no props using sensible defaults', async () => {
		const [html] = await render(WelcomeEmail);
		expectCleanEmailDocument(html);
		expect(html).toContain('Welcome, there!');
	});
});

describe('ReceiptEmail', () => {
	it('renders a clean email document with order id, items, and total', async () => {
		const [html] = await render(ReceiptEmail);
		expectCleanEmailDocument(html);
		expect(html).toContain('AC-10428');
		expect(html).toContain('Acme Pro (annual)');
		expect(html).toContain('$201.00');
	});

	it('renders custom items and total', async () => {
		const [html] = await render(ReceiptEmail, {
			orderId: 'XY-1',
			items: [{ name: 'One thing', quantity: 2, price: '$10.00' }],
			total: '$20.00'
		});
		expectCleanEmailDocument(html);
		expect(html).toContain('XY-1');
		expect(html).toContain('One thing');
		expect(html).toContain('$20.00');
	});
});

describe('OtpEmail', () => {
	it('renders a clean email document showing the passcode', async () => {
		const [html] = await render(OtpEmail, { code: '123 456' });
		expectCleanEmailDocument(html);
		expect(html).toContain('123 456');
		expect(html).toContain('Verify your sign-in');
	});

	it('renders the big code heading fragment as expected', async () => {
		const [html] = await render(OtpEmail, { code: '328 914' });
		const fragment = html.match(/<h2[^>]*>328 914<\/h2>/)?.[0];
		expect(fragment).toMatchInlineSnapshot(
			`"<h2 style="font-size:36px;font-weight:700;letter-spacing:8px;color:#067df7;margin:0;font-family:SFMono-Regular,Menlo,Monaco,Consolas,monospace;">328 914</h2>"`
		);
	});

	it('produces plain text with visible content and no HTML tags', async () => {
		const [, text] = await render(OtpEmail);
		expect(text).toContain('Verify your sign-in'.toUpperCase());
		expect(text).toContain('328 914');
		expect(text).not.toMatch(/<[a-z]/i);
		expect(text).not.toContain('<!DOCTYPE');
	});
});
