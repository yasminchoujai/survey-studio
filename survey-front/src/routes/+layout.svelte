<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import surveyStudioLogo from '$lib/assets/survey.logo.png';
	import ToastContainer from '$lib/components/ui/ToastContainer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={surveyStudioLogo} />
</svelte:head>

{@render children()}

<ToastContainer />