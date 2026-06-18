# Plan: Email template gallery

A production-ready set of `svelte-email-plugin` templates — Tailwind-styled, realistic copy
(no lorem), responsive, Outlook-safe. Reference point is react-email's demo emails, but
**complete** (header, content, CTA, footer, real data) rather than barebone.

Each template lives under `src/emails/<category>/<name>.svelte`, so the nested registry gives
`emails.<category>.<key>(props)` for free, and every one returns `[html, text]`.

---

## Design decisions

- **Shared `Layout.svelte`** (Phase 0): brand header (logo) + footer (address, unsubscribe,
  social). Templates wrap their body in it. This is the lazy/DRY choice over re-authoring a
  header/footer 25×. _Veto path:_ if you want each template fully standalone (react-email
  copy-paste style), say so and Layout becomes opt-in instead of default. Bodies stay
  self-contained either way.
- **Tailwind everywhere**, baked by the plugin. Brand tokens (`--color-brand`, …) live in
  `src/app.css` `@theme` and are auto-detected — templates use `bg-brand`, `text-brand`, etc.
- **Email-safe only**: no `box-shadow`/gradient-dependent layouts (Outlook drops them — see
  the known limitations). Borders, solid fills, tables. Single-column, `max-width:37.5em`
  (Container). One real responsive tweak per template at most (`sm:`).
- **Typed props with sample defaults** — every template renders standalone with `{}` (so the
  preview gallery and `send-test` work with zero args), but every field is overridable.
- **Realistic placeholder brand**: "Acme". Swap later via tokens + Layout props.

## Conventions (per template)

- `let { ... }: Props = $props()` with defaults; `Props` declared inline.
- Author loosely where it reads better (forgiveness remaps native tags), explicit components
  where props are needed (`Button`, `Img`, `Preview`, `Font`).
- `<Preview>` first child of `<Body>` with a real inbox-snippet line.
- Money/dates/quantities passed as already-formatted strings (no runtime i18n in templates).

---

## Phase 0 — Scaffolding

- `src/emails/_shared/Layout.svelte` — `Html>Head>Body` shell, `<Preview>`, brand header
  (logo `Img` + name), `{@render children()}`, footer (company address, unsubscribe link,
  year). Props: `preview`, `brand?`, `unsubscribeUrl?`, `hideFooter?`.
- `src/emails/_shared/Btn.svelte` — `Button` with brand defaults (bg-brand, rounded, padding)
  so CTAs are one tag. Optional `variant: 'primary' | 'secondary'`.
- `src/emails/_shared/sample.ts` — shared sample data (brand, user, sample order/line-items)
  reused across template defaults, so previews look coherent.
- `src/app.css` `@theme` — add brand scale (`--color-brand`, `--color-brand-foreground`,
  `--color-muted`, `--color-success`, `--color-danger`) if not already present.
- Underscore-prefixed `_shared/` is skipped by the registry walker (confirm/extend the walker
  to ignore `_`-prefixed dirs) — these are building blocks, not sendable emails.
- Wire the existing preview server / playground to list every template.

---

## Phase group A — Account & Auth · `emails.auth.*`

### Phase 1 — Welcome · `auth.welcome`

- **Use:** first email after sign-up.
- **Props:** `{ name, productName, getStartedUrl, docsUrl }`.
- **Layout:** hero greeting → 2–3 "what you can do" bullets → primary CTA "Get started" →
  secondary docs link.

### Phase 2 — Verify email · `auth.verifyEmail`

- **Use:** confirm address ownership.
- **Props:** `{ name, verifyUrl, expiresIn }`.
- **Layout:** short ask → big "Verify email" CTA → fallback raw URL line → expiry note.

### Phase 3 — Magic link · `auth.magicLink`

- **Use:** passwordless sign-in link.
- **Props:** `{ loginUrl, expiresIn, requestedFrom? }` (device/IP line).
- **Layout:** "Click to sign in" CTA → fallback URL → "didn't request this?" note.

### Phase 4 — OTP / login code · `auth.otp`

