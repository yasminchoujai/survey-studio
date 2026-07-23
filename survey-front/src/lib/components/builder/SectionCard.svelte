<script>
	import { Trash2 } from 'lucide-svelte';

	import Button from '$lib/components/ui/Button.svelte';
	import QuestionCard from './QuestionCard.svelte';


	let {
		section,
		selectQuestion,
		selectSection,
		deleteSection,
		deleteQuestion,
		duplicateQuestion
	} = $props();





	function handleSelectSection() {

		selectSection?.(
			section.id
		);

	}





	function handleDeleteSection(event) {

		event.stopPropagation();

		deleteSection?.(
			section.id
		);

	}

</script>





<div
	class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-violet-300"
>





	<!-- Section Header -->

	<div
		class="flex items-center justify-between"
		onclick={handleSelectSection}
		onkeydown={(event) => {

			if (
				event.key === 'Enter' ||
				event.key === ' '
			) {

				handleSelectSection();

			}

		}}
		role="button"
		tabindex="0"
	>



		<div>


			<h3 class="font-semibold text-slate-900">

				{section.title}

			</h3>



			<p class="mt-1 text-xs text-slate-500">

				{section.questions.length}

				question{section.questions.length !== 1 ? 's' : ''}

			</p>


		</div>







		<Button

			variant="ghost"

			size="icon"

			class="text-red-500 hover:bg-red-50"

			onclick={handleDeleteSection}

		>

			<Trash2 size={16}/>

		</Button>



	</div>









	<!-- Questions -->

	<div class="mt-5 space-y-4">


		{#if section.questions.length === 0}


			<div
				class="rounded-xl border border-dashed border-slate-300 p-6 text-center"
			>

				<p class="text-sm text-slate-500">

					Select this section, then choose a question type.

				</p>


			</div>



		{:else}



			{#each section.questions as question}



				<QuestionCard

					{question}

					onSelect={selectQuestion}

					onDelete={deleteQuestion}

					onDuplicate={duplicateQuestion}

				/>



			{/each}



		{/if}



	</div>



</div>