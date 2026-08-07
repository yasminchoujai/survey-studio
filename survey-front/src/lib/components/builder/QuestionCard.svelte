<script>
	import { Copy, Trash2, GripVertical } from 'lucide-svelte';

	import Button from '$lib/components/ui/Button.svelte';
	import DeleteModal from '$lib/components/ui/DeleteModal.svelte';

	let {
		question,
		onSelect,
		onDelete,
		onDuplicate,

		onDragStart,
		onDrop,
		onDragOver
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

	function duplicate(event) {
		event.stopPropagation();
		onDuplicate?.(question.id);
	}

	function remove(event) {
		event.stopPropagation();
		showDeleteModal = true;
	}

	function confirmDelete() {
		onDelete?.(question.id);
		showDeleteModal = false;
	}

	function cancelDelete() {
		showDeleteModal = false;
	}
</script>

<div
	role="button"
	tabindex="0"
	draggable="true"
	class="group relative cursor-grab rounded-2xl border border-[#E8E2F2] bg-white p-5 transition-all duration-200 hover:border-[#D4BEE4] hover:shadow-md"
	ondragstart={(event) => {
		event.stopPropagation();
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.setData('application/question-id', question.id);
		event.dataTransfer.setData('text/plain', question.id);
		onDragStart?.(question.id);
	}}
	ondragover={(event) => {
		event.preventDefault();
		event.stopPropagation();
		event.dataTransfer.dropEffect = 'move';
		onDragOver?.(question.id);
	}}
	ondrop={(event) => {
		event.preventDefault();
		event.stopPropagation();
		onDrop?.(event, question.id);
	}}
	onclick={() => onSelect?.(question)}
	onkeydown={(event) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onSelect?.(question);
		}
	}}
>
	<div class="flex items-start justify-between gap-4">
		<!-- Drag Handle -->
		<div class="flex items-center gap-3">
			<div class="cursor-grab text-slate-300 transition-colors group-hover:text-slate-400">
				<GripVertical size={20} />
			</div>

			<div class="flex-1">
				<div class="flex flex-wrap items-center gap-2">
					<span class="rounded-full bg-[#F3ECFA] px-3 py-1 text-xs font-medium text-[#3B1E54]">
						{typeLabels[question.type]}
					</span>

					{#if question.required}
						<span class="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
							Required
						</span>
					{/if}
				</div>

				<h3 class="mt-4 text-lg font-semibold text-[#3B1E54]">
					{question.label || 'Untitled Question'}
				</h3>

				{#if question.description}
					<p class="mt-2 text-sm text-slate-500">
						{question.description}
					</p>
				{/if}
			</div>
		</div>

		<div class="flex gap-1">
			<Button
				variant="ghost"
				size="icon"
				onclick={duplicate}
			>
				<Copy size={16} />
			</Button>

			<Button
				variant="ghost"
				size="icon"
				class="hover:bg-red-50 hover:text-red-500"
				onclick={remove}
			>
				<Trash2 size={16} />
			</Button>
		</div>
	</div>

	<div class="mt-6 rounded-xl bg-[#FAF8FD] p-4">
		{#if question.type === 'short_text' || question.type === 'email'}
			<div class="rounded-lg border border-[#E8E2F2] bg-white px-4 py-3 text-sm text-slate-400">
				{question.placeholder || 'Short answer'}
			</div>

		{:else if question.type === 'long_text'}
			<div class="h-24 rounded-lg border border-[#E8E2F2] bg-white p-4 text-sm text-slate-400">
				{question.placeholder || 'Long answer'}
			</div>

		{:else if question.type === 'single_choice'}
			<div class="space-y-3">
				{#each question.options ?? [] as option}
					<div class="flex items-center gap-3">
						<div class="h-4 w-4 rounded-full border-2 border-[#9B7EBD]"></div>
						<span class="text-sm text-slate-600">{option}</span>
					</div>
				{/each}
			</div>

		{:else if question.type === 'multiple_choice'}
			<div class="space-y-3">
				{#each question.options ?? [] as option}
					<div class="flex items-center gap-3">
						<div class="h-4 w-4 rounded border-2 border-[#9B7EBD]"></div>
						<span class="text-sm text-slate-600">{option}</span>
					</div>
				{/each}
			</div>

		{:else if question.type === 'rating'}
			<div class="text-2xl text-[#D4BEE4]">
				★★★★★
			</div>
		{/if}
	</div>

	<!-- Drag indicator tooltip on hover -->
	<div class="absolute -top-2 -left-2 opacity-0 transition-opacity group-hover:opacity-100">
		<span class="rounded-full bg-[#9B7EBD] px-2 py-0.5 text-[10px] text-white">
			Drag to reorder
		</span>
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