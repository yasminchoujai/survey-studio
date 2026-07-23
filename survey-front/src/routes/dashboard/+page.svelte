<script>
	import { onMount } from 'svelte';

	import { useSurveys } from '$lib/stores/surveys.svelte.js';

	import Card from '$lib/components/ui/Card.svelte';
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
		deleteSurvey
	} = useSurveys();

	onMount(() => {
		load();
	});

	let filteredSurveys = $derived(
		surveys.filter((survey) => {
			const matchesSearch =
				survey.title.toLowerCase().includes(search.toLowerCase()) ||
				survey.description.toLowerCase().includes(search.toLowerCase());

			const matchesStatus =
				status === 'All' || survey.status === status;

			return matchesSearch && matchesStatus;
		})
	);

	let totalPages = $derived(
		Math.max(1, Math.ceil(filteredSurveys.length / pageSize))
	);

	let paginatedSurveys = $derived(
		filteredSurveys.slice(
			(currentPage - 1) * pageSize,
			currentPage * pageSize
		)
	);
</script>

<div class="mx-auto max-w-7xl space-y-6 p-8">

	<div>
		
		<div class="mb-8 flex items-center justify-between">
	     <div>

		  <h1 class="text-3xl font-bold text-gray-900">
			Survey Dashboard
		  </h1>

		   <p class="mt-1 text-gray-500">
			Manage and organize your surveys in one place.
		   </p>

	    </div>

     </div>
	</div>
	<DashboardToolbar
		bind:search
		bind:status
		bind:view
		onCreate={() => (showModal = true)}
	/>

	{#if paginatedSurveys.length === 0}

		<Card>
			<div class="flex flex-col items-center justify-center py-16">

				<h2 class="mt-4 text-2xl font-semibold">
					No surveys found
				</h2>

				<p class="mt-2 text-gray-500">
					Create your first survey.
				</p>

			</div>
		</Card>

	{:else}

		{#if view === 'table'}

			<Card>
				<SurveyTable
					surveys={paginatedSurveys}
					{deleteSurvey}
				/>
			</Card>

		{:else}

			<div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
				{#each paginatedSurveys as survey}
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