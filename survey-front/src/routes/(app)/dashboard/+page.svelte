<script>
	import { onMount } from 'svelte';
	import { FileText } from 'lucide-svelte';

	import { useSurveys } from '$lib/stores/surveys.svelte.js';

	import Card from '$lib/components/ui/Card.svelte';
	import LoadingState from '$lib/components/ui/LoadingState.svelte';
	import ErrorState from '$lib/components/ui/ErrorState.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';

	import DashboardToolbar from '$lib/components/dashboard/DashboardToolbar.svelte';
	import SurveyTable from '$lib/components/dashboard/SurveyTable.svelte';
	import SurveyCard from '$lib/components/dashboard/SurveyCard.svelte';
	import Pagination from '$lib/components/dashboard/Pagination.svelte';
	import CreateSurveyModal from '$lib/components/dashboard/CreateSurveyModal.svelte';

	let showModal = $state(false);

	let search = $state('');
	let status = $state('All');
	let view = $state('table');

	let currentPage = $state(1);

	const pageSize = 5;

	const {
		surveys,
		load,
		addSurvey,
		deleteSurvey,
		loading,
		error
	} = useSurveys();

	onMount(load);

	let filteredSurveys = $derived.by(() => {
		return surveys.filter((survey) => {
			const matchesSearch =
				survey.title.toLowerCase().includes(search.toLowerCase()) ||
				survey.description.toLowerCase().includes(search.toLowerCase());

			const matchesStatus =
				status === 'All' ||
				survey.status === status;

			return matchesSearch && matchesStatus;
		});
	});

	let totalPages = $derived.by(() =>
		Math.max(1, Math.ceil(filteredSurveys.length / pageSize))
	);

	let paginatedSurveys = $derived.by(() => {
		const start = (currentPage - 1) * pageSize;

		return filteredSurveys.slice(start, start + pageSize);
	});

	$effect(() => {
		search;
		status;
		currentPage = 1;
	});

	$effect(() => {
		if (currentPage > totalPages) {
			currentPage = totalPages;
		}
	});
</script>

<div class="mx-auto max-w-7xl space-y-5">

	<div class="flex items-end justify-between py-6">
		<div>
			<h1 class="text-3xl font-bold tracking-tight text-[#3B1E54]">
				Survey Dashboard
			</h1>

			<p class="mt-1 text-sm text-slate-500">
				Create, manage and publish surveys from one place.
			</p>
		</div>
	</div>

	<DashboardToolbar
		bind:search
		bind:status
		bind:view
		onCreate={() => (showModal = true)}
	/>

	{#if loading}

		<LoadingState
			message="Loading surveys..."
			description="Fetching your surveys."
		/>

	{:else if error}

		<ErrorState
			title="Couldn't load surveys"
			message={error}
			buttonText="Retry"
			onRetry={load}
		/>

	{:else if paginatedSurveys.length === 0}

		<EmptyState
			icon={FileText}
			title="No surveys yet"
			description="Create your first survey to start collecting responses."
			buttonText="Create Survey"
			onAction={() => (showModal = true)}
		/>

	{:else}

		{#if view === 'table'}

			<Card padding="none">
				<SurveyTable
					surveys={paginatedSurveys}
					{deleteSurvey}
				/>
			</Card>

		{:else}

			<div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

				{#each paginatedSurveys as survey (survey.id)}

					<SurveyCard
						{survey}
						{deleteSurvey}
					/>

				{/each}

			</div>

		{/if}

		<Pagination
			bind:currentPage
			{totalPages}
		/>

	{/if}

	<CreateSurveyModal
		bind:open={showModal}
		{addSurvey}
	/>

</div>