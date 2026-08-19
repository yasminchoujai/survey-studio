<script>
	import { Search } from 'lucide-svelte';
	import Input from '$lib/components/ui/Input.svelte';

	let {
		value = $bindable('')
	} = $props();
</script>

<div class="relative w-full max-w-md">

	<div
		class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 rounded-lg bg-[#D4BEE4]/40 p-1.5 text-[#3B1E54]"
	>
		<Search size={16} />
	</div>

	<Input
		bind:value
		class="
			h-11
			w-full
			rounded-xl
			border-[#D4BEE4]
			bg-white
			pl-5
			pr-4
			text-sm
			text-[#3B1E54]
			placeholder:text-slate-400
			focus:border-[#9B7EBD]
			focus:ring-2
			focus:ring-[#9B7EBD]/20
		"
		placeholder="Search surveys..."
	/>

</div>