<script>
</script>

<div class="flex h-screen flex-col overflow-hidden bg-slate-50">
	<!-- Header skeleton -->
	<header
		class="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6"
	>
		<div class="flex items-center gap-3">
			<!-- Back button -->
			<div class="h-9 w-9 animate-pulse rounded-lg bg-slate-200"></div>

			<!-- Title -->
			<div class="h-4 w-32 animate-pulse rounded bg-slate-200"></div>

			<!-- Status -->
			<div class="h-6 w-16 animate-pulse rounded-full bg-slate-100"></div>

			<!-- Question count -->
			<div class="hidden h-3 w-24 animate-pulse rounded bg-slate-100 sm:block"></div>
		</div>

		<!-- Header actions -->
		<div class="flex items-center gap-3">
			<div class="h-9 w-20 animate-pulse rounded-lg bg-slate-200"></div>
			<div class="h-9 w-24 animate-pulse rounded-lg bg-slate-200"></div>
		</div>
	</header>

	<!-- Builder body -->
	<div class="flex min-h-0 flex-1">
		<!-- Left question picker -->
		<aside
			class="hidden w-56 shrink-0 border-r border-slate-200 bg-white p-4 lg:block"
		>
			<div class="mb-5 h-3 w-24 animate-pulse rounded bg-slate-200"></div>

			<div class="space-y-3">
				<div class="h-10 animate-pulse rounded-lg bg-slate-100"></div>
				<div class="h-10 animate-pulse rounded-lg bg-slate-100"></div>
				<div class="h-10 animate-pulse rounded-lg bg-slate-100"></div>
				<div class="h-10 animate-pulse rounded-lg bg-slate-100"></div>
				<div class="h-10 animate-pulse rounded-lg bg-slate-100"></div>
			</div>
		</aside>

		<!-- Center canvas -->
		<main class="min-w-0 flex-1 overflow-y-auto p-6">
			<div class="mx-auto max-w-3xl space-y-5">
				<!-- Survey intro -->
				<div class="rounded-2xl border border-slate-200 bg-white p-6">
					<div class="h-5 w-56 animate-pulse rounded bg-slate-200"></div>

					<div class="mt-3 h-3 w-80 max-w-full animate-pulse rounded bg-slate-100"></div>
					<div class="mt-2 h-3 w-64 max-w-full animate-pulse rounded bg-slate-100"></div>
				</div>

				<!-- Question 1 -->
				<div class="rounded-2xl border border-slate-200 bg-white p-6">
					<div class="flex items-center justify-between">
						<div class="h-3 w-20 animate-pulse rounded bg-slate-100"></div>
						<div class="h-8 w-20 animate-pulse rounded-lg bg-slate-100"></div>
					</div>

					<div class="mt-5 h-4 w-72 animate-pulse rounded bg-slate-200"></div>

					<div class="mt-4 h-11 w-full animate-pulse rounded-lg bg-slate-100"></div>
				</div>

				<!-- Question 2 -->
				<div class="rounded-2xl border border-slate-200 bg-white p-6">
					<div class="flex items-center justify-between">
						<div class="h-3 w-20 animate-pulse rounded bg-slate-100"></div>
						<div class="h-8 w-20 animate-pulse rounded-lg bg-slate-100"></div>
					</div>

					<div class="mt-5 h-4 w-60 animate-pulse rounded bg-slate-200"></div>

					<div class="mt-4 space-y-3">
						<div class="h-10 w-full animate-pulse rounded-lg bg-slate-100"></div>
						<div class="h-10 w-full animate-pulse rounded-lg bg-slate-100"></div>
					</div>
				</div>

				<!-- Add question -->
				<div class="h-12 w-full animate-pulse rounded-xl bg-slate-100"></div>
			</div>
		</main>

		<!-- Right settings -->
		<aside
			class="hidden w-72 shrink-0 border-l border-slate-200 bg-white p-5 lg:block"
		>
			<div class="h-4 w-32 animate-pulse rounded bg-slate-200"></div>

			<div class="mt-6 space-y-5">
				<div>
					<div class="h-3 w-16 animate-pulse rounded bg-slate-100"></div>
					<div class="mt-2 h-10 w-full animate-pulse rounded-lg bg-slate-100"></div>
				</div>

				<div>
					<div class="h-3 w-20 animate-pulse rounded bg-slate-100"></div>
					<div class="mt-2 h-20 w-full animate-pulse rounded-lg bg-slate-100"></div>
				</div>

				<div>
					<div class="h-3 w-24 animate-pulse rounded bg-slate-100"></div>
					<div class="mt-2 h-10 w-full animate-pulse rounded-lg bg-slate-100"></div>
				</div>

				<div class="flex items-center justify-between">
					<div class="h-3 w-20 animate-pulse rounded bg-slate-100"></div>
					<div class="h-5 w-9 animate-pulse rounded-full bg-slate-200"></div>
				</div>
			</div>
		</aside>
	</div>
</div>