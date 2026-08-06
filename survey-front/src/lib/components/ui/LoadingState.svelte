<script>
	import Spinner from './Spinner.svelte';

	let {
		fullScreen = false,
		message = 'Loading...',
		description = 'Please wait while we prepare everything.'
	} = $props();
</script>

<div
	class={`flex w-full flex-col items-center justify-center rounded-2xl bg-slate-50 px-6 py-16 text-center ${
		fullScreen ? 'min-h-screen' : 'min-h-[420px]'
	}`}
>
	<div class="mb-6">
		<Spinner size={40} />
	</div>

	<h2 class="text-xl font-semibold text-[#3B1E54]">
		{message}
	</h2>

	<p class="mt-2 max-w-md text-sm text-slate-500">
		{description}
	</p>
</div>