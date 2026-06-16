// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

/** The Cloudflare Email Sending binding (`send_email`), exposed at `platform.env.EMAIL`. */
interface CloudflareEmail {
	send(message: {
		to: string | string[];
		from: { email: string; name?: string };
		subject: string;
		html?: string;
		text?: string;
		replyTo?: string;
	}): Promise<{ messageId: string }>;
}

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env?: {
				EMAIL: CloudflareEmail;
			};
		}
	}
}

export {};
