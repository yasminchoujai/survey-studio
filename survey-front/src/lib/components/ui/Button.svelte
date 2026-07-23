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
		primary: 'bg-violet-600 text-white hover:bg-violet-700',
		secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
		outline:
			'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100',
		ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
		danger: 'bg-red-600 text-white hover:bg-red-700'
	};

	const sizes = {
		sm: 'h-8 px-3 text-sm rounded-md gap-1.5',
		md: 'h-10 px-4 text-sm rounded-lg gap-2',
		lg: 'h-11 px-5 text-base rounded-xl gap-2.5',
		icon: 'h-10 w-10 rounded-lg p-0'
	};
</script>

<button
	{type}
	{disabled}
	{...props}
	onclick={onclick}
	class={`inline-flex items-center justify-center font-medium transition-all duration-200
	${variants[variant]}
	${sizes[size] ?? sizes.md}
	${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
	${className}`}
>
	{#if leftIcon}
		<svelte:component this={leftIcon} size={16} />
	{/if}

	{@render children?.()}

	{#if rightIcon}
		<svelte:component this={rightIcon} size={16} />
	{/if}
</button>