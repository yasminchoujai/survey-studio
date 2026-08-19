<script>
	let questionCount = 4;
</script>

<div class="min-h-screen animate-pulse bg-slate-50">
	<!-- Preview Header Skeleton -->
	<div class="h-16 border-b border-[#EBE4F4] bg-white">
		<div class="mx-auto flex h-full max-w-2xl items-center justify-between px-4">
			<div class="h-4 w-28 rounded bg-slate-200"></div>

			<div class="h-8 w-20 rounded-lg bg-slate-100"></div>
		</div>
	</div>

	<!-- Main Content -->
	<div class="mx-auto max-w-2xl space-y-6 px-4 py-10">
		<!-- Survey Header -->
		<div
			class="rounded-2xl border border-[#EBE4F4] bg-white p-6"
		>
			<div class="space-y-4">
				<div class="h-7 w-2/3 rounded bg-slate-200"></div>

				<div class="h-4 w-full rounded bg-slate-100"></div>

				<div class="h-4 w-4/5 rounded bg-slate-100"></div>
			</div>

			<div
				class="mt-6 h-12 rounded-xl border border-violet-100 bg-violet-50"
			></div>
		</div>

		<!-- Questions -->
		<div
			class="rounded-2xl border border-[#EBE4F4] bg-white p-6"
		>
			<div class="space-y-8">
				{#each Array(questionCount) as _}
					<div class="space-y-3">
						<!-- Question label -->
						<div class="h-4 w-3/5 rounded bg-slate-200"></div>

						<!-- Description -->
						<div class="h-3 w-2/5 rounded bg-slate-100"></div>

						<!-- Input -->
						<div
							class="h-11 w-full rounded-xl border border-slate-100 bg-slate-50"
						></div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Button -->
		<div class="h-11 w-full rounded-xl bg-slate-200"></div>
	</div>
</div>