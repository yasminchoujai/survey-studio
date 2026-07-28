<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	import { useSurveys } from '$lib/stores/surveys.svelte';

	import PreviewHeader from '$lib/components/preview/PreviewHeader.svelte';
	import SurveyHero from '$lib/components/preview/SurveyHero.svelte';
	import PreviewSection from '$lib/components/preview/PreviewSection.svelte';

	import Button from '$lib/components/ui/Button.svelte';


	const { getSurvey } = useSurveys();

	let survey = $state(null);
	let loading = $state(true);


	onMount(async () => {
		try {
			survey = await getSurvey(page.params.id);
		}
		finally {
			loading = false;
		}
	});
</script>


{#if loading}

	<div class="flex items-center justify-center py-20">
		<p class="text-(--text-muted)">
			Loading...
		</p>
	</div>


{:else if survey}


<div class="bg-(--background)">

	<PreviewHeader {survey}/>


	<main class="mx-auto max-w-4xl px-6 py-8">


		<div class="overflow-hidden rounded-2xl border border-(--border) bg-white shadow-sm">


			<SurveyHero {survey}/>


			<div class="space-y-10 p-8">


				{#each survey.sections as section}

					<PreviewSection {section}/>

				{/each}


			</div>


			<div class="border-t border-(--border) p-6">


				<div class="flex justify-end">

					<Button>
						Submit Survey
					</Button>


				</div>


			</div>


		</div>


	</main>


</div>


{/if}