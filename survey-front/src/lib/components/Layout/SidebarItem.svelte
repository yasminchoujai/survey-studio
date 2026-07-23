<script>
	let {
		icon: Icon,
		label,
		href,
		active = false
	} = $props();
</script>

<a
	href={href}
	data-sveltekit-preload-data="hover"
	class={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
	${
		active
			? 'bg-violet-100 text-violet-700'
			: 'text-slate-500 hover:bg-violet-50 hover:text-violet-700'
	}`}
>

	<Icon
		size={18}
		class={`transition-colors ${
			active
				? 'text-violet-700'
				: 'text-slate-500 group-hover:text-violet-700'
		}`}
	/>

	<span>{label}</span>

</a>