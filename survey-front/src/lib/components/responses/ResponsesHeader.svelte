<script>
	import { goto } from '$app/navigation';
	import {
		ArrowLeft,
		Eye,
		Pencil
	} from 'lucide-svelte';

	import Button from '$lib/components/ui/Button.svelte';
	import StatusBadge from '$lib/components/dashboard/StatusBadge.svelte';

	let { survey } = $props();

	let responseCount = $derived(
		survey?.responses ?? 0
	);

	function back() {
		goto('/dashboard');
	}

	function edit() {
		if (!survey?.id) return;

		goto(`/surveys/${survey.id}/builder`);
	}

	function preview() {
		if (!survey?.id) return;

		goto(`/surveys/${survey.id}/preview`);
	}
</script>

<header
	class="flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white px-6"
>
	<!-- LEFT -->

	<div
		class="flex min-w-0 items-center gap-3"
	>
		<!-- Back -->

		<Button
			variant="ghost"
			size="icon"
			onclick={back}
			title="Back to dashboard"
		>
			<ArrowLeft class="h-5 w-5" />
		</Button>

		<!-- Survey information -->

		<div
			class="flex min-w-0 items-center gap-3"
		>
			<h1
				class="truncate text-base font-semibold text-slate-800"
			>
				{survey?.title || 'Untitled Survey'}
			</h1>

			<StatusBadge
				status={survey?.status}
			/>

			<span
				class="hidden text-sm text-slate-500 sm:block"
			>
				• {responseCount}
				{responseCount === 1
					? ' response'
					: ' responses'}
			</span>
		</div>
	</div>

	<!-- RIGHT -->

	<div
		class="flex shrink-0 items-center gap-3"
	>
		<!-- Preview -->

		<Button
			variant="outline"
			onclick={preview}
			disabled={!survey?.id}
		>
			<Eye class="h-4 w-4" />

			<span>Preview</span>
		</Button>

		<!-- Edit -->

		<Button
			variant="outline"
			onclick={edit}
			disabled={!survey?.id}
		>
			<Pencil class="h-4 w-4" />

			<span>Edit</span>
		</Button>
	</div>
</header>