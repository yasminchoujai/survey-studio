<script>
	import Badge from '$lib/components/ui/Badge.svelte';

	let { status } = $props();


	const normalizedStatus =
		status?.toLowerCase();


	const variant =
		normalizedStatus === 'published'
			? 'published'
			: 'draft';


	const displayStatus =
		status
			? status.charAt(0).toUpperCase() + status.slice(1)
			: '';
</script>


<Badge {variant}>
	{displayStatus}
</Badge>