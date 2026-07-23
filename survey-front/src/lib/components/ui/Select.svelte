<script>
	import { ChevronDown, Check } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import Button from './Button.svelte';

	let {
		value = $bindable(''),
		options = []
	} = $props();

	let open = $state(false);
	let container;

	function select(option) {
		value = option;
		open = false;
	}

	onMount(() => {
		function handleClick(event) {
			if (container && !container.contains(event.target)) {
				open = false;
			}
		}

		document.addEventListener('click', handleClick);

		return () => {
			document.removeEventListener('click', handleClick);
		};
	});
</script>

<div
	class="relative"
	bind:this={container}
>

	<Button
		variant="outline"
		class="min-w-30 justify-between"
		onclick={() => (open = !open)}
	>

		<span>{value}</span>

		<ChevronDown
			size={16}
			class={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
		/>

	</Button>

	{#if open}

		<div
			class="absolute right-0 z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
		>

			{#each options as option}

				<Button
					variant="ghost"
					size="sm"
					class="w-full justify-between rounded-none px-3"
					onclick={() => select(option)}
				>

					<span>{option}</span>

					{#if option === value}
						<Check
							size={16}
							class="text-violet-600"
						/>
					{/if}

				</Button>

			{/each}

		</div>

	{/if}

</div>