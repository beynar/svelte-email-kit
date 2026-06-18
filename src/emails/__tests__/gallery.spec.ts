import { describe, it, expect } from 'vitest';
import type { Component } from 'svelte';
import { render } from '$lib/render.js';

import Welcome from '../auth/welcome.svelte';
import VerifyEmail from '../auth/verify-email.svelte';
import MagicLink from '../auth/magic-link.svelte';
import Otp from '../auth/otp.svelte';
import ResetPassword from '../auth/reset-password.svelte';
import PasswordChanged from '../auth/password-changed.svelte';
import NewSignIn from '../auth/new-sign-in.svelte';
import TeamInvite from '../auth/team-invite.svelte';

import OrderConfirmation from '../orders/confirmation.svelte';
import OrderShipped from '../orders/shipped.svelte';
import OrderDelivered from '../orders/delivered.svelte';
import OrderCancelled from '../orders/cancelled.svelte';
import OrderRefunded from '../orders/refunded.svelte';
import ReturnStarted from '../orders/return-started.svelte';
import ReturnComplete from '../orders/return-complete.svelte';

import Receipt from '../billing/receipt.svelte';
import PaymentFailed from '../billing/payment-failed.svelte';
import TrialStarted from '../billing/trial-started.svelte';
import TrialEnding from '../billing/trial-ending.svelte';
import Renewed from '../billing/renewed.svelte';
import SubscriptionCancelled from '../billing/cancelled.svelte';
import CardExpiring from '../billing/card-expiring.svelte';

import Announcement from '../marketing/announcement.svelte';
import Promo from '../marketing/promo.svelte';
import Newsletter from '../marketing/newsletter.svelte';
import Winback from '../marketing/winback.svelte';
import EventInvite from '../marketing/event-invite.svelte';
import Feedback from '../marketing/feedback.svelte';

import Mention from '../notifications/mention.svelte';
import Digest from '../notifications/digest.svelte';

// Smoke test for the template gallery. Each template is authored as loose body
// content; the plugin's forgiveness pass injects the Html/Head/Body shell and the
// Tailwind bake inlines classes. So every gallery template, rendered with `{}`,
// must be a full document with baked styles (no leftover class tokens, no
// char-enumerated Button style), a visible brand, and a non-empty text part.
// Grows one entry per template as the gallery fills out.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = Component<any>;

const CASES: Array<{ name: string; Comp: AnyComponent; textIncludes?: string }> = [
	{ name: 'auth/welcome', Comp: Welcome },
	{ name: 'auth/verify-email', Comp: VerifyEmail },
	{ name: 'auth/magic-link', Comp: MagicLink },
	{ name: 'auth/otp', Comp: Otp, textIncludes: '318924' }, // the code must survive to plain text
	{ name: 'auth/reset-password', Comp: ResetPassword },
	{ name: 'auth/password-changed', Comp: PasswordChanged },
	{ name: 'auth/new-sign-in', Comp: NewSignIn },
	{ name: 'auth/team-invite', Comp: TeamInvite },

	{ name: 'orders/confirmation', Comp: OrderConfirmation, textIncludes: 'AC-100482' },
	{ name: 'orders/shipped', Comp: OrderShipped },
	{ name: 'orders/delivered', Comp: OrderDelivered },
	{ name: 'orders/cancelled', Comp: OrderCancelled },
	{ name: 'orders/refunded', Comp: OrderRefunded },
	{ name: 'orders/return-started', Comp: ReturnStarted },
	{ name: 'orders/return-complete', Comp: ReturnComplete },

	{ name: 'billing/receipt', Comp: Receipt, textIncludes: 'INV-2026-0482' },
	{ name: 'billing/payment-failed', Comp: PaymentFailed },
	{ name: 'billing/trial-started', Comp: TrialStarted },
	{ name: 'billing/trial-ending', Comp: TrialEnding },
	{ name: 'billing/renewed', Comp: Renewed },
	{ name: 'billing/cancelled', Comp: SubscriptionCancelled },
	{ name: 'billing/card-expiring', Comp: CardExpiring },

	{ name: 'marketing/announcement', Comp: Announcement },
	{ name: 'marketing/promo', Comp: Promo, textIncludes: 'SUMMER25' },
	{ name: 'marketing/newsletter', Comp: Newsletter },
	{ name: 'marketing/winback', Comp: Winback },
	{ name: 'marketing/event-invite', Comp: EventInvite },
	{ name: 'marketing/feedback', Comp: Feedback },

	{ name: 'notifications/mention', Comp: Mention },
	{ name: 'notifications/digest', Comp: Digest }
];

describe('gallery', () => {
	it.each(CASES)(
		'$name — shell injected, Tailwind baked, renders with {}',
		async ({ Comp, textIncludes }) => {
			const [html, text] = await render(Comp, {});

			// Forgiveness injected the document shell.
			expect(html.startsWith('<!DOCTYPE html PUBLIC')).toBe(true);
			expect(html).toContain('<body');

			// Brand default applied (header wordmark + footer).
			expect(html).toContain('Acme');

			// Tailwind baked: no raw utility class survived to the output.
			expect(html).not.toMatch(/class="[^"]*\b(bg-white|text-neutral-900|rounded-2xl)\b/);

			// Buttons baked correctly — not the Object.entries-on-a-string corruption
			// (`style="0:d;1:i;…"`).
			expect(html).not.toMatch(/style="0:/);

			// Plain-text alternative is non-empty.
			expect(text.trim().length).toBeGreaterThan(0);
			if (textIncludes) expect(text).toContain(textIncludes);
		}
	);

	it('auth/welcome — neutral palette + button background baked through', async () => {
		const [html] = await render(Welcome, {});
		expect(html).toContain('background-color:rgb(23, 23, 23)'); // bg-neutral-900 CTA button
		expect(html).toContain('color:rgb(115, 115, 115)'); // text-neutral-500 body
	});
});
