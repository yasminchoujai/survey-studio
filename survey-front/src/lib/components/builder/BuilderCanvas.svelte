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
		reorderSectionQuestions,
		onAddQuestion,
		onDrop,                // ✅ Added
		selectedQuestionId     // ✅ Added
	} = $props();

	async function handleQuestionDrop(event, sectionId, targetId) {
		const section = survey.sections.find(s => s.id === sectionId);
		if (!section) return;

		const draggedId = event.dataTransfer.getData('application/question-id');
		if (!draggedId || draggedId === targetId) return;

		const questions = section.questions;
		const fromIndex = questions.findIndex(q => q.id === draggedId);
		const toIndex = questions.findIndex(q => q.id === targetId);

		if (fromIndex === -1 || toIndex === -1) return;

		const [moved] = questions.splice(fromIndex, 1);
		questions.splice(toIndex, 0, moved);

		await reorderSectionQuestions?.(survey, section);
	}
</script>

<section class="flex-1 overflow-y-auto bg-slate-50 p-8">
	<div class="mx-auto flex min-h-full max-w-3xl flex-col gap-5">
		<!-- Survey Header -->
		<div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
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

		<!-- Sections -->
		{#each survey.sections as section (section.id)}
			<SectionCard
				{section}
				{selectQuestion}
				{selectSection}
				{deleteSection}
				{deleteQuestion}
				{duplicateQuestion}
				{onAddQuestion}
				onDrop={handleQuestionDrop}
				{selectedQuestionId}
			/>
		{/each}

		<!-- Add Section Button -->
		<AddSectionButton onAddSection={addSection} />
	</div>
</section>