<script>
	import { onMount } from "svelte";
	import { page } from "$app/state";
	import { goto } from "$app/navigation";
	import { get } from "svelte/store";

	import { useSurveys } from "$lib/stores/surveys.svelte.js";

	import BuilderHeader from "$lib/components/builder/BuilderHeader.svelte";
	import QuestionTypePicker from "$lib/components/builder/QuestionTypePicker.svelte";
	import BuilderCanvas from "$lib/components/builder/BuilderCanvas.svelte";
	import QuestionSettings from "$lib/components/builder/QuestionSettings.svelte";

	const {
		getSurvey,
		addQuestion,
		addSection,
		updateQuestion,
		deleteQuestion,
		duplicateQuestion,
		deleteSection,
		reorderSectionQuestions,
		publishSurvey,
		saveAllQuestions,
		draftStore,
		saveDraft,
		clearDraft,
	} = useSurveys();

	let survey = $state(null);
	let selectedQuestion = $state(null);
	let selectedSectionId = $state(null);

	let publishing = $state(false);
	let publishError = $state("");
	let isDirty = $state(false);
	let showLeaveModal = $state(false);
	let pendingNavigation = $state(null);
	let loading = $state(true);
	let error = $state('');

	// ✅ Track if this is the first load
	let isFirstLoad = $state(true);

	async function loadSurvey(forceRefresh = false) {
		// ✅ Only show loading on first load or forced refresh
		if (isFirstLoad || forceRefresh) {
			loading = true;
		}
		error = '';

		try {
			// ✅ If we already have a survey and it's not a forced refresh, keep it
			if (survey && !forceRefresh) {
				console.log('📌 Keeping existing survey');
				loading = false;
				return;
			}

			// ✅ Check draft store first
			const draft = get(draftStore);
			
			if (draft && draft.id === page.params.id) {
				console.log('✅ Loading from draft');
				survey = draft;
				isDirty = true;
			} else {
				console.log('🔄 Loading from backend');
				survey = await getSurvey(page.params.id);
				isDirty = false;
			}

			if (survey?.sections?.length) {
				selectedSectionId = survey.sections[0].id;
			}
		} catch (err) {
			error = err?.message ?? 'Failed to load survey.';
			console.error(err);
		} finally {
			loading = false;
			isFirstLoad = false;
		}
	}

	onMount(() => {
		loadSurvey();
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
			label: "Untitled question",
			type,
			description: "",
			required: false,
			placeholder: "",
			options: type === "single_choice" || type === "multiple_choice"
				? ["Option 1", "Option 2"]
				: []
		};

		const created = await addQuestion(survey, sectionId, question);
		selectedQuestion = created;
		saveDraft(survey);
		isDirty = true;
	}

	async function handleUpdateQuestion(question) {
		if (!survey) return;

		await updateQuestion(survey, question);
		selectedQuestion = question;
		saveDraft(survey);
		isDirty = true;
	}

	async function handleDeleteQuestion(questionId) {
		if (!survey) return;

		await deleteQuestion(survey, questionId);

		if (selectedQuestion?.id === questionId) {
			selectedQuestion = null;
		}
		saveDraft(survey);
		isDirty = true;
	}

	async function handleDuplicateQuestion(questionId) {
		if (!survey) return;

		const duplicated = await duplicateQuestion(survey, questionId);

		if (duplicated) {
			selectedQuestion = duplicated;
		}
		saveDraft(survey);
		isDirty = true;
	}

	async function handleDeleteSection(sectionId) {
		if (!survey) return;

		await deleteSection(survey, sectionId);

		if (selectedSectionId === sectionId) {
			selectedSectionId = survey.sections[0]?.id ?? null;
		}

		if (
			selectedQuestion &&
			!survey.sections.some(section =>
				section.questions.some(question => question.id === selectedQuestion.id)
			)
		) {
			selectedQuestion = null;
		}
		saveDraft(survey);
		isDirty = true;
	}

	async function handleAddSection() {
		if (!survey) return;

		const section = await addSection(survey);
		selectedSectionId = section.id;
		saveDraft(survey);
		isDirty = true;
	}

	async function handleQuestionDrop(event, sectionId, targetQuestionId) {
		event.preventDefault();

		const draggedQuestionId = event.dataTransfer.getData('application/question-id');

		if (!draggedQuestionId || draggedQuestionId === targetQuestionId) {
			return;
		}

		const section = survey.sections.find((s) => s.id === sectionId);

		if (!section) return;

		const fromIndex = section.questions.findIndex((q) => q.id === draggedQuestionId);
		const toIndex = section.questions.findIndex((q) => q.id === targetQuestionId);

		if (fromIndex === -1 || toIndex === -1) return;

		const [question] = section.questions.splice(fromIndex, 1);
		section.questions.splice(toIndex, 0, question);

		await reorderSectionQuestions(survey, section);
		saveDraft(survey);
	}

	async function handlePublish() {
		if (!survey) return;

		publishing = true;
		publishError = "";

		try {
			await saveAllQuestions(survey);

			if (survey.status !== "Published") {
				await publishSurvey(survey);
			}

			isDirty = false;
			clearDraft();
			goto("/dashboard");
		} catch (err) {
			console.error("Failed to save survey:", err);
			publishError = err?.message ?? "Failed to save survey.";
		} finally {
			publishing = false;
		}
	}

	function handleLeave(path = "/dashboard") {
		if (!isDirty) {
			goto(path);
			return;
		}
		pendingNavigation = path;
		showLeaveModal = true;
	}

	function confirmLeave() {
		showLeaveModal = false;
		isDirty = false;
		clearDraft();
		goto(pendingNavigation || "/dashboard");
	}

	function cancelLeave() {
		showLeaveModal = false;
		pendingNavigation = null;
	}

	// ✅ Auto-save draft whenever survey changes
	$effect(() => {
		if (survey && isDirty) {
			saveDraft(survey);
			console.log('💾 Draft saved automatically');
		}
	});

	// ✅ Prevent accidental navigation
	$effect(() => {
		const unload = (e) => {
			if (isDirty) {
				e.preventDefault();
				e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
				return e.returnValue;
			}
		};
		window.addEventListener("beforeunload", unload);
		return () => window.removeEventListener("beforeunload", unload);
	});
</script>

<!-- Leave Modal -->
{#if showLeaveModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
			<h2 class="text-xl font-semibold text-slate-900">Leave Builder?</h2>
			<p class="mt-2 text-sm text-slate-600">
				You have unsaved changes. If you leave now, your edits will be lost.
			</p>
			<div class="mt-6 flex justify-end gap-3">
				<Button variant="outline" onclick={cancelLeave}>
					Stay
				</Button>
				<Button onclick={confirmLeave}>
					Leave
				</Button>
			</div>
		</div>
	</div>
{/if}

{#if survey}
	<div class="flex h-screen flex-col bg-slate-50">
		<BuilderHeader {survey} onPublish={handlePublish} {publishing} />

		{#if publishError}
			<div class="border-b border-red-100 bg-red-50 px-5 py-2 text-sm text-red-600">
				{publishError}
			</div>
		{/if}

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
				onDrop={handleQuestionDrop}
				onAddQuestion={handleAddQuestion}
			/>

			<QuestionSettings
				question={selectedQuestion}
				updateQuestion={handleUpdateQuestion}
			/>
		</div>
	</div>
{/if}