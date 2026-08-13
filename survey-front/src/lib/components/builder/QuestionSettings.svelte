<script>
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Switch from '$lib/components/ui/Switch.svelte';

	import {
		Settings2,
		Layers,
		Plus,
		Trash2
	} from 'lucide-svelte';

	let {
		question,
		sections = [],
		selectedSectionId,
		onUpdate,
		updateSectionTitle
	} = $props();

	let currentSection = $derived(
		sections?.find(
			(section) => section.id === selectedSectionId
		) ?? null
	);

	let sectionTitle = $state('');

	$effect(() => {
		if (currentSection) {
			sectionTitle = currentSection.title ?? '';
		}
	});

	function updateQuestionField(field, value) {
		if (!question) return;

		const updatedQuestion = {
			...question,
			[field]: value
		};

		onUpdate?.(updatedQuestion);
	}

	function handleDescriptionChange(event) {
		const value = event.currentTarget.value;

		updateQuestionField('description', value);
	}

	function addOption() {
		if (!question) return;

		const currentOptions = Array.isArray(question.options)
			? question.options
			: [];

		updateQuestionField('options', [
			...currentOptions,
			`Option ${currentOptions.length + 1}`
		]);
	}

	function updateOption(index, value) {
		if (!question) return;

		const options = Array.isArray(question.options)
			? [...question.options]
			: [];

		options[index] = value;

		updateQuestionField('options', options);
	}

	function removeOption(index) {
		if (!question) return;

		const options = Array.isArray(question.options)
			? [...question.options]
			: [];

		options.splice(index, 1);

		updateQuestionField('options', options);
	}

	function handleSectionTitleChange(event) {
		const value = event.currentTarget.value;

		sectionTitle = value;

		if (!currentSection) return;

		updateSectionTitle?.(
			currentSection.id,
			value
		);
	}
</script>

<aside class="flex w-72 shrink-0 flex-col border-l border-[#E8E2F2] bg-white">
	<div class="flex items-center justify-between border-b border-[#E8E2F2] px-4 py-3">
		<div>
			<h2 class="text-sm font-semibold text-[#3B1E54]">
				Settings
			</h2>

			<p class="text-xs text-slate-500">
				{#if question}
					Edit question
				{:else if currentSection}
					Edit section
				{:else}
					Select a question
				{/if}
			</p>
		</div>
	</div>

	<div class="flex-1 space-y-5 overflow-y-auto p-4">

		<!-- SECTION SETTINGS -->

		{#if currentSection}
			<section>
				<div class="mb-3 flex items-center gap-2">
					<Layers
						size={16}
						class="text-[#9B7EBD]"
					/>

					<h3 class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
						Section
					</h3>
				</div>

				<label
					class="mb-1 block text-xs font-medium text-[#3B1E54]"
					for="section-title"
				>
					Section Title
				</label>

				<Input
					id="section-title"
					value={sectionTitle}
					oninput={handleSectionTitleChange}
					placeholder="Enter section title..."
				/>
			</section>
		{/if}

		<!-- NO QUESTION -->

		{#if !question}

			{#if !currentSection}
				<div class="flex h-full flex-col items-center justify-center px-5 py-8 text-center">
					<div class="mb-3 rounded-xl bg-[#F3ECFA] p-3 text-[#9B7EBD]">
						<Settings2 size={26} />
					</div>

					<h2 class="text-sm font-semibold text-[#3B1E54]">
						No Selection
					</h2>

					<p class="mt-1 text-xs text-slate-500">
						Click on a question to edit it.
					</p>
				</div>
			{/if}

		{:else}

			<!-- GENERAL -->

			<section>
				<h3 class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
					General
				</h3>

				<div class="space-y-3">

					<!-- LABEL -->

					<div>
						<label
							class="mb-1 block text-xs font-medium text-[#3B1E54]"
							for="question-label"
						>
							Label
						</label>

						<Input
							id="question-label"
							value={question.label ?? ''}
							oninput={(event) =>
								updateQuestionField(
									'label',
									event.currentTarget.value
								)}
						/>
					</div>

					<!-- DESCRIPTION -->

					<div>
						<label
							class="mb-1 block text-xs font-medium text-[#3B1E54]"
							for="question-description"
						>
							Description
						</label>

						<Textarea
							id="question-description"
							value={question.description ?? ''}
							oninput={handleDescriptionChange}
							placeholder="Add a description..."
						/>
					</div>

				</div>
			</section>

			<!-- REQUIRED -->

			<section>
				<h3 class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
					Behavior
				</h3>

				<div class="flex items-center justify-between rounded-xl border border-[#E8E2F2] px-3 py-3">
					<div>
						<p class="text-sm font-medium text-[#3B1E54]">
							Required
						</p>

						<p class="text-[11px] text-slate-500">
							Must answer
						</p>
					</div>

					<Switch
						checked={question.required ?? false}
						onchange={(event) =>
							updateQuestionField(
								'required',
								event.currentTarget.checked
							)}
					/>
				</div>
			</section>

			<!-- PLACEHOLDER -->

			{#if ['short_text', 'long_text', 'email'].includes(question.type)}
				<section>
					<h3 class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
						Input
					</h3>

					<label
						class="mb-1 block text-xs font-medium text-[#3B1E54]"
						for="question-placeholder"
					>
						Placeholder
					</label>

					<Input
						id="question-placeholder"
						value={question.placeholder ?? ''}
						oninput={(event) =>
							updateQuestionField(
								'placeholder',
								event.currentTarget.value
							)}
						placeholder="Enter placeholder..."
					/>
				</section>
			{/if}

			<!-- OPTIONS -->

			{#if ['single_choice', 'multiple_choice'].includes(question.type)}
				<section>
					<div class="mb-2 flex items-center justify-between">
						<h3 class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
							Options
						</h3>

						<button
							type="button"
							class="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-[#9B7EBD] hover:bg-[#F3ECFA]"
							onclick={addOption}
						>
							<Plus size={13} />
							Add
						</button>
					</div>

					<div class="space-y-2">
						{#each question.options ?? [] as option, index}
							<div class="flex gap-2">

								<Input
									value={option}
									oninput={(event) =>
										updateOption(
											index,
											event.currentTarget.value
										)}
								/>

								<button
									type="button"
									class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500"
									onclick={() => removeOption(index)}
									title="Remove option"
								>
									<Trash2 size={14} />
								</button>

							</div>
						{/each}
					</div>
				</section>
			{/if}

		{/if}
	</div>
</aside>
