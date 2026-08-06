<script>
	import { Star } from 'lucide-svelte';

	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';

	let { question, number } = $props();

	let selectedRadio = $state('');
	let selectedCheckboxes = $state([]);
	let rating = $state(0);
</script>

<div class="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

	<!-- Question -->

	<div class="space-y-2">

		<div class="flex items-start justify-between gap-4">

			<h3 class="text-lg font-semibold leading-7 text-[#3B1E54]">
				{number}. {question.label}

				{#if question.required}
					<span class="ml-1 text-red-500">*</span>
				{/if}
			</h3>

		</div>

		{#if question.description}
			<p class="text-sm leading-6 text-slate-500">
				{question.description}
			</p>
		{/if}

	</div>

	<!-- Short Text -->

	{#if question.type === 'short_text'}

		<Input
			placeholder={question.placeholder || 'Type your answer'}
			class="h-11 rounded-xl"
		/>

	<!-- Email -->

	{:else if question.type === 'email'}

		<Input
			type="email"
			placeholder={question.placeholder || 'name@example.com'}
			class="h-11 rounded-xl"
		/>

	<!-- Long Text -->

	{:else if question.type === 'long_text'}

		<Textarea
			rows={5}
			placeholder={question.placeholder || 'Write your answer'}
			class="rounded-xl"
		/>

	<!-- Single Choice -->

	{:else if question.type === 'single_choice'}

		<div class="space-y-3">

			{#each question.options ?? [] as option}

				<label
					class="group flex cursor-pointer items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 transition-all duration-200 hover:border-[#9B7EBD] hover:bg-violet-50 has-[:checked]:border-[#9B7EBD] has-[:checked]:bg-violet-50 has-[:checked]:ring-2 has-[:checked]:ring-[#D4BEE4]"
				>

					<input
						type="radio"
						name={question.id}
						value={option}
						bind:group={selectedRadio}
						class="h-5 w-5 accent-[#9B7EBD]"
					/>

					<span class="text-[15px] font-medium text-slate-700">
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
					class="group flex cursor-pointer items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 transition-all duration-200 hover:border-[#9B7EBD] hover:bg-violet-50 has-[:checked]:border-[#9B7EBD] has-[:checked]:bg-violet-50 has-[:checked]:ring-2 has-[:checked]:ring-[#D4BEE4]"
				>

					<input
						type="checkbox"
						value={option}
						bind:group={selectedCheckboxes}
						class="h-5 w-5 accent-[#9B7EBD]"
					/>

					<span class="text-[15px] font-medium text-slate-700">
						{option}
					</span>

				</label>

			{/each}

		</div>

	<!-- Rating -->

	{:else if question.type === 'rating'}

		<div class="space-y-4">

			<div class="flex gap-3">

				{#each [1, 2, 3, 4, 5] as star}

					<button
						type="button"
						class="rounded-lg p-1 transition-all duration-200 hover:scale-110 focus:outline-none"
						onclick={() => (rating = star)}
					>

						<Star
							size={30}
							fill={rating >= star ? 'currentColor' : 'none'}
							class={`transition-all duration-200 ${
								rating >= star
									? 'text-amber-400'
									: 'text-slate-300 hover:text-amber-300'
							}`}
						/>

					</button>

				{/each}

			</div>

			<div class="flex justify-between text-xs font-medium text-slate-500">
				<span>Poor</span>
				<span>Excellent</span>
			</div>

			<p class="text-sm font-medium text-[#9B7EBD]">
				{rating === 0 ? 'Select a rating' : `${rating} of 5`}
			</p>

		</div>

	{/if}

</div>