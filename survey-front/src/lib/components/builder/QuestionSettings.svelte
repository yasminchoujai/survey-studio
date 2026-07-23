<script>
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Switch from '$lib/components/ui/Switch.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	import { Plus, Trash2 } from 'lucide-svelte';

	let {
		question,
		updateQuestion
	} = $props();

	function save() {
		if (!question) return;

		updateQuestion(question);
	}

	function addOption() {
		if (!question.options) {
			question.options = [];
		}

		question.options.push(`Option ${question.options.length + 1}`);

		save();
	}

	function removeOption(index) {
		question.options.splice(index, 1);

		save();
	}
</script>

<aside class="w-72 overflow-y-auto border-l border-slate-200 bg-white p-5">
	{#if !question}

		<div class="flex h-full items-center justify-center">
			<p class="text-sm text-slate-400">
				Select a question to edit
			</p>
		</div>

	{:else}

		<div class="space-y-6">

			<div>
				<h2 class="text-sm font-semibold text-slate-900">
					Question Settings
				</h2>

				<p class="mt-1 text-xs text-slate-400">
					Edit question properties
				</p>
			</div>

			<!-- Label -->

			<div class="space-y-2">
				<label for="label" class="text-sm font-medium text-slate-700">
					Label
				</label>

				<Input
					id="label"
					bind:value={question.label}
					oninput={save}
				/>
			</div>

			<!-- Description -->

			<div class="space-y-2">
				<label for="description" class="text-sm font-medium text-slate-700">
					Description
				</label>

				<Textarea
					id="description"
					bind:value={question.description}
					oninput={save}
				/>
			</div>

			<!-- Required -->

			<div class="flex items-center justify-between">
				<span class="text-sm font-medium text-slate-700">
					Required
				</span>

				<Switch
					bind:checked={question.required}
					onchange={save}
				/>
			</div>

			<!-- Placeholder -->

			{#if question.type === 'short_text' || question.type === 'long_text' || question.type === 'email'}

				<div class="space-y-2">
					<label for="placeholder" class="text-sm font-medium text-slate-700">
						Placeholder
					</label>

					<Input
						id="placeholder"
						bind:value={question.placeholder}
						oninput={save}
					/>
				</div>

			{/if}

			<!-- Options -->

			{#if question.type === 'single_choice' || question.type === 'multiple_choice'}

				<div class="space-y-3">

					<div class="flex items-center justify-between">

						<p class="text-sm font-medium text-slate-700">
							Options
						</p>

						<Button
							variant="ghost"
							size="icon"
							onclick={addOption}
						>
							<Plus size={16} />
						</Button>

					</div>

					{#each question.options as option, index}

						<div class="flex gap-2">

							<Input
								bind:value={question.options[index]}
								oninput={save}
							/>

							<Button
								variant="ghost"
								size="icon"
								class="text-red-500"
								onclick={() => removeOption(index)}
							>
								<Trash2 size={16} />
							</Button>

						</div>

					{/each}

				</div>

			{/if}

		</div>

	{/if}
</aside>