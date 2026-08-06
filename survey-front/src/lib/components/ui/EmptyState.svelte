<script>
	import Button from "./Button.svelte";

	let {
		icon = null,
		title = "",
		description = "",
		buttonText = "",
		onAction = () => {}
	} = $props();
</script>

<div class="flex justify-center py-20">

	<div class="max-w-lg text-center">

		{#if icon}
			<div
				class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F4EFF8] text-[#9B7EBD]"
			>
				<svelte:component
					this={icon}
					size={36}
				/>
			</div>
		{/if}

		<h2 class="mt-6 text-xl font-semibold text-[#3B1E54]">
			{title}
		</h2>

		<p class="mt-2 text-sm leading-6 text-slate-500">
			{description}
		</p>

		{#if buttonText}
			<div class="mt-8">
				<Button onclick={onAction}>
					{buttonText}
				</Button>
			</div>
		{/if}

	</div>

</div>