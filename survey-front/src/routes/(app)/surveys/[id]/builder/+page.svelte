<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	import { useSurveys } from '$lib/stores/surveys.svelte.js';

	import BuilderHeader from '$lib/components/builder/BuilderHeader.svelte';
	import QuestionTypePicker from '$lib/components/builder/QuestionTypePicker.svelte';
	import BuilderCanvas from '$lib/components/builder/BuilderCanvas.svelte';
	import QuestionSettings from '$lib/components/builder/QuestionSettings.svelte';

	const {
		getSurvey,
		addQuestion,
		addSection,
		updateQuestion,
		deleteQuestion,
		duplicateQuestion,
		deleteSection,
		publishSurvey
	} = useSurveys();

	let survey = $state(null);

	let selectedQuestion = $state(null);

	let selectedSectionId = $state(null);

	onMount(async () => {
		survey = await getSurvey(page.params.id);

		if (survey?.sections?.length) {
			selectedSectionId = survey.sections[0].id;
		}
	});

	function selectSection(sectionId) {
		selectedSectionId = sectionId;
	}

	function selectQuestion(question) {
		selectedQuestion = question;
	}

	async function handleAddQuestion(sectionId, type) {
		if (!survey) return;

		const question = {
			label: 'Untitled question',
			type,
			description: '',
			required: false,
			placeholder: '',
			options:
				type === 'single_choice' ||
				type === 'multiple_choice'
					? ['Option 1', 'Option 2']
					: []
		};

		const created = await addQuestion(
			survey,
			sectionId,
			question
		);

		selectedQuestion = created;
	}

	async function handleUpdateQuestion(question) {
		if (!survey) return;

		await updateQuestion(
			survey,
			question
		);

		selectedQuestion = question;
	}

	async function handleDeleteQuestion(questionId) {
		if (!survey) return;

		await deleteQuestion(
			survey,
			questionId
		);

		if (selectedQuestion?.id === questionId) {
			selectedQuestion = null;
		}
	}

	async function handleDuplicateQuestion(questionId) {
		if (!survey) return;

		const duplicated =
			await duplicateQuestion(
				survey,
				questionId
			);

		if (duplicated) {
			selectedQuestion = duplicated;
		}
	}

	async function handleDeleteSection(sectionId) {
		if (!survey) return;

		await deleteSection(
			survey,
			sectionId
		);

		if (selectedSectionId === sectionId) {
			selectedSectionId =
				survey.sections[0]?.id ?? null;
		}

		if (
			selectedQuestion &&
			!survey.sections.some((section) =>
				section.questions.some(
					(question) =>
						question.id === selectedQuestion.id
				)
			)
		) {
			selectedQuestion = null;
		}
	}

	async function handleAddSection() {
		if (!survey) return;

		const section = await addSection(
			survey
		);

		selectedSectionId = section.id;
	}

	async function handlePublish() {
		if (!survey) return;

		try {
			await publishSurvey(survey);
		} catch (err) {
			console.error('Failed to publish survey:', err);
		}
	}
</script>

{#if survey}
	<div class="flex h-screen flex-col bg-slate-50">

		<BuilderHeader
			{survey}
			onPublish={handlePublish}
		/>

		<div class="flex flex-1 overflow-hidden">

			<QuestionTypePicker
				sectionId={selectedSectionId}
				onAddQuestion={handleAddQuestion}
			/>

			<BuilderCanvas
				{survey}
				{selectQuestion}
				{selectSection}
				addSection={handleAddSection}
				deleteSection={handleDeleteSection}
				deleteQuestion={handleDeleteQuestion}
				duplicateQuestion={handleDuplicateQuestion}
			/>

			<QuestionSettings
				question={selectedQuestion}
				updateQuestion={handleUpdateQuestion}
			/>

		</div>

	</div>
{/if}