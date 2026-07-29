<script>
	import PreviewQuestion from './PreviewQuestion.svelte';

	let { section } = $props();
</script>

<section class="space-y-8">

	{#if section.title && section.title !== 'Untitled Section'}

		<div class="space-y-2">

			<h2 class="text-2xl font-semibold text-slate-900">
				{section.title}
			</h2>

			{#if section.description}
				<p class="text-slate-500">
					{section.description}
				</p>
			{/if}

			<div class="pt-2">
				<div class="h-px bg-slate-200"></div>
			</div>

		</div>

	{/if}

	<div class="space-y-10">

		{#each section.questions ?? [] as question, index (question.id)}

			<PreviewQuestion
				{question}
				number={index + 1}
			/>

		{/each}

	</div>

</section>