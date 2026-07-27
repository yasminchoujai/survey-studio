<script>
	import { goto } from '$app/navigation';
	import { ArrowLeft, Pencil } from 'lucide-svelte';

	import Button from '$lib/components/ui/Button.svelte';

	let { survey } = $props();

	function back() {
		goto(`/surveys/${survey.id}/builder`);
	}
</script>

<header class="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-5">

	<!-- Left -->

	<div class="flex min-w-0 items-center gap-3">

		<Button
			variant="ghost"
			size="icon"
			onclick={back}
		>
			<ArrowLeft size={18} />
		</Button>

		<div class="flex min-w-0 items-center gap-3">

			<h1 class="truncate text-sm font-medium text-slate-800">
				{survey.title}
			</h1>

			<div
				class="flex shrink-0 items-center gap-1.5 rounded-full bg-violet-50 px-2 py-1 text-xs font-medium text-violet-700"
			>
				<span class="h-1.5 w-1.5 rounded-full bg-violet-500"></span>
				Preview
			</div>

			<span class="hidden text-xs text-slate-500 sm:block">
				• {survey.sections.length}
				section{survey.sections.length !== 1 ? 's' : ''}
			</span>

		</div>

	</div>

	<!-- Right -->

	<div class="flex items-center gap-2">

		<Button
			variant="outline"
			onclick={back}
		>
			<Pencil size={16} />
			Back to Builder
		</Button>

	</div>

</header>