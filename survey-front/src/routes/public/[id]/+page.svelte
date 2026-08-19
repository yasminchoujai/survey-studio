<script>
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	import { useSurveys } from '$lib/stores/surveys.svelte';

	import BuilderHeader from '$lib/components/builder/BuilderHeader.svelte';
	import QuestionTypePicker from '$lib/components/builder/QuestionTypePicker.svelte';
	import BuilderCanvas from '$lib/components/builder/BuilderCanvas.svelte';
	import QuestionSettings from '$lib/components/builder/QuestionSettings.svelte';

	import BuilderSkeleton from '$lib/components/builder/BuilderSkeleton.svelte';
	import ErrorState from '$lib/components/ui/ErrorState.svelte';

	const {
		getSurvey,
		addQuestion,
		updateQuestion,
		deleteQuestion,
		duplicateQuestion,
		publishSurvey,
		saveAllQuestions,
		clearDraft
	} = useSurveys();

	let survey = $state(null);
	let selectedQuestionId = $state(null);

	let loading = $state(true);
	let error = $state('');

	let publishing = $state(false);
	let hasUnsavedChanges = $state(false);

	// Controls the dashboard discard modal
	let showDiscardModal = $state(false);

	function createLocalQuestionKey() {
		return `local-${crypto.randomUUID()}`;
	}

	/*
	 * IMPORTANT:
	 *
	 * Editing the survey does NOT save anything.
	 *
	 * Changes stay in this local survey object.
	 *
	 * Backend is only touched when:
	 * - Publish
	 * - Update
	 */
	function markChanged() {
		hasUnsavedChanges = true;
	}

	function ensureLocalQuestionIds() {
		if (!survey || !Array.isArray(survey.questions)) {
			return;
		}

		const usedKeys = new Set();

		survey.questions = survey.questions.map((question) => {
			if (question.id) {
				const localId =
					question.__localId ??
					question.id;

				usedKeys.add(localId);

				return {
					...question,
					__localId: localId
				};
			}

			if (
				question.__localId &&
				!usedKeys.has(question.__localId)
			) {
				usedKeys.add(question.__localId);

				return question;
			}

			const localId = createLocalQuestionKey();

			usedKeys.add(localId);

			return {
				...question,
				__localId: localId
			};
		});
	}

	async function loadSurvey() {
		loading = true;
		error = '';

		try {
			const id = page.params.id;

			if (!id) {
				throw new Error('Survey ID is missing.');
			}

			const result = await getSurvey(id);

			if (!result) {
				throw new Error('Survey not found.');
			}

			survey = result;

			ensureLocalQuestionIds();

			selectedQuestionId = null;

			// Freshly loaded = no unsaved changes
			hasUnsavedChanges = false;
		} catch (err) {
			error =
				err?.message ??
				'Failed to load survey.';
		} finally {
			loading = false;
		}
	}

	/*
	 * ADD QUESTION
	 */
	function handleAddQuestion(type) {
		if (!survey || !type) {
			return;
		}

		const question = addQuestion(
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

	/*
	 * SELECT QUESTION
	 */
	function handleSelectQuestion(question) {
		if (!question) return;

		selectedQuestionId =
			question.id ??
			question.__localId;
	}

	let selectedQuestion = $derived(
		survey?.questions?.find(
			(question) =>
				(
					question.id ??
					question.__localId
				) === selectedQuestionId
		) ?? null
	);

	/*
	 * UPDATE QUESTION
	 */
	function handleUpdateQuestion(updatedQuestion) {
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
					) === questionKey
			);

		if (index === -1) {
			return;
		}

		const updated = {
			...survey.questions[index],
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

	/*
	 * DELETE QUESTION
	 */
	function handleDeleteQuestion(question) {
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
			selectedQuestionId === key
		) {
			selectedQuestionId = null;
		}

		markChanged();
	}

	/*
	 * DUPLICATE QUESTION
	 */
	function handleDuplicateQuestion(question) {
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

	/*
	 * REORDER QUESTIONS
	 */
	function handleReorderQuestions(
		fromIndex,
		toIndex
	) {
		if (!survey) return;

		if (
			fromIndex === undefined ||
			toIndex === undefined
		) {
			return;
		}

		if (
			fromIndex === toIndex ||
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

		const [movedQuestion] =
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

	/*
	 * UPDATE PUBLISHED SURVEY
	 */
	async function handleUpdateSurvey() {
		if (
			!survey ||
			publishing
		) {
			return false;
		}

		publishing = true;
		error = '';

		try {
			await saveAllQuestions(
				survey
			);

			hasUnsavedChanges = false;

			return true;
		} catch (err) {
			error =
				err?.message ??
				'Failed to update survey';

			return false;
		} finally {
			publishing = false;
		}
	}

	/*
	 * PUBLISH DRAFT
	 */
	async function handlePublish() {
		if (
			!survey ||
			publishing
		) {
			return false;
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
					status: 'Published'
				};
			} else {
				survey = {
					...survey,
					status: 'Published'
				};
			}

			ensureLocalQuestionIds();

			hasUnsavedChanges = false;

			return true;
		} catch (err) {
			error =
				err?.message ??
				'Failed to publish survey';

			return false;
		} finally {
			publishing = false;
		}
	}

	/*
	 * PUBLISH / UPDATE BUTTON
	 *
	 * Save first.
	 * Only after successful save:
	 * redirect to dashboard.
	 */
	async function handleHeaderAction() {
		if (
			!survey ||
			publishing
		) {
			return false;
		}

		let success = false;

		if (
			survey.status === 'Published'
		) {
			success =
				await handleUpdateSurvey();
		} else {
			success =
				await handlePublish();
		}

		if (success) {
			await goto('/dashboard');
		}

		return success;
	}

	/*
	 * DASHBOARD BUTTON
	 *
	 * This is the ONLY place where
	 * the discard modal is triggered.
	 *
	 * Preview does NOT use this function.
	 */
	function handleLeave(destination) {
		if (publishing) {
			return;
		}

		/*
		 * No unsaved changes:
		 * go directly to dashboard.
		 */
		if (!hasUnsavedChanges) {
			goto(destination);
			return;
		}

		/*
		 * Unsaved changes:
		 * SHOW MODAL.
		 */
		showDiscardModal = true;
	}

	/*
	 * CANCEL
	 *
	 * Stay inside builder.
	 */
	function cancelDiscard() {
		showDiscardModal = false;
	}

	/*
	 * DISCARD
	 *
	 * IMPORTANT:
	 * NO API REQUEST.
	 *
	 * We simply throw away
	 * the local survey state.
	 */
	function discardChanges() {
		showDiscardModal = false;

		/*
		 * Clear old draft data if your store
		 * still has draft storage.
		 *
		 * This does NOT call the backend.
		 */
		clearDraft?.(page.params.id);

		/*
		 * Destroy the local edited survey.
		 */
		survey = null;
		selectedQuestionId = null;
		hasUnsavedChanges = false;

		/*
		 * Now go to dashboard.
		 */
		goto('/dashboard');
	}

	/*
	 * Load the survey once.
	 */
	loadSurvey();
</script>

{#if loading}

	<BuilderSkeleton />

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
		<!-- HEADER -->

		<BuilderHeader
			{survey}
			onPublish={handleHeaderAction}
			{publishing}
			{hasUnsavedChanges}
			onLeave={handleLeave}
		/>

		<!-- BUILDER -->

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

	<!--
		DISCARD MODAL

		This only appears when:
		Builder Header
		→ Dashboard button
		→ unsaved changes exist
	-->

	{#if showDiscardModal}

		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
		>
			<div
				class="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl"
				role="dialog"
				aria-modal="true"
			>
				<h2
					class="text-lg font-semibold text-slate-900"
				>
					Discard changes?
				</h2>

				<p
					class="mt-2 text-sm text-slate-500"
				>
					Your unsaved changes will be lost.
				</p>

				<div
					class="mt-5 flex justify-end gap-2"
				>
					<button
						type="button"
						onclick={cancelDiscard}
						class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
					>
						Cancel
					</button>

					<button
						type="button"
						onclick={discardChanges}
						class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
					>
						Discard
					</button>
				</div>
			</div>
		</div>

	{/if}

{/if}