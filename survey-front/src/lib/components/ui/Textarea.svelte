<script>
	let {
		id = '',
		value = $bindable(''),
		placeholder = '',
		disabled = false,
		class: className = '',
		...rest
	} = $props();
</script>

<textarea
	{id}
	bind:value
	{placeholder}
	{disabled}
	{...rest}
	class={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 ${className}`}
></textarea>