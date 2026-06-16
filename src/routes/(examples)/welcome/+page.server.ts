import { render } from '$lib/index.js';
import WelcomeEmail from '../../../emails/WelcomeEmail.svelte';

// Rendered on the server: `render()` (from `svelte/server`) needs the
// server-compiled component, so it cannot run in the browser.
export const load = async (): Promise<{ html: string }> => {
	const [html] = await render(WelcomeEmail, { name: 'Ada' });
	return { html };
};
