<script>
	import Modal from './Modal.svelte';
	import Button from './Button.svelte';
	import { Trash2 } from 'lucide-svelte';

	let {
		open = false,
		title = 'Delete item?',
		description = 'This action cannot be undone.',
		confirmText = 'Delete',
		cancelText = 'Cancel',
		loading = false,
		onCancel = () => {},
		onConfirm = () => {}
	} = $props();
</script>

<Modal {open}>
	<div class="flex flex-col items-center text-center">

		<div
			class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500"
		>
			<Trash2 size={20} />
		</div>

		<h2 class="text-lg font-semibold text-slate-900">
			{title}
		</h2>

		<p class="mt-2 max-w-xs text-sm text-slate-500">
			{description}
		</p>

		<div class="mt-6 flex w-full justify-center gap-2">
			<Button
				variant="outline"
				class="min-w-[110px]"
				onclick={onCancel}
				disabled={loading}
			>
				{cancelText}
			</Button>

			<Button
				variant="danger"
				class="min-w-[110px]"
				onclick={onConfirm}
				disabled={loading}
			>
				{#if loading}
					Deleting...
				{:else}
					{confirmText}
				{/if}
			</Button>
		</div>

	</div>
</Modal>