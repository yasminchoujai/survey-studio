<script>
	import Button from '$lib/components/ui/Button.svelte';

	let {
		currentPage = $bindable(1),
		totalPages = 1
	} = $props();

	function previous() {
		if (currentPage > 1) currentPage--;
	}

	function next() {
		if (currentPage < totalPages) currentPage++;
	}
</script>

<div class="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">

	<p class="text-sm text-slate-500">
		Page <span class="font-medium">{currentPage}</span> of {totalPages}
	</p>

	<div class="flex items-center gap-2">

		<Button
			variant="outline"
			size="sm"
			disabled={currentPage === 1}
			onclick={previous}
		>
			Previous
		</Button>

		{#each Array(totalPages) as _, index}

			<Button
				size="sm"
				variant={currentPage === index + 1 ? 'primary' : 'ghost'}
				onclick={() => (currentPage = index + 1)}
			>
				{index + 1}
			</Button>

		{/each}

		<Button
			variant="outline"
			size="sm"
			disabled={currentPage === totalPages}
			onclick={next}
		>
			Next
		</Button>

	</div>

</div>