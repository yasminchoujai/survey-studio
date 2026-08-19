<script>
	import { onMount } from 'svelte';
	import { FileText } from 'lucide-svelte';

	import { useSurveys } from '$lib/stores/surveys.svelte.js';

	import Card from '$lib/components/ui/Card.svelte';
	import ErrorState from '$lib/components/ui/ErrorState.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import DashboardSkeleton from '$lib/components/ui/DashboardSkeleton.svelte';

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

	let loading = $state(true);
	let error = $state(null);

	const pageSize = 5;

	const {
		surveys,
		load,
		addSurvey,
		deleteSurvey
	} = useSurveys();

	async function loadSurveys() {
		loading = true;
		error = null;

		try {
			await load();
		} catch (err) {
			error =
				err?.message ||
				'Failed to load surveys.';
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		loadSurveys();
	});

	let filteredSurveys = $derived.by(() => {
		const searchValue = search
			.trim()
			.toLowerCase();

		return surveys.filter((survey) => {
			const matchesSearch =
				!searchValue ||
				survey.title
					?.toLowerCase()
					.includes(searchValue) ||
				survey.description
					?.toLowerCase()
					.includes(searchValue);

			const matchesStatus =
				status === 'All' ||
				survey.status === status;

			return matchesSearch && matchesStatus;
		});
	});

	let totalPages = $derived.by(() => {
		return Math.max(
			1,
			Math.ceil(
				filteredSurveys.length / pageSize
			)
		);
	});

	let paginatedSurveys = $derived.by(() => {
		const start =
			(currentPage - 1) * pageSize;

		return filteredSurveys.slice(
			start,
			start + pageSize
		);
	});

	// Reset pagination when filters change
	$effect(() => {
		search;
		status;

		currentPage = 1;
	});

	// Keep current page valid
	$effect(() => {
		if (currentPage > totalPages) {
			currentPage = totalPages;
		}
	});
</script>

<div class="mx-auto max-w-7xl space-y-5 px-10">

	<!-- Dashboard Header -->

	<div class="flex items-end justify-between py-6">
		<div>
			<h1
				class="text-3xl font-bold tracking-tight text-[#3B1E54]"
			>
				Survey Dashboard
			</h1>

			<p class="mt-1 text-sm text-slate-500">
				Create, manage and publish surveys
				from one place.
			</p>
		</div>
	</div>

	<!-- Toolbar -->

	<DashboardToolbar
		bind:search
		bind:status
		bind:view
		onCreate={() => (showModal = true)}
	/>

	<!-- Content -->

	{#if loading}

		<DashboardSkeleton {view} />

	{:else if error}

		<ErrorState
			title="Couldn't load surveys"
			message={error}
			buttonText="Retry"
			onRetry={loadSurveys}
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

		<!-- Surveys -->

		{#if view === 'table'}

			<Card padding="none">
				<SurveyTable
					surveys={paginatedSurveys}
					{deleteSurvey}
				/>
			</Card>

		{:else}

			<div
				class="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
			>
				{#each paginatedSurveys as survey (survey.id)}
					<SurveyCard
						{survey}
						{deleteSurvey}
					/>
				{/each}
			</div>

		{/if}

		<!-- Pagination -->

		<Pagination
			bind:currentPage
			{totalPages}
		/>

	{/if}

	<!-- Create Survey Modal -->

	<CreateSurveyModal
		bind:open={showModal}
		{addSurvey}
	/>

</div>