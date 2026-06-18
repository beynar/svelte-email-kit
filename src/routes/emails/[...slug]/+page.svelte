<script lang="ts">
	import { resolve } from '$app/paths';

	let { data }: { data: { slug: string; list: string[]; html: string | null } } = $props();
</script>

<div class="gallery">
	<aside>
		<strong>emails</strong>
		<nav>
			{#each data.list as slug (slug)}
				<a href={resolve('/emails/[...slug]', { slug })} class:active={slug === data.slug}>{slug}</a
				>
			{/each}
		</nav>
	</aside>
	<section>
		{#if data.html}
			<iframe title={data.slug} srcdoc={data.html}></iframe>
		{:else}
			<p class="hint">Pick an email from the list to preview it.</p>
		{/if}
	</section>
</div>

<style>
	.gallery {
		display: flex;
		height: 100vh;
		font-family: system-ui, sans-serif;
	}
	aside {
		width: 240px;
		flex-shrink: 0;
		overflow-y: auto;
		border-right: 1px solid #e5e7eb;
		padding: 1rem;
		background: #fafafa;
	}
	aside strong {
		display: block;
		margin-bottom: 0.75rem;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #6b7280;
	}
	nav {
		display: flex;
		flex-direction: column;
	}
	nav a {
		padding: 0.3rem 0.5rem;
		border-radius: 6px;
		font-size: 0.85rem;
		color: #374151;
		text-decoration: none;
	}
	nav a:hover {
		background: #f0f0f0;
	}
	nav a.active {
		background: #6d28d9;
		color: #fff;
	}
	section {
		flex: 1;
		min-width: 0;
		background: #f3f4f6;
	}
	iframe {
		width: 100%;
		height: 100%;
		border: 0;
	}
	.hint {
		padding: 2rem;
		color: #6b7280;
	}
</style>
