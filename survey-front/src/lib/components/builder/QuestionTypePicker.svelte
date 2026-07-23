<script>
	import Button from '$lib/components/ui/Button.svelte';

	import {
		Type,
		Text,
		Mail,
		CircleDot,
		CheckSquare,
		Star
	} from 'lucide-svelte';



	let {
		sectionId,
		onAddQuestion
	} = $props();





	const questionTypes = [

		{
			type: 'short_text',
			name: 'Short Text',
			icon: Type
		},

		{
			type: 'long_text',
			name: 'Long Text',
			icon: Text
		},

		{
			type: 'email',
			name: 'Email',
			icon: Mail
		},

		{
			type: 'single_choice',
			name: 'Single Choice',
			icon: CircleDot
		},

		{
			type: 'multiple_choice',
			name: 'Multiple Choice',
			icon: CheckSquare
		},

		{
			type: 'rating',
			name: 'Rating',
			icon: Star
		}

	];







	function add(type) {


		if (!sectionId) return;



		onAddQuestion?.(

			sectionId,

			type

		);


	}

</script>





<aside class="w-56 border-r border-slate-200 bg-white">


	<div class="border-b border-slate-200 px-4 py-3">


		<h2 class="text-xs font-semibold uppercase tracking-wider text-slate-400">

			Question Types

		</h2>


	</div>







	<div class="space-y-2 p-2">



		{#each questionTypes as question}



			<Button

				variant="ghost"

				class="h-auto w-full justify-start px-3 py-3"

				onclick={() =>
					add(question.type)
				}

			>



				<div class="flex items-center gap-3">


					<div class="rounded-md bg-violet-100 p-2 text-violet-600">


						<question.icon size={16}/>


					</div>





					<div class="text-left">


						<p class="text-sm font-medium">


							{question.name}


						</p>



						<p class="text-xs text-slate-400">


							Click to add


						</p>



					</div>



				</div>



			</Button>



		{/each}



	</div>


</aside>