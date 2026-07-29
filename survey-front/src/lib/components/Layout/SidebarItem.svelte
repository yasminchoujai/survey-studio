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
	class={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
		active
			? 'bg-[#F6F1FB] text-[#3B1E54]'
			: 'text-slate-500 hover:bg-slate-50 hover:text-[#3B1E54]'
	}`}
>

	{#if active}
		<div class="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#9B7EBD]"></div>
	{/if}

	<Icon
		size={18}
		class={`transition-all duration-200 ${
			active
				? 'text-[#3B1E54]'
				: 'text-slate-500 group-hover:text-[#9B7EBD] group-hover:translate-x-0.5'
		}`}
	/>

	<span class="flex-1">
		{label}
	</span>

</a>