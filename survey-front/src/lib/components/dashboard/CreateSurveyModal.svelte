<script>
	import Modal from '$lib/components/ui/Modal.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let {
		open = $bindable(false),
		addSurvey
	} = $props();

	let title = $state('');
	let description = $state('');

	function createSurvey() {
	if (!title.trim()) return;

	addSurvey({
		title,
		description
	});

	title = '';
	description = '';
	open = false;
}

	function close() {
		title = '';
		description = '';
		open = false;
	}
</script>

<Modal {open}>
	<div class="space-y-5">
		<h2 class="text-2xl font-bold">
			Create Survey
		</h2>

		<div class="space-y-2">
			<label for="title" class="text-sm font-medium">Survey Title</label>

			<Input
				id="title"
				bind:value={title}
				placeholder="Enter survey title..."
			/>
		</div>

		<div class="space-y-2">
			<label for="description" class="text-sm font-medium">
				Description
			</label>

			<textarea
				id="description"
				bind:value={description}
				rows="4"
				class="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
				placeholder="Enter a short description..."
			></textarea>
		</div>

		<div class="flex justify-end gap-3">
			<Button
				variant="secondary"
				onclick={close}
			>
				Cancel
			</Button>

			<Button onclick={createSurvey}>
				Create Survey
			</Button>
		</div>
	</div>
</Modal>