<script>
	import { onMount, onDestroy } from 'svelte';
	import ApexCharts from 'apexcharts';

	let { options } = $props();

	let el;
	let chart;

	onMount(() => {
		chart = new ApexCharts(el, options);
		chart.render();
	});

	$effect(() => {
		const current = options;

		if (chart) {
			chart.updateOptions(current, true, true);
		}
	});

	onDestroy(() => {
		chart?.destroy();
	});
</script>

<div bind:this={el}></div>