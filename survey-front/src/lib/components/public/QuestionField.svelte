<script>
	import Star from 'lucide-svelte/icons/star';

	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';

	let {
		question,
		value = '',
		onChange = () => {},
		error = ''
	} = $props();

	function updateValue(newValue) {
		onChange(newValue);
	}

	function toggleOption(option) {
		const current = Array.isArray(value)
			? [...value]
			: [];

		let nextValue;

		if (current.includes(option)) {
			nextValue = current.filter(
				(item) => item !== option
			);
		} else {
			nextValue = [...current, option];
		}

		updateValue(nextValue);
	}
</script>

<div class="space-y-5">

	<!-- QUESTION -->

	<div class="space-y-2">
		<div class="flex items-start justify-between gap-4">

			<label
				class="text-base font-semibold leading-6 text-[#3B1E54]"
			>
				{question.label}
			</label>

			{#if question.required}
				<span
					class="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600"
				>
					Required
				</span>
			{/if}

		</div>

		{#if question.description}
			<p class="text-sm leading-6 text-slate-500">
				{question.description}
			</p>
		{/if}
	</div>

	<!-- SHORT TEXT / EMAIL -->

	{#if question.type === 'short_text' || question.type === 'email'}

		<Input
			type={
				question.type === 'email'
					? 'email'
					: 'text'
			}
			placeholder={question.placeholder ?? ''}
			value={value ?? ''}
			oninput={(event) => {
				updateValue(
					event.currentTarget.value
				);
			}}
			class="h-11 rounded-xl"
		/>

	<!-- LONG TEXT -->

	{:else if question.type === 'long_text'}

		<Textarea
			placeholder={question.placeholder ?? ''}
			value={value ?? ''}
			oninput={(event) => {
				updateValue(
					event.currentTarget.value
				);
			}}
			class="rounded-xl"
		/>

	<!-- SINGLE CHOICE -->

	{:else if question.type === 'single_choice'}

		<div class="space-y-3">

			{#each question.options ?? [] as option}

				<label
					class="group flex cursor-pointer items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 transition-all hover:border-[#9B7EBD] hover:bg-violet-50"
				>
					<input
						type="radio"
						name={question.id}
						checked={value === option}
						onchange={() =>
							updateValue(option)
						}
						class="h-5 w-5 accent-[#9B7EBD]"
					/>

					<span
						class="text-[15px] font-medium text-slate-700"
					>
						{option}
					</span>
				</label>

			{/each}

		</div>

	<!-- MULTIPLE CHOICE -->

	{:else if question.type === 'multiple_choice'}

		<div class="space-y-3">

			{#each question.options ?? [] as option}

				<label
					class="group flex cursor-pointer items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 transition-all hover:border-[#9B7EBD] hover:bg-violet-50"
				>
					<input
						type="checkbox"
						checked={
							Array.isArray(value) &&
							value.includes(option)
						}
						onchange={() =>
							toggleOption(option)
						}
						class="h-5 w-5 accent-[#9B7EBD]"
					/>

					<span
						class="text-[15px] font-medium text-slate-700"
					>
						{option}
					</span>
				</label>

			{/each}

		</div>

	<!-- RATING -->

	{:else if question.type === 'rating'}

		<div class="flex gap-3">

			{#each [1, 2, 3, 4, 5] as star}

				<button
					type="button"
					onclick={() =>
						updateValue(star)
					}
					class="rounded-lg p-1 transition hover:scale-110"
					aria-label={`Rate ${star} out of 5`}
				>
					<Star
						size={32}
						fill={
							Number(value) >= star
								? 'currentColor'
								: 'none'
						}
						class={
							Number(value) >= star
								? 'text-amber-400'
								: 'text-slate-300'
						}
					/>
				</button>

			{/each}

		</div>

	{/if}

	<!-- ERROR -->

	{#if error}

		<div
			class="rounded-xl border border-red-200 bg-red-50 px-4 py-3"
		>
			<p class="text-sm font-medium text-red-600">
				{error}
			</p>
		</div>

	{/if}

</div>