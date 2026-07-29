<script>
    import { Star } from 'lucide-svelte';

    import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';

    let { question, value = $bindable(), error = '' } = $props();

    function toggleOption(option) {
        const current = Array.isArray(value) ? value: []

        if (current.includes(option)) {
            value = current.filter((item) => item !== option);
        } else {
            value = {...current, option}
        }
    }
</script>


<div class="space-y-2">

	<label class="block text-sm font-medium text-slate-800">
		{question.label}
		{#if question.required}
			<span class="text-red-500">*</span>
		{/if}
	</label>

	{#if question.description}
		<p class="text-sm text-slate-500">
			{question.description}
		</p>
	{/if}

	{#if question.type === 'short_text' || question.type === 'email'}

		<Input
			type={question.type === 'email' ? 'email' : 'text'}
			placeholder={question.placeholder}
			bind:value
		/>

	{:else if question.type === 'long_text'}

		<Textarea
			placeholder={question.placeholder}
			bind:value
		/>

	{:else if question.type === 'single_choice'}

		<div class="space-y-2">
			{#each question.options ?? [] as option}
				<label class="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm has-[:checked]:border-violet-500 has-[:checked]:bg-violet-50">
					<input
						type="radio"
						name={question.id}
						value={option}
						checked={value === option}
						onchange={() => (value = option)}
						class="h-4 w-4 accent-violet-600"
					/>
					{option}
				</label>
			{/each}
		</div>

	{:else if question.type === 'multiple_choice'}

		<div class="space-y-2">
			{#each question.options ?? [] as option}
				<label class="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm has-[:checked]:border-violet-500 has-[:checked]:bg-violet-50">
					<input
						type="checkbox"
						checked={Array.isArray(value) && value.includes(option)}
						onchange={() => toggleOption(option)}
						class="h-4 w-4 accent-violet-600"
					/>
					{option}
				</label>
			{/each}
		</div>

	{:else if question.type === 'rating'}

		<div class="flex gap-1">
			{#each [1, 2, 3, 4, 5] as star}
				<button
					type="button"
					onclick={() => (value = star)}
					class="text-slate-300 transition hover:text-amber-400"
				>
					<Star
						size={28}
						fill={value >= star ? 'currentColor' : 'none'}
						class={value >= star ? 'text-amber-400' : ''}
					/>
				</button>
			{/each}
		</div>

	{/if}

	{#if error}
		<p class="text-xs text-red-500">{error}</p>
	{/if}

</div>