- **Use:** one-time numeric code.
- **Props:** `{ code, expiresIn }`.
- **Layout:** large, letter-spaced code block (table cell, big font, `tracking` — not a CTA
  button) → expiry → security note. **Text alt must include the code prominently.**

### Phase 5 — Password reset · `auth.resetPassword`

- **Use:** reset link (the canonical example).
- **Props:** `{ name, resetUrl, expiresIn }`.
- **Layout:** "Reset your password" CTA → fallback URL → "ignore if you didn't request".

### Phase 6 — Password changed · `auth.passwordChanged`

- **Use:** confirmation + security backstop.
- **Props:** `{ name, changedAt, supportUrl }`.
- **Layout:** confirmation line → "wasn't you?" → contact support CTA.

### Phase 7 — New sign-in / security alert · `auth.newSignIn`

- **Use:** login from new device/location.
- **Props:** `{ name, device, location, time, secureAccountUrl }`.
- **Layout:** alert banner → details table (device/location/time) → "secure account" CTA.

### Phase 8 — Team invite · `auth.teamInvite`

- **Use:** invite to a workspace/org.
- **Props:** `{ inviterName, teamName, acceptUrl, role? }`.
- **Layout:** "X invited you to TEAM" → accept CTA → fallback URL → expiry.

---

## Phase group B — Orders & Shipping · `emails.orders.*`

> Shares a **line-items table** partial (`_shared/LineItems.svelte`): rows of
> item × qty × price, then subtotal/shipping/tax/total. Built once in Phase 9, reused.

### Phase 9 — Order confirmation / receipt · `orders.confirmation`

- **Props:** `{ orderNumber, date, items[], subtotal, shipping, tax, total, shipTo, viewOrderUrl }`.
- **Layout:** "Order #N confirmed" → items table → totals → ship-to address → view-order CTA.

### Phase 10 — Order shipped · `orders.shipped`

- **Props:** `{ orderNumber, carrier, trackingNumber, trackingUrl, eta, items[] }`.
- **Layout:** "On its way" → track CTA → ETA → items summary.

### Phase 11 — Order delivered · `orders.delivered`

- **Props:** `{ orderNumber, deliveredAt, items[], reviewUrl }`.
- **Layout:** "Delivered" → leave-a-review CTA → reorder/items.

### Phase 12 — Order cancelled · `orders.cancelled`

- **Props:** `{ orderNumber, reason?, refundAmount?, refundEta?, supportUrl }`.
- **Layout:** cancellation notice → refund line (if any) → support CTA.

### Phase 13 — Refund issued · `orders.refunded`

- **Props:** `{ orderNumber, amount, method, eta }`.
- **Layout:** "Refund on the way" → amount/method/eta table.

### Phase 14 — Return started · `orders.returnStarted`

- **Props:** `{ orderNumber, items[], returnLabelUrl, instructions, dropoffBy }`.
- **Layout:** "Return started" → download-label CTA → steps → deadline.

### Phase 15 — Return received & refunded · `orders.returnComplete`

- **Props:** `{ orderNumber, items[], refundAmount, refundEta }`.
- **Layout:** "We got your return" → refund summary.

---

## Phase group C — Billing & Subscription · `emails.billing.*`

### Phase 16 — Payment receipt / invoice · `billing.receipt`

- **Props:** `{ invoiceNumber, date, lineItems[], total, card, invoiceUrl }`.
- **Layout:** receipt header → line items → total → "view invoice" / download.

### Phase 17 — Payment failed (dunning) · `billing.paymentFailed`

- **Props:** `{ amount, card, retryDate, updatePaymentUrl }`.
- **Layout:** warning → why → "update payment" CTA → retry date / grace note.

### Phase 18 — Trial started · `billing.trialStarted`

- **Props:** `{ name, planName, trialEnds, manageUrl }`.
- **Layout:** "trial is live" → what's included → trial-end date → manage CTA.

### Phase 19 — Trial ending soon · `billing.trialEnding`

- **Props:** `{ name, planName, daysLeft, upgradeUrl }`.
- **Layout:** "X days left" → upgrade CTA → what happens at end.

