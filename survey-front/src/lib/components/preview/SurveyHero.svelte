<script>
	let { survey } = $props();
</script>

<section class="border-b border-(--border) px-10 py-10">

	<div class="mx-auto max-w-2xl">

		<div class="flex items-center gap-2">

			<div class="h-2 w-2 rounded-full bg-(--primary)"></div>

			<span class="text-(--primary) text-xs font-semibold uppercase tracking-[0.18em]">
				Survey
			</span>

		</div>

		<h1 class="mt-4 text-3xl font-bold tracking-tight text-(--text-heading)">
			{survey.title}
		</h1>

		{#if survey.description}

			<p class="mt-4 max-w-xl text-base leading-7 text-(--text-muted)">
				{survey.description}
			</p>

		{/if}

		<div class="mt-8 flex flex-wrap gap-3">

			<div class="rounded-full border border-(--border) bg-white px-4 py-2 text-sm font-medium text-(--text-body)">
				{survey.sections.length}
				Section{survey.sections.length !== 1 ? 's' : ''}
			</div>

			<div class="rounded-full border border-(--border) bg-white px-4 py-2 text-sm font-medium text-(--text-body)">
				{survey.sections.reduce((total, section) => total + section.questions.length, 0)}
				Question{survey.sections.reduce((total, section) => total + section.questions.length, 0) !== 1 ? 's' : ''}
			</div>

			<div class="rounded-full bg-(--primary-light) px-4 py-2 text-sm font-medium text-(--primary-dark)">
				{survey.status}
			</div>

		</div>

	</div>

</section>