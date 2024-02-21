<script lang="ts">
  import type { DatabaseRow } from './DatabaseRow';

  export let rows: DatabaseRow[];
</script>

<div
	class="w-full max-w-xl p-12 mx-auto rounded-lg shadow-xl dark:bg-white/10 bg-white/30 ring-1 ring-gray-900/5 backdrop-blur-lg"
>
	<p>{rows[0].section} > {rows[0].subsection} > {rows[0].description} </p>
	<p>Quantity: {rows[0].quantity}</p>
	<div class="divide-y divide-gray-900/5">
		<table>
			<tr>
				<th>Contract</th>
				<th>Part Number</th>
			</tr>
			{#each rows as row}
			<tr>
				<td>{row.contract_number}</td>
				<td>{row.part_number}</td>
			</tr>
			{/each}
		</table>
	</div>
</div>
