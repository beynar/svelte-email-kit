// Shared brand config + sample data for the template gallery. Templates default
// their `brand` prop to `acme`, so every email renders standalone with `{}` while
// staying fully overridable. Lives in `_shared/` so the registry/preview skip it.

export interface Brand {
	/** Display name, shown in the header wordmark and footer. */
	name: string;
	/** Optional logo image URL; when set, the header shows it instead of a wordmark. */
	logoUrl?: string;
	logoWidth?: number;
	logoHeight?: number;
	/** Marketing site URL (header/footer links). */
	url: string;
	/** Physical address line shown in the footer (legal/CAN-SPAM). */
	address: string;
	/** Support contact surfaced in transactional emails. */
	supportEmail: string;
	/** Unsubscribe link shown in the footer. */
	unsubscribeUrl?: string;
}

export const acme: Brand = {
	name: 'Acme',
	url: 'https://acme.com',
	address: 'Acme Inc. · 123 Market St · San Francisco, CA 94103',
	supportEmail: 'support@acme.com',
	unsubscribeUrl: 'https://acme.com/unsubscribe'
};

/** A single purchasable line on an order/receipt. */
export interface LineItem {
	name: string;
	qty: number;
	/** Pre-formatted price string (no runtime money math in templates). */
	price: string;
}

export const sampleItems: LineItem[] = [
	{ name: 'Aeron Chair — Size B, Graphite', qty: 1, price: '$1,395.00' },
	{ name: 'Felt Desk Mat — Charcoal', qty: 2, price: '$70.00' }
];

export const sampleOrder = {
	number: 'AC-100482',
	date: 'June 18, 2026',
	items: sampleItems,
	subtotal: '$1,465.00',
	shipping: 'Free',
	tax: '$128.19',
	total: '$1,593.19',
	shipTo: 'Ada Lovelace, 12 Analytical Way, London EC1, UK'
};
