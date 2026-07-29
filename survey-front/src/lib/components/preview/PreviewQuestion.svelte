<script>
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';

	let { question, number } = $props();

	let selectedRadio = $state('');
	let selectedCheckboxes = $state([]);
	let rating = $state(0);
</script>

<div class="space-y-5 rounded-xl border border-slate-200 p-6">

	<!-- Question -->

	<div>

		<h3 class="text-lg font-semibold text-slate-900">
			{number}. {question.label}

			{#if question.required}
				<span class="text-red-500">*</span>
			{/if}
		</h3>

		{#if question.description}
			<p class="mt-2 text-sm text-slate-500">
				{question.description}
			</p>
		{/if}

	</div>

	<!-- Short Text -->

	{#if question.type === 'short_text'}

		<Input
			placeholder={question.placeholder || 'Type your answer'}
		/>

	<!-- Email -->

	{:else if question.type === 'email'}

		<Input
			type="email"
			placeholder={question.placeholder || 'name@example.com'}
		/>

	<!-- Long Text -->

	{:else if question.type === 'long_text'}

		<Textarea
			rows={5}
			placeholder={question.placeholder || 'Write your answer'}
		/>

	<!-- Single Choice -->

	{:else if question.type === 'single_choice'}

		<div class="space-y-3">

			{#each question.options ?? [] as option}

				<label
					class="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4 transition hover:border-violet-500"
				>

					<input
						type="radio"
						name={question.id}
						value={option}
						bind:group={selectedRadio}
						class="h-5 w-5 accent-violet-600"
					/>

					<span
						class:text-violet-700={selectedRadio === option}
						class:font-semibold={selectedRadio === option}
					>
						{option}
					</span>

				</label>

			{/each}

		</div>

	<!-- Multiple Choice -->

	{:else if question.type === 'multiple_choice'}

		<div class="space-y-3">

			{#each question.options ?? [] as option}

				<label
					class="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4 transition hover:border-violet-500"
				>

					<input
						type="checkbox"
						value={option}
						bind:group={selectedCheckboxes}
						class="h-5 w-5 accent-violet-600"
					/>

					<span
						class:text-violet-700={selectedCheckboxes.includes(option)}
						class:font-semibold={selectedCheckboxes.includes(option)}
					>
						{option}
					</span>

				</label>

			{/each}

		</div>

	<!-- Rating -->

	{:else if question.type === 'rating'}

		<div class="flex flex-col items-center gap-4">

			<div class="flex gap-3">

				{#each [1, 2, 3, 4, 5] as star}

					<button
						type="button"
						class="transition duration-200 hover:scale-110"
						onclick={() => (rating = star)}
					>

						<span
							class="text-5xl transition-colors"
							class:text-amber-400={star <= rating}
							class:text-slate-300={star > rating}
						>
							★
						</span>

					</button>

				{/each}

			</div>

			<div class="flex w-full justify-between text-xs font-medium text-slate-500">
				<span>Poor</span>
				<span>Excellent</span>
			</div>

			<p class="text-sm font-medium text-violet-600">
				{rating === 0 ? 'Select a rating' : `${rating} of 5`}
			</p>

		</div>

	{/if}

</div>