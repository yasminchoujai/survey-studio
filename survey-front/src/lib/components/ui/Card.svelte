<script>
	let {
		padding = 'md',
		class: className = '',
		children
	} = $props();

	const paddings = {
		none: '',
		sm: 'p-4',
		md: 'p-6',
		lg: 'p-8'
	};
</script>

<div
	class={`
		rounded-2xl
		border
		border-[#D4BEE4]/60
		bg-white
		shadow-sm
		transition-all
		duration-200
		hover:shadow-lg
		hover:border-[#9B7EBD]/40
		${paddings[padding]}
		${className}
	`}
>
	{@render children?.()}
</div>