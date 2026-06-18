import fs from 'node:fs';
import path from 'node:path';

/**
 * Recursively collect `.svelte` email paths under `dir`, relative to `baseDir`
 * (POSIX separators, sorted). Recurses into sub-folders, skipping `node_modules`,
 * dot-folders, and `_`-prefixed entries (shared building blocks like `_shared/`
 * — not sendable emails). Shared by the Vite plugin's registry generation and the
 * preview server's listing.
 */
export function collectSvelteFiles(dir: string, baseDir: string = dir): string[] {
	let entries: fs.Dirent[];
	try {
		entries = fs.readdirSync(dir, { withFileTypes: true });
	} catch {
		return [];
	}
	const out: string[] = [];
	for (const entry of entries) {
		// `_`-prefixed files/folders are shared partials, not sendable emails.
		if (entry.name.startsWith('_')) continue;
		const abs = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
			out.push(...collectSvelteFiles(abs, baseDir));
		} else if (entry.isFile() && entry.name.endsWith('.svelte')) {
			out.push(path.relative(baseDir, abs).split(path.sep).join('/'));
		}
	}
	return out.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}
