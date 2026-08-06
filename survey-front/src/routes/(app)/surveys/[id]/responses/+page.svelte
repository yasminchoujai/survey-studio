<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { Inbox } from 'lucide-svelte';

	import { useSurveys } from '$lib/stores/surveys.svelte.js';

	import LoadingState from '$lib/components/ui/LoadingState.svelte';
	import ErrorState from '$lib/components/ui/ErrorState.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';

	import ResponsesHeader from '$lib/components/responses/ResponsesHeader.svelte';
	import ResponsesSummary from '$lib/components/responses/ResponsesSummary.svelte';
	import ResponseCard from '$lib/components/responses/ResponseCard.svelte';

	const { getSurveyWithResponses } = useSurveys();

	let survey = $state(null);
	let responses = $state([]);

	let loading = $state(true);
	let error = $state('');

	async function loadResponses() {
		loading = true;
		error = '';

		try {
			const result = await getSurveyWithResponses(page.params.id);

			survey = result.survey;
			responses = result.responses ?? [];
		} catch (err) {
			error = err.message ?? 'Failed to load responses.';
		} finally {
			loading = false;
		}
	}

	onMount(loadResponses);

	let sortedResponses = $derived(
		[...responses].sort(
			(a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
		)
	);
</script>

{#if loading}

	<LoadingState
		fullScreen
		message="Loading responses..."
		description="Fetching survey submissions."
	/>

{:else if error}

	<ErrorState
		title="Couldn't load responses"
		message={error}
		buttonText="Retry"
		onRetry={loadResponses}
	/>

{:else if survey}

	<div class="min-h-screen bg-slate-50">

		<ResponsesHeader {survey} />

		<div class="mx-auto max-w-5xl space-y-6 p-8">

			<ResponsesSummary {survey} {responses} />

			{#if sortedResponses.length === 0}

				<EmptyState
					icon={Inbox}
					title="No responses yet"
					description="Share your survey with respondents. Their submissions will appear here."
				/>

			{:else}

				<div class="space-y-4">

					{#each sortedResponses as response, index (response.id)}

						<ResponseCard
							{survey}
							{response}
							{index}
							expanded={sortedResponses.length === 1}
						/>

					{/each}

				</div>

			{/if}

		</div>

	</div>

{/if}