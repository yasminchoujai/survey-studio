<script>
	import PreviewQuestion from './PreviewQuestion.svelte';

	let {
		section
	} = $props();
</script>

<section class="space-y-8">

	{#if section.title && section.title !== 'Untitled Section'}

		<div>

			<h2 class="text-xl font-semibold text-slate-900">
				{section.title}
			</h2>

			<div class="mt-3 h-px bg-slate-200"></div>

		</div>

	{/if}

	<div class="space-y-8">

		{#each section.questions as question, index}

			<PreviewQuestion
				{question}
				number={index + 1}
			/>

		{/each}

	</div>

</section>