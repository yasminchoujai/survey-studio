<script>
	let {
		variant = 'draft',
		children
	} = $props();

	const variants = {
		draft:
			'bg-amber-50 text-amber-700 border border-amber-200',

		published:
			'bg-emerald-50 text-emerald-700 border border-emerald-200',

		info:
			'bg-blue-50 text-blue-700 border border-blue-200',

		error:
			'bg-red-50 text-red-700 border border-red-200'
	};
</script>

<span
	class={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${variants[variant]}`}
>
	{@render children?.()}
</span>