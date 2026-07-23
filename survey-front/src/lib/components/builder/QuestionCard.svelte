<script>
	import { Copy, Trash2 } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let {
		question,
		onSelect,
		onDelete,
		onDuplicate
	} = $props();

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
		onDelete?.(question.id);
	}
</script>

<div
	class="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-violet-300 hover:shadow-sm"
	role="button"
	tabindex="0"
	onclick={() => onSelect?.(question)}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onSelect?.(question);
		}
	}}
>
	<div class="flex items-start justify-between gap-4">

		<div class="flex-1">

			<div class="flex items-center gap-2">
				<p class="text-xs font-semibold uppercase tracking-wide text-violet-600">
					{typeLabels[question.type] ?? question.type}
				</p>

				{#if question.required}
					<span class="rounded bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600">
						Required
					</span>
				{/if}
			</div>

			<h4 class="mt-2 font-medium text-slate-900">
				{question.label || 'Untitled question'}
			</h4>

			{#if question.description}
				<p class="mt-1 text-sm text-slate-500">
					{question.description}
				</p>
			{/if}

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
				class="text-red-500 hover:bg-red-50"
				onclick={remove}
			>
				<Trash2 size={16} />
			</Button>

		</div>

	</div>

	<div class="mt-4">

		{#if question.type === 'short_text' || question.type === 'email'}

			<div class="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-400">
				{question.placeholder || 'User answer'}
			</div>

		{:else if question.type === 'long_text'}

			<div class="h-20 rounded-lg border border-slate-200 p-3 text-sm text-slate-400">
				{question.placeholder || 'Long answer'}
			</div>

		{:else if question.type === 'single_choice' || question.type === 'multiple_choice'}

			<div class="space-y-2">

				{#each question.options ?? [] as option}

					<div class="flex items-center gap-2 text-sm text-slate-600">
						<div class="h-4 w-4 rounded-full border border-slate-300"></div>
						{option}
					</div>

				{/each}

			</div>

		{:else if question.type === 'rating'}

			<div class="flex gap-2 text-xl text-slate-400">
				{#each [1, 2, 3, 4, 5] as _}
					<span>☆</span>
				{/each}
			</div>

		{/if}

	</div>

</div>