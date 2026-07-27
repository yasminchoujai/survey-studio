<script>
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';

	let { question, number } = $props();

	let rating = $state(0);
	let selectedRadio = $state('');
	let selectedCheckboxes = $state([]);
</script>

<div class="space-y-6">
	<!-- Question -->

	<div class="space-y-2">
		<h3 class="text-lg font-semibold text-(--text-heading)">
			{number}. {question.label}

			{#if question.required}
				<span class="ml-1 text-red-500">*</span>
			{/if}
		</h3>

		{#if question.description}
			<p class="text-sm leading-6 text-(--text-muted)">
				{question.description}
			</p>
		{/if}
	</div>

	<!-- Short Text -->

	{#if question.type === 'short_text'}

		<Input
			class="h-12"
			placeholder={question.placeholder || 'Type your answer...'}
		/>

	<!-- Email -->

	{:else if question.type === 'email'}

		<Input
			type="email"
			class="h-12"
			placeholder={question.placeholder || 'name@example.com'}
		/>

	<!-- Long Text -->

	{:else if question.type === 'long_text'}

		<Textarea
			rows="5"
			placeholder={question.placeholder || 'Write your answer...'}
		/>

	<!-- Single Choice -->

	{:else if question.type === 'single_choice'}

		<div class="space-y-3">

			{#each question.options ?? [] as option}

				<label
					class="flex cursor-pointer items-center gap-4 rounded-2xl border px-5 py-4 transition-all duration-200 hover:border-(--primary) hover:bg-[#FCFBFE]"
					class:border-(--primary)={selectedRadio === option}
					class:bg-[#F8F3FD]={selectedRadio === option}
					class:border-(--border)={selectedRadio !== option}
					class:bg-(--surface)={selectedRadio !== option}
				>

					<input
						type="radio"
						name={question.id}
						value={option}
						bind:group={selectedRadio}
						class="sr-only"
					/>

					<div
						class="flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all"
						class:border-(--primary)={selectedRadio === option}
						class:border-slate-300={selectedRadio !== option}
					>

						{#if selectedRadio === option}
							<div class="h-3 w-3 rounded-full bg-(--primary)"></div>
						{/if}

					</div>

					<span class="flex-1 text-base font-medium text-(--text-body)">
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
					class="flex cursor-pointer items-center gap-4 rounded-2xl border px-5 py-4 transition-all duration-200 hover:border-(--primary) hover:bg-[#FCFBFE]"
					class:border-(--primary)={selectedCheckboxes.includes(option)}
					class:bg-[#F8F3FD]={selectedCheckboxes.includes(option)}
					class:border-(--border)={!selectedCheckboxes.includes(option)}
					class:bg-(--surface)={!selectedCheckboxes.includes(option)}
				>

					<input
						type="checkbox"
						value={option}
						bind:group={selectedCheckboxes}
						class="sr-only"
					/>

					<div
						class="flex h-6 w-6 items-center justify-center rounded-lg border-2 transition-all"
						class:border-(--primary)={selectedCheckboxes.includes(option)}
						class:bg-(--primary)={selectedCheckboxes.includes(option)}
						class:border-slate-300={!selectedCheckboxes.includes(option)}
					>

						{#if selectedCheckboxes.includes(option)}

							<svg
								viewBox="0 0 24 24"
								class="h-4 w-4 text-white"
								fill="none"
								stroke="currentColor"
								stroke-width="3"
							>
								<path
									d="M5 13l4 4L19 7"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>

						{/if}

					</div>

					<span class="flex-1 text-base font-medium text-(--text-body)">
						{option}
					</span>

				</label>

			{/each}

		</div>

	<!-- Rating -->

	{:else if question.type === 'rating'}

		<div class="flex flex-col items-center gap-5">

			<div class="flex gap-2">

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

			<p class="text-sm font-medium text-(--primary-dark)">
				{rating === 0
					? 'Select a rating'
					: `${rating} of 5 stars`}
			</p>

		</div>

	{/if}
</div>