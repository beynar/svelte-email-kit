#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as p from '@clack/prompts';
import { CATEGORIES, categoryCount, copyTemplates, detectSetup } from '../dist/cli-copy.js';

// The bundled templates ship under `<pkg>/src/emails` (see package.json `files`).
const EMAILS_DIR = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	'..',
	'src',
	'emails'
);

async function main() {
	p.intro('svelte-email-plugin — copy email templates');

	const target = await p.text({
		message: 'Where should the templates go?',
		placeholder: 'src/emails',
		defaultValue: 'src/emails'
	});
	if (p.isCancel(target)) return p.cancel('Cancelled.');

	const categories = await p.multiselect({
		message: 'Which types of email do you want?',
		options: CATEGORIES.map((c) => ({
			value: c,
			label: c,
			hint: `${categoryCount(EMAILS_DIR, c)} templates`
		})),
		required: true
	});
	if (p.isCancel(categories)) return p.cancel('Cancelled.');

	const dest = path.resolve(process.cwd(), target);
	if (fs.existsSync(dest) && fs.readdirSync(dest).length > 0) {
		const ok = await p.confirm({
			message: `${target}/ already exists — copy into it? Files with the same name are overwritten.`
		});
		if (p.isCancel(ok) || !ok) return p.cancel('Cancelled.');
	}

	const s = p.spinner();
	s.start('Copying templates');
	const n = copyTemplates({ emailsDir: EMAILS_DIR, target: dest, categories });
	s.stop(`Copied ${n} templates + the shared kit into ${target}/`);

	// Only surface the setup steps the project still needs.
	const { installed, wired } = detectSetup(process.cwd());
	const steps = [];
	let i = 1;
	if (!installed) {
		steps.push(`${i++}. Install it:`, '     pnpm add -D svelte-email-plugin', '');
	}
	if (!wired) {
		steps.push(
			`${i++}. Add the Vite plugin (point \`dir\` at ${target}):`,
			"     import { email } from 'svelte-email-plugin/vite';",
			`     plugins: [email({ dir: '${target}' }), sveltekit()]`,
			''
		);
	}
	steps.push(
		`${i}. The plugin writes ${target}/index.ts — a typed \`emails\` registry. Render + send`,
		'   (templates use stock Tailwind — no theme config needed):',
		`     const [html, text] = await emails.${categories[0]}.…({ /* props */ });`
	);

	p.note(steps.join('\n'), installed && wired ? "You're all set" : 'Next steps');
	p.outro('Templates copied 🎉');
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
