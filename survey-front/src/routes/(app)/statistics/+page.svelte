<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		Layers,
		Users,
		ListChecks,
		Gauge,
		AlertTriangle
	} from 'lucide-svelte';

	import { getAllSurveysStatistics } from '$lib/api/statistics.js';

	import Card from '$lib/components/ui/Card.svelte';
	import State from '$lib/components/ui/State.svelte';
	import ApexChart from '$lib/components/ui/ApexChart.svelte';
	import Skeleton from '$lib/components/ui/Skeleton.svelte';

	import Pagination from '$lib/components/dashboard/Pagination.svelte';

	let stats = $state(null);
	let loading = $state(true);
	let error = $state('');

	let currentPage = $state(1);

	const pageSize = 5;

	function normalizeStatus(status) {
		return status === 'published'
			? 'Published'
			: 'Draft';
	}

	onMount(async () => {
		try {
			stats = await getAllSurveysStatistics();
		} catch (err) {
			error =
				err?.message ||
				'Failed to load statistics';
		} finally {
			loading = false;
		}
	});

	let normalizedSurveys = $derived(
		(stats?.surveys ?? []).map((survey) => ({
			...survey,
			status: normalizeStatus(
				survey.status
			)
		}))
	);

	let publishedCount = $derived(
		normalizedSurveys.filter(
			(survey) =>
				survey.status === 'Published'
		).length
	);

	let draftCount = $derived(
		normalizedSurveys.filter(
			(survey) =>
				survey.status === 'Draft'
		).length
	);

	let averageCompletionRate = $derived.by(
		() => {
			if (
				normalizedSurveys.length === 0
			) {
				return 0;
			}

			const total =
				normalizedSurveys.reduce(
					(sum, survey) =>
						sum +
						(survey.averageCompletionRate ??
							0),
					0
				);

			return Math.round(
				total /
					normalizedSurveys.length
			);
		}
	);

	// Top 6 surveys are used only for the chart
	let topSurveys = $derived(
		[...normalizedSurveys]
			.sort(
				(a, b) =>
					(b.totalResponses ?? 0) -
					(a.totalResponses ?? 0)
			)
			.slice(0, 6)
	);

	// --------------------------------------------------
	// TABLE PAGINATION
	// --------------------------------------------------

	let totalPages = $derived.by(() =>
		Math.max(
			1,
			Math.ceil(
				normalizedSurveys.length /
					pageSize
			)
		)
	);

	let paginatedSurveys = $derived.by(() => {
		const start =
			(currentPage - 1) *
			pageSize;

		return normalizedSurveys.slice(
			start,
			start + pageSize
		);
	});

	// Reset pagination when survey data changes
	$effect(() => {
		normalizedSurveys;

		currentPage = 1;
	});

	// Prevent invalid page
	$effect(() => {
		if (currentPage > totalPages) {
			currentPage = totalPages;
		}
	});

	// --------------------------------------------------
	// CHARTS
	// --------------------------------------------------

	let statusChartOptions = $derived({
		chart: {
			type: 'donut',
			height: 260,
			fontFamily: 'inherit'
		},

		labels: [
			'Published',
			'Draft'
		],

		series: [
			publishedCount,
			draftCount
		],

		colors: [
			'#10b981',
			'#f59e0b'
		],

		legend: {
			position: 'bottom'
		},

		dataLabels: {
			enabled: true
		}
	});

	let topSurveysChartOptions =
		$derived({
			chart: {
				type: 'bar',
				height: 320,
				toolbar: {
					show: false
				},
				fontFamily: 'inherit'
			},

			series: [
				{
					name: 'Responses',

					data: topSurveys.map(
						(survey) =>
							survey.totalResponses ??
							0
					)
				}
			],

			xaxis: {
				categories:
					topSurveys.map(
						(survey) =>
							survey.title
					)
			},

			plotOptions: {
				bar: {
					borderRadius: 4,
					horizontal: true,
					barHeight: '55%'
				}
			},

			colors: [
				'#9B7EBD'
			],

			dataLabels: {
				enabled: false
			}
		});
</script>

