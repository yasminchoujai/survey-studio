<script>
	import SectionCard from './SectionCard.svelte';
	import AddSectionButton from './AddSectionButton.svelte';

	let {
		survey,
		selectQuestion,
		selectSection,
		addSection,
		deleteSection,
		deleteQuestion,
		duplicateQuestion,
		reorderSectionQuestions
	} = $props();
</script>

<section class="flex-1 overflow-y-auto bg-slate-50 p-8">

	<div class="mx-auto flex min-h-full max-w-3xl flex-col gap-5">

		<div
			class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
		>
			<p class="text-xs font-semibold uppercase tracking-widest text-violet-600">
				Survey
			</p>

			<h1 class="mt-2 text-2xl font-bold text-slate-900">
				{survey.title}
			</h1>

			<p class="mt-2 text-sm text-slate-500">
				{survey.description || 'Start building your survey.'}
			</p>
		</div>

		{#each survey.sections as section}

			<SectionCard
				survey={survey}
				section={section}
				{selectQuestion}
				{selectSection}
				{deleteSection}
				{deleteQuestion}
				{duplicateQuestion}
				{reorderSectionQuestions}
			/>

		{/each}

		<AddSectionButton
			onAddSection={addSection}
		/>

	</div>

</section>