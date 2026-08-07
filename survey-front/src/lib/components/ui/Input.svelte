<script>
	let {
		id = '',
		type = 'text',
		placeholder = '',
		value = $bindable(''),
		disabled = false,
		class: className = '',
		...rest
	} = $props();
</script>

<input
	{id}
	bind:value
	{type}
	{placeholder}
	{disabled}
	{...rest}
	class={`
		h-11
		w-full
		rounded-xl
		border
		border-[#D4BEE4]/70
		bg-white
		px-4
		text-sm
		text-[#3B1E54]
		placeholder:text-slate-400
		shadow-sm
		outline-none
		transition-all
		duration-200

		hover:border-[#9B7EBD]/60

		focus:border-[#9B7EBD]
		focus:ring-4
		focus:ring-[#D4BEE4]/40

		disabled:cursor-not-allowed
		disabled:border-slate-200
		disabled:bg-slate-100
		disabled:text-slate-400
		disabled:shadow-none

		${className}
	`}
/>