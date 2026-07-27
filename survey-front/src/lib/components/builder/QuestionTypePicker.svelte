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

	const questionGroups = [
		{
			title: 'Text Inputs',
			items: [
				{
					type: 'short_text',
					name: 'Short Text',
					icon: Type,
					helper: 'Single line'
				},
				{
					type: 'long_text',
					name: 'Long Text',
					icon: Text,
					helper: 'Paragraph'
				},
				{
					type: 'email',
					name: 'Email',
					icon: Mail,
					helper: 'Email'
				}
			]
		},
		{
			title: 'Choice',
			items: [
				{
					type: 'single_choice',
					name: 'Single Choice',
					icon: CircleDot,
					helper: 'One answer'
				},
				{
					type: 'multiple_choice',
					name: 'Multiple Choice',
					icon: CheckSquare,
					helper: 'Multiple answers'
				}
			]
		},
		{
			title: 'Rating',
			items: [
				{
					type: 'rating',
					name: 'Rating',
					icon: Star,
					helper: '1–5 stars'
				}
			]
		}
	];

	function add(type) {
		if (!sectionId) return;

		onAddQuestion?.(sectionId, type);
	}
</script>

<aside class="flex h-full w-60 flex-col border-r border-[#E8E2F2] bg-white">

	<!-- Header -->

	<div class="border-b border-[#E8E2F2] px-5 py-4">

		<h2 class="text-base font-semibold text-[#3B1E54]">
			Add Question
		</h2>

		<p class="mt-1 text-xs text-slate-500">
			Choose a type
		</p>

	</div>

	<!-- Content -->

	<div class="flex-1 space-y-6 overflow-y-auto p-4">

		{#each questionGroups as group}

			<div>

				<h3 class="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
					{group.title}
				</h3>

				<div class="space-y-2">

					{#each group.items as question}

						<Button
							variant="ghost"
							class="group h-auto w-full justify-start rounded-xl border border-transparent px-3 py-2.5 hover:border-[#D4BEE4] hover:bg-[#F8F5FC]"
							onclick={() => add(question.type)}
						>

							<div class="flex w-full items-center gap-3">

								<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F4EFF8] text-[#9B7EBD] transition group-hover:bg-[#D4BEE4] group-hover:text-[#3B1E54]">

									<question.icon size={16} />

								</div>

								<div class="flex-1 text-left">

									<p class="text-sm font-medium text-[#3B1E54]">
										{question.name}
									</p>

									<p class="text-[11px] text-slate-500">
										{question.helper}
									</p>

								</div>

							</div>

						</Button>

					{/each}

				</div>

			</div>

		{/each}

	</div>

</aside>