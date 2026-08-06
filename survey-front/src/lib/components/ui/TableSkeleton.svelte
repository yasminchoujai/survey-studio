<script>
	let { rows = 6 } = $props();
</script>

<div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

	<table class="w-full">

		<thead class="border-b bg-slate-50">

			<tr>

				{#each Array(5) as _}
					<th class="px-6 py-4">
						<div
							class="h-3 w-20 animate-pulse rounded bg-slate-200"
						/>
					</th>
				{/each}

			</tr>

		</thead>

		<tbody>

			{#each Array(rows) as _}

				<tr class="border-b">

					{#each Array(5) as __}

						<td class="px-6 py-5">

							<div
								class="h-4 w-full animate-pulse rounded bg-slate-200"
							/>

						</td>

					{/each}

				</tr>

			{/each}

		</tbody>

	</table>

</div>