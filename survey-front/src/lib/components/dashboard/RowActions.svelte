<script>
	import { goto } from '$app/navigation';
	import {
		Pencil,
		Trash2,
		Eye,
		BarChart3
	} from 'lucide-svelte';

	let { survey, deleteSurvey } = $props();

	function edit() {
		goto(`/surveys/${survey.id}/builder`);
	}

	function preview() {
		goto(`/surveys/${survey.id}`);
	}

	function responses() {
		goto(`/surveys/${survey.id}/responses`);
	}

	function remove() {
		deleteSurvey(survey.id);
	}
</script>

<div class="flex items-center justify-end gap-1">

	<button
		onclick={edit}
		class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-violet-100 hover:text-violet-600"
		title="Edit"
	>
		<Pencil size={18} />
	</button>

	<button
		onclick={preview}
		class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-sky-100 hover:text-sky-600"
		title="Preview"
	>
		<Eye size={18} />
	</button>

	<button
		onclick={responses}
		class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-emerald-100 hover:text-emerald-600"
		title="Responses"
	>
		<BarChart3 size={18} />
	</button>

	<div class="mx-1 h-5 w-px bg-slate-200"></div>

	<button
		onclick={remove}
		class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-100 hover:text-red-600"
		title="Delete"
	>
		<Trash2 size={18} />
	</button>

</div>