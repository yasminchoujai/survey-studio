<script>
	import { goto } from '$app/navigation';
	import { ArrowLeft, Pencil } from 'lucide-svelte';

	import Button from '$lib/components/ui/Button.svelte';

	let { survey, onBack } = $props();  // ✅ Added onBack

	function back() {
		if (onBack) {
			onBack();
		} else {
			goto(`/surveys/${survey.id}/builder`);
		}
	}
</script>

<header class="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
	<div class="flex items-center gap-4">
		<Button variant="ghost" size="icon" onclick={back}>
			<ArrowLeft size={18} />
		</Button>

		<div>
			<h1 class="text-lg font-semibold text-slate-900">
				{survey.title}
			</h1>
		</div>
	</div>

	<Button variant="outline" onclick={back}>
		<Pencil size={16} />
		Back to Builder
	</Button>
</header>