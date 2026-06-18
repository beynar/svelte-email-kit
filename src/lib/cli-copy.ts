import fs from 'node:fs';
import path from 'node:path';

/** Template categories a user can scaffold into their project. */
export const CATEGORIES = ['auth', 'orders', 'billing', 'marketing', 'notifications'] as const;
export type Category = (typeof CATEGORIES)[number];

/**
 * Rewrite the templates' repo-internal `$lib/index.js` import (used for
 * dogfooding inside this repo) to the published package specifier, so copied
 * templates resolve their components from `svelte-email-plugin` in the user's
 * project.
 */
export function rewriteImports(content: string): string {
	return content.replaceAll("'$lib/index.js'", "'svelte-email-plugin'");
}

/** Number of `.svelte` templates in a category (used for the prompt hint). */
export function categoryCount(emailsDir: string, category: string): number {
	try {
		return fs.readdirSync(path.join(emailsDir, category)).filter((f) => f.endsWith('.svelte'))
			.length;
	} catch {
		return 0;
	}
}

/**
 * Recursively copy a directory, rewriting imports in every copied file and
 * skipping test files. Returns the number of `.svelte` files copied.
 */
function copyDir(src: string, dest: string): number {
	fs.mkdirSync(dest, { recursive: true });
	let count = 0;
	for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
		if (entry.name === '__tests__' || /\.(spec|test)\./.test(entry.name)) continue;
		const from = path.join(src, entry.name);
		const to = path.join(dest, entry.name);
		if (entry.isDirectory()) {
			count += copyDir(from, to);
		} else {
			fs.writeFileSync(to, rewriteImports(fs.readFileSync(from, 'utf8')));
			if (entry.name.endsWith('.svelte')) count++;
		}
	}
	return count;
}

/**
 * Best-effort detection of whether the target project already has the package
 * installed (in any dependency field of its `package.json`) and the Vite plugin
 * wired (a `vite.config.*` importing `svelte-email-plugin/vite`). Used to print
 * only the setup steps that are actually still needed.
 */
export function detectSetup(cwd: string): { installed: boolean; wired: boolean } {
	let installed = false;
	try {
		const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
		const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
		installed = 'svelte-email-plugin' in deps;
	} catch {
		// no/unreadable package.json — treat as not installed
	}

	let wired = false;
	for (const name of ['vite.config.ts', 'vite.config.js', 'vite.config.mjs', 'vite.config.mts']) {
		try {
			if (fs.readFileSync(path.join(cwd, name), 'utf8').includes('svelte-email-plugin/vite')) {
				wired = true;
				break;
			}
		} catch {
			// missing config of this name — try the next
		}
	}
	return { installed, wired };
}

/**
 * Detect the project's package manager from its lockfile, falling back to the
 * package manager that invoked the CLI (`npm_config_user_agent`), then `npm`.
 */
export function detectPackageManager(
	cwd: string,
	userAgent: string = process.env.npm_config_user_agent ?? ''
): 'pnpm' | 'yarn' | 'bun' | 'npm' {
	if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
	if (fs.existsSync(path.join(cwd, 'yarn.lock'))) return 'yarn';
	if (fs.existsSync(path.join(cwd, 'bun.lockb')) || fs.existsSync(path.join(cwd, 'bun.lock')))
		return 'bun';
	if (fs.existsSync(path.join(cwd, 'package-lock.json'))) return 'npm';
	if (userAgent.startsWith('pnpm')) return 'pnpm';
	if (userAgent.startsWith('yarn')) return 'yarn';
	if (userAgent.startsWith('bun')) return 'bun';
	return 'npm';
}

/** The dev-dependency install command for a package manager. */
export function installCommand(
	pm: string,
	pkg = 'svelte-email-plugin'
): { cmd: string; args: string[] } {
	if (pm === 'npm') return { cmd: 'npm', args: ['install', '-D', pkg] };
	if (pm === 'bun') return { cmd: 'bun', args: ['add', '-d', pkg] };
	return { cmd: pm, args: ['add', '-D', pkg] }; // pnpm, yarn
}

/**
 * Copy the shared `_shared` kit plus the selected template categories from
 * `emailsDir` into `target`, rewriting imports. Returns the number of templates
 * (`.svelte` files outside `_shared`) copied.
 */
export function copyTemplates(options: {
	emailsDir: string;
	target: string;
	categories: readonly string[];
}): number {
	const { emailsDir, target, categories } = options;
	copyDir(path.join(emailsDir, '_shared'), path.join(target, '_shared'));
	let count = 0;
	for (const category of categories) {
		count += copyDir(path.join(emailsDir, category), path.join(target, category));
	}
	return count;
}
