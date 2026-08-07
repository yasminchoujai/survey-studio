<script>
	import { goto } from '$app/navigation';
	import { ArrowLeft, Eye, Send } from 'lucide-svelte';

	import Button from '$lib/components/ui/Button.svelte';

	let {
		survey,
		onPublish = () => {},
		publishing = false,
		hasUnsavedChanges = false,
		onLeave = () => {}
	} = $props();

	let isPublished = $derived(survey.status === 'Published');

	function back() {
		if (hasUnsavedChanges) {
			onLeave();
			return;
		}
		goto('/dashboard');
	}

	function preview() {
		goto(`/surveys/${survey.id}/preview`, {
			state: { survey: JSON.parse(JSON.stringify(survey)) }
		});
	}
</script>

<header
	class="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6"
>
	<!-- Left -->
	<div class="flex min-w-0 items-center gap-3">
		<Button variant="ghost" size="icon" onclick={back}>
			<ArrowLeft class="h-5 w-5" />
		</Button>

		<div class="flex min-w-0 items-center gap-3">
			<h1 class="truncate text-base font-semibold text-slate-800">
				{survey.title}
			</h1>

			<!-- ✅ Status Badge -->
			{#if isPublished}
				<!-- Published - GREEN -->
				<div class="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
					<span class="h-2 w-2 rounded-full bg-emerald-500"></span>
					Published
				</div>
			{:else}
				<!-- Draft - YELLOW (always yellow for draft) -->
				<div class="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
					<span class="h-2 w-2 rounded-full bg-amber-500"></span>
					Draft
				</div>
			{/if}

			<span class="hidden text-sm text-slate-500 sm:block">
				• {survey.sections.length}
				section{survey.sections.length !== 1 ? 's' : ''}
			</span>
		</div>
	</div>

	<!-- Actions -->
	<div class="flex items-center gap-3">
		<Button variant="outline" onclick={preview}>
			<Eye class="h-4 w-4" />
			<span>Preview</span>
		</Button>

		<Button onclick={onPublish} disabled={publishing}>
			<Send class="h-4 w-4" />

			<span>
				{#if publishing}
					{isPublished ? 'Updating...' : 'Publishing...'}
				{:else}
					{isPublished ? 'Update' : 'Publish'}
				{/if}
			</span>
		</Button>
	</div>
</header>