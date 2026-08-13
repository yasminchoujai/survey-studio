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

	const {
		getSurvey
	} = useSurveys();

	let survey =
		$state(
			page.state?.survey ??
				null
		);

	let loading =
		$state(!survey);

	let error =
		$state('');

	let answers =
		$state({});

	let errors =
		$state({});

	function initializeAnswers(
		data
	) {
		const initial = {};

		for (
			const question of
				data?.questions ?? []
		) {
			if (
				question.type ===
				'multiple_choice'
			) {
				initial[
					getQuestionKey(
						question
					)
				] = [];
			} else if (
				question.type ===
				'rating'
			) {
				initial[
					getQuestionKey(
						question
					)
				] = 0;
			} else {
				initial[
					getQuestionKey(
						question
					)
				] = '';
			}
		}

		return initial;
	}

	function getQuestionKey(
		question
	) {
		return (
			question?.id ??
			question?.__localId
		);
	}

	async function loadSurvey() {
		loading = true;
		error = '';

		try {
			const id =
				page.params.id;

			survey =
				await getSurvey(id);

			answers =
				initializeAnswers(
					survey
				);
		} catch (err) {
			error =
				err?.message ??
				'Failed to load survey.';
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		if (survey) {
			answers =
				initializeAnswers(
					survey
				);

			loading = false;

			return;
		}

		loadSurvey();
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
	<div
		class="min-h-screen bg-slate-50"
	>
		<PreviewHeader
			{survey}
		/>

		<div
			class="mx-auto max-w-2xl space-y-6 px-4 py-10"
		>
			<Card class="space-y-5">
				<div
					class="flex items-center gap-3"
				>
					<div>
						<h1
							class="text-2xl font-bold text-slate-900"
						>
							{survey.title}
						</h1>

						{#if survey.description}
							<p
								class="mt-1 text-slate-500"
							>
								{
									survey.description
								}
							</p>
						{/if}
					</div>
				</div>

				<div
					class="rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-700"
				>
					This is a preview of your
					survey. Responses are not
					saved.
				</div>
			</Card>

			{#if survey.questions?.length}
				<Card
					class="space-y-6"
				>
					{#each survey.questions as question (
						question.id ??
						question.__localId
					)}
						<QuestionField
							{question}
							value={
								answers[
									getQuestionKey(
										question
									)
								] ??
								(
									question.type ===
									'multiple_choice'
										? []
										: question.type ===
												'rating'
											? 0
											: ''
								)
							}
							onChange={(
								value
							) => {
								answers[
									getQuestionKey(
										question
									)
								] =
									value;
							}}
							error={
								errors[
									getQuestionKey(
										question
									)
								]
							}
						/>
					{/each}
				</Card>
			{:else}
				<Card>
					<div
						class="py-12 text-center"
					>
						<p
							class="text-sm text-slate-500"
						>
							This survey doesn't
							have any questions yet.
						</p>
					</div>
				</Card>
			{/if}

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