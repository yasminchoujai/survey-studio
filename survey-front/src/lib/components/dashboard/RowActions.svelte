<script>
	import { goto } from '$app/navigation';
	import {
		Pencil,
		Trash2,
		Eye,
		BarChart3,
		Copy,
		Check
	} from 'lucide-svelte';

	import DeleteModal from '$lib/components/ui/DeleteModal.svelte';
	import { useToast } from '$lib/stores/toast.svelte.js';

	const toast = useToast();

	let copied = $state(false);

	let { survey, deleteSurvey } = $props();

	let showDeleteModal = $state(false);
	let deleting = $state(false);


	function edit() {
		goto(`/surveys/${survey.id}/builder`);
	}


	function preview() {
		goto(`/surveys/${survey.id}/preview`);
	}


	function responses() {
		goto(`/surveys/${survey.id}/responses`);
	}


	function remove() {
		showDeleteModal = true;
	}


	function cancelDelete() {
		showDeleteModal = false;
	}


	async function confirmDelete() {
		try {
			deleting = true;

			await deleteSurvey(survey.id);

			showDeleteModal = false;

			toast.success('Survey deleted');

		} catch (err) {
			console.error(err);

			toast.error('Failed to delete survey');

		} finally {
			deleting = false;
		}
	}


	async function copyLink() {
		const url = `${window.location.origin}/public/${survey.id}`;

		try {
			await navigator.clipboard.writeText(url);

			copied = true;

			toast.success('Link copied to clipboard');

			setTimeout(() => {
				copied = false;
			}, 2000);

		} catch (error) {
			console.error(error);

			toast.error('Failed to copy link');
		}
	}
</script>


<div class="flex items-center justify-end">

	{#if survey.status === 'Published'}
		<button
			onclick={copyLink}
			class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors duration-200 hover:bg-violet-100 hover:text-violet-600"
			title={copied ? 'Copied!' : 'Copy survey link'}
		>
			{#if copied}
				<Check size={18} class="text-green-600" />
			{:else}
				<Copy size={18} />
			{/if}
		</button>
	{/if}


	<button
		onclick={edit}
		class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors duration-200 hover:bg-violet-100 hover:text-violet-600"
		title="Edit"
	>
		<Pencil size={18} />
	</button>


	<button
		onclick={preview}
		class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors duration-200 hover:bg-sky-100 hover:text-sky-600"
		title="Preview"
	>
		<Eye size={18} />
	</button>


	<button
		onclick={responses}
		class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors duration-200 hover:bg-emerald-100 hover:text-emerald-600"
		title="Responses"
	>
		<BarChart3 size={18} />
	</button>


	<div class="mx-2 h-5 w-px bg-slate-200"></div>


	<button
		onclick={remove}
		class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors duration-200 hover:bg-red-100 hover:text-red-600"
		title="Delete"
	>
		<Trash2 size={18} />
	</button>


	<DeleteModal
		open={showDeleteModal}
		title="Delete survey?"
		description={`You're about to permanently delete "${survey.title}". This action cannot be undone and all responses associated with this survey will also be deleted.`}
		confirmText="Delete Survey"
		cancelText="Cancel"
		loading={deleting}
		onConfirm={confirmDelete}
		onCancel={cancelDelete}
	/>

</div>