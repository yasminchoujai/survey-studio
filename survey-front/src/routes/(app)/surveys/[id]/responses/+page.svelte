<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { Inbox } from 'lucide-svelte';

	import { useSurveys } from '$lib/stores/surveys.svelte.js';

	import ErrorState from '$lib/components/ui/ErrorState.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import ResponsesSkeleton from '$lib/components/responses/ResponsesSkeleton.svelte';

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
			const surveyId = page.params.id;

			if (!surveyId) {
				throw new Error('Survey ID is missing.');
			}

			const result = await getSurveyWithResponses(surveyId);

			if (!result) {
				throw new Error('No response data was returned.');
			}

			survey = result.survey ?? null;

			responses = Array.isArray(result.responses)
				? result.responses
				: [];
		} catch (err) {
			error = err?.message ?? 'Failed to load responses.';
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		loadResponses();
	});

	let sortedResponses = $derived(
		[...responses].sort((a, b) => {
			const dateA = new Date(
				a.submittedAt ?? a.createdAt ?? 0
			);

			const dateB = new Date(
				b.submittedAt ?? b.createdAt ?? 0
			);

			return dateB - dateA;
		})
	);
</script>

{#if loading}

	<ResponsesSkeleton />

{:else if error}

	<ErrorState
		title="Couldn't load responses"
		message={error}
		buttonText="Retry"
		onRetry={loadResponses}
	/>

{:else if survey}

	<div class="min-h-screen bg-slate-50">
		<!-- Header -->
		<ResponsesHeader {survey} />

		<!-- Content -->
		<div
			class="mx-auto max-w-5xl space-y-6 p-6 md:p-8"
		>
			<!-- Summary -->
			<ResponsesSummary
				{survey}
				{responses}
			/>

			<!-- Responses -->
			{#if sortedResponses.length === 0}

				<EmptyState
					icon={Inbox}
					title="No responses yet"
					description="Share your survey with respondents. Their submissions will appear here."
				/>

			{:else}

				<div class="space-y-4">
					{#each sortedResponses as response, index (
						response.id
					)}
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

{:else}

	<EmptyState
		icon={Inbox}
		title="Survey not found"
		description="We couldn't find this survey."
	/>

{/if}