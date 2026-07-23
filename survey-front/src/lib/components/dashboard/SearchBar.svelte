<script>
	import { Search } from 'lucide-svelte';
	import Input from '$lib/components/ui/Input.svelte';

	let {
		value = $bindable('')
	} = $props();
</script>

<div class="relative w-full">

	<Search
		size={16}
		class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
	/>

	<Input
		bind:value
		class="pl-10"
		placeholder="Search surveys..."
	/>

</div>