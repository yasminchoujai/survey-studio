<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { CheckCircle2, AlertTriangle } from 'lucide-svelte';

	import { getPublicSurvey } from '$lib/api/public.js';
	import { submitResponse } from '$lib/api/responses.js';

	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import State from '$lib/components/ui/State.svelte';

	import QuestionField from '$lib/components/public/QuestionField.svelte';

	let survey = $state(null);
	let answers = $state({});
	let errors = $state({});

	let loading = $state(true);
	let loadError = $state('');

	let submitting = $state(false);
	let submitted = $state(false);

	function normalizeSurveyResponse(response) {
		if (response?.success && response?.data) {
			return response.data;
		}

		if (response?.data) {
			return response.data;
		}

		return response;
	}

	function normalizeSurvey(surveyData) {
		if (!surveyData) return null;

		let sections = Array.isArray(surveyData.sections)
			? surveyData.sections
			: [];

		if (
			sections.length === 0 &&
			Array.isArray(surveyData.questions) &&
			surveyData.questions.length > 0
		) {
			sections = [
				{
					id: 'default-section',
					title: '',
					questions: surveyData.questions
				}
			];
		}

		return {
			...surveyData,
			sections
		};
	}

	function initializeAnswers(data) {
		const initial = {};

		for (const section of data?.sections ?? []) {
			for (const question of section.questions ?? []) {
				if (!question.id) continue;

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
		loadError = '';

		try {
			const response = await getPublicSurvey(page.params.id);

			const data = normalizeSurveyResponse(response);

			if (!data) {
				throw new Error('Survey not found');
			}

			survey = normalizeSurvey(data);
			answers = initializeAnswers(survey);
		} catch (err) {
			loadError =
				err?.message ??
				'This survey could not be found.';
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		loadSurvey();
	});

	function validate() {
		errors = {};

		if (!survey) return false;

		for (const section of survey.sections ?? []) {
			for (const question of section.questions ?? []) {
				if (!question.required) continue;

				const value = answers[question.id];

				const empty =
					value === undefined ||
					value === null ||
					value === '' ||
					(Array.isArray(value) &&
						value.length === 0);

				if (empty) {
					errors[question.id] =
						'This question is required';
				}
			}
		}

		return Object.keys(errors).length === 0;
	}

	async function handleSubmit() {
		if (!survey) return;

		if (!validate()) {
			return;
		}

		submitting = true;
		loadError = '';

		try {
			const payload = Object.entries(answers).map(
				([questionId, value]) => ({
					questionId,
					value
				})
			);

			await submitResponse(
				survey.id,
				payload
			);

			submitted = true;
		} catch (err) {
			loadError =
				err?.message ??
				'Failed to submit your response.';
		} finally {
			submitting = false;
		}
	}
</script>

{#if loading}

	<div
		class="flex min-h-screen items-center justify-center bg-slate-50"
	>
		<Spinner />
	</div>

{:else if loadError && !survey}

	<div
		class="flex min-h-screen items-center justify-center bg-slate-50 px-4"
	>
		<State
			icon={AlertTriangle}
			title="Survey unavailable"
			description={loadError}
		/>
	</div>

{:else if submitted}

	<div
		class="flex min-h-screen items-center justify-center bg-slate-50 px-4"
	>
		<State
			icon={CheckCircle2}
			title="Thanks for your response!"
			description="Your answers have been submitted successfully."
		/>
	</div>

{:else if survey}

	<div class="min-h-screen bg-slate-50 px-4 py-10">
		<div class="mx-auto max-w-2xl space-y-6">

			<Card class="space-y-3">
				<h1
					class="text-3xl font-bold text-slate-900"
				>
					{survey.title}
				</h1>

				{#if survey.description}
					<p
						class="text-base leading-7 text-slate-500"
					>
						{survey.description}
					</p>
				{/if}
			</Card>

			{#if survey.sections?.length}

				{#each survey.sections as section}

					{#if section.questions?.length}

						<Card class="space-y-7">

							{#if section.title}
								<h2
									class="border-b border-slate-100 pb-3 text-sm font-semibold uppercase tracking-wider text-slate-400"
								>
									{section.title}
								</h2>
							{/if}

							<div class="space-y-8">

								{#each section.questions as question}

									<QuestionField
										{question}
										value={
											answers[question.id] ??
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
										onChange={(value) => {
											answers = {
												...answers,
												[question.id]: value
											};
										}}
										error={errors[question.id]}
									/>

								{/each}

							</div>

						</Card>

					{/if}

				{/each}

			{:else}

				<Card>
					<div class="py-10 text-center">
						<p
							class="text-sm text-slate-500"
						>
							This survey doesn't have any
							questions yet.
						</p>
					</div>
				</Card>

			{/if}

			{#if loadError}
				<p class="text-sm text-red-500">
					{loadError}
				</p>
			{/if}

			<Button
				class="w-full"
				size="lg"
				disabled={submitting}
				onclick={handleSubmit}
			>
				{#if submitting}
					Submitting...
				{:else}
					Submit
				{/if}
			</Button>

		</div>
	</div>

{/if}