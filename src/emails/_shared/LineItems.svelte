<script lang="ts">
	import type { LineItem } from './brand.js';

	let {
		items,
		subtotal,
		shipping,
		tax,
		total
	}: { items: LineItem[]; subtotal: string; shipping: string; tax: string; total: string } =
		$props();
</script>

<table
	class="w-full text-sm"
	role="presentation"
	cellpadding="0"
	cellspacing="0"
	style="border-collapse:collapse"
>
	<tbody>
		{#each items as item (item.name)}
			<tr>
				<td class="border-b border-neutral-200 py-3 pr-3 align-top text-neutral-900">
					{item.name}
					<span class="block text-neutral-500">Qty {item.qty}</span>
				</td>
				<td
					class="border-b border-neutral-200 py-3 text-right align-top text-neutral-900"
					style="white-space:nowrap">{item.price}</td
				>
			</tr>
		{/each}
		<tr>
			<td class="pt-4 text-neutral-500">Subtotal</td>
			<td class="pt-4 text-right text-neutral-900">{subtotal}</td>
		</tr>
		<tr>
			<td class="pt-1 text-neutral-500">Shipping</td>
			<td class="pt-1 text-right text-neutral-900">{shipping}</td>
		</tr>
		<tr>
			<td class="pt-1 text-neutral-500">Tax</td>
			<td class="pt-1 text-right text-neutral-900">{tax}</td>
		</tr>
		<tr>
			<td class="pt-3 text-base font-bold text-neutral-900">Total</td>
			<td class="pt-3 text-right text-base font-bold text-neutral-900">{total}</td>
		</tr>
	</tbody>
</table>
