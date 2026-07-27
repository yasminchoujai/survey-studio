<script>
	let {
		variant = 'primary',
		size = 'md',
		type = 'button',
		disabled = false,
		leftIcon = null,
		rightIcon = null,
		class: className = '',
		onclick,
		children,
		...props
	} = $props();

	const variants = {
		primary:
			'bg-[#9B7EBD] text-white shadow-sm hover:bg-[#8D70B1] hover:shadow-md',

		secondary:
			'bg-[#D4BEE4]/30 text-[#3B1E54] hover:bg-[#D4BEE4]/50',

		outline:
			'border border-[#D4BEE4] bg-white text-[#3B1E54] shadow-sm hover:bg-[#D4BEE4]/20 hover:border-[#9B7EBD]',

		ghost:
			'bg-transparent text-[#3B1E54] hover:bg-[#D4BEE4]/30',

		danger:
			'bg-red-600 text-white shadow-sm hover:bg-red-700',

		soft:
			'bg-[#D4BEE4]/40 text-[#3B1E54] hover:bg-[#D4BEE4]/60'
	};

	const sizes = {
		sm: 'h-8 px-3 text-sm rounded-lg gap-1.5',

		md: 'h-10 px-4 text-sm rounded-xl gap-2',

		lg: 'h-11 px-5 text-base rounded-xl gap-2.5',

		icon: 'h-10 w-10 rounded-xl p-0'
	};
</script>

<button
	{type}
	{disabled}
	{...props}
	onclick={onclick}
	class={`
		inline-flex items-center justify-center
		font-medium
		whitespace-nowrap
		select-none
		transition-all
		duration-200
		ease-out
		active:scale-[0.97]
		focus:outline-none
		focus-visible:ring-2
		focus-visible:ring-[#9B7EBD]
		focus-visible:ring-offset-2
		disabled:pointer-events-none
		disabled:opacity-50
		disabled:shadow-none
		${variants[variant]}
		${sizes[size] ?? sizes.md}
		${className}
	`}
>
	{#if leftIcon}
		<svelte:component
			this={leftIcon}
			size={16}
			class="shrink-0"
		/>
	{/if}

	<span class="flex items-center">
		{@render children?.()}
	</span>

	{#if rightIcon}
		<svelte:component
			this={rightIcon}
			size={16}
			class="shrink-0"
		/>
	{/if}
</button>