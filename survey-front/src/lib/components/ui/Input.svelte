<script>
	import { Eye, EyeOff } from 'lucide-svelte';

	let {
		id = '',
		type = 'text',
		placeholder = '',
		value = $bindable(''),
		disabled = false,
		autocomplete = undefined,
		class: className = '',
		...rest
	} = $props();

	let showPassword = $state(false);

	let inputType = $derived(
		type === 'password'
			? showPassword
				? 'text'
				: 'password'
			: type
	);
</script>

<div class="relative w-full">
	<input
		{id}
		bind:value
		type={inputType}
		{placeholder}
		{disabled}
		{autocomplete}
		{...rest}
		class={`
			h-11
			w-full
			rounded-xl
			border
			border-[#D4BEE4]/70
			bg-white
			px-4
			text-sm
			text-[#3B1E54]
			placeholder:text-slate-400
			shadow-sm
			outline-none
			transition-all
			duration-200

			hover:border-[#9B7EBD]/60

			focus:border-[#9B7EBD]
			focus:ring-4
			focus:ring-[#D4BEE4]/40

			disabled:cursor-not-allowed
			disabled:border-slate-200
			disabled:bg-slate-100
			disabled:text-slate-400
			disabled:shadow-none

			${type === 'password' ? 'pr-11' : ''}

			${className}
		`}
	/>

	{#if type === 'password'}
		<button
			type="button"
			disabled={disabled}
			class="
				absolute
				right-3
				top-1/2
				-translate-y-1/2
				flex
				h-8
				w-8
				items-center
				justify-center
				rounded-lg
				text-slate-400
				transition-colors
				hover:bg-[#D4BEE4]/20
				hover:text-[#3B1E54]
				focus:outline-none
				focus-visible:ring-2
				focus-visible:ring-[#9B7EBD]
				disabled:pointer-events-none
				disabled:opacity-50
			"
			aria-label={showPassword ? 'Hide password' : 'Show password'}
			onclick={() => (showPassword = !showPassword)}
		>
			{#if showPassword}
				<Eye class="h-4 w-4" />
			{:else}
				<EyeOff class="h-4 w-4" />
			{/if}
		</button>
	{/if}
</div>