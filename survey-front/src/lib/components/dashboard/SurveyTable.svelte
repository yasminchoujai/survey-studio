<script>
	import SurveyRow from './SurveyRow.svelte';

	let {
		surveys = [],
		deleteSurvey
	} = $props();
</script>

<div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

	<table class="min-w-full">

		<thead class="border-b bg-slate-50">

			<tr>

				<th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
					Survey
				</th>

				<th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
					Status
				</th>

				<th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
					Responses
				</th>

				<th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
					Last Updated
				</th>

				<th class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
					Actions
				</th>

			</tr>

		</thead>

		<tbody class="divide-y divide-slate-100">

			{#each surveys as survey (survey.id)}

				<SurveyRow
					{survey}
					{deleteSurvey}
				/>

			{/each}

		</tbody>

	</table>

</div>