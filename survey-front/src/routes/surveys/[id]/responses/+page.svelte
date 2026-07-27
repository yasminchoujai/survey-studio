<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { Inbox, AlertTriangle } from 'lucide-svelte';

	import { useSurveys } from '$lib/stores/surveys.svelte.js';

	import Spinner from '$lib/components/ui/Spinner.svelte';
	import State from '$lib/components/ui/State.svelte';

	import ResponsesHeader from '$lib/components/responses/ResponsesHeader.svelte';
	import ResponsesSummary from '$lib/components/responses/ResponsesSummary.svelte';
	import ResponseCard from '$lib/components/responses/ResponseCard.svelte';

	const { getSurveyWithResponses } = useSurveys();

	let survey = $state(null);
	let responses = $state([]);

	let loading = $state(true);
	let error = $state('');

	onMount(async () => {
		try {
			const result = await getSurveyWithResponses(page.params.id);

			survey = result.survey;
			responses = result.responses ?? [];
		} catch (err) {
			error = err.message || 'Failed to load responses';
		} finally {
			loading = false;
		}
	});

	let sortedResponses = $derived(
		[...responses].sort(
			(a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
		)
	);
</script>

{#if loading}

	<div class="flex h-screen items-center justify-center bg-slate-50">
		<Spinner />
	</div>

{:else if error}

	<div class="flex h-screen items-center justify-center bg-slate-50">
		<State
			icon={AlertTriangle}
			title="Couldn't load responses"
			description={error}
		/>
	</div>

{:else if survey}

	<div class="min-h-screen bg-slate-50">

		<ResponsesHeader {survey} />

		<div class="mx-auto max-w-5xl space-y-6 p-8">

			<ResponsesSummary {survey} {responses} />

			{#if sortedResponses.length === 0}

				<State
					icon={Inbox}
					title="No responses yet"
					description="Once people start submitting this survey, their answers will show up here."
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