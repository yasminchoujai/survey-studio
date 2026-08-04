<script>
	import { Trash2 } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import QuestionCard from './QuestionCard.svelte';

	let {
		survey,
		section,
		selectQuestion,
		selectSection,
		deleteSection,
		deleteQuestion,
		duplicateQuestion,
		reorderSectionQuestions
	} = $props();

	let draggedQuestionId = null;

	function handleSelectSection() {
		selectSection?.(section.id);
	}

	function handleDeleteSection(event) {
		event.stopPropagation();
		deleteSection?.(section.id);
	}

	function handleDragStart(id) {
		draggedQuestionId = id;
	}

	async function handleDrop(targetId) {
		if (!draggedQuestionId || draggedQuestionId === targetId) return;

		const from = section.questions.findIndex(
			(q) => q.id === draggedQuestionId
		);

		const to = section.questions.findIndex(
			(q) => q.id === targetId
		);

		if (from === -1 || to === -1) return;

		const [draggedQuestion] = section.questions.splice(from, 1);

		section.questions.splice(to, 0, draggedQuestion);

		// Persist order in backend
		await reorderSectionQuestions?.(survey, section);

		draggedQuestionId = null;
	}
</script>

<div
	class="rounded-2xl border border-[#E8E2F2] bg-white p-5 shadow-sm transition-all duration-200 hover:border-[#D4BEE4]"
>
	<div
		class="mb-5 flex items-center justify-between"
		role="button"
		tabindex="0"
		onclick={handleSelectSection}
		onkeydown={(event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				handleSelectSection();
			}
		}}
	>
		<div class="flex items-center gap-2">
			<div class="rounded-full bg-[#F3ECFA] px-3 py-1 text-xs font-medium text-[#3B1E54]">
				{section.questions.length}
				Question{section.questions.length !== 1 ? 's' : ''}
			</div>
		</div>

		<Button
			variant="ghost"
			size="icon"
			class="text-slate-400 hover:bg-red-50 hover:text-red-500"
			onclick={handleDeleteSection}
		>
			<Trash2 size={16} />
		</Button>
	</div>

	<div class="space-y-4">
		{#if section.questions.length === 0}

			<div
				class="rounded-xl border-2 border-dashed border-[#D4BEE4] bg-[#FCFBFE] p-8 text-center"
			>
				<p class="font-medium text-[#3B1E54]">
					No questions yet
				</p>

				<p class="mt-2 text-sm text-slate-500">
					Choose a question type from the left panel.
				</p>
			</div>

		{:else}

			{#each section.questions as question}

				<QuestionCard
					{question}
					onSelect={selectQuestion}
					onDelete={deleteQuestion}
					onDuplicate={duplicateQuestion}
					onDragStart={handleDragStart}
					onDragOver={() => {}}
					onDrop={handleDrop}
				/>

			{/each}

		{/if}
	</div>
</div>