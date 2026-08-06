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
		sm: 'h-8 rounded-lg px-3 text-sm',
		md: 'h-10 rounded-xl px-4 text-sm',
		lg: 'h-11 rounded-xl px-5 text-base',
		icon: 'h-10 w-10 rounded-xl'
	};
</script>

<button
	{type}
	{disabled}
	{...props}
	onclick={onclick}
	class={`
		inline-flex
		items-center
		justify-center
		gap-2
		shrink-0
		select-none
		whitespace-nowrap
		font-medium
		leading-none
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
		cursor-pointer
	`}
>
	{#if leftIcon}
		<svelte:component
			this={leftIcon}
			class="h-4 w-4 shrink-0"
		/>
	{/if}

	{#if children}
		<span class="inline-flex items-center gap-2 leading-none">
			{@render children?.()}
		</span>
	{/if}

	{#if rightIcon}
		<svelte:component
			this={rightIcon}
			class="h-4 w-4 shrink-0"
		/>
	{/if}
</button>