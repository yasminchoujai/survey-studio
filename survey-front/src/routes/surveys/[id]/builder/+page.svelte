<script>
	import { page } from '$app/state';

	import { useSurveys } from '$lib/stores/surveys.svelte.js';

	import BuilderHeader from '$lib/components/builder/BuilderHeader.svelte';
	import QuestionTypePicker from '$lib/components/builder/QuestionTypePicker.svelte';
	import BuilderCanvas from '$lib/components/builder/BuilderCanvas.svelte';
	import QuestionSettings from '$lib/components/builder/QuestionSettings.svelte';



	const {
		load,
		getSurvey,
		addQuestion,
		addSection,
		updateQuestion,
		deleteQuestion,
		duplicateQuestion,
		deleteSection
	} = useSurveys();





	load();





	let survey = $derived(
		getSurvey(page.params.id)
	);





	let selectedQuestion = $state(null);


	let selectedSectionId = $state(null);









	$effect(() => {


		if (
			survey &&
			survey.sections.length &&
			selectedSectionId === null
		) {


			selectedSectionId =
				survey.sections[0].id;


		}


	});









	function selectSection(sectionId) {


		selectedSectionId = sectionId;


	}









	function selectQuestion(question) {


		selectedQuestion = question;


	}









	function handleAddQuestion(sectionId, type) {


		if (!survey) return;



		const question = {


			id: Date.now(),


			type,


			label: 'Untitled question',


			description: '',


			required: false,


			placeholder: '',


			options:
				type === 'single_choice' ||
				type === 'multiple_choice'
					?
					[
						'Option 1',
						'Option 2'
					]
					:
					[]


		};





		addQuestion(

			survey.id,

			sectionId,

			question

		);


	}









	function handleUpdateQuestion(question) {


		if (!survey) return;



		updateQuestion(

			survey.id,

			question

		);




		selectedQuestion = question;


	}









	function handleDeleteQuestion(questionId) {


		if (!survey) return;



		deleteQuestion(

			survey.id,

			questionId

		);





		if (
			selectedQuestion?.id === questionId
		) {

			selectedQuestion = null;

		}


	}









	function handleDuplicateQuestion(questionId) {
	if (!survey) return;

	duplicateQuestion(survey.id, questionId);
}









	function handleDeleteSection(sectionId) {


		if (!survey) return;



		deleteSection(

			survey.id,

			sectionId

		);



		selectedSectionId = null;


	}









	function handleAddSection() {


		if (!survey) return;


		addSection(

			survey.id

		);


	}

</script>







{#if survey}



	<div class="flex h-screen flex-col bg-slate-50">


		<BuilderHeader {survey} />





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