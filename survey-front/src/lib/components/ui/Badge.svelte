<script>
	let {
		variant = 'draft',
		children
	} = $props();

	const variants = {
		draft:
			'border border-amber-200 bg-amber-50 text-amber-700 ml-4',

		published:
			'border border-emerald-200 bg-emerald-50 text-emerald-700',

		info:
			'border border-blue-200 bg-blue-50 text-blue-700',

		error:
			'border border-red-200 bg-red-50 text-red-700'
	};
</script>

<span
	class={`inline-flex h-7 items-center justify-center rounded-full px-3 text-xs font-semibold whitespace-nowrap transition-colors ${variants[variant]}`}
>
	{@render children?.()}
</span>