{#if loading}

	<!-- STATISTICS SKELETON -->

	<div class="mx-auto max-w-6xl space-y-6 p-8">

		<!-- Page heading -->

		<div class="space-y-2">
			<Skeleton class="h-9 w-40" />

			<Skeleton class="h-4 w-80" />
		</div>

		<!-- Stats cards -->

		<div
			class="grid grid-cols-2 gap-4 lg:grid-cols-4"
		>
			{#each Array(4) as _}

				<Card
					class="border border-slate-200 bg-white p-4"
				>
					<div class="flex items-center gap-2">
						<Skeleton
							class="h-7 w-7 rounded-md"
						/>

						<Skeleton
							class="h-3 w-24"
						/>
					</div>

					<Skeleton
						class="mt-4 h-8 w-16"
					/>
				</Card>

			{/each}
		</div>

		<!-- Charts -->

		<div
			class="grid grid-cols-1 gap-6 lg:grid-cols-2"
		>

			<Card
				class="border border-slate-200 bg-white p-6"
			>
				<Skeleton
					class="h-4 w-36"
				/>

				<div
					class="mt-5 flex items-center justify-center"
				>
					<Skeleton
						class="h-52 w-52 rounded-full"
					/>
				</div>

				<div
					class="mt-4 flex justify-center gap-6"
				>
					<Skeleton
						class="h-3 w-20"
					/>

					<Skeleton
						class="h-3 w-16"
					/>
				</div>
			</Card>

			<Card
				class="border border-slate-200 bg-white p-6"
			>
				<Skeleton
					class="h-4 w-48"
				/>

				<div class="mt-6 space-y-4">

					{#each Array(6) as _}

						<div
							class="flex items-center gap-3"
						>
							<Skeleton
								class="h-3 w-24 shrink-0"
							/>

							<Skeleton
								class="h-6 flex-1 rounded"
							/>
						</div>

					{/each}

				</div>
			</Card>

		</div>

		<!-- Surveys table -->

		<Card
			class="border border-slate-200 bg-white p-0"
		>
			<div
				class="border-b border-slate-100 px-6 py-4"
			>
				<Skeleton class="h-4 w-24" />
			</div>

			<div class="w-full">

				<!-- Header -->

				<div
					class="grid grid-cols-5 gap-4 border-b border-slate-100 px-6 py-3"
				>
					<Skeleton class="h-3 w-16" />
					<Skeleton class="h-3 w-14" />
					<Skeleton class="h-3 w-20" />
					<Skeleton class="h-3 w-20" />
					<Skeleton class="h-3 w-20" />
				</div>

				<!-- Rows -->

				{#each Array(5) as _}

					<div
						class="grid grid-cols-5 items-center gap-4 border-b border-slate-50 px-6 py-4"
					>
						<Skeleton
							class="h-4 w-32"
						/>

						<Skeleton
							class="h-6 w-20 rounded-full"
						/>

						<Skeleton
							class="h-4 w-10"
						/>

						<Skeleton
							class="h-4 w-12"
						/>

						<Skeleton
							class="h-4 w-14"
						/>
					</div>

				{/each}

			</div>
		</Card>

	</div>

{:else if error}

	<div
		class="flex h-screen items-center justify-center bg-slate-50"
	>
		<State
			icon={AlertTriangle}
			title="Couldn't load statistics"
			description={error}
		/>
	</div>

{:else if stats}

	<div class="mx-auto max-w-6xl space-y-6 p-8">

		<!-- HEADER -->

		<div>
			<h1
				class="text-3xl font-bold text-gray-900"
			>
				Statistics
			</h1>

			<p
				class="mt-1 text-gray-500"
			>
				An overview of all your surveys
				and responses.
			</p>
		</div>

		<!-- STATISTICS CARDS -->

		<div
			class="grid grid-cols-2 gap-4 lg:grid-cols-4"
		>

			<Card
				class="border border-slate-200 bg-white p-4"
			>
				<div
					class="flex items-center gap-2 text-slate-500"
				>
					<div
						class="rounded-md bg-slate-50 p-1.5"
					>
						<Layers size={15} />
					</div>

					<span
						class="text-xs font-medium"
					>
						Total Surveys
					</span>
				</div>

				<p
					class="mt-3 text-2xl font-bold text-slate-900"
				>
					{stats.totalSurveys}
				</p>
			</Card>

			<Card
				class="border border-slate-200 bg-white p-4"
			>
				<div
					class="flex items-center gap-2 text-slate-500"
				>
					<div
						class="rounded-md bg-violet-50 p-1.5"
					>
						<Users
							size={15}
							class="text-violet-600"
						/>
					</div>

					<span
						class="text-xs font-medium"
					>
						Total Responses
					</span>
				</div>

				<p
					class="mt-3 text-2xl font-bold text-slate-900"
				>
					{stats.totalResponses}
				</p>
			</Card>

			<Card
				class="border border-slate-200 bg-white p-4"
			>
				<div
					class="flex items-center gap-2 text-slate-500"
				>
					<div
						class="rounded-md bg-sky-50 p-1.5"
					>
						<ListChecks
							size={15}
							class="text-sky-600"
						/>
					</div>

					<span
						class="text-xs font-medium"
					>
						Total Questions
					</span>
				</div>

				<p
					class="mt-3 text-2xl font-bold text-slate-900"
				>
					{stats.totalQuestions}
				</p>
			</Card>

			<Card
				class="border border-slate-200 bg-white p-4"
			>
				<div
					class="flex items-center gap-2 text-slate-500"
				>
					<div
						class="rounded-md bg-emerald-50 p-1.5"
					>
						<Gauge
							size={15}
							class="text-emerald-600"
						/>
					</div>

					<span
						class="text-xs font-medium"
					>
						Avg. Completion Rate
					</span>
				</div>

				<p
					class="mt-3 text-2xl font-bold text-slate-900"
				>
					{averageCompletionRate}%
				</p>
			</Card>

		</div>

		<!-- CHARTS -->

		<div
			class="grid grid-cols-1 gap-6 lg:grid-cols-2"
		>

			<Card
				class="border border-slate-200 bg-white p-6"
			>
				<h2
					class="mb-2 text-sm font-semibold text-slate-700"
				>
					Published vs Draft
				</h2>

				{#if normalizedSurveys.length === 0}

					<p
						class="py-8 text-center text-sm text-slate-400"
					>
						No surveys yet.
					</p>

				{:else}

					<ApexChart
						options={statusChartOptions}
					/>

				{/if}
			</Card>

			<Card
				class="border border-slate-200 bg-white p-6"
			>
				<h2
					class="mb-2 text-sm font-semibold text-slate-700"
				>
					Top Surveys by Responses
				</h2>

				{#if topSurveys.length === 0}

					<p
						class="py-8 text-center text-sm text-slate-400"
					>
						No surveys yet.
					</p>

				{:else}

					<ApexChart
						options={topSurveysChartOptions}
					/>

				{/if}
			</Card>

		</div>

		<!-- ALL SURVEYS -->

		<Card
			class="border border-slate-200 bg-white p-0"
		>

			<div
				class="border-b border-slate-100 px-6 py-4"
			>
				<h2
					class="text-sm font-semibold text-slate-700"
				>
					All Surveys
				</h2>
			</div>

			{#if normalizedSurveys.length === 0}

				<p
					class="px-6 py-8 text-center text-sm text-slate-400"
				>
					No surveys yet.
				</p>

			{:else}

				<div class="overflow-x-auto">

					<table class="w-full text-sm">

						<thead>
							<tr
								class="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400"
							>
								<th
									class="px-6 py-3 font-medium"
								>
									Survey
								</th>

								<th
									class="px-6 py-3 font-medium"
								>
									Status
								</th>

								<th
									class="px-6 py-3 font-medium"
								>
									Questions
								</th>

								<th
									class="px-6 py-3 font-medium"
								>
									Responses
								</th>

								<th
									class="px-6 py-3 font-medium"
								>
									Completion
								</th>
							</tr>
						</thead>

						<tbody>

							{#each paginatedSurveys as survey (
								survey.surveyId
							)}

								<tr
									onclick={() =>
										goto(
											`/surveys/${survey.surveyId}/statistics`
										)
									}
									class="cursor-pointer border-b border-slate-50 transition hover:bg-slate-50"
								>

									<td
										class="px-6 py-3 font-medium text-slate-800"
									>
										{survey.title}
									</td>

									<td class="px-6 py-3">

										<span
											class={`rounded-full px-2 py-1 text-xs font-medium ${
												survey.status ===
												'Published'
													? 'bg-emerald-50 text-emerald-700'
													: 'bg-amber-50 text-amber-700'
											}`}
										>
											{survey.status}
										</span>

									</td>

									<td
										class="px-6 py-3 text-slate-600"
									>
										{survey.totalQuestions}
									</td>

									<td
										class="px-6 py-3 text-slate-600"
									>
										{survey.totalResponses}
									</td>

									<td
										class="px-6 py-3 text-slate-600"
									>
										{survey.averageCompletionRate}%
									</td>

								</tr>

							{/each}

						</tbody>

					</table>

				</div>

				<!-- PAGINATION -->

				<Pagination
					bind:currentPage
					{totalPages}
				/>

			{/if}

		</Card>

	</div>

{/if}