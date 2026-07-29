<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	import { useSurveys } from '$lib/stores/surveys.svelte';

	import PreviewHeader from '$lib/components/preview/PreviewHeader.svelte';
	import PreviewHero from '$lib/components/preview/PreviewHero.svelte';
	import PreviewSection from '$lib/components/preview/PreviewSection.svelte';
	import PreviewFooter from '$lib/components/preview/PreviewFooter.svelte';

	const { getSurvey } = useSurveys();

	let survey = $state(null);
	let loading = $state(true);
	let error = $state('');

	onMount(async () => {
		try {
			const data = await getSurvey(page.params.id);

			console.log('Survey:', data);

			survey = data;
		} catch (err) {
			console.error(err);
			error = err?.message ?? 'Failed to load survey.';
		} finally {
			loading = false;
		}
	});
</script>

{#if loading}

	<div class="flex h-full items-center justify-center">
		<p class="text-slate-500">Loading survey...</p>
	</div>

{:else if error}

	<div class="flex h-full items-center justify-center">
		<p class="text-red-500">{error}</p>
	</div>

{:else if survey}

	<div class="flex h-full flex-col bg-slate-50">

		<PreviewHeader survey={survey} />

		<div class="flex-1 overflow-y-auto">

			<div class="mx-auto max-w-4xl px-6 py-6">

				<div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

					<PreviewHero survey={survey} />

					<div class="space-y-12 p-8">

						{#each survey.sections ?? [] as section (section.id)}

							<PreviewSection section={section} />

						{/each}

					</div>

					<PreviewFooter />

				</div>

			</div>

		</div>

	</div>

{:else}

	<div class="flex h-full items-center justify-center">
		<p class="text-slate-500">Survey not found.</p>
	</div>

{/if}