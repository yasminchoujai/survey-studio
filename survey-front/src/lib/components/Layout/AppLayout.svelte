<script>
	import Sidebar from './Sidebar.svelte';

	let { children } = $props();
</script>


<div class="flex h-screen overflow-hidden bg-[#FAFAFC]">

	<Sidebar />

	<main class="flex-1 overflow-hidden">

		{@render children()}

	</main>

</div>