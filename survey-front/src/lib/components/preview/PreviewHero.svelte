<script>
	let { survey } = $props();

	let questionCount = $derived(
		(survey?.sections ?? []).reduce(
			(total, section) => total + (section.questions?.length ?? 0),
			0
		)
	);

	let estimatedMinutes = $derived(
		Math.max(1, Math.ceil(questionCount / 4))
	);
</script>

<section class="border-b border-slate-200 bg-gradient-to-r from-violet-50 via-white to-white p-8">

	<div class="space-y-6">

		<div>

			<p class="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
				We value your feedback
			</p>

			<h1 class="mt-3 text-4xl font-bold tracking-tight text-slate-900">
				{survey.title}
			</h1>

			<p class="mt-4 max-w-2xl leading-7 text-slate-600">
				{survey.description ||
				'Please answer the questions below. Your responses help us improve our services and should only take a few minutes.'}
			</p>

		</div>

		<div class="flex flex-wrap gap-3">

			<div class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
				 {questionCount}
				question{questionCount !== 1 ? 's' : ''}
			</div>

			<div class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
				{survey.sections.length}
				section{survey.sections.length !== 1 ? 's' : ''}
			</div>

		

		</div>

		<div class="rounded-xl border border-violet-100 bg-violet-50 p-4">

			<p class="text-sm leading-6 text-slate-700">
				Thank you for taking the time to complete this survey. Please answer each question as accurately as possible before submitting your responses.
			</p>

		</div>

	</div>

</section>