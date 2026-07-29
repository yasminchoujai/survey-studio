<script>
	import AppLayout from '$lib/components/Layout/AppLayout.svelte';

	let { children } = $props();
</script>

<AppLayout>
	{@render children()}
</AppLayout>