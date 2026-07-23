<script>
	let {
		open = false,
		children
	} = $props();
</script>

{#if open}

<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
>

	<div
		class="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl"
	>

		<div class="p-6">

			{@render children?.()}

		</div>

	</div>

</div>

{/if}