<script>
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Switch from '$lib/components/ui/Switch.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	import { Plus, Trash2, Settings2, Layers } from 'lucide-svelte';

	let { 
		question,
		sections,
		selectedSectionId,
		updateSectionTitle
	} = $props();

	let currentSection = $derived(
		sections?.find(s => s.id === selectedSectionId)
	);
	let sectionTitle = $state('');

	$effect(() => {
		if (currentSection) {
			sectionTitle = currentSection.title || '';
		}
	});

	function handleSectionTitleChange() {
		if (currentSection && sectionTitle.trim()) {
			updateSectionTitle?.(currentSection.id, sectionTitle.trim());
		}
	}

	function addOption() {
		question.options ??= [];
		question.options.push(`Option ${question.options.length + 1}`);
	}

	function removeOption(index) {
		question.options.splice(index, 1);
	}
</script>

<aside class="flex w-72 flex-col border-l border-[#E8E2F2] bg-white">
	<div class="flex items-center justify-between border-b border-[#E8E2F2] px-4 py-3">
		<div>
			<h2 class="text-sm font-semibold text-[#3B1E54]">Settings</h2>
			<p class="text-xs text-slate-500">
				{#if question}
					Edit question
				{:else if currentSection}
					Edit section
				{:else}
					Select a section or question
				{/if}
			</p>
		</div>
	</div>

	<div class="space-y-5 overflow-y-auto p-4">
		<!-- Section Settings -->
		{#if currentSection}
			<section>
				<div class="flex items-center gap-2 mb-3">
					<Layers size={16} class="text-[#9B7EBD]" />
					<h3 class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
						Section
					</h3>
				</div>
				<div>
					<label class="mb-1 block text-xs font-medium text-[#3B1E54]">
						Section Title
					</label>
					<Input
						bind:value={sectionTitle}
						oninput={handleSectionTitleChange}
						placeholder="Enter section title..."
					/>
				</div>
			</section>
		{/if}

		{#if !question}
			{#if !currentSection}
				<div class="flex h-full flex-col items-center justify-center px-5 text-center py-8">
					<div class="mb-3 rounded-xl bg-[#F3ECFA] p-3 text-[#9B7EBD]">
						<Settings2 size={26} />
					</div>
					<h2 class="text-sm font-semibold text-[#3B1E54]">
						No Selection
					</h2>
					<p class="mt-1 text-xs text-slate-500">
						Click on a section or question to edit.
					</p>
				</div>
			{/if}
		{:else}
			<!-- Question Settings -->
			<section>
				<h3 class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
					General
				</h3>

				<div class="space-y-3">
					<div>
						<label class="mb-1 block text-xs font-medium text-[#3B1E54]">
							Label
						</label>
						<Input bind:value={question.label} />
					</div>

					<div>
						<label class="mb-1 block text-xs font-medium text-[#3B1E54]">
							Description
						</label>
						<Textarea bind:value={question.description} />
					</div>
				</div>
			</section>

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
					<Switch bind:checked={question.required} />
				</div>
			</section>

			{#if ['short_text', 'long_text', 'email'].includes(question.type)}
				<section>
					<h3 class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
						Input
					</h3>

					<label class="mb-1 block text-xs font-medium text-[#3B1E54]">
						Placeholder
					</label>
					<Input bind:value={question.placeholder} />
				</section>
			{/if}

			{#if ['single_choice', 'multiple_choice'].includes(question.type)}
				<section>
					<div class="mb-2 flex items-center justify-between">
						<h3 class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
							Options
						</h3>
						<Button size="sm" onclick={addOption}>
							<Plus size={13} />
							Add
						</Button>
					</div>

					<div class="space-y-2">
						{#each question.options ?? [] as option, index}
							<div class="flex gap-2">
								<Input bind:value={question.options[index]} />
								<Button
									variant="ghost"
									size="icon"
									onclick={() => removeOption(index)}
								>
									<Trash2 size={14} />
								</Button>
							</div>
						{/each}
					</div>
				</section>
			{/if}
		{/if}
	</div>
</aside>