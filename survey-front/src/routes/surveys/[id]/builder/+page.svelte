<script>
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	import { useSurveys } from '$lib/stores/surveys.svelte';

	import BuilderHeader from '$lib/components/builder/BuilderHeader.svelte';
	import QuestionTypePicker from '$lib/components/builder/QuestionTypePicker.svelte';
	import BuilderCanvas from '$lib/components/builder/BuilderCanvas.svelte';
	import QuestionSettings from '$lib/components/builder/QuestionSettings.svelte';

	import LoadingState from '$lib/components/ui/LoadingState.svelte';
	import ErrorState from '$lib/components/ui/ErrorState.svelte';

	const {
		getSurvey,
		addQuestion,
		updateQuestion,
		deleteQuestion,
		duplicateQuestion,
		reorderQuestions,
		publishSurvey,
		saveAllQuestions,
		saveDraft,
		clearDraft
	} = useSurveys();

	let survey = $state(null);

	let selectedQuestionId =
		$state(null);

	let loading = $state(true);

	let error = $state('');

	let publishing =
		$state(false);

	let hasUnsavedChanges =
		$state(false);

	function createLocalQuestionKey() {
		return `local-${crypto.randomUUID()}`;
	}

	function markChanged() {
		hasUnsavedChanges = true;

		if (survey) {
			saveDraft?.(survey);
		}
	}

	function ensureLocalQuestionIds() {
		if (
			!survey ||
			!Array.isArray(
				survey.questions
			)
		) {
			return;
		}

		const usedKeys =
			new Set();

		survey.questions =
			survey.questions.map(
				(question) => {
					if (question.id) {
						const localId =
							question.__localId ??
							question.id;

						usedKeys.add(
							localId
						);

						return {
							...question,
							__localId:
								localId
						};
					}

					if (
						question.__localId &&
						!usedKeys.has(
							question.__localId
						)
					) {
						usedKeys.add(
							question.__localId
						);

						return question;
					}

					const localId =
						createLocalQuestionKey();

					usedKeys.add(
						localId
					);

					return {
						...question,
						__localId:
							localId
					};
				}
			);

		saveDraft?.(survey);
	}

	async function loadSurvey() {
		loading = true;
		error = '';

		try {
			const id =
				page.params.id;

			const result =
				await getSurvey(id);

			survey = result;

			ensureLocalQuestionIds();

			selectedQuestionId =
				null;

			hasUnsavedChanges =
				true;
		} catch (err) {
			error =
				err?.message ??
				'Failed to load survey';
		} finally {
			loading = false;
		}
	}

	function handleAddQuestion(
		type
	) {
		if (
			!survey ||
			!type
		) {
			return;
		}

		const question =
			addQuestion(
				survey,
				type
			);

		if (!question) {
			return;
		}

		question.__localId =
			createLocalQuestionKey();

		selectedQuestionId =
			question.__localId;

		markChanged();
	}

	function handleSelectQuestion(
		question
	) {
		if (!question) return;

		selectedQuestionId =
			question.id ??
			question.__localId;
	}

	let selectedQuestion =
		$derived(
			survey?.questions?.find(
				(question) =>
					(
						question.id ??
						question.__localId
					) ===
					selectedQuestionId
			) ?? null
		);

	function handleUpdateQuestion(
		updatedQuestion
	) {
		if (
			!survey ||
			!updatedQuestion
		) {
			return;
		}

		const questionKey =
			updatedQuestion.id ??
			updatedQuestion.__localId;

		const index =
			survey.questions.findIndex(
				(question) =>
					(
						question.id ??
						question.__localId
					) ===
					questionKey
			);

		if (index === -1) {
			return;
		}

		const updated = {
			...survey.questions[
				index
			],
			...updatedQuestion,

			__localId:
				survey.questions[index]
					.__localId ??
				updatedQuestion.__localId ??
				updatedQuestion.id ??
				createLocalQuestionKey()
		};

		survey.questions =
			survey.questions.map(
				(question, i) =>
					i === index
						? updated
						: question
			);

		selectedQuestionId =
			updated.id ??
			updated.__localId;

		markChanged();
	}

	function handleDeleteQuestion(
		question
	) {
		if (
			!survey ||
			!question
		) {
			return;
		}

		const key =
			question.id ??
			question.__localId;

		deleteQuestion(
			survey,
			question
		);

		if (
			selectedQuestionId ===
			key
		) {
			selectedQuestionId =
				null;
		}

		markChanged();
	}

	function handleDuplicateQuestion(
		question
	) {
		if (
			!survey ||
			!question
		) {
			return;
		}

		const duplicated =
			duplicateQuestion(
				survey,
				question
			);

		if (!duplicated) {
			return;
		}

		duplicated.__localId =
			createLocalQuestionKey();

		selectedQuestionId =
			duplicated.__localId;

		markChanged();
	}

	function handleReorderQuestions(
		fromIndex,
		toIndex
	) {
		if (!survey) return;

		if (
			fromIndex ===
				undefined ||
			toIndex ===
				undefined
		) {
			return;
		}

		if (
			fromIndex ===
				toIndex ||
			fromIndex < 0 ||
			toIndex < 0 ||
			fromIndex >=
				survey.questions.length ||
			toIndex >=
				survey.questions.length
		) {
			return;
		}

		const questions = [
			...survey.questions
		];

		const [
			movedQuestion
		] =
			questions.splice(
				fromIndex,
				1
			);

		questions.splice(
			toIndex,
			0,
			movedQuestion
		);

		survey.questions =
			questions;

		markChanged();
	}

	async function handleUpdateSurvey() {
		if (
			!survey ||
			publishing
		) {
			return;
		}

		publishing = true;
		error = '';

		try {
			await saveAllQuestions(
				survey
			);

			hasUnsavedChanges =
				false;
		} catch (err) {
			error =
				err?.message ??
				'Failed to update survey';
		} finally {
			publishing = false;
		}
	}

	async function handleHeaderAction() {
		if (!survey) return;

		if (
			survey.status ===
			'Published'
		) {
			await handleUpdateSurvey();

			return;
		}

		await handlePublish();
	}

	async function handlePublish() {
		if (
			!survey ||
			publishing
		) {
			return;
		}

		publishing = true;
		error = '';

		try {
			const updatedSurvey =
				await publishSurvey(
					survey
				);

			if (updatedSurvey) {
				survey = {
					...survey,
					...updatedSurvey,

					status:
						'Published'
				};

				ensureLocalQuestionIds();
			}

			hasUnsavedChanges =
				false;
		} catch (err) {
			error =
				err?.message ??
				'Failed to publish survey';
		} finally {
			publishing = false;
		}
	}

	function handleLeave(
		destination
	) {
		goto(destination);
	}

	$effect(() => {
		const id =
			page.params.id;

		if (id) {
			loadSurvey();
		}
	});
