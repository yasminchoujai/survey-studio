<script>
	import { ChevronDown, User } from 'lucide-svelte';

	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	import { getAnswer, formatAnswer } from '$lib/utils/responses.js';

	let { survey, response, index, expanded = false } = $props();

	let open = $state(expanded);

	function formatDateTime(date) {
		if (!date) return 'Unknown date';

		return new Date(date).toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	let questionCount = $derived(
		Array.isArray(survey.questions)
			? survey.questions.length
			: 0
	);
</script>

<Card padding="none" class="overflow-hidden border border-slate-200 bg-white">

	<button
		type="button"
		onclick={() => (open = !open)}
		class="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-slate-50"
	>
		<div class="flex min-w-0 items-center gap-3">

			<div
				class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600"
			>
				<User size={16} />
			</div>

			<div class="min-w-0">
				<p class="truncate text-sm font-semibold text-slate-900">
					{response.respondent || `Response #${index + 1}`}
				</p>

				<p class="text-xs text-slate-500">
					{formatDateTime(response.submittedAt)}
				</p>
			</div>

		</div>

		<div class="flex shrink-0 items-center gap-3">

			<Badge variant="info">
				{questionCount} questions
			</Badge>

			<ChevronDown
				size={18}
				class={`text-slate-400 transition-transform duration-200 ${
					open ? 'rotate-180' : ''
				}`}
			/>

		</div>
	</button>

	{#if open}

		<div class="border-t border-slate-100 px-5 py-5">

			{#if !survey.questions?.length}

				<div class="py-6 text-center">
					<p class="text-sm text-slate-400">
						No questions found for this survey.
					</p>
				</div>

			{:else}

				<div class="space-y-4">

					{#each survey.questions as question}

						{@const value = getAnswer(response, question.id)}
						{@const formatted = formatAnswer(question, value)}

						<div class="rounded-lg bg-slate-50 p-4">

							<p class="text-sm font-medium text-slate-700">
								{question.label}
							</p>

							{#if formatted === null || formatted === undefined || formatted === ''}

								<p class="mt-1 text-sm italic text-slate-400">
									No answer
								</p>

							{:else if Array.isArray(formatted)}

								<div class="mt-2 flex flex-wrap gap-1.5">
									{#each formatted as option}
										<Badge variant="info">
											{option}
										</Badge>
									{/each}
								</div>

							{:else}

								<p class="mt-1 text-sm text-slate-900">
									{formatted}
								</p>

							{/if}

						</div>

					{/each}

				</div>

			{/if}

		</div>

	{/if}

</Card>