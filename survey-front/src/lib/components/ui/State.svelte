<script>
	import Button from './Button.svelte';

	let {
		icon: Icon = null,
		title = '',
		description = '',
		actionLabel = '',
		onAction = () => {}
	} = $props();
</script>

<div class="flex flex-col items-center justify-center py-16 text-center">

	{#if Icon}
		<div class="mb-5 rounded-full bg-violet-100 p-4 text-violet-600">
			<Icon size={28}/>
		</div>
	{/if}

	<h2 class="text-xl font-semibold text-slate-900">
		{title}
	</h2>

	<p class="mt-2 max-w-md text-sm text-slate-500">
		{description}
	</p>

	{#if actionLabel}
		<div class="mt-6">
			<Button onclick={onAction}>
				{actionLabel}
			</Button>
		</div>
	{/if}

</div>