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
	class={`rounded-xl border border-slate-200 bg-white shadow-sm ${paddings[padding]} ${className}`}
>
	{@render children?.()}
</div>