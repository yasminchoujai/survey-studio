<script>
	import SurveyRow from './SurveyRow.svelte';

	let {
		surveys = [],
		deleteSurvey
	} = $props();
</script>

<div class="overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm">

	<table class="min-w-full">

		<thead class="border-b border-slate-200 bg-slate-50">

			<tr>

				<th class="w-[45%] px-8 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
					Survey
				</th>

				<th class="w-[15%] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
					Status
				</th>

				<th class="w-[12%] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
					Responses
				</th>

				<th class="w-[18%] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
					Last Updated
				</th>

				<th class="w-[10%] px-8 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
					Actions
				</th>

			</tr>

		</thead>

		<tbody class="divide-y divide-slate-100">

			{#if surveys.length === 0}

				<tr>
					<td
						colspan="5"
						class="px-8 py-16 text-center text-slate-500"
					>
						No surveys yet.
					</td>
				</tr>

			{:else}

				{#each surveys as survey (survey.id)}

					<SurveyRow
						{survey}
						{deleteSurvey}
					/>

				{/each}

			{/if}

		</tbody>

	</table>

</div>