### Phase 20 — Subscription renewed · `billing.renewed`

- **Props:** `{ planName, amount, nextBillingDate, manageUrl }`.
- **Layout:** renewal confirmation → amount/next-date → manage CTA.

### Phase 21 — Subscription cancelled · `billing.cancelled`

- **Props:** `{ planName, accessUntil, resubscribeUrl, feedbackUrl? }`.
- **Layout:** "cancelled" → access-until date → win-back resubscribe CTA → optional feedback.

### Phase 22 — Card expiring _(optional)_ · `billing.cardExpiring`

- **Props:** `{ cardLast4, expMonthYear, updatePaymentUrl }`.
- **Layout:** heads-up → update-card CTA.

---

## Phase group D — Marketing & Lifecycle · `emails.marketing.*`

### Phase 23 — Product announcement / changelog · `marketing.announcement`

- **Props:** `{ headline, features[] (title, body, img?), ctaUrl, ctaLabel }`.
- **Layout:** hero → feature blocks → CTA. The most layout-heavy one.

### Phase 24 — Promotional offer · `marketing.promo`

- **Props:** `{ headline, discount, code?, expiresAt, shopUrl, heroImg? }`.
- **Layout:** big offer + code block → shop CTA → expiry + fine print.

### Phase 25 — Newsletter / digest · `marketing.newsletter`

- **Props:** `{ issue, intro, stories[] (title, excerpt, url, img?) }`.
- **Layout:** masthead → story list (img + excerpt + read-more) → footer.

### Phase 26 — Re-engagement / win-back _(optional)_ · `marketing.winback`

- **Props:** `{ name, incentive?, returnUrl }`.
- **Layout:** "we miss you" → optional incentive → come-back CTA.

### Phase 27 — Event / webinar invite _(optional)_ · `marketing.eventInvite`

- **Props:** `{ title, date, time, location/joinUrl, rsvpUrl, agenda? }`.
- **Layout:** event card (date/time/place) → RSVP CTA → add-to-calendar line.

### Phase 28 — Feedback / NPS survey _(optional)_ · `marketing.feedback`

- **Props:** `{ name, question, ratingUrl(base) }`.
- **Layout:** prompt → row of rating buttons (1–5 / 0–10 as small `Btn`s linking to
  `ratingUrl?score=n`) → one-line why.

---

## Phase group E — Notifications _(optional)_ · `emails.notifications.*`

### Phase 29 — Comment / mention · `notifications.mention`

- **Props:** `{ actorName, context, snippet, replyUrl }`.
- **Layout:** "X mentioned you" → quoted snippet → reply CTA.

### Phase 30 — Weekly activity digest · `notifications.digest`

- **Props:** `{ periodLabel, stats[] (label, value), highlights[], dashboardUrl }`.
- **Layout:** "your week" → stats row (2–3 cols) → highlights → dashboard CTA.

---

## Final phase — Gallery + verification

1. Confirm registry generated every key (nested objects per category); `_shared/` excluded.
2. `pnpm run build` ("All good!"), `pnpm check` 0/0, `pnpm lint`, `pnpm test`.
3. Preview each template (preview server / playground) — eyeball desktop + `sm:` width; spot
   the OTP code, line-items totals, tracking CTA render correctly.
4. Sanity a couple through `render()` → assert `text` contains the load-bearing bits (OTP code,
   order number, reset URL) so the plain-text alternative isn't empty.
5. README: add a "Templates" section linking the gallery + the `emails.*` keys.

---

## Count

**28 core + ~7 optional = ~30 templates** across auth (8), orders (7), billing (6–7),
marketing (3–6), notifications (0–2). Trim any phase before we start — the optional ones are
the obvious first cuts if this is too much for a first pass.

## Open questions

1. Standalone templates or shared `Layout` (default above)?
2. Build all ~28, or core-only first (drop the _(optional)_ ones)?
3. Brand: keep "Acme" placeholder, or your real brand (logo URL, colors, footer address)?
