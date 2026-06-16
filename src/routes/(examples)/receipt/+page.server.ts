import { render } from '$lib/index.js';
import ReceiptEmail from '../../../emails/ReceiptEmail.svelte';

// Rendered on the server: `render()` (from `svelte/server`) needs the
// server-compiled component, so it cannot run in the browser.
export const load = async (): Promise<{ html: string }> => {
	const [html] = await render(ReceiptEmail);
	return { html };
};
