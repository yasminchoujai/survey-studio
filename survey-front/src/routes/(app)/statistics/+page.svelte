<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Layers, Users, ListChecks, Gauge, AlertTriangle } from 'lucide-svelte';

	import { getAllSurveysStatistics } from '$lib/api/statistics.js';

	import Card from '$lib/components/ui/Card.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import State from '$lib/components/ui/State.svelte';
	import ApexChart from '$lib/components/ui/ApexChart.svelte';

	let stats = $state(null);
	let loading = $state(true);
	let error = $state('');

	// Backend sends the raw DB value ("published" / "draft") — normalize the
	// same way lib/stores/surveys.svelte.js already does everywhere else.
	function normalizeStatus(status) {
		return status === 'published' ? 'Published' : 'Draft';
	}

	onMount(async () => {
		try {
			stats = await getAllSurveysStatistics();
		} catch (err) {
			error = err.message || 'Failed to load statistics';
		} finally {
			loading = false;
		}
	});

	let normalizedSurveys = $derived(
		(stats?.surveys ?? []).map((survey) => ({
			...survey,
			status: normalizeStatus(survey.status)
		}))
	);

	let publishedCount = $derived(
		normalizedSurveys.filter((survey) => survey.status === 'Published').length
	);

	let draftCount = $derived(
		normalizedSurveys.filter((survey) => survey.status === 'Draft').length
	);

	let averageCompletionRate = $derived.by(() => {
		if (normalizedSurveys.length === 0) return 0;

		const total = normalizedSurveys.reduce(
			(sum, survey) => sum + (survey.averageCompletionRate ?? 0),
			0
		);

		return Math.round(total / normalizedSurveys.length);
	});

	let topSurveys = $derived(
		[...normalizedSurveys]
			.sort((a, b) => (b.totalResponses ?? 0) - (a.totalResponses ?? 0))
			.slice(0, 6)
	);

	let statusChartOptions = $derived({
		chart: { type: 'donut', height: 260, fontFamily: 'inherit' },
		labels: ['Published', 'Draft'],
		series: [publishedCount, draftCount],
		colors: ['#10b981', '#f59e0b'],
		legend: { position: 'bottom' },
		dataLabels: { enabled: true }
	});

	let topSurveysChartOptions = $derived({
		chart: { type: 'bar', height: 320, toolbar: { show: false }, fontFamily: 'inherit' },
		series: [
			{
				name: 'Responses',
				data: topSurveys.map((survey) => survey.totalResponses ?? 0)
			}
		],
		xaxis: {
			categories: topSurveys.map((survey) => survey.title)
		},
		plotOptions: {
			bar: { borderRadius: 4, horizontal: true, barHeight: '55%' }
		},
		colors: ['#9B7EBD'],
		dataLabels: { enabled: false }
	});
</script>

{#if loading}

	<div class="flex h-screen items-center justify-center bg-slate-50">
		<Spinner />
	</div>

{:else if error}

	<div class="flex h-screen items-center justify-center bg-slate-50">
		<State icon={AlertTriangle} title="Couldn't load statistics" description={error} />
	</div>

{:else if stats}

	<div class="mx-auto max-w-6xl space-y-6 p-8">

		<div>
			<h1 class="text-3xl font-bold text-gray-900">Statistics</h1>
			<p class="mt-1 text-gray-500">An overview of all your surveys and responses.</p>
		</div>

		<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">

			<Card class="border border-slate-200 bg-white p-4">
				<div class="flex items-center gap-2 text-slate-500">
					<div class="rounded-md bg-slate-50 p-1.5"><Layers size={15}/></div>
					<span class="text-xs font-medium">Total Surveys</span>
				</div>
				<p class="mt-3 text-2xl font-bold text-slate-900">{stats.totalSurveys}</p>
			</Card>

			<Card class="border border-slate-200 bg-white p-4">
				<div class="flex items-center gap-2 text-slate-500">
					<div class="rounded-md bg-violet-50 p-1.5"><Users size={15} class="text-violet-600"/></div>
					<span class="text-xs font-medium">Total Responses</span>
				</div>
				<p class="mt-3 text-2xl font-bold text-slate-900">{stats.totalResponses}</p>
			</Card>

			<Card class="border border-slate-200 bg-white p-4">
				<div class="flex items-center gap-2 text-slate-500">
					<div class="rounded-md bg-sky-50 p-1.5"><ListChecks size={15} class="text-sky-600"/></div>
					<span class="text-xs font-medium">Total Questions</span>
				</div>
				<p class="mt-3 text-2xl font-bold text-slate-900">{stats.totalQuestions}</p>
			</Card>

			<Card class="border border-slate-200 bg-white p-4">
				<div class="flex items-center gap-2 text-slate-500">
					<div class="rounded-md bg-emerald-50 p-1.5"><Gauge size={15} class="text-emerald-600"/></div>
					<span class="text-xs font-medium">Avg. Completion Rate</span>
				</div>
				<p class="mt-3 text-2xl font-bold text-slate-900">{averageCompletionRate}%</p>
			</Card>

		</div>

		<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">

			<Card class="border border-slate-200 bg-white p-6">
				<h2 class="mb-2 text-sm font-semibold text-slate-700">Published vs Draft</h2>

				{#if normalizedSurveys.length === 0}
					<p class="py-8 text-center text-sm text-slate-400">No surveys yet.</p>
				{:else}
					<ApexChart options={statusChartOptions} />
				{/if}
			</Card>

			<Card class="border border-slate-200 bg-white p-6">
				<h2 class="mb-2 text-sm font-semibold text-slate-700">Top Surveys by Responses</h2>

				{#if topSurveys.length === 0}
					<p class="py-8 text-center text-sm text-slate-400">No surveys yet.</p>
				{:else}
					<ApexChart options={topSurveysChartOptions} />
				{/if}
			</Card>

		</div>

		<Card class="border border-slate-200 bg-white p-0">

			<div class="border-b border-slate-100 px-6 py-4">
				<h2 class="text-sm font-semibold text-slate-700">All Surveys</h2>
			</div>

			{#if normalizedSurveys.length === 0}

				<p class="px-6 py-8 text-center text-sm text-slate-400">No surveys yet.</p>

			{:else}

				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
							<th class="px-6 py-3 font-medium">Survey</th>
							<th class="px-6 py-3 font-medium">Status</th>
							<th class="px-6 py-3 font-medium">Questions</th>
							<th class="px-6 py-3 font-medium">Responses</th>
							<th class="px-6 py-3 font-medium">Completion</th>
						</tr>
					</thead>
					<tbody>
						{#each normalizedSurveys as survey (survey.surveyId)}
							<tr
								onclick={() => goto(`/surveys/${survey.surveyId}/statistics`)}
								class="cursor-pointer border-b border-slate-50 transition hover:bg-slate-50"
							>
								<td class="px-6 py-3 font-medium text-slate-800">{survey.title}</td>
								<td class="px-6 py-3">
									<span class={`rounded-full px-2 py-1 text-xs font-medium ${
										survey.status === 'Published'
											? 'bg-emerald-50 text-emerald-700'
											: 'bg-amber-50 text-amber-700'
									}`}>
										{survey.status}
									</span>
								</td>
								<td class="px-6 py-3 text-slate-600">{survey.totalQuestions}</td>
								<td class="px-6 py-3 text-slate-600">{survey.totalResponses}</td>
								<td class="px-6 py-3 text-slate-600">{survey.averageCompletionRate}%</td>
							</tr>
						{/each}
					</tbody>
				</table>

			{/if}

		</Card>

	</div>

{/if}