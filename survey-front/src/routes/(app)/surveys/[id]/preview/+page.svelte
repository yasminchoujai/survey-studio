<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	import { useSurveys } from '$lib/stores/surveys.svelte';

	import LoadingState from '$lib/components/ui/LoadingState.svelte';
	import ErrorState from '$lib/components/ui/ErrorState.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	import PreviewHeader from '$lib/components/preview/PreviewHeader.svelte';
	import QuestionField from '$lib/components/public/QuestionField.svelte';

	const { getSurvey } = useSurveys();

	let survey = $state(page.state?.survey ?? null);

	let loading = $state(!survey);
	let error = $state('');

	let answers = $state({});
	let errors = $state({});


	function initializeAnswers(data) {
		const initial = {};

		for (const section of data.sections ?? []) {
			for (const question of section.questions ?? []) {

				if (question.type === 'multiple_choice') {
					initial[question.id] = [];

				} else if (question.type === 'rating') {
					initial[question.id] = 0;

				} else {
					initial[question.id] = '';
				}
			}
		}

		return initial;
	}


	async function loadSurvey() {
		loading = true;
		error = '';

		try {
			survey = await getSurvey(page.params.id);

			answers = initializeAnswers(survey);

		} catch (err) {
			error = err?.message ?? 'Failed to load survey.';

		} finally {
			loading = false;
		}
	}


	onMount(() => {

		if (survey) {

			answers = initializeAnswers(survey);
			loading = false;

		} else {

			loadSurvey();

		}
	});
</script>


{#if loading}

	<LoadingState
		fullScreen
		message="Loading preview..."
		description="Preparing your survey."
	/>


{:else if error}

	<ErrorState
		title="Couldn't load preview"
		message={error}
		buttonText="Retry"
		onRetry={loadSurvey}
	/>


{:else if survey}

	<div class="min-h-screen bg-slate-50">

		<PreviewHeader {survey} />


		<div class="mx-auto max-w-2xl space-y-6 px-4 py-10">


			<Card class="space-y-5">

				<div class="flex items-center gap-3">

					<div>

						<h1 class="text-2xl font-bold text-slate-900">
							{survey.title}
						</h1>


						{#if survey.description}

							<p class="mt-1 text-slate-500">
								{survey.description}
							</p>

						{/if}

					</div>

				</div>


				<div
					class="rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-700"
				>
					This is a preview of your survey. Responses are not saved.
				</div>

			</Card>



			{#each survey.sections ?? [] as section}

				{#if section.questions?.length}

					<Card class="space-y-6">


						<h2
							class="text-sm font-semibold uppercase tracking-wide text-slate-400"
						>
							{section.title}
						</h2>



						{#each section.questions as question}


							<QuestionField
								{question}
								value={
									answers[question.id] ??
									(
										question.type === 'multiple_choice'
											? []
											: question.type === 'rating'
												? 0
												: ''
									)
								}
								onChange={(value) => {
									answers[question.id] = value;
								}}
								error={errors[question.id]}
							/>


						{/each}


					</Card>

				{/if}

			{/each}



			<Button
				class="w-full"
				size="lg"
				variant="secondary"
				disabled
			>
				Preview Mode
			</Button>


		</div>

	</div>

{/if}