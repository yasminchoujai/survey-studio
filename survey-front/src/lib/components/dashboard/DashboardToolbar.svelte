<script>
	import { Plus } from 'lucide-svelte';

	import SearchBar from './SearchBar.svelte';

	import Button from '$lib/components/ui/Button.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import ViewToggle from '$lib/components/ui/ViewToggle.svelte';

	let {
		search = $bindable(''),
		status = $bindable('All'),
		view = $bindable('table'),
		onCreate
	} = $props();

	const options = ['All', 'Draft', 'Published'];
</script>

<div class="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

	<div class="flex-1 max-w-lg">
		<SearchBar bind:value={search} />
	</div>

	<div class="flex items-center gap-3">

		<Select
			bind:value={status}
			{options}
		/>

		<ViewToggle bind:view />

		<Button
			leftIcon={Plus}
			onclick={onCreate}
		>
			Create Survey
		</Button>

	</div>

</div>