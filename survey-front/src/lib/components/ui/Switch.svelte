<script>
	let {
		checked = $bindable(false),
		onchange
	} = $props();
</script>


<label class="relative inline-flex cursor-pointer items-center">


	<input
		type="checkbox"
		class="peer sr-only"
		bind:checked
		onchange={onchange}
	/>


	<div
		class="h-5 w-9 rounded-full bg-slate-300 transition peer-checked:bg-violet-600"
	>


		<div
			class="ml-0.5 mt-0.5 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-4"
		></div>


	</div>


</label>