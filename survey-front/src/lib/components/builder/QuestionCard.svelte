<script>
	import { Copy, Trash2, GripVertical } from 'lucide-svelte';

	import Button from '$lib/components/ui/Button.svelte';
	import DeleteModal from '$lib/components/ui/DeleteModal.svelte';

	let {
		question,
		questionIndex,
		onSelect,
		onDelete,
		onDuplicate,
		onDrop
	} = $props();

	let showDeleteModal = $state(false);

	const typeLabels = {
		short_text: 'Short Text',
		long_text: 'Long Text',
		email: 'Email',
		single_choice: 'Single Choice',
		multiple_choice: 'Multiple Choice',
		rating: 'Rating'
	};

	let options = $derived(
		Array.isArray(question?.options) ? question.options : []
	);

	function duplicate(event) {
		event.preventDefault();
		event.stopPropagation();

		onDuplicate?.(question);
	}

	function remove(event) {
		event.preventDefault();
		event.stopPropagation();

		showDeleteModal = true;
	}

	function confirmDelete() {
		onDelete?.(question);
		showDeleteModal = false;
	}

	function cancelDelete() {
		showDeleteModal = false;
	}

	function handleDragStart(event) {
		event.stopPropagation();

		if (
			questionIndex === undefined ||
			questionIndex === null
		) {
			return;
		}

		event.dataTransfer.effectAllowed = 'move';

		event.dataTransfer.setData(
			'application/question-index',
			String(questionIndex)
		);

		event.dataTransfer.setData(
			'application/x-survey-question-reorder',
			'true'
		);
	}

	function handleDragOver(event) {
		event.preventDefault();
		event.stopPropagation();

		const types = event.dataTransfer.types;

		if (
			types.includes('application/question-index')
		) {
			event.dataTransfer.dropEffect = 'move';
		}
	}

	function handleDrop(event) {
		event.preventDefault();
		event.stopPropagation();

		const dragType = event.dataTransfer.getData(
			'application/question-index'
		);

		if (!dragType) {
			return;
		}

		const draggedIndex = Number(dragType);

		if (Number.isNaN(draggedIndex)) {
			return;
		}

		if (
			questionIndex === undefined ||
			questionIndex === null
		) {
			return;
		}

		if (draggedIndex === questionIndex) {
			return;
		}

		onDrop?.(draggedIndex, questionIndex);
	}
</script>

<div
	role="button"
	tabindex="0"
	draggable="true"
	class="group relative cursor-grab rounded-2xl border border-[#E8E2F2] bg-white p-5 transition-all hover:border-[#D4BEE4] hover:shadow-md active:cursor-grabbing"
	ondragstart={handleDragStart}
	ondragover={handleDragOver}
	ondrop={handleDrop}
	onclick={() => onSelect?.(question)}
	onkeydown={(event) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onSelect?.(question);
		}
	}}
>
	<div class="flex items-start justify-between gap-4">
		<div class="flex min-w-0 flex-1 items-start gap-3">
			<div
				class="mt-1 shrink-0 cursor-grab text-slate-300 transition-colors group-hover:text-slate-400 active:cursor-grabbing"
				title="Drag to reorder"
			>
				<GripVertical size={20} />
			</div>

			<div class="min-w-0 flex-1">
				<div class="flex flex-wrap items-center gap-2">
					<span
						class="rounded-full bg-[#F3ECFA] px-3 py-1 text-xs font-medium text-[#3B1E54]"
					>
						{typeLabels[question.type] ?? question.type}
					</span>

					{#if question.required}
						<span
							class="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600"
						>
							Required
						</span>
					{/if}
				</div>

				<h3
					class="mt-4 text-lg font-semibold text-[#3B1E54]"
				>
					{question.label || 'Untitled Question'}
				</h3>

				{#if question.description?.trim()}
					<p
						class="mt-2 text-sm leading-5 text-slate-500"
					>
						{question.description}
					</p>
				{/if}
			</div>
		</div>

		<div class="flex shrink-0 gap-1">
			<Button
				variant="ghost"
				size="icon"
				onclick={duplicate}
				title="Duplicate question"
			>
				<Copy size={16} />
			</Button>

			<Button
				variant="ghost"
				size="icon"
				class="hover:bg-red-50 hover:text-red-500"
				onclick={remove}
				title="Delete question"
			>
				<Trash2 size={16} />
			</Button>
		</div>
	</div>

	<div class="mt-6 rounded-xl bg-[#FAF8FD] p-4">
		{#if question.type === 'short_text' || question.type === 'email'}
			<div
				class="rounded-lg border border-[#E8E2F2] bg-white px-4 py-3 text-sm text-slate-400"
			>
				{question.placeholder || 'Short answer'}
			</div>

		{:else if question.type === 'long_text'}
			<div
				class="h-24 rounded-lg border border-[#E8E2F2] bg-white p-4 text-sm text-slate-400"
			>
				{question.placeholder || 'Long answer'}
			</div>

		{:else if question.type === 'single_choice'}
			<div class="space-y-3">
				{#each options as option}
					<div class="flex items-center gap-3">
						<div
							class="h-4 w-4 shrink-0 rounded-full border-2 border-[#9B7EBD]"
						></div>

						<span class="text-sm text-slate-600">
							{option}
						</span>
					</div>
				{/each}
			</div>

		{:else if question.type === 'multiple_choice'}
			<div class="space-y-3">
				{#each options as option}
					<div class="flex items-center gap-3">
						<div
							class="h-4 w-4 shrink-0 rounded border-2 border-[#9B7EBD]"
						></div>

						<span class="text-sm text-slate-600">
							{option}
						</span>
					</div>
				{/each}
			</div>

		{:else if question.type === 'rating'}
			<div class="text-2xl tracking-wide text-[#D4BEE4]">
				★★★★★
			</div>
		{/if}
	</div>
</div>

<DeleteModal
	open={showDeleteModal}
	title="Delete Question?"
	description="This question will be permanently deleted. This action cannot be undone."
	confirmText="Delete"
	cancelText="Cancel"
	onConfirm={confirmDelete}
	onCancel={cancelDelete}
/>