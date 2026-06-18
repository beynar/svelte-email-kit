import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	rewriteImports,
	copyTemplates,
	categoryCount,
	detectSetup,
	detectPackageManager,
	installCommand,
	CATEGORIES
} from './cli-copy.js';

// The repo's own templates double as the package's bundled templates.
const EMAILS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'emails');

describe('cli-copy', () => {
	it('rewrites the $lib import to the package specifier', () => {
		expect(rewriteImports(`import { Text } from '$lib/index.js';`)).toBe(
			`import { Text } from 'svelte-email-plugin';`
		);
	});

	it('lists the five categories', () => {
		expect([...CATEGORIES]).toEqual(['auth', 'orders', 'billing', 'marketing', 'notifications']);
	});

	it('copies the _shared kit + a category, rewriting imports', () => {
		const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sep-cli-'));
		try {
			const n = copyTemplates({ emailsDir: EMAILS_DIR, target: tmp, categories: ['auth'] });
			expect(n).toBe(categoryCount(EMAILS_DIR, 'auth'));
			expect(n).toBeGreaterThanOrEqual(8);

			const welcome = fs.readFileSync(path.join(tmp, 'auth', 'welcome.svelte'), 'utf8');
			expect(welcome).toContain(`from 'svelte-email-plugin'`);
			expect(welcome).not.toContain('$lib/index.js');

			// The shared kit (which the templates import) comes along too.
			expect(fs.existsSync(path.join(tmp, '_shared', 'Layout.svelte'))).toBe(true);
			expect(fs.existsSync(path.join(tmp, '_shared', 'brand.ts'))).toBe(true);
		} finally {
			fs.rmSync(tmp, { recursive: true, force: true });
		}
	});

	it('detects whether the package is installed and the plugin is wired', () => {
		const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sep-detect-'));
		try {
			// Empty project — neither installed nor wired.
			expect(detectSetup(tmp)).toEqual({ installed: false, wired: false });

			fs.writeFileSync(
				path.join(tmp, 'package.json'),
				JSON.stringify({ devDependencies: { 'svelte-email-plugin': '^1.0.0' } })
			);
			fs.writeFileSync(
				path.join(tmp, 'vite.config.ts'),
				`import { email } from 'svelte-email-plugin/vite';\nexport default {};`
			);
			expect(detectSetup(tmp)).toEqual({ installed: true, wired: true });
		} finally {
			fs.rmSync(tmp, { recursive: true, force: true });
		}
	});

	it('detects the package manager from the lockfile, then user agent, then npm', () => {
		const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sep-pm-'));
		try {
			expect(detectPackageManager(tmp, '')).toBe('npm'); // nothing → npm
			expect(detectPackageManager(tmp, 'pnpm/9.0.0 npm/? node/v22')).toBe('pnpm'); // user agent
			fs.writeFileSync(path.join(tmp, 'yarn.lock'), '');
			expect(detectPackageManager(tmp, 'pnpm/9.0.0')).toBe('yarn'); // lockfile wins
		} finally {
			fs.rmSync(tmp, { recursive: true, force: true });
		}
	});

	it('builds the right dev-install command per package manager', () => {
		expect(installCommand('pnpm')).toEqual({
			cmd: 'pnpm',
			args: ['add', '-D', 'svelte-email-plugin']
		});
		expect(installCommand('npm')).toEqual({
			cmd: 'npm',
			args: ['install', '-D', 'svelte-email-plugin']
		});
		expect(installCommand('bun')).toEqual({
			cmd: 'bun',
			args: ['add', '-d', 'svelte-email-plugin']
		});
	});
});
