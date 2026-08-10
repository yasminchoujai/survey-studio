<script>
	import { ClipboardList } from 'lucide-svelte';

	import StatusBadge from './StatusBadge.svelte';
	import RowActions from './RowActions.svelte';

	let { survey, deleteSurvey } = $props();

	function formatDate(date) {
		if (!date) return '';

		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

<tr class="transition-colors duration-200 hover:bg-violet-50/30">

	<!-- Survey -->
	<td class="px-6 py-5 align-middle">
		<div class="flex items-center gap-3">

			<div
				class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600"
			>
				<ClipboardList size={18} strokeWidth={2} />
			</div>

			<div class="min-w-0">

				<h3 class="truncate text-sm font-semibold text-[#3B1E54]">
					{survey.title}
				</h3>

				<p class="mt-0.5 truncate text-xs text-slate-500">
					{survey.description || 'No description'}
				</p>

			</div>

		</div>
	</td>

	<!-- Status -->
	<td class="px-12 py-5 align-middle">
		<StatusBadge status={survey.status} />
	</td>

	<!-- Responses -->
	<td class="px-6 py-5 text-center align-middle">
		<span class="text-sm font-medium text-slate-700">
			{survey.responses ?? 0}
		</span>
	</td>

	<!-- Date -->
	<td class="px-6 py-5 align-middle">
		<span class="text-sm text-slate-500">
			{formatDate(survey.updatedAt)}
		</span>
	</td>

	<!-- Actions -->
	<td class="px-6 py-5 align-middle">
		<div class="flex justify-center">
			<RowActions
				{survey}
				{deleteSurvey}
			/>
		</div>
	</td>

</tr>