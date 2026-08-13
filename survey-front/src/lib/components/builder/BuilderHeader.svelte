<script>
	import { goto } from '$app/navigation';
	import {
		ArrowLeft,
		Eye,
		Send,
		Save
	} from 'lucide-svelte';

	import Button from '$lib/components/ui/Button.svelte';

	let {
		survey,
		onPublish = () => {},
		publishing = false,
		hasUnsavedChanges = false,
		onLeave = () => {}
	} = $props();

	let isPublished = $derived(
		survey?.status === 'Published'
	);

	let questionCount = $derived(
		Array.isArray(
			survey?.questions
		)
			? survey.questions.length
			: 0
	);

	function back() {
		console.log(
			'⬅️ Leaving builder for dashboard'
		);

		/*
		IMPORTANT:
		Do NOT clear the draft here.

		If you want to discard changes,
		that should happen explicitly when
		leaving the dashboard flow.
		*/

		onLeave?.('/dashboard');
	}

	function preview() {
		if (!survey?.id) return;

		console.log(
			'👀 Opening preview:',
			survey.id
		);

		/*
		Pass the current local survey to Preview.

		No backend call.
		*/

		goto(
			`/surveys/${survey.id}/preview`,
			{
				state: {
					survey: JSON.parse(
						JSON.stringify(
							survey
						)
					)
				}
			}
		);
	}

	function handleSave() {
		if (publishing) return;

		onPublish?.();
	}
</script>

<header
	class="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6"
>
	<!-- LEFT -->

	<div
		class="flex min-w-0 items-center gap-3"
	>
		<Button
			variant="ghost"
			size="icon"
			onclick={back}
			title="Back to dashboard"
		>
			<ArrowLeft
				class="h-5 w-5"
			/>
		</Button>

		<div
			class="flex min-w-0 items-center gap-3"
		>
			<h1
				class="truncate text-base font-semibold text-slate-800"
			>
				{survey?.title ||
					'Untitled Survey'}
			</h1>

			{#if isPublished}
				<div
					class="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
				>
					<span
						class="h-2 w-2 rounded-full bg-emerald-500"
					></span>

					Published
				</div>
			{:else}
				<div
					class="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700"
				>
					<span
						class="h-2 w-2 rounded-full bg-amber-500"
					></span>

					Draft
				</div>
			{/if}

			<span
				class="hidden text-sm text-slate-500 sm:block"
			>
				• {questionCount}
				{questionCount === 1
					? 'question'
					: 'questions'}
			</span>

			{#if hasUnsavedChanges}
				<span
					class="text-xs text-amber-600"
				>
					Unsaved changes
				</span>
			{/if}
		</div>
	</div>

	<!-- RIGHT -->

	<div
		class="flex items-center gap-3"
	>
		<Button
			variant="outline"
			onclick={preview}
			disabled={!survey?.id}
		>
			<Eye class="h-4 w-4" />

			<span>Preview</span>
		</Button>

		<Button
			onclick={handleSave}
			disabled={
				publishing ||
				!survey?.id
			}
		>
			{#if isPublished}
				<Save class="h-4 w-4" />
			{:else}
				<Send class="h-4 w-4" />
			{/if}

			<span>
				{#if publishing}
					{isPublished
						? 'Updating...'
						: 'Publishing...'}
				{:else if isPublished}
					Update
				{:else}
					Publish
				{/if}
			</span>
		</Button>
	</div>
</header>