<script>
	let responseCount = 3;
</script>

<div class="min-h-screen animate-pulse bg-slate-50">
	<!-- Header -->
	<div class="border-b border-[#EBE4F4] bg-white">
		<div
			class="mx-auto flex max-w-5xl items-center justify-between px-6 py-5 md:px-8"
		>
			<div class="space-y-2">
				<div class="h-6 w-48 rounded bg-slate-200"></div>
				<div class="h-3 w-64 rounded bg-slate-100"></div>
			</div>

			<div class="h-9 w-24 rounded-xl bg-slate-100"></div>
		</div>
	</div>

	<!-- Content -->
	<div
		class="mx-auto max-w-5xl space-y-6 p-6 md:p-8"
	>
		<!-- Summary -->
		<div
			class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
		>
			{#each Array(4) as _}
				<div
					class="rounded-2xl border border-[#EBE4F4] bg-white p-5"
				>
					<div class="space-y-3">
						<div class="h-3 w-24 rounded bg-slate-100"></div>

						<div class="h-7 w-16 rounded bg-slate-200"></div>

						<div class="h-2.5 w-20 rounded bg-slate-100"></div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Responses -->
		<div class="space-y-4">
			{#each Array(responseCount) as _}
				<div
					class="rounded-2xl border border-[#EBE4F4] bg-white p-6"
				>
					<!-- Response Header -->
					<div
						class="flex items-center justify-between border-b border-[#F1EDF5] pb-4"
					>
						<div class="flex items-center gap-3">
							<div
								class="h-9 w-9 rounded-full bg-slate-200"
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
							class="h-7 w-20 rounded-lg bg-slate-100"
						></div>
					</div>

					<!-- Answers -->
					<div class="space-y-6 pt-5">
						{#each Array(3) as _}
							<div class="space-y-2">
								<div
									class="h-3 w-32 rounded bg-slate-100"
								></div>

								<div
									class="h-4 w-3/4 rounded bg-slate-200"
								></div>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>