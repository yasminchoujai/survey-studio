<script>
	import QuestionCard from './QuestionCard.svelte';

	let {
		survey,
		selectQuestion,
		deleteQuestion,
		duplicateQuestion,
		onAddQuestion,
		reorderQuestions
	} = $props();

	let isTypeDragOver = $state(false);

	function handleDragOver(event) {
		event.preventDefault();
		event.stopPropagation();

		const types = Array.from(
			event.dataTransfer.types
		);

		// Existing question
		if (
			types.includes(
				'application/question-index'
			)
		) {
			event.dataTransfer.dropEffect = 'move';

			isTypeDragOver = false;

			return;
		}

		// New question type
		if (
			types.includes(
				'application/question-type'
			)
		) {
			event.dataTransfer.dropEffect = 'copy';

			isTypeDragOver = true;

			return;
		}
	}

	function handleDragLeave(event) {
		event.preventDefault();

		// Don't remove the state while moving
		// between children.
		if (
			event.currentTarget === event.target
		) {
			isTypeDragOver = false;
		}
	}

	function handleDrop(event) {
		event.preventDefault();
		event.stopPropagation();

		isTypeDragOver = false;

		const types = Array.from(
			event.dataTransfer.types
		);

		/*
		 * -----------------------------------------
		 * EXISTING QUESTION
		 * -----------------------------------------
		 */

		if (
			types.includes(
				'application/question-index'
			)
		) {
			// DO NOTHING HERE.
			//
			// QuestionCard handles reordering
			// when dropped onto another QuestionCard.

			console.log(
				'↔️ Existing question dropped on canvas'
			);

			return;
		}

		/*
		 * -----------------------------------------
		 * NEW QUESTION TYPE
		 * -----------------------------------------
		 */

		const questionType =
			event.dataTransfer.getData(
				'application/question-type'
			);

		if (!questionType) {
			console.log(
				'⚠️ No question type found'
			);

			return;
		}

		console.log(
			'➕ New question dropped:',
			questionType
		);

		onAddQuestion?.(questionType);
	}

	function handleQuestionDrop(
		draggedIndex,
		targetIndex
	) {
		if (!survey?.questions) return;

		if (
			draggedIndex === undefined ||
			targetIndex === undefined
		) {
			return;
		}

		if (draggedIndex === targetIndex) {
			return;
		}

		if (
			draggedIndex < 0 ||
			targetIndex < 0 ||
			draggedIndex >= survey.questions.length ||
			targetIndex >= survey.questions.length
		) {
			return;
		}

		console.log(
			'🔀 Reordering:',
			draggedIndex,
			'→',
			targetIndex
		);

		reorderQuestions?.(
			survey,
			draggedIndex,
			targetIndex
		);
	}
</script>

<section
	role="region"
	class="flex-1 overflow-y-auto bg-slate-50 p-8"
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
>
	<div class="mx-auto flex min-h-full max-w-3xl flex-col gap-5">

		<!-- SURVEY HEADER -->

		<div
			class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
		>
			<p
				class="text-xs font-semibold uppercase tracking-widest text-violet-600"
			>
				Survey
			</p>

			<h1
				class="mt-2 text-2xl font-bold text-slate-900"
			>
				{survey?.title || 'Untitled Survey'}
			</h1>

			{#if survey?.description}
				<p class="mt-2 text-sm text-slate-500">
					{survey.description}
				</p>
			{:else}
				<p class="mt-2 text-sm text-slate-400">
					Start building your survey.
				</p>
			{/if}
		</div>

		<!-- QUESTIONS -->

		{#if survey?.questions?.length}
			<div class="flex flex-col gap-4">
				{#each survey.questions as question, index (
					question.id ??
					question.__localId ??
					index
				)}
					<QuestionCard
						{question}
						questionIndex={index}
						onSelect={selectQuestion}
						onDelete={deleteQuestion}
						onDuplicate={duplicateQuestion}
						onDrop={handleQuestionDrop}
					/>
				{/each}
			</div>
		{:else}

			<!-- EMPTY STATE -->

			<div
				class="rounded-2xl border border-dashed border-[#D4BEE4] bg-white px-8 py-14 text-center"
			>
				<div
					class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F3ECFA]"
				>
					<span class="text-xl text-[#9B7EBD]">
						+
					</span>
				</div>

				<h2
					class="mt-4 text-lg font-semibold text-[#3B1E54]"
				>
					No questions yet
				</h2>

				<p
					class="mx-auto mt-2 max-w-sm text-sm text-slate-500"
				>
					Drag a question type from the left
					sidebar or click "Add question".
				</p>
			</div>
		{/if}

		<!-- ADD QUESTION BUTTON -->

		<button
			type="button"
			class="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#D4BEE4] bg-white px-4 py-4 text-sm font-medium text-[#9B7EBD] transition hover:border-[#9B7EBD] hover:bg-[#FAF8FD]"
			onclick={() =>
				onAddQuestion?.('short_text')
			}
		>
			<span class="text-lg leading-none">
				+
			</span>

			Add question
		</button>
	</div>
</section>