<script>
	import { goto } from '$app/navigation';
	import {
		ArrowLeft,
		Pencil
	} from 'lucide-svelte';

	import Button from '$lib/components/ui/Button.svelte';

	let {
		survey,
		onBack = null
	} = $props();

	function back() {
		if (!survey?.id) {
			return;
		}

		const destination =
			`/surveys/${survey.id}/builder`;

		if (onBack) {
			onBack();
			return;
		}

		goto(destination);
	}
</script>

<header
	class="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6"
>
	<div
		class="flex items-center gap-4"
	>
		<Button
			variant="ghost"
			size="icon"
			onclick={back}
			title="Back to Builder"
		>
			<ArrowLeft
				class="h-5 w-5"
			/>
		</Button>

		<div>
			<h1
				class="text-lg font-semibold text-slate-900"
			>
				{survey?.title ||
					'Untitled Survey'}
			</h1>
		</div>
	</div>

	<Button
		variant="outline"
		onclick={back}
	>
		<Pencil
			class="h-4 w-4"
		/>

		Back to Builder
	</Button>
</header>