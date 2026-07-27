<script>
	import { goto } from '$app/navigation';
	import { FileText, Calendar } from 'lucide-svelte';

	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	import RowActions from './RowActions.svelte';

	let {
		survey,
		deleteSurvey
	} = $props();


	function edit() {
		goto(`/surveys/${survey.id}/builder`);
	}


	function formatDate(date) {
		if (!date) return '';

		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}


	function formatStatus(status) {
		if (!status) return '';

		return status.charAt(0).toUpperCase() + status.slice(1);
	}


	const badgeVariant =
		survey.status?.toLowerCase() === 'published'
			? 'published'
			: 'draft';
</script>


<Card
	class="flex h-full flex-col border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
>

	<div class="flex items-start justify-between gap-3">

		<div class="min-w-0">

			<h3 class="truncate text-lg font-bold text-slate-900">
				{survey.title}
			</h3>


			<div class="mt-2 h-10">

				<p class="line-clamp-2 text-sm leading-5 text-slate-500">
					{survey.description || ''}
				</p>

			</div>

		</div>


		<div class="flex items-center gap-2">

			<Badge variant={badgeVariant}>
				{formatStatus(survey.status)}
			</Badge>


			<RowActions
				survey={survey}
				deleteSurvey={deleteSurvey}
			/>

		</div>

	</div>



	<div class="my-6 grid grid-cols-2 gap-3">


		<div class="rounded-xl border border-slate-100 bg-slate-50 p-4">

			<div class="flex items-center gap-2 text-slate-500">

				<div class="rounded-md bg-white p-1.5 shadow-sm">
					<FileText size={15}/>
				</div>


				<span class="text-xs font-medium">
					Responses
				</span>

			</div>


			<p class="mt-3 text-xl font-bold text-slate-900">
				{survey.responses ?? 0}
			</p>

		</div>




		<div class="rounded-xl border border-slate-100 bg-slate-50 p-4">

			<div class="flex items-center gap-2 text-slate-500">

				<div class="rounded-md bg-white p-1.5 shadow-sm">
					<Calendar size={15}/>
				</div>


				<span class="text-xs font-medium">
					Updated
				</span>

			</div>


			<p class="mt-3 text-sm font-semibold text-slate-900">
				{formatDate(survey.updatedAt)}
			</p>

		</div>


	</div>



	<div class="mt-auto pt-2">

		<Button
			class="w-full rounded-xl"
			onclick={edit}
		>
			Edit Survey
		</Button>

	</div>


</Card>