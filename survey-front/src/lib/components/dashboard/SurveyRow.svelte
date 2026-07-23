<script>
	import StatusBadge from './StatusBadge.svelte';
	import RowActions from './RowActions.svelte';

	let { survey, deleteSurvey } = $props();
</script>

<tr class="transition-colors hover:bg-slate-50">

	<td class="px-6 py-5">

		<div class="font-semibold text-slate-900">
			{survey.title}
		</div>

		<p class="mt-1 max-w-sm text-sm text-slate-500">
			{survey.description}
		</p>

	</td>

	<td class="px-6 py-5">
		<StatusBadge status={survey.status} />
	</td>

	<td class="px-6 py-5 font-medium text-slate-700">
		{survey.responses}
	</td>

	<td class="px-6 py-5 text-slate-500">
		{survey.updatedAt}
	</td>

	<td class="px-6 py-5 text-right">
		<RowActions
			{survey}
			{deleteSurvey}
		/>
	</td>

</tr>