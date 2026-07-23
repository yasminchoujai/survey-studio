<script>
	import Button from '$lib/components/ui/Button.svelte';

	import {
		Table,
		Grid2x2
	} from 'lucide-svelte';

	let {
		view = $bindable('table')
	} = $props();
</script>

<div class="flex rounded-lg border border-slate-200 bg-white p-1">

	<Button
	variant={view === 'table' ? 'primary' : 'ghost'}
	size="sm"
	onclick={() => (view = 'table')}
	leftIcon={Table}
/>

<Button
	variant={view === 'grid' ? 'primary' : 'ghost'}
	size="sm"
	onclick={() => (view = 'grid')}
	leftIcon={Grid2x2}
/>

</div>