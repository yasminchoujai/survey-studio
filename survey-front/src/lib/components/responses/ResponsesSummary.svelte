<script>
	import {
		Users,
		ListChecks,
		Layers,
		Clock
	} from 'lucide-svelte';

	import Card from '$lib/components/ui/Card.svelte';

	let {
		survey,
		responses = []
	} = $props();

	function formatDate(date) {
		if (!date) return '—';

		const parsed = new Date(date);

		if (Number.isNaN(parsed.getTime())) {
			return '—';
		}

		return parsed.toLocaleDateString(
			'en-US',
			{
				month: 'short',
				day: 'numeric',
				year: 'numeric'
			}
		);
	}

	const sections = $derived(
		Array.isArray(survey?.sections)
			? survey.sections
			: []
	);

	const questionCount = $derived(
		sections.reduce(
			(total, section) =>
				total +
				(section?.questions?.length ?? 0),
			0
		)
	);

	const lastResponseAt = $derived(() => {
		if (!responses.length) {
			return null;
		}

		const dates = responses
			.map(
				(response) =>
					response?.submittedAt ??
					response?.createdAt ??
					null
			)
			.filter(Boolean)
			.map((date) => new Date(date))
			.filter(
				(date) =>
					!Number.isNaN(date.getTime())
			)
			.sort(
				(a, b) => b.getTime() - a.getTime()
			);

		return dates[0] ?? null;
	});

	const stats = $derived([
		{
			label: 'Total Responses',
			value: responses.length,
			icon: Users
		},
		{
			label: 'Sections',
			value: sections.length,
			icon: Layers
		},
		{
			label: 'Questions',
			value: questionCount,
			icon: ListChecks
		},
		{
			label: 'Last Response',
			value: formatDate(lastResponseAt),
			icon: Clock
		}
	]);
</script>

<div
	class="grid grid-cols-2 gap-4 lg:grid-cols-4"
>
	{#each stats as stat}

		<Card
			class="border border-slate-200 bg-white p-4"
		>
			<div
				class="flex items-center gap-2 text-slate-500"
			>
				<div
					class="rounded-md bg-slate-50 p-1.5"
				>
					<stat.icon size={15} />
				</div>

				<span
					class="text-xs font-medium"
				>
					{stat.label}
				</span>
			</div>

			<p
				class="mt-3 text-xl font-bold text-slate-900"
			>
				{stat.value}
			</p>
		</Card>

	{/each}
</div>