<script>
	import { Trash2 } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import DeleteModal from '$lib/components/ui/DeleteModal.svelte';
	import QuestionCard from './QuestionCard.svelte';

	let {
		section,
		selectQuestion,
		selectSection,
		deleteSection,
		deleteQuestion,
		duplicateQuestion,
		onDragStart,
		onDrop,
		onAddQuestion
	} = $props();

	let hoveredQuestionId = $state(null);
	let isDropTarget = $state(false);
	let showDeleteModal = $state(false);

	function handleSelectSection() {
		selectSection?.(section.id);
	}

	function handleDeleteSection(event) {
		event.stopPropagation();
		showDeleteModal = true;
	}

	function confirmDeleteSection() {
		deleteSection?.(section.id);
		showDeleteModal = false;
	}

	function cancelDeleteSection() {
		showDeleteModal = false;
	}

	function handleDragOver(event) {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'copy';
		isDropTarget = true;
	}

	function handleDragLeave(event) {
		event.preventDefault();
		isDropTarget = false;
	}

	function handleDropOnSection(event) {
		event.preventDefault();
		event.stopPropagation();

		isDropTarget = false;

		const questionType = event.dataTransfer.getData(
			'application/question-type'
		);

		console.log('DROP:', questionType);

		if (questionType) {
			onAddQuestion?.(section.id, questionType);
		}
	}
</script>

<div
	role="region"
	aria-label={`Section ${section.id}`}
	class={`rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 ${
		isDropTarget
			? 'border-[#9B7EBD] ring-2 ring-[#D4BEE4]'
			: 'border-[#E8E2F2]'
	}`}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDropOnSection}
>
	<div
		class="mb-5 flex items-center justify-between"
		role="button"
		tabindex="0"
		onclick={handleSelectSection}
		onkeydown={(event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				handleSelectSection();
			}
		}}
	>
		<div class="rounded-full bg-[#F3ECFA] px-3 py-1 text-xs font-medium text-[#3B1E54]">
			{section.questions.length}
			Question{section.questions.length !== 1 ? 's' : ''}
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
				class="rounded-xl border-2 border-dashed border-[#D4BEE4] bg-[#FCFBFE] p-8 text-center transition-colors"
				ondragover={handleDragOver}
				ondragleave={handleDragLeave}
				ondrop={handleDropOnSection}
			>
				<p class="font-medium text-[#3B1E54]">
					Drop a question here
				</p>

				<p class="mt-2 text-sm text-slate-500">
					or click a question type from the left panel.
				</p>
			</div>

		{:else}

			{#each section.questions as question (question.id)}

				<QuestionCard
					{question}
					onSelect={selectQuestion}
					onDelete={deleteQuestion}
					onDuplicate={duplicateQuestion}
					onDragStart={onDragStart}
					onDragOver={(id) => {
						hoveredQuestionId = id;
					}}
					onDrop={(event, id) => {
						hoveredQuestionId = null;
						onDrop?.(event, section.id, id);
					}}
					dragOver={hoveredQuestionId === question.id}
				/>

			{/each}

		{/if}
	</div>
</div>

<DeleteModal
	open={showDeleteModal}
	title="Delete Section?"
	description="This section and all its questions will be permanently deleted. This action cannot be undone."
	confirmText="Delete"
	cancelText="Cancel"
	onConfirm={confirmDeleteSection}
	onCancel={cancelDeleteSection}
/>