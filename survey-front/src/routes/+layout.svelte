<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import AppLayout from '$lib/components/Layout/AppLayout.svelte';
	import '@fontsource/inter';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<AppLayout>
	{@render children()}
</AppLayout>