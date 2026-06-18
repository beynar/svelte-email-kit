#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import * as p from '@clack/prompts';
import {
	CATEGORIES,
	categoryCount,
	copyTemplates,
	detectSetup,
	detectPackageManager,
	installCommand
} from '../dist/cli-copy.js';

// The bundled templates ship under `<pkg>/src/emails` (see package.json `files`).
const EMAILS_DIR = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	'..',
	'src',
	'emails'
);

/** Run a command in the user's project, resolving on exit 0, rejecting otherwise. */
function run(cmd, args) {
	return new Promise((resolve, reject) => {
		const child = spawn(cmd, args, {
			cwd: process.cwd(),
			stdio: 'pipe',
			shell: process.platform === 'win32'
		});
		let out = '';
		child.stdout.on('data', (d) => (out += d));
		child.stderr.on('data', (d) => (out += d));
		child.on('error', reject);
		child.on('close', (code) =>
			code === 0 ? resolve(out) : reject(new Error(out || `exited ${code}`))
		);
	});
}

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

	// Offer to install the package if it's missing, then surface only remaining setup.
	let { installed, wired } = detectSetup(process.cwd());
	const pm = detectPackageManager(process.cwd());
	if (!installed) {
		const yes = await p.confirm({
			message: `svelte-email-plugin isn't installed here. Install it now with ${pm}?`
		});
		if (p.isCancel(yes)) return p.cancel('Cancelled.');
		if (yes) {
			const { cmd, args } = installCommand(pm);
			const sp = p.spinner();
			sp.start(`Installing svelte-email-plugin (${pm})`);
			try {
				await run(cmd, args);
				installed = true;
				sp.stop('Installed svelte-email-plugin');
			} catch {
				sp.stop(`Couldn't install automatically — run \`${cmd} ${args.join(' ')}\` yourself.`);
			}
		}
	}

	const steps = [];
	let i = 1;
	if (!installed) {
		const { cmd, args } = installCommand(pm);
		steps.push(`${i++}. Install it:`, `     ${cmd} ${args.join(' ')}`, '');
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