</script>

{#if loading}
	<div
		class="flex h-screen items-center justify-center bg-slate-50"
	>
		<LoadingState />
	</div>

{:else if error && !survey}
	<div
		class="flex h-screen items-center justify-center bg-slate-50"
	>
		<ErrorState
			message={error}
			onRetry={loadSurvey}
		/>
	</div>

{:else if survey}
	<div
		class="flex h-screen flex-col overflow-hidden bg-slate-50"
	>
		<BuilderHeader
			{survey}
			onPublish={handleHeaderAction}
			{publishing}
			{hasUnsavedChanges}
			onLeave={handleLeave}
		/>

		<div
			class="flex min-h-0 flex-1"
		>
			<QuestionTypePicker
				onAddQuestion={
					handleAddQuestion
				}
			/>

			<BuilderCanvas
				{survey}
				selectQuestion={
					handleSelectQuestion
				}
				deleteQuestion={
					handleDeleteQuestion
				}
				duplicateQuestion={
					handleDuplicateQuestion
				}
				onAddQuestion={
					handleAddQuestion
				}
				reorderQuestions={
					handleReorderQuestions
				}
			/>

			{#if selectedQuestion}
				<QuestionSettings
					question={
						selectedQuestion
					}
					onUpdate={
						handleUpdateQuestion
					}
				/>
			{:else}
				<aside
					class="hidden w-72 shrink-0 border-l border-[#E8E2F2] bg-white lg:block"
				>
					<div
						class="flex h-full items-center justify-center p-6 text-center"
					>
						<div>
							<div
								class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F3ECFA]"
							>
								<span
									class="text-xl text-[#9B7EBD]"
								>
									⚙
								</span>
							</div>

							<h3
								class="mt-4 text-sm font-semibold text-[#3B1E54]"
							>
								Question settings
							</h3>

							<p
								class="mt-2 text-xs leading-5 text-slate-500"
							>
								Select a question to
								edit its settings.
							</p>
						</div>
					</div>
				</aside>
			{/if}
		</div>
	</div>
{/if}