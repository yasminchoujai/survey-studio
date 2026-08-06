<script>
	let {
		open = false,
		children
	} = $props();
</script>

{#if open}

	<div
		class="fixed inset-0 z-[9999] isolate flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
	>

		<div
			class="relative z-[10000] w-full max-w-sm rounded-2xl border border-slate-200 bg-white shadow-2xl"
		>

			<div class="p-5">
				{@render children?.()}
			</div>

		</div>

	</div>

{/if}