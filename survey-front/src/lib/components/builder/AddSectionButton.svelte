<script>
	import { Plus } from 'lucide-svelte';

	import Button from '$lib/components/ui/Button.svelte';



	let {
		onAddSection
	} = $props();

</script>



<Button

	variant="outline"

	class="flex w-full items-center justify-center gap-2 border-dashed"

	onclick={() => onAddSection?.()}

>

	<Plus size={16} />

	Add section

</Button>