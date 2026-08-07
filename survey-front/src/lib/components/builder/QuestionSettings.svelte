<script>
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Switch from '$lib/components/ui/Switch.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	import { Plus, Trash2, Settings2 } from 'lucide-svelte';

	let { question } = $props();  // ✅ Removed updateQuestion

	function addOption() {
		question.options ??= [];
		question.options.push(`Option ${question.options.length + 1}`);
	}

	function removeOption(index) {
		question.options.splice(index, 1);
	}
</script>

<aside class="flex w-72 flex-col border-l border-[#E8E2F2] bg-white">
	{#if !question}
		<div class="flex h-full flex-col items-center justify-center px-5 text-center">
			<div class="mb-3 rounded-xl bg-[#F3ECFA] p-3 text-[#9B7EBD]">
				<Settings2 size={26} />
			</div>

			<h2 class="text-sm font-semibold text-[#3B1E54]">
				No Question Selected
			</h2>

			<p class="mt-1 text-xs text-slate-500">
				Select a question to edit settings.
			</p>
		</div>
	{:else}
		<div class="flex items-center justify-between border-b border-[#E8E2F2] px-4 py-3">
			<div>
				<h2 class="text-sm font-semibold text-[#3B1E54]">
					Settings
				</h2>

				<p class="text-xs text-slate-500">
					Edit question
				</p>
			</div>
		</div>

		<div class="space-y-5 overflow-y-auto p-4">
			<section>
				<h3 class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
					General
				</h3>

				<div class="space-y-3">
					<div>
						<label class="mb-1 block text-xs font-medium text-[#3B1E54]">
							Label
						</label>

						<!-- ✅ Removed oninput={notifyChange} -->
						<Input bind:value={question.label} />
					</div>

					<div>
						<label class="mb-1 block text-xs font-medium text-[#3B1E54]">
							Description
						</label>

						<!-- ✅ Removed oninput={notifyChange} -->
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

					<!-- ✅ Removed onchange={notifyChange} -->
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

					<!-- ✅ Removed oninput={notifyChange} -->
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
								<!-- ✅ Removed oninput={notifyChange} -->
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
		</div>
	{/if}
</aside>