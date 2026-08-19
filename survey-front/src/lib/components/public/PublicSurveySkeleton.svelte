<script>
	let { sections = 2 } = $props();
</script>

<div class="min-h-screen bg-slate-50 px-4 py-10">
	<div class="mx-auto max-w-2xl space-y-6 animate-pulse">

		<!-- Survey header -->
		<div class="rounded-2xl border border-slate-200 bg-white p-6">
			<div class="space-y-4">
				<div class="h-8 w-3/4 rounded-lg bg-slate-200"></div>

				<div class="space-y-2">
					<div class="h-4 w-full rounded bg-slate-100"></div>
					<div class="h-4 w-5/6 rounded bg-slate-100"></div>
				</div>
			</div>
		</div>

		<!-- Sections -->
		{#each Array(sections) as _}
			<div
				class="rounded-2xl border border-slate-200 bg-white p-6"
			>
				<!-- Section title -->
				<div class="mb-7 border-b border-slate-100 pb-3">
					<div class="h-3 w-28 rounded bg-slate-200"></div>
				</div>

				<!-- Questions -->
				<div class="space-y-8">

					<!-- Question 1 -->
					<div class="space-y-3">
						<div class="h-4 w-3/5 rounded bg-slate-200"></div>

						<div class="h-10 w-full rounded-lg bg-slate-100"></div>
					</div>

					<!-- Question 2 -->
					<div class="space-y-3">
						<div class="h-4 w-2/3 rounded bg-slate-200"></div>

						<div class="space-y-2">
							<div class="h-10 w-full rounded-lg bg-slate-100"></div>
							<div class="h-10 w-full rounded-lg bg-slate-100"></div>
							<div class="h-10 w-full rounded-lg bg-slate-100"></div>
						</div>
					</div>

					<!-- Question 3 -->
					<div class="space-y-3">
						<div class="h-4 w-1/2 rounded bg-slate-200"></div>

						<div class="h-10 w-full rounded-lg bg-slate-100"></div>
					</div>

				</div>
			</div>
		{/each}

		<!-- Submit button -->
		<div class="h-12 w-full rounded-xl bg-slate-200"></div>

	</div>
</div>