<script>
	import {
		Type,
		Text,
		Mail,
		CircleDot,
		CheckSquare,
		Star
	} from 'lucide-svelte';

	let { onAddQuestion } = $props();

	let draggingType = $state(null);

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
		console.log('➕ Adding question:', type);

		onAddQuestion?.(type);
	}

	function dragStart(event, type) {
		draggingType = type;

		event.dataTransfer.effectAllowed = 'copy';

		// THIS means "create a NEW question"
		event.dataTransfer.setData(
			'application/question-type',
			type
		);

		// fallback
		event.dataTransfer.setData(
			'text/plain',
			type
		);

		console.log('🟣 Dragging question type:', type);
	}

	function dragEnd() {
		draggingType = null;
	}
</script>

<aside
	class="flex h-full w-60 flex-col border-r border-[#E8E2F2] bg-white"
>
	<div class="border-b border-[#E8E2F2] px-5 py-4">
		<h2 class="text-base font-semibold text-[#3B1E54]">
			Add Question
		</h2>

		<p class="mt-1 text-xs text-slate-500">
			Click or drag to add a question
		</p>
	</div>

	<div class="flex-1 space-y-6 overflow-y-auto p-4">
		{#each questionGroups as group}
			<div>
				<h3
					class="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400"
				>
					{group.title}
				</h3>

				<div class="space-y-2">
					{#each group.items as question}
						<button
							type="button"
							draggable="true"
							class="group flex h-auto w-full cursor-grab justify-start rounded-xl border border-transparent px-3 py-2.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D4BEE4] hover:bg-[#F8F5FC] hover:shadow-sm active:cursor-grabbing"
							class:opacity-50={draggingType === question.type}
							class:scale-95={draggingType === question.type}
							onclick={() => add(question.type)}
							ondragstart={(event) =>
								dragStart(event, question.type)
							}
							ondragend={dragEnd}
						>
							<div class="flex w-full items-center gap-3">
								<div
									class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F4EFF8] text-[#9B7EBD] transition-all group-hover:bg-[#D4BEE4] group-hover:text-[#3B1E54]"
								>
									<question.icon size={16} />
								</div>

								<div class="flex-1">
									<p
										class="text-sm font-medium text-[#3B1E54]"
									>
										{question.name}
									</p>

									<p class="text-[11px] text-slate-500">
										{question.helper}
									</p>
								</div>
							</div>
						</button>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</aside>