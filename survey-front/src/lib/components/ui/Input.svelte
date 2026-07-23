<script>
	let {
		id = '',
		type = 'text',
		placeholder = '',
		value = $bindable(''),
		disabled = false,
		class: className = ''
	} = $props();
</script>

<input
	{id}
	bind:value
	{type}
	{placeholder}
	{disabled}
	class={`h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition
	focus:border-violet-500 focus:ring-2 focus:ring-violet-100
	disabled:bg-slate-100 disabled:text-slate-400
	${className}`}
/>