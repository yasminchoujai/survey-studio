<script>
	let { view = 'table' } = $props();
</script>

{#if view === 'table'}
	<div
		class="animate-pulse overflow-hidden rounded-2xl border border-[#EBE4F4] bg-white"
	>
		<!-- Table header -->
		<div
			class="flex h-12 items-center border-b border-[#EBE4F4] px-5"
		>
			<div class="h-3 w-32 rounded bg-slate-200"></div>

			<div class="ml-auto flex items-center gap-10">
				<div class="h-3 w-16 rounded bg-slate-200"></div>
				<div class="h-3 w-20 rounded bg-slate-200"></div>
				<div class="h-3 w-6 rounded bg-slate-200"></div>
			</div>
		</div>

		<!-- Table rows -->
		{#each Array(5) as _}
			<div
				class="flex min-h-[76px] items-center border-b border-[#F1EDF5] px-5 last:border-b-0"
			>
				<!-- Survey -->
				<div class="flex min-w-0 flex-1 items-center gap-3">
					<div
						class="h-9 w-9 shrink-0 rounded-xl bg-slate-200"
					></div>

					<div class="min-w-0 space-y-2">
						<div
							class="h-3.5 w-36 rounded bg-slate-200"
						></div>

						<div
							class="h-2.5 w-52 max-w-full rounded bg-slate-100"
						></div>
					</div>
				</div>

				<!-- Status -->
				<div class="w-24">
					<div
						class="h-6 w-16 rounded-full bg-slate-100"
					></div>
				</div>

				<!-- Responses -->
				<div class="w-28">
					<div
						class="h-3 w-10 rounded bg-slate-100"
					></div>
				</div>

				<!-- Actions -->
				<div class="flex w-10 justify-end">
					<div
						class="h-8 w-8 rounded-lg bg-slate-100"
					></div>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<!-- Card view -->
	<div
		class="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
	>
		{#each Array(5) as _}
			<div
				class="animate-pulse rounded-2xl border border-[#EBE4F4] bg-white p-5"
			>
				<!-- Card header -->
				<div class="flex items-start justify-between">
					<div class="flex items-center gap-3">
						<div
							class="h-10 w-10 rounded-xl bg-slate-200"
						></div>

						<div class="space-y-2">
							<div
								class="h-3.5 w-28 rounded bg-slate-200"
							></div>

							<div
								class="h-2.5 w-20 rounded bg-slate-100"
							></div>
						</div>
					</div>

					<div
						class="h-7 w-7 rounded-lg bg-slate-100"
					></div>
				</div>

				<!-- Description -->
				<div class="mt-5 space-y-2">
					<div
						class="h-2.5 w-full rounded bg-slate-100"
					></div>

					<div
						class="h-2.5 w-3/4 rounded bg-slate-100"
					></div>
				</div>

				<!-- Footer -->
				<div
					class="mt-6 flex items-center justify-between border-t border-[#F1EDF5] pt-4"
				>
					<div
						class="h-3 w-16 rounded bg-slate-100"
					></div>

					<div
						class="h-3 w-12 rounded bg-slate-100"
					></div>
				</div>
			</div>
		{/each}
	</div>
{/if}