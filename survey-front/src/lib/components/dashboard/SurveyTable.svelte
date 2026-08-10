<script>
	import SurveyRow from './SurveyRow.svelte';

	let {
		surveys = [],
		deleteSurvey
	} = $props();
</script>

<table class="min-w-full ">

	<thead class="border-b border-slate-200 bg-slate-50/50">
	<tr>
		<th
			class="w-[40%] px-7 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500"
		>
			Survey
		</th>

		<th
			class="w-[15%] px-16 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500"
		>
			Status
		</th>

		<th
			class="w-[20%] px-1 py-4 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500 mr-20"
		>
			Responses
		</th>

		<th
			class="w-[12%] px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500"
		>
			Last Updated
		</th>

		<th
			class="w-[20%] px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500"
		>
			Actions
		</th>
	</tr>
</thead>

	<tbody class="divide-y divide-slate-100">

		{#if surveys.length === 0}

			<tr>

				<td
					colspan="5"
					class="py-14 text-center text-sm text-slate-500"
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