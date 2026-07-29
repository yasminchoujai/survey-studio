<script>
	import Sidebar from './Sidebar.svelte';

	let { children } = $props();
</script>

<div class="flex h-screen bg-[#FAFAFC]">

	<Sidebar />

	<main class="flex-1 overflow-y-auto">

		{@render children()}

	</main>

</div>