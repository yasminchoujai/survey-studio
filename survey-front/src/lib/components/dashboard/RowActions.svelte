<script>
	import { goto } from '$app/navigation';
	import {
		MoreVertical,
		Pencil,
		Trash2,
		Eye,
		BarChart3
	} from 'lucide-svelte';


	let { survey, deleteSurvey } = $props();


	let open = $state(false);



	function edit() {
		open = false;
		goto(`/surveys/${survey.id}/builder`);
	}


	function preview() {
		open = false;
		goto(`/surveys/${survey.id}`);
	}


	function responses() {
		open = false;
		goto(`/surveys/${survey.id}/responses`);
	}


	function remove() {
		open = false;
		deleteSurvey(survey.id);
	}

</script>



<div class="relative">


	<button
		onclick={() => open = !open}
		class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
	>
		<MoreVertical size={18}/>
	</button>





	{#if open}

		<div
			class="absolute right-0 top-10 z-30 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg"
		>


			<button
				onclick={edit}
				class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-600"
			>
				<Pencil size={16}/>
				Edit
			</button>



			<button
				onclick={preview}
				class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-600"
			>
				<Eye size={16}/>
				Preview
			</button>



			<button
				onclick={responses}
				class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
			>
				<BarChart3 size={16}/>
				Responses
			</button>



			<div class="my-1 border-t border-slate-100"></div>



			<button
				onclick={remove}
				class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
			>
				<Trash2 size={16}/>
				Delete
			</button>


		</div>

	{/if}


</div>