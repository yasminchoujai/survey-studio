<script>
	import { useToast } from '$lib/stores/toast.svelte.js';
	import { CheckCircle2, XCircle, Info, X } from 'lucide-svelte';

	const { toasts, remove } = useToast();

	const icons = {
		success: CheckCircle2,
		error: XCircle,
		info: Info
	};

	const styles = {
		success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
		error: 'border-red-200 bg-red-50 text-red-700',
		info: 'border-slate-200 bg-white text-slate-700'
	};
</script>

<div class="pointer-events-none fixed bottom-6 right-6 z-50 flex w-80 flex-col gap-2">

	{#each toasts as toast (toast.id)}

		{@const Icon = icons[toast.type]}

		<div class={`pointer-events-auto flex items-start gap-2 rounded-xl border px-4 py-3 text-sm shadow-lg ${styles[toast.type]}`}>

			<Icon size={18} class="mt-0.5 shrink-0" />

			<p class="flex-1">{toast.message}</p>

			<button
				onclick={() => remove(toast.id)}
				class="shrink-0 opacity-60 hover:opacity-100"
			>
				<X size={14}/>
			</button>

		</div>

	{/each}

</div>