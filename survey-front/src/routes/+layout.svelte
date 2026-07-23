<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import AppLayout from '$lib/components/layout/AppLayout.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<AppLayout>
	{@render children()}
</AppLayout>