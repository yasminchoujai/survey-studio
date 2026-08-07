<script>
	import { Trash2, Pencil } from 'lucide-svelte';

	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import DeleteModal from '$lib/components/ui/DeleteModal.svelte';
	import QuestionCard from './QuestionCard.svelte';

	let {
		section,
		selectQuestion,
		selectSection,
		deleteSection,
		deleteQuestion,
		duplicateQuestion,
		onDrop,
		onAddQuestion,
		selectedQuestionId,
		updateSectionTitle = () => {}
	} = $props();

	let showDeleteModal = $state(false);
	let isDropTarget = $state(false);

	let isEditing = $state(false);
	let editingTitle = $state('');

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

	function startEditing(event) {
		event.stopPropagation();
		isEditing = true;
		editingTitle = section.title ?? '';
	}

	async function saveTitle() {
		const title = editingTitle.trim();

		if (!title) {
			isEditing = false;
			return;
		}

		if (title === section.title) {
			isEditing = false;
			return;
		}

		await updateSectionTitle(section.id, title);

		isEditing = false;
	}

	function cancelEditing() {
		isEditing = false;
	}

	function handleKeydown(event) {
		if (event.key === 'Enter') {
			event.preventDefault();
			saveTitle();
		}

		if (event.key === 'Escape') {
			cancelEditing();
		}
	}

	function handleDragOver(event) {
		event.preventDefault();

		const type = event.dataTransfer.types.includes(
			'application/question-type'
		);

		if (type) {
			event.dataTransfer.dropEffect = 'copy';
			isDropTarget = true;
		}
	}

	function handleDragLeave() {
		isDropTarget = false;
	}

	function handleDrop(event) {
		event.preventDefault();
		event.stopPropagation();

		isDropTarget = false;

		const questionType = event.dataTransfer.getData(
			'application/question-type'
		);

		if (questionType) {
			onAddQuestion?.(section.id, questionType);
		}
	}
</script>

<div
	role="region"
	aria-label="Survey section"
	class={`group rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 ${
		isDropTarget
			? 'border-[#9B7EBD] ring-2 ring-[#D4BEE4]'
			: 'border-[#E8E2F2]'
	}`}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
>
	<div class="mb-5 flex items-center justify-between">
		<div class="flex items-center gap-3">
			<button
				type="button"
				class="flex items-center gap-2"
				onclick={handleSelectSection}
			>
				<div class="rounded-full bg-[#F3ECFA] px-3 py-1 text-xs font-medium text-[#3B1E54]">
					{section.questions?.length ?? 0}
					Question{section.questions?.length !== 1 ? 's' : ''}
				</div>
			</button>

			{#if isEditing}
				<Input
					bind:value={editingTitle}
					class="h-8 min-w-[220px] text-sm font-semibold"
					onkeydown={handleKeydown}
					onblur={saveTitle}
				/>
			{:else}
				<div class="flex items-center gap-2">
					<h3
						class="cursor-pointer text-sm font-semibold text-slate-700 hover:text-[#9B7EBD]"
						onclick={handleSelectSection}
					>
						{section.title || 'Untitled Section'}
					</h3>

					<button
						type="button"
						class="opacity-0 transition-all group-hover:opacity-100 text-slate-400 hover:text-[#9B7EBD]"
						onclick={startEditing}
					>
						<Pencil size={14} />
					</button>
				</div>
			{/if}
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
		{#if section.questions?.length === 0}
			<div class="rounded-xl border-2 border-dashed border-[#D4BEE4] bg-[#FCFBFE] p-8 text-center">
				<p class="font-medium text-[#3B1E54]">
					Drop a question here
				</p>
				<p class="mt-2 text-sm text-slate-500">
					Drag a question type from the sidebar
				</p>
			</div>
		{:else}
			{#each section.questions as question (question.id)}
				<QuestionCard
					{question}
					onSelect={selectQuestion}
					onDelete={deleteQuestion}
					onDuplicate={duplicateQuestion}
					isSelected={selectedQuestionId === question.id}
					onDrop={(event, targetId) => {
						onDrop?.(event, section.id, targetId);
					}}
				/>
			{/each}
		{/if}
	</div>
</div>

<DeleteModal
	open={showDeleteModal}
	title="Delete Section?"
	description="This section and all its questions will be permanently deleted."
	confirmText="Delete"
	cancelText="Cancel"
	onConfirm={confirmDeleteSection}
	onCancel={cancelDeleteSection}
/>