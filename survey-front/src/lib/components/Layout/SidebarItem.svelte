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
			? 'bg-[#D4BEE4] text-[#3B1E54] shadow-sm'
			: 'text-slate-500 hover:bg-[#F8F5FC] hover:text-[#3B1E54]'
	}`}
>

	<Icon
		size={18}
		class={`transition-colors ${
			active
				? 'text-[#3B1E54]'
				: 'text-slate-500 group-hover:text-[#9B7EBD]'
		}`}
	/>

	<span>{label}</span>

</a>